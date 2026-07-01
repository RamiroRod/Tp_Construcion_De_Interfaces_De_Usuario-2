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

export async function getUsers(): Promise<User[]> {
  const response = await fetch(`${API_URL}/users`);

  if (!response.ok) {
    throw new Error("Error al obtener los usuarios.");
  }

  return response.json();
}

export async function getUserById(id: number): Promise<User> {
  const response = await fetch(`${API_URL}/users/${id}`);

  if (!response.ok) {
    throw new Error(`Error al obtener el usuario con id ${id}.`);
  }

  return response.json();
}

export async function createUser(
  payload: RegisterUserPayload
): Promise<User> {
  const response = await fetch(`${API_URL}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Error al crear el usuario.");
  }

  return response.json();
}

export async function getPosts(): Promise<FeedPost[]> {
  const response = await fetch(`${API_URL}/posts`);

  if (!response.ok) {
    throw new Error("Error al obtener las publicaciones.");
  }

  return response.json();
}

export async function getTags(): Promise<Tag[]> {
  const response = await fetch(`${API_URL}/tags`);

  if (!response.ok) {
    throw new Error("Error al obtener los tags.");
  }

  return response.json();
}

export async function getFeedPosts(): Promise<FeedPost[]> {
  return getPosts();
}

export async function getPostById(id: number): Promise<Post> {
  const response = await fetch(`${API_URL}/posts/${id}`);

  if (!response.ok) {
    throw new Error(`Error al obtener la publicación con id ${id}.`);
  }

  return response.json();
}

export async function createPost(
  payload: CreatePostPayload
): Promise<Post> {
  const body = {
    description: payload.description,
    userId: payload.userId ?? payload.UserId,
    tagIds: payload.tagIds ?? [],
  };

  const response = await fetch(`${API_URL}/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error("Error al crear la publicación.");
  }

  return response.json();
}

export async function getVisibleComments(postId: number): Promise<Comment[]> {
  const response = await fetch(`${API_URL}/comments/post/${postId}`);

  if (!response.ok) {
    throw new Error(`Error al obtener los comentarios del post ${postId}.`);
  }

  return response.json();
}

export async function createComment(
  payload: CreateCommentPayload
): Promise<Comment> {
  const body = {
    content: payload.content,
    userId: payload.userId,
    postId: payload.postId,
  };

  const response = await fetch(`${API_URL}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error("Error al crear el comentario.");
  }

  return response.json();
}

export async function getPostImageUrls(postId: number): Promise<PostImage[]> {
  const response = await fetch(`${API_URL}/postimages/post/${postId}`);

  if (!response.ok) {
    throw new Error(`Error al obtener las imágenes del post ${postId}.`);
  }

  return response.json();
}

export async function createPostImage(
  payload: CreatePostImagePayload
): Promise<PostImage> {
  const body = {
    url: payload.url,
    postId: payload.postId,
  };

  const response = await fetch(`${API_URL}/postimages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error("Error al crear la imagen del post.");
  }

  return response.json();
}

