export interface User {
  id: number;
  nickName: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface RegisterUserPayload {
  nickName: string;
  email: string;
}

export interface CreateCommentPayload {
  content: string;
  userId: number;
  postId: number;
}

export interface CreatePostImagePayload {
  url: string;
  postId: number;
}

export interface CreatePostPayload {
  description: string;
  userId: number;
  tagIds: number[];
  imageUrls?: string[];
}

export interface Tag {
  id: number;
  name: string;
}

export interface PostImage {
  id: number;
  url: string;
  PostId?: number;
  postId?: number;
}

export interface Comment {
  id: number;
  content: string;
  UserId?: number;
  userId?: number;
  PostId?: number;
  postId?: number;
  createdAt?: string;
  User?: User;
  user?: User;
}

export interface Post {
  id: number;
  title?: string;
  description: string;
  UserId?: number;
  userId?: number;
  createdAt?: string;
  updatedAt?: string;
  User?: User;
  user?: User;
  Tags?: Tag[];
  tags?: Tag[];
}

export interface FeedPost extends Post {
  images: PostImage[];
  visibleComments: Comment[];
}
