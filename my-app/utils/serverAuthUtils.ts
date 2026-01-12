'use server'

import { cookies } from 'next/headers';
import { verifyJwt, type JwtPayload } from './jwt';

export async function getAuthenticatedUser(): Promise<{ user: JwtPayload } | { error: string }> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    
    if (!token) {
      return { error: 'No authentication token provided' };
    }
    
    const payload = verifyJwt(token);
    if (!payload) {
      return { error: 'Invalid or expired token' };
    }
    
    return { user: payload };
  } catch (error) {
    return { error: 'Authentication verification failed' };
  }
}

export async function requireAuthenticatedUser(): Promise<JwtPayload> {
  const auth = await getAuthenticatedUser();
  if ('error' in auth) {
    throw new Error(auth.error);
  }
  return auth.user;
}

export async function validateUserId(userId: string): Promise<{ valid: boolean; error?: string }> {
  try {
    const auth = await requireAuthenticatedUser();
    if (auth.userId !== userId) {
      return { valid: false, error: 'Invalid user' };
    }
    return { valid: true };
  } catch (error) {
    return { valid: false, error: 'Authentication failed' };
  }
}