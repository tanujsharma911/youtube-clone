// export type Video = {
//   id: string;
//   title: string;
//   thumbnailUrl: string;
//   channelName: string;
//   channelAvatarUrl: string;
//   views: string;
//   postedAt: string;
//   duration: string;
// };

// Interface for individual video document from API
export interface Video {
  _id: string;
  title: string;
  description: string;
  duration: number;
  owner: string;
  thumbnail: string;
  thumbnail_public_id: string;
  videoPath: string;
  video_public_id: string;
  views: number;
  visibility: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Interface for paginated video response
export interface PaginatedVideoResponse {
  docs: Video[];
  totalDocs: number;
  limit: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number | null;
  prevPage: number | null;
  pagingCounter: number;
}
