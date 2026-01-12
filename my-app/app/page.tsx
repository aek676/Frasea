import { redirect } from 'next/navigation';
import { getServerAuth } from '@/utils/serverAuth';

export default async function Home() {
  try {
    // Server-side authentication check
    const { userId } = await getServerAuth();
    
    if (userId) {
      // User is authenticated, redirect to translator
      redirect('/translator');
    } else {
      // User is not authenticated, redirect to login
      redirect('/login');
    }
  } catch (error) {
    // If there's an error with authentication, redirect to login
    redirect('/login');
  }
}