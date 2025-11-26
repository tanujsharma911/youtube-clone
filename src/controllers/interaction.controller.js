import mongoose, { isValidObjectId } from "mongoose"
// import { Like } from "../models/like.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import asyncHandler from "../utils/asyncHandler.js"
import { Interaction } from "../models/interactions.model.js";
import { Video } from "../models/video.model.js";

const toggleVideoInteraction = asyncHandler(async (req, res) => {
    const { videoId, action } = req.query;

    if (!videoId) throw new ApiError(422, "Video id is requried");
    if (!isValidObjectId(videoId)) throw new ApiError(422, "Video id is not valid");

    const user = req.user;

    const userInteraction = await Interaction.findOne({ user_id: user._id.toString(), video: videoId });

    // if user not interacted
    if (!userInteraction) {

        let interactionDoc = {
            video: videoId,
            user_id: user._id,
            action: action
        };

        const interactionResult = await Interaction.create(interactionDoc);

        if (!interactionResult) throw new ApiError(500, "Can't create user interaction");

        res.status(200).json(new ApiResponse(200, "Interaction created", interactionResult));
    }
    // user interacted
    else {

        // if prev action is same as new, delete it
        if (String(userInteraction.action) === String(action)) {
            const deleteResult = await Interaction.deleteOne({ _id: userInteraction._id });

            if (deleteResult.acknowledged !== true) throw new ApiError(500, "Can't delete document");

            res.status(200).json(new ApiResponse(200, "Interaction deleted", deleteResult));
        }
        // else update it with new action given
        else {
            const updateResult = await Interaction.updateOne({ _id: userInteraction._id }, { $set: { action: action } });
            res.status(200).json(new ApiResponse(200, "Interaction updated prev: " + userInteraction.action + " new: " + action, updateResult));
        }
    }
});

const getVideoInteractions = asyncHandler(async (req, res) => {
    const { videoId } = req.query;

    if (!videoId) throw new ApiError(422, "Video ID is required");
    if (!isValidObjectId(videoId)) throw new ApiError(422, "Video ID is required");

    // Find video is in db
    const video = await Video.findById(videoId);

    if (!video) throw new ApiError(422, "No video is available with this ID");

    // Get all interactions
    // const allUserInteractions = await Interaction.find({ video: videoId });

    const allUserInteractions = await Interaction.aggregate([
        {
            $match: {
                video: new mongoose.Types.ObjectId(String(videoId))
            }
        },
        {
            $group: {
                _id: "$action",
                users: {
                    $push: {
                        user_id: "$user_id",
                        createdAt: "$createdAt",
                        updatedAt: "$updatedAt"
                    }
                },
                length: {
                    $sum: 1
                }
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "users.user_id",
                foreignField: "_id",
                as: "users"
            }
        },

        {
            $project: {
                "_id": 1,
                "length": 1,
                "users._id": 1,
                "users.avatar": 1,
                "users.createdAt": 1,
                "users.username": 1,
                "users.fullName": 1
            }
        }
    ]);

    res.status(200).json(new ApiResponse(200, "here is the video interaction info: " + videoId, allUserInteractions));
});

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all interacted videos matching user_id

    const videos = await Interaction.aggregate([
        {
            $match: {
                user_id: req.user._id,
                action: 1
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "meta"
            }
        },
        {
            $unwind: "$meta"
        },
        {
            $project: {
                "_id": 1,
                "action": 1,
                "createdAt": 1,
                "video_id": "$meta._id",
                "thumbnail": "$meta.thumbnail",
                "title": "$meta.title",
                "visibility": "$meta.visibility",
            }
        },
        {
            $sort: {
                createdAt: -1
            }
        }
    ]);

    res.status(200).json(new ApiResponse(200, "here is the all liked videos", videos));
});

const toggleCommentInteraction = asyncHandler(async (req, res) => {
    //TODO: get all interacted videos
    const { commentId } = req.query;

    res.status(200).json(new ApiResponse(200, "toggle comment interaction done: " + commentId));
});

export {
    toggleVideoInteraction,
    getLikedVideos,
    getVideoInteractions,
    toggleCommentInteraction
}