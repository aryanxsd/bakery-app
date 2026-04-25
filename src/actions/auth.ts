"use server";

import { redirect } from "next/navigation";

import { signInAdmin, signOut } from "@/lib/auth";

export type AuthFormState = {
  error?: string;
};

export async function loginAction(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    return { error: "Please enter both email and password." };
  }

  const session = await signInAdmin(email, password);

  if (!session) {
    return { error: "Invalid admin credentials." };
  }

  redirect("/admin");
}

export async function logoutAction() {
  await signOut();
  redirect("/");
}
