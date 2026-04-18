import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Icon } from "@/components/Icon";
import { createClient } from "@/utils/supabase/server";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string; next?: string }>;
}) {
  const sp = await searchParams;

  async function login(formData: FormData) {
    "use server";
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const next = formData.get("next") as string;
    const supabase = createClient(await cookies());

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      redirect(`/auth/login?error=${encodeURIComponent(error.message)}`);
    }
    redirect(next || "/");
  }

  return (
    <>
      <Header />
      <main className="max-w-md mx-auto px-6 py-20">
        <h1 className="text-4xl font-extrabold tracking-tighter text-center">
          Welcome back
        </h1>
        <p className="text-secondary text-center mt-2 mb-10">
          Log in to manage your bookings and rentals.
        </p>

        {sp.message && (
          <div className="bg-primary-container text-on-primary-fixed rounded-lg p-4 mb-6 text-sm font-semibold flex items-center gap-2">
            <Icon name="check_circle" className="!text-[18px]" />
            {sp.message}
          </div>
        )}
        {sp.error && (
          <div className="bg-error-container text-on-error-container rounded-lg p-4 mb-6 text-sm font-semibold flex items-center gap-2">
            <Icon name="error" className="!text-[18px]" />
            {sp.error}
          </div>
        )}

        <form action={login} className="space-y-4">
          <input type="hidden" name="next" value={sp.next || ""} />
          <label className="block bg-surface-container-low rounded-lg p-4">
            <div className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-1">
              Email
            </div>
            <input
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              className="w-full bg-transparent font-bold focus:ring-0 border-none p-0 placeholder:text-secondary/50"
            />
          </label>
          <label className="block bg-surface-container-low rounded-lg p-4">
            <div className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-1">
              Password
            </div>
            <input
              name="password"
              type="password"
              required
              placeholder="••••••••"
              className="w-full bg-transparent font-bold focus:ring-0 border-none p-0 placeholder:text-secondary/50"
            />
          </label>
          <button
            type="submit"
            className="w-full cta-gradient text-on-primary-fixed rounded-full py-4 font-bold text-lg hover:opacity-95 active:scale-95 transition"
          >
            Log in
          </button>
        </form>

        <p className="text-center text-sm text-secondary mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/auth/signup" className="font-bold text-primary">
            Sign up
          </Link>
        </p>
      </main>
      <Footer />
    </>
  );
}
