import Image from "next/image";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { requireAuth } from "@/lib/auth";
import { VendorLayout } from "@/components/VendorLayout";
import { Icon } from "@/components/Icon";
import type { Booking, DbScooter } from "@/lib/types";

function formatDatetime(iso: string) {
  const d = new Date(iso);
  return (
    d.toLocaleDateString("en-IN", { month: "short", day: "numeric" }) +
    ", " +
    d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false })
  );
}

export default async function VendorBookings() {
  const user = await requireAuth();
  const supabase = createClient(await cookies());

  // Vendor's scooter IDs
  const { data: myScooters } = await supabase
    .from("scooters")
    .select("id, name")
    .eq("vendor_id", user.id);

  const scooterIds = (myScooters || []).map((s) => s.id);

  let bookings: (Booking & { scooter?: DbScooter })[] = [];
  if (scooterIds.length > 0) {
    const { data } = await supabase
      .from("bookings")
      .select("*, scooter:scooters(*)")
      .in("scooter_id", scooterIds)
      .order("created_at", { ascending: false });
    bookings = (data as (Booking & { scooter?: DbScooter })[]) || [];
  }

  const first = bookings[0];

  return (
    <VendorLayout active="Bookings" title="Manage bookings">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex gap-2 flex-wrap">
          {["All", "Upcoming", "Ongoing", "Completed", "Cancelled"].map((t, i) => (
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
        <div className="flex gap-2">
          <select className="rounded-full bg-surface-container-lowest px-5 py-2 text-sm font-bold border-none focus:ring-0">
            <option>All scootys</option>
            {(myScooters || []).map((s) => (
              <option key={s.id}>{s.name}</option>
            ))}
          </select>
          <input
            type="date"
            className="rounded-full bg-surface-container-lowest px-5 py-2 text-sm font-bold border-none focus:ring-0"
          />
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-20 bg-surface-container-lowest rounded-lg">
          <Icon name="event_busy" className="!text-[64px] text-secondary/40" />
          <h2 className="text-2xl font-extrabold mt-4">No bookings yet</h2>
          <p className="text-secondary mt-2">Bookings for your fleet will appear here.</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-[1fr_360px] gap-6">
          <div className="space-y-4">
            {bookings.map((b) => {
              const s = b.scooter;
              const displayStatus: Record<string, string> = {
                confirmed: "Upcoming", active: "Ongoing",
                completed: "Completed", cancelled: "Cancelled",
              };
              return (
                <div
                  key={b.id}
                  className="bg-surface-container-lowest rounded-lg p-5 flex gap-5 items-center"
                >
                  <div className="relative w-32 h-24 rounded-lg overflow-hidden bg-surface-container-high shrink-0">
                    {s?.image && (
                      <Image src={s.image} alt={s?.name || ""} fill sizes="128px" className="object-cover" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <div className="text-xs font-bold uppercase tracking-widest text-secondary">
                        {b.id.slice(0, 8).toUpperCase()}
                      </div>
                      <StatusPill status={displayStatus[b.status] || b.status} />
                    </div>
                    <h3 className="text-lg font-extrabold mt-1">{s?.name || "Scooty"}</h3>
                    <div className="text-sm text-secondary mt-1 flex flex-wrap gap-4">
                      <span className="flex items-center gap-1">
                        <Icon name="person" className="!text-[14px]" />
                        {b.rider_name || "Rider"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Icon name="schedule" className="!text-[14px]" />
                        {formatDatetime(b.pickup_datetime)} → {formatDatetime(b.drop_datetime)}
                      </span>
                    </div>
                  </div>
                  <div className="hidden md:block text-right shrink-0">
                    <div className="font-bold">Paid · ₹{b.total.toLocaleString("en-IN")}</div>
                    <div className="mt-2 text-xs font-bold text-secondary">
                      {b.days} day{b.days !== 1 ? "s" : ""}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick details sidebar — shows first booking */}
          <aside className="space-y-4">
            {first && (
              <div className="bg-surface-container-lowest rounded-lg p-6">
                <h3 className="text-xl font-extrabold mb-4">Latest booking</h3>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center">
                    <Icon name="person" className="text-on-primary-fixed" />
                  </div>
                  <div>
                    <div className="font-bold">{first.rider_name || "Rider"}</div>
                    <div className="text-xs text-secondary">{first.rider_phone || "—"}</div>
                  </div>
                </div>
                <div className="space-y-3 text-sm">
                  <InfoRow label="Period" value={`${formatDatetime(first.pickup_datetime)} → ${formatDatetime(first.drop_datetime)}`} />
                  <InfoRow label="Pickup" value={first.pickup_hub || first.pickup_address || "Hub"} />
                  <InfoRow label="Payment" value={`Paid · ₹${first.total.toLocaleString("en-IN")}`} />
                  <InfoRow label="Licence" value={first.rider_licence || "—"} />
                </div>
              </div>
            )}

            <div className="rounded-lg bg-inverse-surface text-inverse-on-surface p-6">
              <div className="text-xs font-bold uppercase tracking-widest text-primary-container">
                Total revenue
              </div>
              <div className="text-3xl font-extrabold mt-2">
                ₹{bookings
                  .filter((b) => b.status !== "cancelled")
                  .reduce((s, b) => s + b.total, 0)
                  .toLocaleString("en-IN")}
              </div>
              <div className="text-sm text-inverse-on-surface/60 mt-1">
                from {bookings.length} booking{bookings.length !== 1 ? "s" : ""}
              </div>
            </div>
          </aside>
        </div>
      )}
    </VendorLayout>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-2">
      <span className="text-secondary shrink-0">{label}</span>
      <span className="font-bold text-right">{value}</span>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    Upcoming: "bg-primary-container text-on-primary-fixed",
    Ongoing: "bg-tertiary-container text-on-tertiary-container",
    Completed: "bg-surface-container-high text-on-surface-variant",
    Cancelled: "bg-error-container text-on-error-container",
  };
  return (
    <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${map[status] || ""}`}>
      {status}
    </span>
  );
}
