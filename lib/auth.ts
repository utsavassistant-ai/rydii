import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import type { Profile } from "@/lib/types";

export async function getUser() {
  const supabase = createClient(await cookies());
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function getProfile(): Promise<Profile | null> {
  const supabase = createClient(await cookies());
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();
  return data;
}

export async function requireAuth() {
  const user = await getUser();
  if (!user) {
    const { redirect } = await import("next/navigation");
    redirect("/auth/login");
  }
  return user!;
}
