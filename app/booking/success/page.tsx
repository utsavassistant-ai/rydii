import Link from "next/link";
import Image from "next/image";
import { cookies } from "next/headers";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Icon } from "@/components/Icon";
import { createClient } from "@/utils/supabase/server";
import { getUser } from "@/lib/auth";
import type { Booking } from "@/lib/types";

type Search = Promise<{ id?: string }>;

function formatDatetime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
  }) +
    ", " +
    d.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
}

export default async function BookingSuccess({
  searchParams,
}: {
  searchParams: Search;
}) {
  const { id } = await searchParams;
  const user = await getUser();

  let booking: Booking | null = null;

  // Require auth + ownership to show booking details.
  // Avoids enumeration: unauthenticated visitors get the generic success screen.
  if (id && user) {
    const supabase = createClient(await cookies());
    const { data } = await supabase
      .from("bookings")
      .select("*, scooter:scooters(*)")
      .eq("id", id)
      .eq("user_id", user.id)
      .single<Booking>();
    booking = data;
  }

  const s = booking?.scooter;

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

        {booking && s ? (
          <div className="mt-10 rounded-lg bg-surface-container-low p-6 md:p-8 text-left">
            <div className="flex items-center gap-6">
              <div className="relative w-32 h-24 rounded-lg overflow-hidden bg-surface-container-high shrink-0">
                {s.image && (
                  <Image
                    src={s.image}
                    alt={s.name}
                    fill
                    sizes="128px"
                    className="object-cover"
                  />
                )}
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-primary">
                  {booking.id.slice(0, 8).toUpperCase()}
                </div>
                <h2 className="text-2xl font-extrabold mt-1">{s.name}</h2>
                <div className="text-sm text-secondary mt-1">
                  {booking.pickup_hub || booking.pickup_address || s.hub},{" "}
                  {s.city}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
              <Meta
                icon="schedule"
                label="Pickup"
                value={formatDatetime(booking.pickup_datetime)}
              />
              <Meta
                icon="event_available"
                label="Return"
                value={formatDatetime(booking.drop_datetime)}
              />
              <Meta
                icon="location_on"
                label="Hub"
                value={booking.pickup_hub || booking.pickup_address || s.hub}
              />
              <Meta icon="payments" label="Paid" value={`₹${booking.total}`} />
            </div>
          </div>
        ) : (
          <div className="mt-10 rounded-lg bg-surface-container-low p-6 md:p-8 text-left">
            <p className="text-secondary">
              Your booking has been placed successfully. Check{" "}
              <Link href="/bookings" className="text-primary font-bold underline">
                My bookings
              </Link>{" "}
              for details.
            </p>
          </div>
        )}

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
