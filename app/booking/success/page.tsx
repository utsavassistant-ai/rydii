import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Icon } from "@/components/Icon";
import { getScooterBySlug, scooters } from "@/lib/scooters";

type Search = Promise<{ scooty?: string }>;

export default async function BookingSuccess({
  searchParams,
}: {
  searchParams: Search;
}) {
  const { scooty } = await searchParams;
  const s = getScooterBySlug(scooty || "") || scooters[0];
  const bookingId = `RYD${Math.floor(Math.random() * 900000 + 100000)}`;

  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-6 py-16 text-center">
        <div className="w-20 h-20 rounded-full cta-gradient mx-auto flex items-center justify-center">
          <Icon name="check" className="!text-[48px] text-on-primary-fixed" fill />
        </div>
        <h1 className="text-5xl font-extrabold tracking-tighter mt-8">
          Booking confirmed!
        </h1>
        <p className="text-lg text-secondary mt-3">
          Your scooty is reserved. We&apos;ve sent pickup details to your phone.
        </p>

        <div className="mt-10 rounded-lg bg-surface-container-low p-6 md:p-8 text-left">
          <div className="flex items-center gap-6">
            <div className="relative w-32 h-24 rounded-lg overflow-hidden bg-surface-container-high shrink-0">
              <Image
                src={s.image}
                alt={s.name}
                fill
                sizes="128px"
                className="object-cover"
              />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-primary">
                {bookingId}
              </div>
              <h2 className="text-2xl font-extrabold mt-1">{s.name}</h2>
              <div className="text-sm text-secondary mt-1">
                {s.hub}, {s.city}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
            <Meta icon="schedule" label="Pickup" value="Oct 25, 10:00" />
            <Meta icon="event_available" label="Return" value="Oct 26, 10:00" />
            <Meta icon="location_on" label="Hub" value={s.hub} />
            <Meta icon="payments" label="Paid" value={`₹${s.pricePerDay + 102}`} />
          </div>
        </div>

        <div className="mt-6 rounded-lg bg-inverse-surface text-inverse-on-surface p-6 text-left">
          <div className="flex items-start gap-3">
            <Icon name="lightbulb" className="text-primary-container" fill />
            <div>
              <div className="font-bold">Before you ride</div>
              <p className="text-sm text-inverse-on-surface/70 mt-1">
                Carry a valid driving licence and the phone number linked to
                this booking. Helmet will be provided at the hub.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-8 justify-center">
          <Link
            href="/bookings"
            className="rounded-full cta-gradient text-on-primary-fixed px-8 py-4 font-bold hover:opacity-95 active:scale-95 transition"
          >
            View my bookings
          </Link>
          <Link
            href="/browse"
            className="rounded-full bg-surface-container-high text-on-surface px-8 py-4 font-bold hover:opacity-95 active:scale-95 transition"
          >
            Explore more scootys
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}

function Meta({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-surface-container-lowest rounded-lg p-4">
      <Icon name={icon} className="!text-[18px] text-primary" />
      <div className="text-[10px] font-bold uppercase tracking-widest text-secondary mt-1">
        {label}
      </div>
      <div className="font-bold">{value}</div>
    </div>
  );
}
