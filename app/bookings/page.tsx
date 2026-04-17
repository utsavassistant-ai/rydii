import Link from "next/link";
import Image from "next/image";
import { cookies } from "next/headers";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Icon } from "@/components/Icon";
import { createClient } from "@/utils/supabase/server";
import { requireAuth } from "@/lib/auth";
import type { Booking } from "@/lib/types";

const statusBadge: Record<
  Booking["status"],
  string
> = {
  confirmed: "bg-primary-container text-on-primary-fixed",
  active: "bg-tertiary-container text-on-tertiary-container",
  completed: "bg-surface-container-high text-on-surface",
  cancelled: "bg-error-container text-on-error-container",
};

const statusLabel: Record<Booking["status"], string> = {
  confirmed: "Confirmed",
  active: "Active",
  completed: "Completed",
  cancelled: "Cancelled",
};

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

export default async function BookingsPage() {
  const user = await requireAuth();

  const supabase = createClient(await cookies());
  const { data: bookings } = await supabase
    .from("bookings")
    .select("*, scooter:scooters(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .returns<Booking[]>();

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

        {!bookings || bookings.length === 0 ? (
          <div className="text-center py-20">
            <Icon
              name="directions_bike"
              className="!text-[64px] text-secondary/40"
            />
            <h2 className="text-2xl font-extrabold mt-4">No bookings yet</h2>
            <p className="text-secondary mt-2 mb-6">
              Once you rent a scooty, it will show up here.
            </p>
            <Link
              href="/browse"
              className="inline-block rounded-full cta-gradient text-on-primary-fixed px-8 py-4 font-bold hover:opacity-95 active:scale-95 transition"
            >
              Browse scootys
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {bookings.map((b) => {
              const s = b.scooter;
              return (
                <div
                  key={b.id}
                  className="bg-surface-container-lowest rounded-lg overflow-hidden shadow-ambient"
                >
                  <div className="relative aspect-[16/10] bg-surface-container-high">
                    {s?.image && (
                      <Image
                        src={s.image}
                        alt={s.name}
                        fill
                        sizes="33vw"
                        className="object-cover"
                      />
                    )}
                    <span
                      className={`absolute top-4 left-4 rounded-full px-3 py-1 text-xs font-bold ${
                        statusBadge[b.status]
                      }`}
                    >
                      {statusLabel[b.status]}
                    </span>
                  </div>
                  <div className="p-6 space-y-3">
                    <div className="text-xs font-bold uppercase tracking-widest text-secondary">
                      {b.id.slice(0, 8).toUpperCase()}
                    </div>
                    <h3 className="text-xl font-extrabold">
                      {s?.name ?? "Scooty"}
                    </h3>
                    <div className="text-sm text-secondary space-y-1">
                      <div className="flex items-center gap-2">
                        <Icon name="schedule" className="!text-[14px]" />
                        {formatDatetime(b.pickup_datetime)} →{" "}
                        {formatDatetime(b.drop_datetime)}
                      </div>
                      <div className="flex items-center gap-2">
                        <Icon name="location_on" className="!text-[14px]" />
                        {b.pickup_hub || b.pickup_address || s?.hub || "—"}
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-3">
                      <div className="font-bold text-lg">₹{b.total}</div>
                      {s && (
                        <Link
                          href={`/scooty/${s.slug}`}
                          className="rounded-full bg-surface-container-high px-4 py-2 text-sm font-bold hover:bg-surface-container-highest"
                        >
                          Details
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
