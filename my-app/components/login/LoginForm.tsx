'use client';

import { LoginSchema } from '@/schemas/login.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { startTransition, useActionState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '../ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '../ui/field';
import { Input } from '../ui/input';
import { loginAction } from './action';

interface LoginFormProps {
  onSubmit?: (username: string, password: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = () => {
  const [state, action, isPending] = useActionState(loginAction, null);

  function onSubmit(data: z.infer<typeof LoginSchema>) {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) =>
      formData.append(key, value as string)
    );

    startTransition(() => {
      action(formData);
    })
  }

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  return (
    <div className="w-full">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Sign In
        </h2>
        <p className="text-gray-600 mt-2">Enter your credentials to access</p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FieldGroup>
          <Controller
            name="username"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invald={fieldState.invalid}>
                <FieldLabel htmlFor="form-username">Username</FieldLabel>
                <Input
                  {...field}
                  id="form-username"
                  aria-invalid={fieldState.invalid}
                  placeholder="Username"
                  autoComplete="username"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invald={fieldState.invalid}>
                <FieldLabel htmlFor="form-password">Password</FieldLabel>
                <Input
                  {...field}
                  id="form-password"
                  aria-invalid={fieldState.invalid}
                  placeholder="Password"
                  autoComplete="password"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>
        <Field orientation="vertical" className="justify-end">
          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? 'Signing in...' : 'Sign In'}
          </Button>
          {state?.message && (
            <FieldError errors={[{ message: state.message }]} />
          )}
        </Field>
      </form>
    </div>
  );
};

export default LoginForm;
