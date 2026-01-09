"use server"

import { serverEnv } from '@/env';
import { dbConnect } from '@/lib/mongoose';
import { User } from '@/models/User';
import { COOKIE_NAME } from '@/utils/jwt';
import { compare, hash } from 'bcryptjs';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function login(username: string, password: string) {
  await dbConnect();
  let user = await User.findOne({ username });

  if (!user) {
    const passwordHash = await hash(password, 10);
    user = await User.create({
      username,
      passwordHash,
    });
  }

  if (!user) {
    return {
      success: false,
      error: 'Unable to create or find user',
    };
  }

  const isPasswordValid = await compare(password, user.passwordHash);
  if (!isPasswordValid) {
    return {
      success: false,
      error: 'Incorrect password',
    };
  }

  const expiresInSeconds = parseInt(serverEnv.env.JWT_EXPIRES_IN, 10);

  const signOptions: SignOptions = {
    expiresIn: expiresInSeconds,
  };

  const token = jwt.sign(
    { userId: user.id, username: user.username },
    serverEnv.env.JWT_SECRET as Secret,
    signOptions
  );

  (await cookies()).set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: expiresInSeconds,
  });

  return { success: true };
}

export async function logout() {
  try {
    const cookieStore = await cookies();
    if (cookieStore.get(COOKIE_NAME)) {
      cookieStore.delete({ name: COOKIE_NAME, path: '/' });
    }
    return { success: true };
  } catch (err) {
    console.error('Failed to delete cookie', err);
    return { success: false, error: 'Failed to delete cookie' };
  }
}
