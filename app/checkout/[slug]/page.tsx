import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Icon } from "@/components/Icon";
import { getScooterBySlug } from "@/lib/scooters";

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const s = getScooterBySlug(slug);
  if (!s) notFound();

  async function completeBooking() {
    "use server";
    redirect(`/booking/success?scooty=${slug}`);
  }

  const platform = 40;
  const insurance = 39;
  const gst = Math.round((s.pricePerDay + platform + insurance) * 0.18);
  const total = s.pricePerDay + platform + insurance + gst;

  return (
    <>
      <Header />
      <main className="max-w-screen-xl mx-auto px-6 py-10">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-10">
          Review & pay
        </h1>

        <form action={completeBooking} className="grid md:grid-cols-3 gap-10">
          <div className="md:col-span-2 space-y-6">
            {/* Vehicle teaser */}
            <section className="bg-surface-container-low rounded-lg p-6 flex items-center gap-6">
              <div className="relative w-32 h-24 rounded-lg overflow-hidden bg-surface-container-high shrink-0">
                <Image
                  src={s.image}
                  alt={s.name}
                  fill
                  sizes="128px"
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="text-xs font-bold uppercase tracking-widest text-primary">
                  {s.category} · {s.brand}
                </div>
                <h2 className="text-2xl font-extrabold tracking-tight mt-1">
                  {s.name}
                </h2>
                <div className="text-sm text-secondary mt-1">
                  {s.range || s.mileage} · {s.topSpeed}
                </div>
              </div>
            </section>

            {/* Logistics */}
            <section className="bg-surface-container-low rounded-lg p-6 space-y-4">
              <h2 className="text-xl font-extrabold">Pickup & drop</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <Field label="Pickup hub">
                  <select className="w-full bg-transparent font-bold focus:ring-0 border-none p-0">
                    <option>
                      {s.hub}, {s.city}
                    </option>
                    <option>HSR Layout Hub</option>
                    <option>Koramangala Hub</option>
                  </select>
                </Field>
                <Field label="Drop-off hub">
                  <select className="w-full bg-transparent font-bold focus:ring-0 border-none p-0">
                    <option>Same as pickup</option>
                    <option>Indiranagar Hub</option>
                  </select>
                </Field>
                <Field label="Pickup date & time">
                  <input
                    type="datetime-local"
                    defaultValue="2025-10-25T10:00"
                    className="w-full bg-transparent font-bold focus:ring-0 border-none p-0"
                  />
                </Field>
                <Field label="Return date & time">
                  <input
                    type="datetime-local"
                    defaultValue="2025-10-26T10:00"
                    className="w-full bg-transparent font-bold focus:ring-0 border-none p-0"
                  />
                </Field>
              </div>
            </section>

            {/* Rider */}
            <section className="bg-surface-container-low rounded-lg p-6 space-y-4">
              <h2 className="text-xl font-extrabold">Rider details</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <Field label="Full name">
                  <input
                    type="text"
                    required
                    placeholder="As on driving licence"
                    className="w-full bg-transparent font-bold focus:ring-0 border-none p-0 placeholder:text-secondary/60"
                  />
                </Field>
                <Field label="Phone">
                  <input
                    type="tel"
                    required
                    placeholder="+91 98xxxx xxxx"
                    className="w-full bg-transparent font-bold focus:ring-0 border-none p-0 placeholder:text-secondary/60"
                  />
                </Field>
                <Field label="Email">
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    className="w-full bg-transparent font-bold focus:ring-0 border-none p-0 placeholder:text-secondary/60"
                  />
                </Field>
                <Field label="Driving licence">
                  <input
                    type="text"
                    required
                    placeholder="KA01 20250001234"
                    className="w-full bg-transparent font-bold focus:ring-0 border-none p-0 placeholder:text-secondary/60"
                  />
                </Field>
              </div>
            </section>

            {/* Payment */}
            <section className="bg-surface-container-low rounded-lg p-6 space-y-4">
              <h2 className="text-xl font-extrabold">Payment method</h2>
              <div className="grid md:grid-cols-2 gap-3">
                <PaymentOption
                  icon="qr_code_2"
                  label="UPI"
                  sublabel="PhonePe, GPay, Paytm"
                  defaultChecked
                />
                <PaymentOption
                  icon="credit_card"
                  label="Credit / Debit card"
                  sublabel="Visa, Mastercard, Rupay"
                />
              </div>
            </section>
          </div>

          {/* Summary */}
          <aside className="md:sticky md:top-24 h-fit">
            <div className="rounded-lg bg-surface-container-lowest shadow-ambient p-6 space-y-4">
              <h2 className="text-xl font-extrabold">Booking summary</h2>
              <div className="space-y-2 text-sm">
                <Row label={`₹${s.pricePerDay} × 1 day`} value={`₹${s.pricePerDay}`} />
                <Row label="Platform fee" value={`₹${platform}`} />
                <Row label="Smart protection" value={`₹${insurance}`} />
                <Row label="GST (18%)" value={`₹${gst}`} />
                <div className="border-t border-outline-variant/30 pt-3 flex justify-between font-bold text-lg">
                  <span>Total payable</span>
                  <span>₹{total}</span>
                </div>
              </div>

              <div className="bg-surface-container-low rounded-lg p-3 flex items-center gap-2">
                <input
                  placeholder="Referral / promo code"
                  className="flex-1 bg-transparent focus:ring-0 border-none p-0 font-semibold placeholder:text-secondary/60"
                />
                <button
                  type="button"
                  className="rounded-full bg-on-surface text-surface px-4 py-1.5 text-sm font-bold"
                >
                  Apply
                </button>
              </div>

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
            </div>
          </aside>
        </form>
      </main>
      <Footer />
    </>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block bg-surface-container-lowest rounded-lg p-4">
      <div className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-1">
        {label}
      </div>
      {children}
    </label>
  );
}

function PaymentOption({
  icon,
  label,
  sublabel,
  defaultChecked,
}: {
  icon: string;
  label: string;
  sublabel: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-center gap-3 bg-surface-container-lowest rounded-lg p-4 cursor-pointer">
      <input
        type="radio"
        name="payment"
        defaultChecked={defaultChecked}
        className="accent-primary-container"
      />
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
