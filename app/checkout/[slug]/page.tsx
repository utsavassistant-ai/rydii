import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { cookies } from "next/headers";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Icon } from "@/components/Icon";
import { LocationPicker } from "@/components/LocationPicker";
import { createClient } from "@/utils/supabase/server";
import { requireAuth } from "@/lib/auth";
import type { DbScooter } from "@/lib/types";

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const supabase = createClient(await cookies());

  // Auth is optional at page load — gate is at the payment step
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: s } = await supabase
    .from("scooters")
    .select("*")
    .eq("slug", slug)
    .single<DbScooter>();

  if (!s) notFound();

  // Pre-fill rider details from profile when logged in
  let profile: { full_name: string | null; phone: string | null } | null = null;
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("full_name, phone")
      .eq("id", user.id)
      .single();
    profile = data;
  }

  async function completeBooking(formData: FormData) {
    "use server";
    // Auth gate lives here — not on page load
    const currentUser = await requireAuth();

    const cookieStore = await cookies();
    const sb = createClient(cookieStore);

    const { data: scooter } = await sb
      .from("scooters")
      .select("*")
      .eq("slug", slug)
      .single<DbScooter>();

    if (!scooter) throw new Error("Scooter not found");

    const rider_name     = formData.get("rider_name")     as string;
    const rider_phone    = formData.get("rider_phone")    as string;
    const rider_email    = formData.get("rider_email")    as string;
    const rider_licence  = formData.get("rider_licence")  as string;
    const pickup_datetime = formData.get("pickup_datetime") as string;
    const drop_datetime  = formData.get("drop_datetime")  as string;
    const pickup_mode    = (formData.get("pickup_mode")   as string) || "hub";
    const pickup_hub     = formData.get("pickup_hub")     as string | null;
    const pickup_address = formData.get("pickup_address") as string | null;
    const pickup_lat     = formData.get("pickup_lat") ? Number(formData.get("pickup_lat")) : null;
    const pickup_lng     = formData.get("pickup_lng") ? Number(formData.get("pickup_lng")) : null;
    const drop_mode      = (formData.get("drop_mode")     as string) || "hub";
    const drop_hub       = formData.get("drop_hub")       as string | null;
    const drop_address   = formData.get("drop_address")   as string | null;
    const drop_lat       = formData.get("drop_lat")  ? Number(formData.get("drop_lat"))  : null;
    const drop_lng       = formData.get("drop_lng")  ? Number(formData.get("drop_lng"))  : null;
    const payment_method = (formData.get("payment")       as string) || "upi";
    const promo_code     = (formData.get("promo_code")    as string) || null;

    const pickupDate = new Date(pickup_datetime);
    const dropDate   = new Date(drop_datetime);
    const diffMs     = dropDate.getTime() - pickupDate.getTime();
    const days       = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));

    const base_price    = scooter.price_per_day * days;
    const delivery_fee  = (pickup_mode === "delivery" ? 79 : 0) + (drop_mode === "delivery" ? 79 : 0);
    const platform_fee  = 40;
    const insurance_fee = 39;
    const gst   = Math.round((base_price + platform_fee + insurance_fee + delivery_fee) * 0.18);
    const total = base_price + delivery_fee + platform_fee + insurance_fee + gst;

    const { data: booking, error } = await sb
      .from("bookings")
      .insert({
        user_id: currentUser.id,
        scooter_id: scooter.id,
        pickup_datetime, drop_datetime,
        pickup_mode,
        pickup_hub:     pickup_mode === "hub"      ? pickup_hub     : null,
        pickup_address: pickup_mode === "delivery" ? pickup_address : null,
        pickup_lat:     pickup_mode === "delivery" ? pickup_lat     : null,
        pickup_lng:     pickup_mode === "delivery" ? pickup_lng     : null,
        drop_mode,
        drop_hub:     drop_mode === "hub"      ? drop_hub     : null,
        drop_address: drop_mode === "delivery" ? drop_address : null,
        drop_lat:     drop_mode === "delivery" ? drop_lat     : null,
        drop_lng:     drop_mode === "delivery" ? drop_lng     : null,
        days, base_price, delivery_fee, platform_fee, insurance_fee, gst, total,
        payment_method, status: "confirmed",
        rider_name, rider_phone, rider_email, rider_licence, promo_code,
      })
      .select("id")
      .single();

    if (error || !booking) throw new Error(error?.message || "Failed to create booking");

    redirect(`/booking/success?id=${booking.id}`);
  }

  const platform  = 40;
  const insurance = 39;
  const gst   = Math.round((s.price_per_day + platform + insurance) * 0.18);
  const total = s.price_per_day + platform + insurance + gst;

  const loginHref  = `/auth/login?next=${encodeURIComponent(`/checkout/${slug}`)}`;
  const signupHref = `/auth/signup?next=${encodeURIComponent(`/checkout/${slug}`)}`;

  return (
    <>
      <Header />
      <main className="max-w-screen-xl mx-auto px-6 py-10">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-10">
          Review & pay
        </h1>

        <form action={completeBooking} className="grid md:grid-cols-3 gap-10">
          <div className="md:col-span-2 space-y-6">

            {/* Vehicle */}
            <section className="bg-surface-container-low rounded-lg p-6 flex items-center gap-6">
              <div className="relative w-32 h-24 rounded-lg overflow-hidden bg-surface-container-high shrink-0">
                {s.image && (
                  <Image src={s.image} alt={s.name} fill sizes="128px" className="object-cover" />
                )}
              </div>
              <div className="flex-1">
                <div className="text-xs font-bold uppercase tracking-widest text-primary">
                  {s.category} · {s.brand}
                </div>
                <h2 className="text-2xl font-extrabold tracking-tight mt-1">{s.name}</h2>
                <div className="text-sm text-secondary mt-1">
                  {s.range_km || s.mileage} · {s.top_speed}
                </div>
              </div>
            </section>

            {/* Dates & location */}
            <section className="bg-surface-container-low rounded-lg p-6 space-y-6">
              <h2 className="text-xl font-extrabold">Pickup & drop</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <Field label="Pickup date & time">
                  <input
                    type="datetime-local"
                    name="pickup_datetime"
                    defaultValue="2025-10-25T10:00"
                    className="w-full bg-transparent font-bold focus:ring-0 border-none p-0"
                  />
                </Field>
                <Field label="Return date & time">
                  <input
                    type="datetime-local"
                    name="drop_datetime"
                    defaultValue="2025-10-26T10:00"
                    className="w-full bg-transparent font-bold focus:ring-0 border-none p-0"
                  />
                </Field>
              </div>
              <div className="grid md:grid-cols-2 gap-6 pt-2">
                <LocationPicker type="pickup" hubName={s.hub} city={s.city} />
                <LocationPicker type="drop"   hubName={s.hub} city={s.city} />
              </div>
            </section>

            {/* Rider details */}
            <section className="bg-surface-container-low rounded-lg p-6 space-y-4">
              <h2 className="text-xl font-extrabold">Rider details</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <Field label="Full name">
                  <input
                    type="text"
                    name="rider_name"
                    required
                    defaultValue={profile?.full_name ?? ""}
                    placeholder="As on driving licence"
                    className="w-full bg-transparent font-bold focus:ring-0 border-none p-0 placeholder:text-secondary/60"
                  />
                </Field>
                <Field label="Phone">
                  <input
                    type="tel"
                    name="rider_phone"
                    required
                    defaultValue={profile?.phone ?? ""}
                    placeholder="+91 98xxxx xxxx"
                    className="w-full bg-transparent font-bold focus:ring-0 border-none p-0 placeholder:text-secondary/60"
                  />
                </Field>
                <Field label="Email">
                  <input
                    type="email"
                    name="rider_email"
                    required
                    defaultValue={user?.email ?? ""}
                    placeholder="you@example.com"
                    className="w-full bg-transparent font-bold focus:ring-0 border-none p-0 placeholder:text-secondary/60"
                  />
                </Field>
                <Field label="Driving licence">
                  <input
                    type="text"
                    name="rider_licence"
                    required
                    placeholder="KA01 20250001234"
                    className="w-full bg-transparent font-bold focus:ring-0 border-none p-0 placeholder:text-secondary/60"
                  />
                </Field>
              </div>
            </section>

            {/* Payment method — only when logged in */}
            {user ? (
              <section className="bg-surface-container-low rounded-lg p-6 space-y-4">
                <h2 className="text-xl font-extrabold">Payment method</h2>
                <div className="grid md:grid-cols-2 gap-3">
                  <PaymentOption icon="qr_code_2"   label="UPI"               sublabel="PhonePe, GPay, Paytm"    value="upi"  defaultChecked />
                  <PaymentOption icon="credit_card" label="Credit / Debit card" sublabel="Visa, Mastercard, Rupay" value="card" />
                </div>
              </section>
            ) : (
              /* Auth gate — shown only to unauthenticated users */
              <section className="rounded-lg border-2 border-dashed border-outline-variant/40 p-8 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center mx-auto">
                  <Icon name="lock_open" className="text-on-primary-fixed" />
                </div>
                <h2 className="text-xl font-extrabold">Sign in to complete booking</h2>
                <p className="text-secondary text-sm max-w-sm mx-auto">
                  Your dates and details are saved. Create an account or log in — it takes 30 seconds.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                  <Link
                    href={loginHref}
                    className="rounded-full cta-gradient text-on-primary-fixed px-8 py-3 font-bold hover:opacity-95 active:scale-95 transition"
                  >
                    Log in
                  </Link>
                  <Link
                    href={signupHref}
                    className="rounded-full bg-surface-container-high text-on-surface px-8 py-3 font-bold hover:opacity-95 active:scale-95 transition"
                  >
                    Create account
                  </Link>
                </div>
                <p className="text-xs text-secondary">Free to join · No spam</p>
              </section>
            )}
          </div>

          {/* Summary sidebar */}
          <aside className="md:sticky md:top-24 h-fit">
            <div className="rounded-lg bg-surface-container-lowest shadow-ambient p-6 space-y-4">
              <h2 className="text-xl font-extrabold">Booking summary</h2>
              <div className="space-y-2 text-sm">
                <Row label={`₹${s.price_per_day} × 1 day`} value={`₹${s.price_per_day}`} />
                <Row label="Platform fee"     value={`₹${platform}`} />
                <Row label="Smart protection" value={`₹${insurance}`} />
                <Row label="GST (18%)"        value={`₹${gst}`} />
                <div className="flex justify-between text-secondary text-xs bg-surface-container-low rounded-lg px-3 py-2">
                  <span className="flex items-center gap-1">
                    <Icon name="local_shipping" className="!text-[13px]" />
                    Delivery (if selected)
                  </span>
                  <span className="text-on-surface font-semibold">+₹79 each</span>
                </div>
                <div className="border-t border-outline-variant/30 pt-3 flex justify-between font-bold text-lg">
                  <span>Total payable</span>
                  <span>₹{total}+</span>
                </div>
              </div>

              <div className="bg-surface-container-low rounded-lg p-3 flex items-center gap-2">
                <input
                  name="promo_code"
                  placeholder="Referral / promo code"
                  className="flex-1 bg-transparent focus:ring-0 border-none p-0 font-semibold placeholder:text-secondary/60"
                />
                <button type="button" className="rounded-full bg-on-surface text-surface px-4 py-1.5 text-sm font-bold">
                  Apply
                </button>
              </div>

              {user ? (
                <>
                  <button
                    type="submit"
                    className="w-full cta-gradient text-on-primary-fixed rounded-full py-4 font-bold text-lg hover:opacity-95 active:scale-95 transition"
                  >
                    Complete payment →
                  </button>
                  <div className="text-xs text-secondary text-center flex items-center justify-center gap-1">
                    <Icon name="lock" className="!text-[14px]" />
                    Secured by 256-bit SSL encryption
                  </div>
                </>
              ) : (
                <Link
                  href={loginHref}
                  className="block text-center w-full cta-gradient text-on-primary-fixed rounded-full py-4 font-bold text-lg hover:opacity-95 active:scale-95 transition"
                >
                  Sign in to pay →
                </Link>
              )}
            </div>
          </aside>
        </form>
      </main>
      <Footer />
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block bg-surface-container-lowest rounded-lg p-4">
      <div className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-1">{label}</div>
      {children}
    </label>
  );
}

function PaymentOption({
  icon, label, sublabel, value, defaultChecked,
}: {
  icon: string; label: string; sublabel: string; value: string; defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-center gap-3 bg-surface-container-lowest rounded-lg p-4 cursor-pointer">
      <input type="radio" name="payment" value={value} defaultChecked={defaultChecked} className="accent-primary-container" />
      <Icon name={icon} className="text-primary" />
      <div>
        <div className="font-bold">{label}</div>
        <div className="text-xs text-secondary">{sublabel}</div>
      </div>
    </label>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-secondary">
      <span>{label}</span>
      <span className="text-on-surface font-semibold">{value}</span>
    </div>
  );
}
