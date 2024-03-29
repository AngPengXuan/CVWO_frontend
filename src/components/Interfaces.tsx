// This file contains all the interfaces used across the other files

export interface PostInterface {
  title: string;
  content: string;
  category: string;
  id: number;
  username?: string;
  user_id: number;
  created_at: Date;
  like_count: number;
  dislike_count: number;
}

interface CommentRatingInterface {
  user_id: number;
  rating: number;
}

export interface CommentInterface {
  username: string;
  content: string;
  modified_content: string;
  is_owner: boolean;
  id: number;
  created_at: Date;
  comment_ratings: Array<CommentRatingInterface>;
}

export interface UpdatedCommentInterface {
  username: string;
  content: string | JSX.Element;
  is_owner: boolean;
  id: number;
  created_at: Date;
}

export interface ResponseInterface {
  post: PostInterface;
  comments: CommentInterface[];
  is_owner: boolean;
}

export interface RequestData {
  token?: string | null;
  comment?: {
    content?: string;
    post_id?: string | number;
    id?: number;
  };
  post?: {
    title: string;
    category: string;
    content: string;
  };
  user?: { username: string; password: string };
  post_rating?: {
    user_token?: string | null;
    post_id?: number;
    rating?: number;
  };
  comment_rating?: {
    user_token?: string | null;
    comment_id?: number;
    rating?: number;
  };
}

type OnLogoutFunction = () => void;

export interface LogoutProps {
  onLogout: OnLogoutFunction;
}

type OnLoginFunction = () => void;

export interface LoginProps {
  onLogin: OnLoginFunction;
}

export type Ratings = {
  rating: number;
};
