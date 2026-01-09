import { serverEnv } from '@/env';
import { dbConnect } from '@/lib/mongoose';
import { User } from '@/models/User';
import { compare, hash } from 'bcryptjs';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { cookies } from 'next/headers';

export const COOKIE_NAME = 'auth_token';

export async function login(username: string, password: string) {
  await dbConnect();
  let user = await User.findOne({ userName: username });

  if (!user) {
    const hashedPassword = await hash(password, 10);
    user = await User.create({
      userName: username,
      passwordHash: hashedPassword,
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

  const expiresInEnv = serverEnv.env.JWT_EXPIRES_IN;

  const signOptions: SignOptions = {
    expiresIn: expiresInEnv as SignOptions['expiresIn'],
  };

  const token = jwt.sign(
    { userId: user.id, username: user.userName },
    serverEnv.env.JWT_SECRET as Secret,
    signOptions
  );

  (await cookies()).set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: Number(serverEnv.env.JWT_EXPIRES_IN),
  });

  return { success: true };
}
