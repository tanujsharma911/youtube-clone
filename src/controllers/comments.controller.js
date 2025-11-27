import mongoose, { isValidObjectId } from "mongoose"
import { Comment } from "../models/comment.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import asyncHandler from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const { videoId, page = 1, limit = 10, sortBy = { createdAt: -1 } } = req.query;

    if (!videoId) throw new ApiError(422, "videoId is required");

    const options = {
        page,
        limit,
        sort: sortBy,
    };

    const aggregate = Comment.aggregate([
        {
            $match: {
                video: new mongoose.Types.ObjectId(String(videoId)),
                comment_to: { $exists: false }
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner"
            }
        },
        { $unwind: "$owner" },
        {
            $project: {
                _id: 1,
                content: 1,
                video: 1,
                user_id: "$owner._id",
                username: "$owner.username",
                avatar: "$owner.avatar",
                replies: 1,
                createdAt: 1,
                updatedAt: 1
            }
        },
    ]);

    const comments = await Comment.aggregatePaginate(aggregate, options);

    res.status(200).json(new ApiResponse(200, "top-level comments fetched successfully", comments));
});

const getCommentReplies = asyncHandler(async (req, res) => {
    //TODO: get all replies for a comment
    const { commentId, page = 1, limit = 10, sortBy = { createdAt: -1 } } = req.query;

    if (!commentId) throw new ApiError(422, "commentId is required");
    if (!isValidObjectId(commentId)) throw new ApiError(422, "commentId is not valid ID");

    const options = {
        page,
        limit,
        sort: sortBy,
    };

    const aggregate = Comment.aggregate([
        {
            $match: {
                comment_to: new mongoose.Types.ObjectId(String(commentId))
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner"
            }
        },
        { $unwind: "$owner" },
        {
            $project: {
                _id: 1,
                content: 1,
                video: 1,
                user_id: "$owner._id",
                username: "$owner.username",
                avatar: "$owner.avatar",
                replies: 1,
                createdAt: 1,
                updatedAt: 1
            }
        },
    ]);

    const replies = await Comment.aggregatePaginate(aggregate, options);

    res.status(200).json(new ApiResponse(200, "comment replies fetched successfully", replies));
})

const addComment = asyncHandler(async (req, res) => {
    const { videoId, message, commentTo } = req.query;

    if (!videoId) throw new ApiError(422, "videoId is required");
    if (!isValidObjectId(videoId)) throw new ApiError(422, "videoId is not valid ID");

    // find the video in db
    const video = await Video.findById(videoId);
    if (!video) throw new ApiError(422, "Video does not exist");

    let commentDoc = { content: message, owner: req.user._id, video: videoId };

    if (commentTo) {
        try {

            const fetchCommentTo = await Comment.findById(commentTo);

            if (!fetchCommentTo?._id) throw new ApiError(422, "commentTo does not exist");

            commentDoc.comment_to = commentTo;

            // increment replies count in parent comment
            fetchCommentTo.replies += 1;
            await fetchCommentTo.save();
        }
        catch (error) {
            throw new ApiError(422, "commentTo is not valid ID", error);
        }
    }

    // add comment
    const response = await Comment.create(commentDoc);

    if (!response) throw new ApiError(500, "Unable to create comment document");

    res.status(200).json(new ApiResponse(200, "Created successfully", response));
});

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const { commentId, message } = req.query;

    if (!commentId) throw new ApiError(422, "commentId is required");
    if (!isValidObjectId(commentId)) throw new ApiError(422, "commentId is not valid ID");

    // find the comment in db
    const comment = await Comment.findById(commentId);
    if (!comment) throw new ApiError(404, "Comment not found");

    // verify ownership
    if (comment.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not the owner of this comment");
    }

    // update the comment
    comment.content = message;
    await comment.save();

    res.status(200).json(new ApiResponse(200, "Comment updated successfully", comment));
});

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const { commentId } = req.query;

    if (!commentId) throw new ApiError(422, "commentId is required");
    if (!isValidObjectId(commentId)) throw new ApiError(422, "commentId is not valid ID");

    // find the comment in db
    const comment = await Comment.findById(commentId);
    if (!comment) throw new ApiError(404, "Comment not found");

    // verify ownership
    if (comment.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not the owner of this comment");
    }

    // if it's a reply, decrement the replies count in parent comment
    if (comment.comment_to) {
        const parentComment = await Comment.findById(comment.comment_to);
        if (parentComment) {
            parentComment.replies = Math.max(0, parentComment.replies - 1);
            await parentComment.save();
        }
    }

    // delete the comment
    await Comment.deleteOne({ _id: commentId });

    res.status(200).json(new ApiResponse(200, "Comment deleted successfully"));
})

export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment,
    getCommentReplies
}