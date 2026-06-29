import type {
  Comment,
  FeedPost,
  Post,
  PostImage,
  RegisterUserPayload,
  User,
} from "../types";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.error || data?.message || "Ocurrió un error inesperado.");
  }

  return data as T;
}

export function getUsers() {
  return request<User[]>("/users");
}

export function createUser(payload: RegisterUserPayload) {
  return request<User>("/users", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getPostImages(postId: number) {
  return request<PostImage[]>(`/postimages/post/${postId}`);
}

export function getVisibleComments(postId: number) {
  return request<Comment[]>(`/comments/post/${postId}`);
}

export async function getFeedPosts(): Promise<FeedPost[]> {
  const posts = await request<Post[]>("/posts");

  const postsWithExtraData = await Promise.all(
    posts.map(async (post) => {
      const [images, visibleComments] = await Promise.all([
        getPostImages(post.id).catch(() => []),
        getVisibleComments(post.id).catch(() => []),
      ]);

      return {
        ...post,
        images,
        visibleComments,
      };
    })
  );

  return postsWithExtraData;
}