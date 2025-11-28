import VideoCard from "@/components/VideoCard";
import type { Video } from "@/types";

const Feed = ({ videos }: { videos: Video[] | undefined }) => {
  return (
    <div>
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mb-5">
        Feed
      </h3>
      {/* Video Grid */}
      <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {videos?.map((video) => (
          <VideoCard key={video._id} video={video} />
        ))}
      </div>
    </div>
  );
};

export default Feed;
