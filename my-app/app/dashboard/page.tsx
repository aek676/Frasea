import { parseAuthCookie, verifyJwt } from '@/utils/jwt';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function Dashboard() {
  const headersList = await headers();
  const token = parseAuthCookie(headersList.get('cookie') ?? undefined);
  const payload = token ? verifyJwt(token) : null;

  if (!payload) {
    redirect('/login');
  }

  return (
    <div>
      <h1>Welcome, {payload.username}!</h1>
      <p>User ID: {payload.userId}</p>
    </div>
  );
}
