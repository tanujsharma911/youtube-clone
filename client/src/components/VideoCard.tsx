import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import type { VideoCardProps } from "@/types";

dayjs().format();
dayjs.extend(relativeTime);

const VideoCard = ({ video }: VideoCardProps) => {
  const formattedDate = dayjs(video?.createdAt).fromNow();
  return (
    <div>
      <div className="group cursor-pointer hover:bg-gray-100 p-2 rounded-3xl flex flex-col gap-3">
        {/* Thumbnail Wrapper */}
        <div className="relative aspect-video w-full overflow-hidden rounded-xl">
          <img
            src={video?.thumbnail}
            alt={video?.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-xs font-medium text-white">
            {((video?.duration ?? 0) / 60).toFixed(0)}:
            {String(((video?.duration ?? 0) % 60).toFixed(0)).padStart(2, "0")}
          </div>
        </div>

        {/* Details */}
        <div className="flex gap-3">
          <Avatar>
            <AvatarImage src={video?.owner?.avatar} />
            <AvatarFallback>{video?.owner?.username.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <h3 className="text-md font-semibold">{video?.title}</h3>
            <p className="mt-1 text-xs text-muted-foreground hover:text-foreground">
              {video?.owner?.fullName}
            </p>
            <div className="flex items-center text-xs text-muted-foreground">
              <span>{video?.views} views</span>
              <span className="mx-1">•</span>
              <span>{formattedDate}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
