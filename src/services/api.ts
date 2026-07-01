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
    ...(Array.isArray(payload.tagIds) && payload.tagIds.length > 0
      ? { tagIds: payload.tagIds }
      : {}),
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

  const createdPost = await response.json();

  if (payload.imageUrls?.length || payload.images?.length) {
    const imageUploads = [
      ...(payload.imageUrls ?? [])
        .filter(Boolean)
        .map((url) =>
          createPostImage({
            url,
            postId: createdPost.id,
          }).catch(() => null)
        ),
      ...((payload.images ?? []).map((file) => {
        return new Promise<void>((resolve) => {
          const reader = new FileReader();
          reader.onload = async () => {
            try {
              await createPostImage({
                url: reader.result as string,
                postId: createdPost.id,
              });
              resolve();
            } catch {
              resolve();
            }
          };
          reader.onerror = () => resolve();
          reader.readAsDataURL(file);
        });
      })),
    ];

    await Promise.all(imageUploads);
  }

  return createdPost;
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

