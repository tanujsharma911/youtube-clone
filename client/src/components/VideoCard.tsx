import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import type { Video } from "@/types";

interface VideoCardProps {
  video: Video;
}

const VideoCard = ({ video }: VideoCardProps) => {
  return (
    <div>
      <div className="group cursor-pointer flex flex-col gap-3">
        {/* Thumbnail Wrapper */}
        <div className="relative aspect-video w-full overflow-hidden rounded-xl">
          <img
            src={video.thumbnail}
            alt={video.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-xs font-medium text-white">
            {video.duration}
          </div>
        </div>

        {/* Details */}
        <div className="flex gap-3">
          <Avatar>
            <AvatarImage src={video.owner.} />
            <AvatarFallback>{video.channelName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <h3 className="text-md font-semibold">{video.title}</h3>
            <p className="mt-1 text-xs text-muted-foreground hover:text-foreground">
              {video.channelName}
            </p>
            <div className="flex items-center text-xs text-muted-foreground">
              <span>{video.views} views</span>
              <span className="mx-1">•</span>
              <span>{video.postedAt}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
