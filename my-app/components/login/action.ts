"use server"

import { LoginSchema } from "@/schemas/login.schema";
import { login } from "@/services/auth";

export async function loginAction(prevState: any, formData: FormData) {
  const validatedFieldsLogin = LoginSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFieldsLogin.success) {
    return {
      message: "Username or password incorrect"
    }
  }

  const { username, password } = validatedFieldsLogin.data;

  console.log("Logging in with:", { username, password });

  const isLogin = await login(username, password);

  if (!isLogin.success) {
    return {
      message: isLogin.error,
    }
  }

  return { message: "Login sucessfull" }
}

