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

export interface CreatePostPayload {
  title?: string;
  description: string;
  UserId: number;
  Tags?: number[];
  images?: File[];
  imageUrls?: string[];
}

export interface Tag {
  id: number;
  name: string;
}

export interface PostImage {
  id: number;
  url: string;
  PostId: number;
}

export interface Comment {
  id: number;
  content: string;
  UserId: number;
  PostId: number;
  createdAt?: string;
  User?: User;
}

export interface Post {
  id: number;
  title?: string;
  description: string;
  UserId: number;
  createdAt?: string;
  updatedAt?: string;
  User?: User;
  Tags?: Tag[];
}

export interface FeedPost extends Post {
  images: PostImage[];
  visibleComments: Comment[];
}