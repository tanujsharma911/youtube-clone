import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import axios from "../api/axios";
import type { PaginatedVideoResponse } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const fetchVideos = async (): Promise<PaginatedVideoResponse> => {
  const videos = await axios.get("/videos").then((res) => res.data);

  return videos.data;
};

export const convertBase64ToFile = (
  base64String: string,
  filename: string
): File => {
  const arr = base64String.split(",");
  const mime = arr[0].match(/:(.*?);/)![1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};
