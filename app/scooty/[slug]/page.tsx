import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ScooterCard } from "@/components/ScooterCard";
import { Icon } from "@/components/Icon";
import { scooters, getScooterBySlug } from "@/lib/scooters";

export function generateStaticParams() {
  return scooters.map((s) => ({ slug: s.slug }));
}

export default async function ScootyDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const s = getScooterBySlug(slug);
  if (!s) notFound();

  const related = scooters.filter((x) => x.id !== s.id).slice(0, 3);
  const platform = 40;
  const insurance = 39;
  const total = s.pricePerDay + platform + insurance;

  return (
    <>
      <Header />
      <main className="max-w-screen-xl mx-auto px-6 py-10 pb-40">
        {/* Breadcrumb */}
        <nav className="text-sm text-secondary mb-6 font-semibold">
          <Link href="/browse" className="hover:text-on-surface">
            ← Back to explore
          </Link>
        </nav>

        {/* Gallery */}
        <section className="grid md:grid-cols-3 gap-4 mb-12">
          <div className="md:col-span-2 relative aspect-[16/10] rounded-lg overflow-hidden bg-surface-container-high">
            <Image
              src={s.gallery[0] || s.image}
              alt={s.name}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 66vw"
              className="object-cover"
            />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
            {(s.gallery.slice(1, 3).length > 0 ? s.gallery.slice(1, 3) : [s.image, s.image]).map((g, i) => (
              <div
                key={i}
                className="relative aspect-square rounded-lg overflow-hidden bg-surface-container-high"
              >
                <Image src={g} alt="" fill sizes="33vw" className="object-cover" />
              </div>
            ))}
          </div>
        </section>

        <div className="grid md:grid-cols-3 gap-12">
          {/* Main */}
          <div className="md:col-span-2 space-y-10">
            <header className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-primary">
                    {s.brand}
                  </div>
                  <h1 className="text-5xl font-extrabold tracking-tighter mt-2">
                    {s.name}
                  </h1>
                  <div className="flex items-center gap-2 mt-3 text-secondary">
                    <Icon name="star" className="!text-[18px] text-primary-container" fill />
                    <span className="font-bold text-on-surface">{s.rating}</span>
                    <span>· {s.reviews} reviews</span>
                    <span>·</span>
                    <span>{s.hub}, {s.city}</span>
                  </div>
                </div>
                <button
                  aria-label="Save"
                  className="p-3 rounded-full bg-surface-container-high"
                >
                  <Icon name="favorite" className="text-secondary" />
                </button>
              </div>
            </header>

            {/* Spec chips */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Spec
                icon={s.category === "Electric" ? "bolt" : "local_gas_station"}
                label={s.category === "Electric" ? "Range" : "Mileage"}
                value={s.range || s.mileage || "—"}
              />
              <Spec icon="speed" label="Top Speed" value={s.topSpeed} />
              <Spec
                icon={s.category === "Electric" ? "battery_charging_full" : "settings"}
                label={s.category === "Electric" ? "Fuel" : "Engine"}
                value={s.category === "Electric" ? "Electric" : s.engine || "—"}
              />
              <Spec icon="inventory_2" label="Available" value={`${s.available} units`} />
            </div>

            <section>
              <h2 className="text-2xl font-extrabold mb-3">About this scooty</h2>
              <p className="text-secondary leading-relaxed">{s.description}</p>
            </section>

            <section>
              <h2 className="text-2xl font-extrabold mb-4">What&apos;s included</h2>
              <div className="grid grid-cols-2 gap-3">
                {s.amenities.map((a) => (
                  <div
                    key={a}
                    className="flex items-center gap-3 bg-surface-container-low rounded-lg p-4"
                  >
                    <Icon name="check_circle" className="text-primary" fill />
                    <span className="font-semibold">{a}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Vendor */}
            <section className="bg-surface-container-low rounded-lg p-6 md:p-8">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-primary-container flex items-center justify-center">
                  <Icon name="store" className="!text-[32px] text-on-primary-fixed" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-extrabold">{s.vendor.name}</h3>
                    {s.vendor.superhost && (
                      <span className="rounded-full bg-primary-container text-on-primary-fixed text-xs font-bold px-2 py-0.5">
                        Superhost
                      </span>
                    )}
                  </div>
                  <div className="text-secondary text-sm mt-1">
                    ⭐ {s.vendor.rating} · Hosting since {s.vendor.since}
                  </div>
                </div>
                <button className="hidden md:block rounded-full bg-surface-container-high px-5 py-2 text-sm font-bold">
                  Message
                </button>
              </div>
            </section>

            {/* Reviews */}
            <section>
              <h2 className="text-2xl font-extrabold mb-4">Recent reviews</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  {
                    name: "Priya S.",
                    date: "Oct 2025",
                    stars: 5,
                    body: "Scooter was in pristine condition. Pickup near HSR Layout was a breeze. Highly recommend.",
                  },
                  {
                    name: "Rahul M.",
                    date: "Sep 2025",
                    stars: 4,
                    body: "Very fuel efficient. Perfect for Bangalore traffic. Karan was helpful with instructions.",
                  },
                ].map((r) => (
                  <div
                    key={r.name}
                    className="bg-surface-container-low rounded-lg p-6 space-y-3"
                  >
                    <div className="flex gap-0.5">
                      {Array.from({ length: r.stars }).map((_, i) => (
                        <Icon
                          key={i}
                          name="star"
                          className="!text-[16px] text-primary-container"
                          fill
                        />
                      ))}
                    </div>
                    <p className="text-on-surface">{r.body}</p>
                    <div className="text-sm text-secondary">
                      {r.name} · {r.date}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-extrabold mb-6">People also booked</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {related.map((r) => (
                  <ScooterCard key={r.id} scooter={r} />
                ))}
              </div>
            </section>
          </div>

          {/* Booking sidebar */}
          <aside className="md:sticky md:top-24 h-fit">
            <div className="rounded-lg bg-surface-container-lowest shadow-ambient p-6 space-y-4">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-4xl font-extrabold">₹{s.pricePerDay}</span>
                  <span className="text-secondary">/day</span>
                </div>
                <div className="flex items-center gap-1 text-sm font-bold">
                  <Icon name="star" className="!text-[16px] text-primary-container" fill />
                  {s.rating}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 bg-surface-container-low rounded-lg p-2">
                <div className="p-3">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-secondary">
                    Pickup
                  </div>
                  <div className="font-bold">Oct 25, 10:00</div>
                </div>
                <div className="p-3">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-secondary">
                    Return
                  </div>
                  <div className="font-bold">Oct 26, 10:00</div>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <Row label={`₹${s.pricePerDay} × 1 day`} value={`₹${s.pricePerDay}`} />
                <Row label="Platform fee" value={`₹${platform}`} />
                <Row label="Smart protection" value={`₹${insurance}`} />
                <div className="border-t border-outline-variant/30 pt-3 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </div>

              <Link
                href={`/checkout/${s.slug}`}
                className="block text-center w-full cta-gradient text-on-primary-fixed rounded-full py-4 font-bold text-lg hover:opacity-95 active:scale-95 transition"
              >
                Reserve now
              </Link>
              <p className="text-xs text-secondary text-center">
                Free cancellation up to 24h before pickup
              </p>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}

function Spec({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-surface-container-low rounded-lg p-4">
      <Icon name={icon} className="!text-[22px] text-primary" />
      <div className="text-[10px] font-bold uppercase tracking-widest text-secondary mt-2">
        {label}
      </div>
      <div className="font-extrabold text-lg">{value}</div>
    </div>
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
