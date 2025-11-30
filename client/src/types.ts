export interface Video {
  _id: string;
  title: string;
  description: string;
  duration: number;
  owner: {
    _id: string;
    username: string;
    avatar: string;
    fullName: string;
  };
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

export interface VideoCardProps {
  video?: Video;
}

// Interface for user object
export interface User {
  _id: string;
  username: string;
  email: string;
  fullName: string;
  avatar: string;
  coverImage: string;
  watchHistory: string[];
  createdAt: string;
  updatedAt: string;
  accessToken?: string;
  __v: number;
}
