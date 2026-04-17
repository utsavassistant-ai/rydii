import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Icon } from "@/components/Icon";
import { createClient } from "@/utils/supabase/server";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const sp = await searchParams;

  async function signup(formData: FormData) {
    "use server";
    const fullName = formData.get("full_name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const role = (formData.get("role") as string) || "rider";
    const supabase = createClient(await cookies());

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName, role } },
    });
    if (error) {
      redirect(`/auth/signup?error=${encodeURIComponent(error.message)}`);
    }
    redirect("/auth/login?error=Check+your+email+to+confirm+your+account");
  }

  return (
    <>
      <Header />
      <main className="max-w-md mx-auto px-6 py-20">
        <h1 className="text-4xl font-extrabold tracking-tighter text-center">
          Create account
        </h1>
        <p className="text-secondary text-center mt-2 mb-10">
          Start renting scootys in under 60 seconds.
        </p>

        {sp.error && (
          <div className="bg-error-container text-on-error-container rounded-lg p-4 mb-6 text-sm font-semibold flex items-center gap-2">
            <Icon name="error" className="!text-[18px]" />
            {sp.error}
          </div>
        )}

        <form action={signup} className="space-y-4">
          <label className="block bg-surface-container-low rounded-lg p-4">
            <div className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-1">
              Full name
            </div>
            <input
              name="full_name"
              type="text"
              required
              placeholder="Karan Sharma"
              className="w-full bg-transparent font-bold focus:ring-0 border-none p-0 placeholder:text-secondary/50"
            />
          </label>
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
              minLength={6}
              placeholder="Min 6 characters"
              className="w-full bg-transparent font-bold focus:ring-0 border-none p-0 placeholder:text-secondary/50"
            />
          </label>

          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-2">
              I want to
            </div>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex items-center gap-3 bg-surface-container-low rounded-lg p-4 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="rider"
                  defaultChecked
                  className="accent-primary-container"
                />
                <div>
                  <div className="font-bold">Rent</div>
                  <div className="text-xs text-secondary">Book scootys</div>
                </div>
              </label>
              <label className="flex items-center gap-3 bg-surface-container-low rounded-lg p-4 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="vendor"
                  className="accent-primary-container"
                />
                <div>
                  <div className="font-bold">List</div>
                  <div className="text-xs text-secondary">Earn money</div>
                </div>
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full cta-gradient text-on-primary-fixed rounded-full py-4 font-bold text-lg hover:opacity-95 active:scale-95 transition"
          >
            Create account
          </button>
        </form>

        <p className="text-center text-sm text-secondary mt-6">
          Already have an account?{" "}
          <Link href="/auth/login" className="font-bold text-primary">
            Log in
          </Link>
        </p>
      </main>
      <Footer />
    </>
  );
}
