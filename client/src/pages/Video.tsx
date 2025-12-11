import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router";
import { useForm, type SubmitHandler } from "react-hook-form";
import { ArrowBigDown, ArrowBigUp, Loader2Icon, Share2 } from "lucide-react";
import { useMemo } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import VideoPlayer from "@/components/VideoPlayer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CommentCard from "@/components/ui/commentCard";
import { Input } from "@/components/ui/input";

import useAuth from "@/store/auth";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import axios from "../api/axios";
import type { CommentType, InteractionType, VideoType } from "@/types";
import Feed from "@/components/Feed";

type UserCommentType = {
  content: string;
};

const Video = () => {
  // ------------------------------------- Hooks ------------------------------------- //
  const [searchParams] = useSearchParams();
  const videoId = searchParams.get("v");
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<UserCommentType>();

  // ------------------------------------- Handlers ------------------------------------- //

  const video = useQuery({
    queryKey: ["video", videoId],
    queryFn: async (): Promise<VideoType | null> => {
      try {
        const videoData = await axios.get(
          `/videos/getById/?videoId=${videoId}`
        );
        return videoData.data.data;
      } catch (error) {
        console.log("Video :: error while fetching the video data", error);
        navigate("/not-found");
        return null;
      }
    },
  });

  const interactions = useQuery({
    queryKey: ["interactions", videoId],
    queryFn: async (): Promise<InteractionType[] | null> => {
      try {
        const interactionsData = await axios.get(
          `/interaction/v?videoId=${videoId}`
        );
        return interactionsData.data.data;
      } catch (error) {
        console.log(
          "Video :: error while fetching the video interactions",
          error
        );
        return null;
      }
    },
  });

  const comments = useQuery({
    queryKey: ["comments", videoId],
    queryFn: async () => {
      try {
        const commentsData = await axios.get(`/comments?videoId=${videoId}`);

        return commentsData.data.data;
      } catch (error) {
        console.log("Video :: error while fetching the video comments", error);
        return null;
      }
    },
  });

  const makeVote = useMutation({
    mutationFn: async (vote: number) => {
      if (user?.loggedIn === false) {
        toast.error("You need to be logged in to vote.");
        return;
      }
      try {
        const response = await axiosPrivate.post(
          `interaction/toggle/v?videoId=${videoId}&action=${vote}`
        );

        return response.data;
      } catch (error) {
        console.log("Video :: error while submitting vote", videoId, error);

        throw error;
      }
    },
    onSuccess: () => {
      interactions.refetch();
    },
  });

  const sendUserComment: SubmitHandler<UserCommentType> = async (data) => {
    try {
      const response = await axiosPrivate.post(
        `/comments?videoId=${videoId}&message=${data.content}`
      );
      toast.success("Comment added successfully!");
      setValue("content", "");
      comments.refetch();
      return response.data;
    } catch (error) {
      console.log("Video :: error while submitting comment", error);
    }
  };

  const videoJsOptions = useMemo(
    () => ({
      autoplay: true,
      controls: true,
      responsive: true,
      fluid: true,
      liveui: true,
      aspectRatio: "16:9",
      sources: [
        {
          src: video?.data?.videoPath || "",
          type: "application/x-mpegURL",
        },
      ],
      poster: video?.data?.thumbnail || "",
    }),
    [video?.data?.videoPath, video?.data?.thumbnail]
  );

  if (video.isPending) {
    return <div className="flex items-center justify-center">Loading...</div>;
  }
  return (
    <div className="flex flex-col lg:grid lg:grid-cols-4 gap-8">
      <div className="flex flex-col gap-4 w-full lg:col-span-3">
        {!video.isPending && (
          <div>
            <VideoPlayer options={videoJsOptions} />
          </div>
        )}
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
          {video?.data?.title}
        </h4>

        {/* Channel and Interaction */}
        <div className="flex items-center justify-between">
          {/* Channel info */}
          <div className="flex items-center gap-3">
            <div>
              <Avatar>
                <AvatarImage
                  src={video?.data?.owner?.avatar}
                  alt={video?.data?.owner?.fullName}
                />
                <AvatarFallback>
                  {video?.data?.owner?.fullName
                    ? video?.data?.owner?.fullName[0]
                    : null}
                </AvatarFallback>
              </Avatar>
            </div>
            <div>
              <p className="font-medium">
                {video?.data?.owner?.fullName || "Unknown User"}
              </p>
            </div>
          </div>

          {/* Interaction */}
          <div className="flex items-center gap-4">
            <div className="[&>*+*]:border-l-0">
              <Button
                type="button"
                onClick={() => makeVote.mutate(1)}
                variant="outline"
                className="rounded-none first:rounded-l-md last:rounded-r-md gap-1 px-3.5 font-semibold hover:bg-green-600/20 hover:text-green-600"
              >
                <ArrowBigUp
                  fill={
                    interactions?.data?.some(
                      (interaction: InteractionType) =>
                        interaction.user_id === user?.data?._id &&
                        interaction.action === 1 &&
                        interaction.commentId === null
                    )
                      ? "currentColor"
                      : "none"
                  }
                  className="h-5! w-5!"
                />
                {interactions.isPending && (
                  <Loader2Icon className="animate-spin" />
                )}
                {interactions?.data?.filter(
                  (interaction: InteractionType) =>
                    interaction.action === 1 && interaction.commentId === null
                )?.length || ""}
              </Button>
              <Button
                type="button"
                onClick={() => makeVote.mutate(-1)}
                variant="outline"
                className="rounded-none first:rounded-l-md font-semibold last:rounded-r-md hover:bg-rose-500/20 hover:text-rose-500"
              >
                <ArrowBigDown
                  fill={
                    interactions?.data?.some(
                      (interaction) =>
                        interaction.user_id === user?.data?._id &&
                        interaction.action === -1 &&
                        interaction.commentId === null
                    )
                      ? "currentColor"
                      : "none"
                  }
                  className="h-5! w-5!"
                />
                {interactions.isPending && (
                  <Loader2Icon className="animate-spin" />
                )}
              </Button>
            </div>
            <div>
              <Button
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success("Video link copied to clipboard!");
                }}
              >
                <Share2 /> Share
              </Button>
            </div>
          </div>
        </div>
        {/* Description */}
        <div className="mb-4 bg-gray-200 rounded-2xl border- p-4">
          <h4 className="font-semibold">Description</h4>
          <p className="">{video?.data?.description}</p>
        </div>

        {/* Comments */}
        <div>
          <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
            {comments?.data?.docs?.length || ""} Comments
          </h4>
          {user?.loggedIn === true && (
            <div className="flex w-full mt-5 items-start gap-2">
              <Avatar>
                <AvatarImage
                  src={user?.data?.avatar}
                  alt={user?.data?.fullName}
                />
                <AvatarFallback>
                  {user?.data?.fullName ? user?.data?.fullName[0] : null}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Comment"
                  className="border-0 shadow-none border-b rounded-none"
                  {...register("content", { required: true })}
                />
                {errors && errors.content && (
                  <p className="text-red-500 text-sm mt-2">
                    Comment cannot be empty
                  </p>
                )}
              </div>
              <Button
                type="submit"
                variant="outline"
                onClick={handleSubmit(sendUserComment)}
              >
                Comment
              </Button>
            </div>
          )}
          {!comments.isPending && comments?.data && (
            <div className="flex flex-col gap-4 mt-10">
              {comments?.data?.docs?.map((comment: CommentType) => (
                <CommentCard
                  key={comment._id}
                  videoId={videoId}
                  comment={comment}
                  interactions={interactions.data}
                  onVote={() => interactions.refetch()}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      <div>
        <Feed class="flex flex-col gap-3" />
      </div>
    </div>
  );
};

export default Video;
