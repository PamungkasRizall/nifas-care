"use server";

import { signIn, signOut } from "@/lib/auth/auth";
import { AuthError } from "next-auth";

export async function logoutAction() {
  await signOut({ redirectTo: "/" });
}

export async function loginWithCredentialsAction(formData: FormData) {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const callbackUrl = (formData.get("callbackUrl") as string) || "/dashboard";

    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl,
    });

    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { success: false, error: "Email atau password salah." };
        default:
          return { success: false, error: "Terjadi kesalahan autentikasi." };
      }
    }
    throw error; // Biarkan Next.js menangani redirect
  }
}
