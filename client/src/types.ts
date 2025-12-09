export interface VideoType {
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

export type CommentType = {
  _id: string;
  video: string;
  user_id: string;
  username: string;
  avatar: string;
  fullName: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  replies: number;
};

export type InteractionType = {
  _id: string;
  user_id: string;
  commentId?: string;
  action: number;
  createdAt: string;
  updatedAt: string;
};

// Interface for paginated video response
export interface PaginatedVideoResponse {
  docs: VideoType[];
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
  video?: VideoType;
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
