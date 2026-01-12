import { parseAuthCookie } from '@/utils/jwt';

// Client-side function to get current user from cookies
export async function getCurrentUser() {
  try {
    // Get cookies from browser
    const cookies = document.cookie;
    const token = parseAuthCookie(cookies);
    
    if (!token) {
      return null;
    }

    // Decode JWT payload (without verification for client-side)
    const payload = JSON.parse(atob(token.split('.')[1]));
    
    return {
      userId: payload.userId,
      username: payload.username
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

// Check if user is authenticated
export async function isAuthenticated() {
  const user = await getCurrentUser();
  return user !== null;
}