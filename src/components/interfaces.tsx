export interface PostInterface {
  title: string;
  content: string;
  category: string;
  id: number;
  username?: string;
  created_at: Date;
}

export interface CommentInterface {
  username: string;
  content: string;
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
}

type OnLogoutFunction = () => void;

export interface LogoutProps {
  onLogout: OnLogoutFunction;
}

type OnLoginFunction = () => void;

export interface LoginProps {
  onLogin: OnLoginFunction;
}
