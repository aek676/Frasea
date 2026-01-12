import { parseAuthCookie } from "@/utils/jwt";

export async function getCurrentUser() {
  try {
    const cookies = document.cookie;
    const token = parseAuthCookie(cookies);

    if (!token) {
      return null;
    }

    const payload = JSON.parse(atob(token.split(".")[1]));

    return {
      userId: payload.userId,
      username: payload.username,
    };
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

export async function isAuthenticated() {
  const user = await getCurrentUser();
  return user !== null;
}

