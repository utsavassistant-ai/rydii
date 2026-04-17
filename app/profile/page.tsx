import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Icon } from "@/components/Icon";
import { createClient } from "@/utils/supabase/server";
import { requireAuth } from "@/lib/auth";

export default async function ProfilePage() {
  const user = await requireAuth();
  const supabase = createClient(await cookies());
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user!.id)
    .single();

  async function updateProfile(formData: FormData) {
    "use server";
    const supabase = createClient(await cookies());
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) redirect("/auth/login");

    await supabase
      .from("profiles")
      .update({
        full_name: formData.get("full_name") as string,
        phone: formData.get("phone") as string,
      })
      .eq("id", user.id);

    redirect("/profile");
  }

  return (
    <>
      <Header />
      <main className="max-w-xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-extrabold tracking-tighter mb-10">
          My profile
        </h1>

        <form action={updateProfile} className="space-y-4">
          <label className="block bg-surface-container-low rounded-lg p-4">
            <div className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-1">
              Full name
            </div>
            <input
              name="full_name"
              type="text"
              defaultValue={profile?.full_name || ""}
              className="w-full bg-transparent font-bold focus:ring-0 border-none p-0 placeholder:text-secondary/50"
            />
          </label>

          <label className="block bg-surface-container-low rounded-lg p-4">
            <div className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-1">
              Email
            </div>
            <input
              type="email"
              disabled
              value={user!.email || ""}
              className="w-full bg-transparent font-bold focus:ring-0 border-none p-0 text-secondary"
            />
          </label>

          <label className="block bg-surface-container-low rounded-lg p-4">
            <div className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-1">
              Phone
            </div>
            <input
              name="phone"
              type="tel"
              defaultValue={profile?.phone || ""}
              placeholder="+91 98xxxx xxxx"
              className="w-full bg-transparent font-bold focus:ring-0 border-none p-0 placeholder:text-secondary/50"
            />
          </label>

          <div className="bg-surface-container-low rounded-lg p-4">
            <div className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-1">
              Role
            </div>
            <div className="flex items-center gap-2">
              <Icon
                name={profile?.role === "vendor" ? "store" : "two_wheeler"}
                className="text-primary !text-[20px]"
              />
              <span className="font-bold capitalize">
                {profile?.role || "rider"}
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full cta-gradient text-on-primary-fixed rounded-full py-4 font-bold text-lg hover:opacity-95 active:scale-95 transition mt-6"
          >
            Save changes
          </button>
        </form>
      </main>
      <Footer />
    </>
  );
}
