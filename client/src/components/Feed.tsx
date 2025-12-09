import { useQuery } from "@tanstack/react-query";

import VideoCard from "@/components/VideoCard";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchVideos } from "@/lib/utils";
import clsx from "clsx";

const Feed = ({ class: className }: { class?: string }) => {
  const fetchVideosFn = async () => {
    const videos = await fetchVideos();
    return videos.docs;
  };
  const { data: videos, isLoading } = useQuery({
    queryKey: ["videos"],
    queryFn: fetchVideosFn,
  });
  return (
    <div>
      {/* Video Grid */}
      <div
        className={clsx(
          className
            ? className
            : `grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5`
        )}
      >
        {!isLoading
          ? videos?.map((video) => <VideoCard key={video._id} video={video} />)
          : [1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="flex flex-col space-y-3 aspect-video w-full"
              >
                <Skeleton className="aspect-video rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            ))}
        {videos?.length === 0 && !isLoading && (
          <p className="text-center col-span-full flex flex-col items-center gap-4">
            <img
              src="./media/Questions.gif"
              alt="No videos found"
              width={250}
            />
            No videos found.
          </p>
        )}
      </div>
    </div>
  );
};

export default Feed;
