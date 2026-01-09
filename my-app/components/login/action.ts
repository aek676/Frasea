'use server';

import { LoginSchema } from '@/schemas/login.schema';
import { login } from '@/services/auth';
import { redirect } from 'next/navigation';

export async function loginAction(_prevState: any, formData: FormData) {
  const validatedFieldsLogin = LoginSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFieldsLogin.success) {
    return {
      message: 'Username or password incorrect',
    };
  }

  const { username, password } = validatedFieldsLogin.data;

  const isLogin = await login(username, password);

  if (!isLogin.success) {
    return {
      message: isLogin.error,
    };
  }

  redirect('/translator');
}
