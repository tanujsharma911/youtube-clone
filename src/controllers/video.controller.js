import mongoose, { isValidObjectId } from "mongoose"
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import asyncHandler from "../utils/asyncHandler.js"
import { deleteOnCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, number = 10, query, sortBy = { createdAt: -1 }, sortType, userId } = req.query;

  if (number > 20) throw new ApiError(422, "number can be maximum 20");
  if (!sortBy) throw new ApiError(422, "sortBy should be json like {createdAt: -1} means most recent");

  // get all videos(thumbnail url, title, duration) based on query, sort, pagination

  const filter = { visibility: true };

  // -------------------------------- SIMPLE AND PIPELINE METHOD --------------------------

  // const skip = (page - 1) * number;

  // const videos = await Video.find().skip(skip).limit(number).sort(sortBy); // SIMPLE WAY

  // const videos = await Video.aggregate([ //  PIPELINE WAY
  //   {
  //     $match: filter
  //   },
  //   {
  //     $skip: skip
  //   },
  //   {
  //     $limit: number
  //   },
  //   {
  //     $sort: sortBy
  //   }
  // ]);

  // 'mongoose-aggregate-paginate-v2' WAY  -->  Aggregate + Paginate

  const aggregate = Video.aggregate([{ $match: filter }]);
  const options = {
    page,
    limit: number,
    sort: sortBy,
  };

  const videos = await Video.aggregatePaginate(aggregate, options);

  res.status(200).json(new ApiResponse(200, "Fetched successfully", videos));
})

const uploadVideo = asyncHandler(async (req, res) => {
  console.log("UPLOAD VIDEO");
  const { title, description, visibility = true } = req.body;

  const videoInfo = {
    owner: req.user,
    title,
    description,
    // videoPath, thumbnail & duration
    views: 0,
    visibility: visibility
    // timestampz are added automatically
  };

  // Check data validation
  if (!title?.length) throw new ApiError(422, "Title is required");
  if (title?.length < 5) throw new ApiError(422, "Title should be minimum 5 character long");
  if (title?.length > 100) throw new ApiError(422, "Title can be maximum 100 character long");
  if (description?.length > 500) throw new ApiError(422, "Description can be maximum 500 character long");

  const videoPath = req.files?.videoFile?.[0]?.path;
  if (!videoPath) throw new ApiError(422, "Video file is required");

  const thumbnailPath = req.files?.thumbnail?.[0]?.path;
  if (!thumbnailPath) throw new ApiError(422, "Thumbnail file is required");

  console.log("All Validation passed ✅");


  // -------------------------------- VIDEO -------------------------------- 

  // upload video to cloudinary
  const videoFileUploadResult = await uploadOnCloudinary(videoPath);

  if (!videoFileUploadResult?.playback_url) throw new ApiError(500, "Failed to upload video on cloudinary");

  console.log("Video uploaded on cloudinary ✅");

  // Set videoInfo.filePath
  videoInfo.videoPath = videoFileUploadResult.playback_url;
  videoInfo.video_public_id = videoFileUploadResult.public_id;

  // -------------------------------- THUMBNAIL -------------------------------- 

  // upload video to cloudinary
  const thumbnailFileUploadResult = await uploadOnCloudinary(thumbnailPath);

  if (!thumbnailFileUploadResult?.secure_url) throw new ApiError(500, "Failed to upload thumbnail on cloudinary");

  console.log("Thumbnail uploaded on cloudinary ✅");

  // Set videoInfo.thumbnail
  videoInfo.thumbnail = thumbnailFileUploadResult.secure_url;
  videoInfo.thumbnail_public_id = thumbnailFileUploadResult.public_id;

  // -------------------------------- SET INFO -------------------------------- 
  videoInfo.duration = videoFileUploadResult.duration;

  // create video document
  const video = await Video.create(videoInfo);

  if (!video) throw new ApiError(500, "Failed to create video document on mongodb");

  res.status(201).json(new ApiResponse(201, "Video uploaded successfully", video));
})

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.query;
  console.log(isValidObjectId(videoId))

  if (!videoId) throw new ApiError(422, "Video ID is required");
  if (!isValidObjectId(videoId.toString())) throw new ApiError(422, "Video ID is not valid");

  // Get video url from document
  const video = await Video.findById(videoId);

  if (!video) throw new ApiError(400, "Can't find video");

  res.status(200).json(new ApiResponse(200, "Video fetched successfully", video));
});

const deleteVideo = asyncHandler(async (req, res) => {
  console.log("DELETE VIDEO");
  const { videoId } = req.query;

  if (!videoId) throw new ApiError(422, "videoId is required");
  if (!isValidObjectId(videoId)) throw new ApiError(422, "videoId is not valid");

  // Get user info
  const user = req.user;

  // Get video docu
  const video = await Video.findById(videoId);

  if (!video && !video?.owner) throw new ApiError(422, "Can't find video");

  console.log("Video found ✅");

  // Match user with video owner
  if (video.owner._id.toString() !== user._id.toString()) throw new ApiError(403, "You are not the owner of video");

  console.log("You are the owner ✅");

  console.log("Delete video: " + video.video_public_id)
  console.log("Delete thumbnail: " + video.thumbnail_public_id)

  // Delete video and thumbnail from cloudinary
  const deleteThumbnailResult = await deleteOnCloudinary(video.thumbnail_public_id, "image");
  const deleteVideoResult = await deleteOnCloudinary(video.video_public_id, "video");

  console.log("delete video result: ", deleteVideoResult, " thumbnail: ", deleteThumbnailResult)

  if (!(deleteVideoResult.result === "ok" && deleteThumbnailResult.result === "ok")) {
    throw new ApiError(500, "Can't delete from cloudinary");
  }

  console.log("Delete from cloundinary ✅");

  // delete video document from DB
  // const response = await Video.deleteOne({ _id: videoId });

  // console.log("response after deleting video document:", response);

  res.status(200).json(new ApiResponse(200, "Deleted successfully"));

});

export {
  getAllVideos,
  uploadVideo,
  getVideoById,
  deleteVideo,
}


// VIDEO document
/* 
uploaded video:  {
  asset_id: 'f25c92fb5fccf7a777e5b458c0f2e1f9',
  public_id: 'elnue2uh9ys5ewwsibfs',
  version: 1763629067,
  version_id: 'a66fb700937837beff524ba9ca023ad3',
  signature: '9b83ef132394258a1eb270c1fba55cac437a0cf2',
  width: 1516,
  height: 764,
  format: 'mp4',
  resource_type: 'video',
  created_at: '2025-11-20T08:57:47Z',
  tags: [],
  pages: 0,
  bytes: 1084342,
  type: 'upload',
  etag: '76b430e499f9d8e7a62917915317e4c2',
  placeholder: false,
  url: 'http://res.cloudinary.com/djtncylvn/video/upload/v1763629067/elnue2uh9ys5ewwsibfs.mp4',
  secure_url: 'https://res.cloudinary.com/djtncylvn/video/upload/v1763629067/elnue2uh9ys5ewwsibfs.mp4',
  playback_url: 'https://res.cloudinary.com/djtncylvn/video/upload/sp_auto/v1763629067/elnue2uh9ys5ewwsibfs.m3u8',
  asset_folder: '',
  display_name: 'elnue2uh9ys5ewwsibfs',
  audio: {
    codec: 'aac',
    bit_rate: '9267',
    frequency: 48000,
    channels: 2,
    channel_layout: 'stereo'
  },
  video: {
    pix_format: 'yuv420p',
    codec: 'h264',
    level: 42,
    profile: 'High',
    bit_rate: '653643',
    dar: '379:191',
    time_base: '1/60000'
  },
  is_audio: false,
  frame_rate: 60,
  bit_rate: 696765,
  duration: 12.45,
  rotation: 0,
  original_filename: 'videoFile-1763629055677-939906747',
  nb_frames: 747,
  api_key: '981137778429968'
}
*/