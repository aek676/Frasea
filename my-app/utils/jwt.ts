import jwt from 'jsonwebtoken';
import { parse } from 'cookie';
import { serverEnv } from '@/env';

export type JwtPayload = {
  userId: string;
  username: string;
  iat?: number;
  exp?: number;
};

export function parseAuthCookie(cookieHeader: string | undefined): string | null {
  if (!cookieHeader) return null;
  const cookies = parse(cookieHeader);
  return cookies.authToken ?? null;
}

export function verifyJwt(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, serverEnv.env.JWT_SECRET as jwt.Secret) as JwtPayload;
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}
