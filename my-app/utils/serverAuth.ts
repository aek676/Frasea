import { parseAuthCookie, verifyJwt } from '@/utils/jwt';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export async function getServerAuth() {
  const headersList = await headers();
  const token = parseAuthCookie(headersList.get('cookie') ?? undefined);
  const payload = token ? verifyJwt(token) : null;

  if (!payload) {
    redirect('/login');
  }

  return { userId: payload.userId, username: payload.username };
}