import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { Icon } from "./Icon";

export async function AuthButton() {
  const supabase = createClient(await cookies());
  const {
    data: { user },
  } = await supabase.auth.getUser();

  async function logout() {
    "use server";
    const supabase = createClient(await cookies());
    await supabase.auth.signOut();
    redirect("/");
  }

  if (!user) {
    return (
      <Link
        href="/auth/login"
        className="rounded-full bg-on-surface text-surface px-5 py-2 text-sm font-bold hover:opacity-90 transition"
      >
        Log in
      </Link>
    );
  }

  const initials = (user.user_metadata?.full_name || user.email || "U")
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex items-center gap-2">
      <Link
        href="/profile"
        className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary-fixed font-bold text-sm"
        title={user.email || "Profile"}
      >
        {initials}
      </Link>
      <form action={logout}>
        <button
          type="submit"
          className="p-2 text-secondary hover:text-on-surface transition"
          title="Log out"
        >
          <Icon name="logout" className="!text-[20px]" />
        </button>
      </form>
    </div>
  );
}
