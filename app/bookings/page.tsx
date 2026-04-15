import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Icon } from "@/components/Icon";
import { scooters } from "@/lib/scooters";

const demoBookings = [
  {
    id: "RYD284512",
    scooterSlug: "honda-activa-6g",
    status: "Upcoming" as const,
    from: "Oct 25, 10:00",
    to: "Oct 26, 10:00",
    price: 641,
  },
  {
    id: "RYD284100",
    scooterSlug: "ather-450x",
    status: "Completed" as const,
    from: "Sep 18, 09:00",
    to: "Sep 20, 18:00",
    price: 1820,
  },
  {
    id: "RYD283887",
    scooterSlug: "tvs-jupiter-125",
    status: "Cancelled" as const,
    from: "Sep 01, 10:00",
    to: "Sep 02, 10:00",
    price: 530,
  },
];

export default function BookingsPage() {
  return (
    <>
      <Header />
      <main className="max-w-screen-xl mx-auto px-6 py-10">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-2">
          My bookings
        </h1>
        <p className="text-secondary mb-8">
          Track, manage and review your scooty rentals.
        </p>

        <div className="flex gap-2 mb-8 flex-wrap">
          {["All", "Upcoming", "Completed", "Cancelled"].map((t, i) => (
            <button
              key={t}
              className={`rounded-full px-5 py-2 font-bold text-sm ${
                i === 0
                  ? "bg-on-surface text-surface"
                  : "bg-surface-container-high text-on-surface-variant"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {demoBookings.map((b) => {
            const s = scooters.find((x) => x.slug === b.scooterSlug)!;
            return (
              <div
                key={b.id}
                className="bg-surface-container-lowest rounded-lg overflow-hidden shadow-ambient"
              >
                <div className="relative aspect-[16/10] bg-surface-container-high">
                  <Image
                    src={s.image}
                    alt={s.name}
                    fill
                    sizes="33vw"
                    className="object-cover"
                  />
                  <span
                    className={`absolute top-4 left-4 rounded-full px-3 py-1 text-xs font-bold ${
                      b.status === "Upcoming"
                        ? "bg-primary-container text-on-primary-fixed"
                        : b.status === "Completed"
                          ? "bg-tertiary-container text-on-tertiary-container"
                          : "bg-error-container text-on-error-container"
                    }`}
                  >
                    {b.status}
                  </span>
                </div>
                <div className="p-6 space-y-3">
                  <div className="text-xs font-bold uppercase tracking-widest text-secondary">
                    {b.id}
                  </div>
                  <h3 className="text-xl font-extrabold">{s.name}</h3>
                  <div className="text-sm text-secondary space-y-1">
                    <div className="flex items-center gap-2">
                      <Icon name="schedule" className="!text-[14px]" />
                      {b.from} → {b.to}
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon name="location_on" className="!text-[14px]" />
                      {s.hub}
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-3">
                    <div className="font-bold text-lg">₹{b.price}</div>
                    <Link
                      href={`/scooty/${s.slug}`}
                      className="rounded-full bg-surface-container-high px-4 py-2 text-sm font-bold hover:bg-surface-container-highest"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
      <Footer />
    </>
  );
}
