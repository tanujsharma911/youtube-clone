import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import axios from "axios";
import type { PaginatedVideoResponse } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const fetchVideos = async (): Promise<PaginatedVideoResponse> => {
  const videos = await axios.get("/api/videos").then((res) => res.data);
  // await new Promise((resolve) =>
  //   setTimeout(() => {
  //     resolve(null);
  //   }, 1000)
  // ); // Simulate network delay

  return videos.data;
};
