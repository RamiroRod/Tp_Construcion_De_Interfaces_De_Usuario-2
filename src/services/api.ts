import type {
  Comment,
  CreatePostPayload,
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

export function getImagenPostId(postId: number) {
  return getPostImages(postId);
}

export async function uploadPostImages(
  postId: number,
  images: File[]
): Promise<PostImage[]> {
  const formData = new FormData();
  formData.append("postId", String(postId));

  images.forEach((image) => {
    formData.append("images", image);
  });

  const response = await fetch(`${API_URL}/postimages`, {
    method: "POST",
    body: formData,
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.error || data?.message || "Error al subir imágenes.");
  }

  return data as PostImage[];
}

export async function uploadPostImageUrls(
  postId: number,
  imageUrls: string[]
): Promise<PostImage[]> {
  return request<PostImage[]>(`/postimages`, {
    method: "POST",
    body: JSON.stringify({ postId, imageUrls }),
  });
}

export function getVisibleComments(postId: number) {
  return request<Comment[]>(`/comments/post/${postId}`);
}

export function getPostById(postId: number) {
  return request<Post>(`/posts/${postId}`);
}

export async function createPost(
  payload: CreatePostPayload
): Promise<FeedPost> {
  // map client payload keys to backend expectations: userId and tagIds
  const body = {
    description: payload.description,
    userId: payload.UserId,
    tagIds: payload.Tags ?? [],
    ...(payload.title ? { title: payload.title } : {}),
  };

  const post = await request<Post>("/posts", {
    method: "POST",
    body: JSON.stringify(body),
  });

  let imagesPromise: Promise<PostImage[]>;

  if (payload.images?.length || payload.imageUrls?.length) {
    const uploads: Promise<PostImage[]>[] = [];

    if (payload.images?.length) {
      uploads.push(uploadPostImages(post.id, payload.images).catch(() => []));
    }

    if (payload.imageUrls?.length) {
      uploads.push(uploadPostImageUrls(post.id, payload.imageUrls).catch(() => []));
    }

    imagesPromise = Promise.all(uploads).then((results) => results.flat());
  } else {
    imagesPromise = getImagenPostId(post.id).catch(() => []);
  }

  const [uploadedImages, visibleComments] = await Promise.all([
    imagesPromise,
    getVisibleComments(post.id).catch(() => []),
  ]);

  return {
    ...post,
    images: uploadedImages,
    visibleComments,
  };
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

export interface CreateCommentPayload {
  PostId: number;
  UserId: number;
  content: string;
}

export function createComment(payload: CreateCommentPayload) {
  return request<Comment>("/comments", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}