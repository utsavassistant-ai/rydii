"use server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export type SignupState =
  | null
  | { success: true; email: string }
  | { error: string };

export async function signupAction(
  _prev: SignupState,
  formData: FormData
): Promise<SignupState> {
  const fullName = formData.get("full_name") as string;
  const email    = formData.get("email")     as string;
  const password = formData.get("password")  as string;
  const role     = (formData.get("role") as string) || "rider";

  const supabase = createClient(await cookies());
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://rydii.vercel.app";

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName, role },
      emailRedirectTo: `${siteUrl}/auth/callback`,
    },
  });

  if (error) return { error: error.message };
  return { success: true, email };
}
