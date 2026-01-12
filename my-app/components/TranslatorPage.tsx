import TranslationForm from '@/components/TranslationForm';
import { getAuthenticatedUser } from '@/utils/serverAuthUtils';
import { redirect } from 'next/navigation';

export default async function TranslatorPage() {
  try {
    // Server-side authentication check
    const authResult = await getAuthenticatedUser();

    if ('error' in authResult) {
      redirect('/login');
    }

    return <TranslationForm />;
  } catch (error) {
    console.error('Error in TranslatorPage:', error);
    redirect('/login');
  }
}
