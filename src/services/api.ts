import type {
  Comment,
  CreateCommentPayload,
  CreatePostImagePayload,
  CreatePostPayload,
  FeedPost,
  Post,
  PostImage,
  RegisterUserPayload,
  Tag,
  User,
} from "../types";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

type ApiListResponse<T> = T[] | { data?: T[]; rows?: T[]; tags?: T[]; posts?: T[]; comments?: T[]; images?: T[] };
type ApiItemResponse<T> = T | { data?: T; post?: T; comment?: T; image?: T };

function normalizeList<T>(value: ApiListResponse<T>): T[] {
  if (Array.isArray(value)) return value;

  return (
    value.data ??
    value.rows ??
    value.tags ??
    value.posts ??
    value.comments ??
    value.images ??
    []
  );
}

function normalizeItem<T>(value: ApiItemResponse<T>): T {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const objectValue = value as { data?: T; post?: T; comment?: T; image?: T };
    return objectValue.data ?? objectValue.post ?? objectValue.comment ?? objectValue.image ?? (value as T);
  }

  return value as T;
}

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers ?? {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.error || data?.message || "Ocurrió un error inesperado.");
  }

  return data as T;
}

export function getUsers(): Promise<User[]> {
  return request<User[]>("/users");
}

export function createUser(payload: RegisterUserPayload): Promise<User> {
  return request<User>("/users", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getTags(): Promise<Tag[]> {
  const data = await request<ApiListResponse<Tag>>("/tags");
  return normalizeList<Tag>(data);
}

export async function getPosts(): Promise<Post[]> {
  const data = await request<ApiListResponse<Post>>("/posts");
  return normalizeList<Post>(data);
}

export async function getPostById(postId: number): Promise<Post> {
  const data = await request<ApiItemResponse<Post>>(`/posts/${postId}`);
  return normalizeItem<Post>(data);
}

export async function getPostImages(postId: number): Promise<PostImage[]> {
  const data = await request<ApiListResponse<PostImage>>(`/postimages/post/${postId}`);
  return normalizeList<PostImage>(data);
}

export const getImagenPostId = getPostImages;
export const getPostImageUrls = getPostImages;

export async function getVisibleComments(postId: number): Promise<Comment[]> {
  const data = await request<ApiListResponse<Comment>>(`/comments/post/${postId}`);
  return normalizeList<Comment>(data);
}

export async function createPostImage(
  payload: CreatePostImagePayload
): Promise<PostImage> {
  const data = await request<ApiItemResponse<PostImage>>("/postimages", {
    method: "POST",
    body: JSON.stringify({
      url: payload.url,
      postId: payload.postId,
    }),
  });

  return normalizeItem<PostImage>(data);
}

export async function createPost(payload: CreatePostPayload): Promise<FeedPost> {
  const data = await request<ApiItemResponse<Post>>("/posts", {
    method: "POST",
    body: JSON.stringify({
      description: payload.description,
      userId: payload.userId,
      tagIds: payload.tagIds,
    }),
  });

  const post = normalizeItem<Post>(data);

  const urls = (payload.imageUrls ?? [])
    .map((url) => url.trim())
    .filter(Boolean);

  if (urls.length > 0) {
    await Promise.all(
      urls.map((url) =>
        createPostImage({
          url,
          postId: post.id,
        })
      )
    );
  }

  const [images, visibleComments] = await Promise.all([
    getPostImages(post.id).catch(() => []),
    getVisibleComments(post.id).catch(() => []),
  ]);

  return {
    ...post,
    images,
    visibleComments,
  };
}

export async function createComment(
  payload: CreateCommentPayload
): Promise<Comment> {
  const data = await request<ApiItemResponse<Comment>>("/comments", {
    method: "POST",
    body: JSON.stringify({
      content: payload.content,
      userId: payload.userId,
      postId: payload.postId,
    }),
  });

  return normalizeItem<Comment>(data);
}

export async function getFeedPosts(): Promise<FeedPost[]> {
  const posts = await getPosts();

  return Promise.all(
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
}
