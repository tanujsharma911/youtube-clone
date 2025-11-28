import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import axios from "axios";
import type { PaginatedVideoResponse } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const fetchVideos = async (): Promise<PaginatedVideoResponse> => {
  const videos = await axios.get("/api/videos").then((res) => res.data);

  // console.log("Fetched videos:", videos.data);

  return videos.data;
};
