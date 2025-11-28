import React from "react";
import { useQuery } from "@tanstack/react-query";

import Feed from "./Feed";
import { fetchVideos } from "@/lib/utils";

const Home = () => {
  const fetchVideosFn = async () => {
    const videos = await fetchVideos();
    return videos.docs;
  };
  const { data: videos } = useQuery({
    queryKey: ["videos"],
    queryFn: fetchVideosFn,
  });

  return (
    <div>
      <Feed videos={videos} />
    </div>
  );
};

export default Home;
