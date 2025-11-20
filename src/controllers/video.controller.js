import mongoose, { isValidObjectId } from "mongoose"
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import asyncHandler from "../utils/asyncHandler.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query

    if (limit - page > 20) throw new ApiError(400, "Cannot fetch more than 20 videos at a time");
    // get all videos(thumbnail url, title, duration) based on query, sort, pagination

    res.status(200).json(new ApiResponse(200, "OK"));
})

const uploadVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body
    // get video from multer
    const videoPath = req.files?.videoFile?.[0]?.path;

    if (!videoPath) throw new ApiError(422, "Video file is required");

    // upload video to cloudinary
    // get video info - duration
    // create video document

    res.status(201).json(new ApiResponse(201, "Video uploaded successfully"));
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    // Get video url from document
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    // Verify user
    // Match user with video owner
    // delete video document from DB
    // delete video from cloudinary
})

export {
    getAllVideos,
    uploadVideo,
    getVideoById,
    deleteVideo,
}