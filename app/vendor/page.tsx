import Link from "next/link";
import Image from "next/image";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { requireAuth } from "@/lib/auth";
import { VendorLayout } from "@/components/VendorLayout";
import { Icon } from "@/components/Icon";
import type { DbScooter, Booking } from "@/lib/types";

export default async function VendorDashboard() {
  const user = await requireAuth();
  const supabase = createClient(await cookies());

  // Verify vendor role and get profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "vendor") {
    const { redirect } = await import("next/navigation");
    redirect("/");
  }

  // Fetch vendor's scooters
  const { data: scooters } = await supabase
    .from("scooters")
    .select("*")
    .eq("vendor_id", user.id)
    .order("created_at", { ascending: false });

  const fleet: DbScooter[] = scooters || [];
  const scooterIds = fleet.map((s) => s.id);

  // Fetch bookings for vendor's scooters
  let allBookings: (Booking & { scooter?: DbScooter })[] = [];
  if (scooterIds.length > 0) {
    const { data: bookingsData } = await supabase
      .from("bookings")
      .select("*, scooter:scooters(*)")
      .in("scooter_id", scooterIds)
      .order("created_at", { ascending: false });

    allBookings = (bookingsData as (Booking & { scooter?: DbScooter })[]) || [];
  }

  // Calculate stats
  const totalBookings = allBookings.length;
  const completedBookings = allBookings.filter(
    (b) => b.status === "completed"
  );
  const totalEarnings = completedBookings.reduce(
    (sum, b) => sum + (b.total || 0),
    0
  );
  const activeScooters = fleet.length;

  // Average rating across fleet
  const ratedScooters = fleet.filter((s) => s.reviews_count > 0);
  const avgRating =
    ratedScooters.length > 0
      ? ratedScooters.reduce((sum, s) => sum + s.rating, 0) /
        ratedScooters.length
      : 0;

  // Format earnings
  const formattedEarnings =
    totalEarnings >= 100000
      ? `₹${(totalEarnings / 100000).toFixed(1)}L`
      : `₹${totalEarnings.toLocaleString("en-IN")}`;

  // Recent bookings (last 5)
  const recentBookings = allBookings.slice(0, 5);

  // Fleet status counts
  const activeBookingScooterIds = new Set(
    allBookings
      .filter((b) => b.status === "active")
      .map((b) => b.scooter_id)
  );
  const onRideCount = activeBookingScooterIds.size;
  const availableCount = fleet.filter(
    (s) => s.available > 0 && !activeBookingScooterIds.has(s.id)
  ).length;
  const maintenanceCount = fleet.filter(
    (s) => s.available === 0 && !activeBookingScooterIds.has(s.id)
  ).length;
  const fleetHealth =
    fleet.length > 0
      ? Math.round(((fleet.length - maintenanceCount) / fleet.length) * 100)
      : 100;

  const stats = [
    { label: "Total bookings", value: totalBookings.toLocaleString(), delta: "", icon: "event_note" },
    { label: "Earnings (YTD)", value: formattedEarnings, delta: "", icon: "payments" },
    { label: "Active scootys", value: String(activeScooters), delta: "", icon: "two_wheeler" },
    {
      label: "Avg rating",
      value: avgRating > 0 ? `${avgRating.toFixed(1)} ★` : "N/A",
      delta: "",
      icon: "star",
    },
  ];

  const displayName = profile.full_name?.split(" ")[0] || "Vendor";

  // Map booking status to display status
  function displayStatus(status: string): string {
    switch (status) {
      case "confirmed":
        return "Upcoming";
      case "active":
        return "Ongoing";
      case "completed":
        return "Completed";
      case "cancelled":
        return "Cancelled";
      default:
        return status;
    }
  }

  return (
    <VendorLayout
      active="Dashboard"
      title={`Hi ${displayName} 👋`}
      action={
        <div className="flex gap-3">
          <button className="rounded-full bg-surface-container-high px-5 py-2.5 font-bold text-sm">
            Export report
          </button>
          <Link
            href="/vendor/add"
            className="rounded-full cta-gradient text-on-primary-fixed px-5 py-2.5 font-bold text-sm"
          >
            + Add scooty
          </Link>
        </div>
      }
    >
      {/* Stats bento */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-surface-container-lowest rounded-lg p-6 space-y-3"
          >
            <div className="flex items-center justify-between">
              <Icon name={s.icon} className="text-primary" />
              {s.delta && (
                <span className="text-xs font-bold text-tertiary bg-tertiary-container/20 rounded-full px-2 py-0.5">
                  {s.delta}
                </span>
              )}
            </div>
            <div>
              <div className="text-3xl font-extrabold">{s.value}</div>
              <div className="text-xs text-secondary font-bold uppercase tracking-widest mt-1">
                {s.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Earnings + Fleet */}
      <div className="grid lg:grid-cols-3 gap-4 mb-8">
        <div className="lg:col-span-2 bg-surface-container-lowest rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-extrabold">Earnings · last 6 months</h3>
            <select className="bg-surface-container-low rounded-full px-4 py-2 text-sm font-bold border-none focus:ring-0">
              <option>6 months</option>
              <option>12 months</option>
            </select>
          </div>
          <div className="grid grid-cols-6 gap-3 h-56 items-end">
            {[55, 72, 48, 88, 64, 95].map((h, i) => (
              <div key={i} className="flex flex-col items-center gap-2 h-full justify-end">
                <div
                  className="w-full cta-gradient rounded"
                  style={{ height: `${h}%` }}
                />
                <div className="text-xs font-bold text-secondary">
                  {["May", "Jun", "Jul", "Aug", "Sep", "Oct"][i]}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-surface-container-lowest rounded-lg p-6">
          <h3 className="text-xl font-extrabold mb-4">Fleet status</h3>
          <div className="space-y-3">
            <FleetRow label="On ride" count={onRideCount} color="bg-tertiary" />
            <FleetRow label="Available" count={availableCount} color="bg-primary-container" />
            <FleetRow label="Maintenance" count={maintenanceCount} color="bg-error" />
          </div>
          <div className="mt-6 pt-6 border-t border-outline-variant/20">
            <div className="text-xs font-bold uppercase tracking-widest text-secondary">
              Fleet health
            </div>
            <div className="text-3xl font-extrabold mt-1">{fleetHealth}%</div>
            <div className="h-2 bg-surface-container-high rounded-full mt-3 overflow-hidden">
              <div className="h-full cta-gradient" style={{ width: `${fleetHealth}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Recent bookings */}
      <div className="bg-surface-container-lowest rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-extrabold">Recent bookings</h3>
          <Link
            href="/vendor/bookings"
            className="text-sm font-bold text-primary"
          >
            View all →
          </Link>
        </div>
        {recentBookings.length === 0 ? (
          <div className="text-center py-12 text-secondary">
            <Icon name="event_note" className="!text-[48px] text-secondary/50" />
            <p className="mt-3 font-bold">No bookings yet</p>
            <p className="text-sm mt-1">
              Bookings will appear here once riders start renting your scootys.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-xs font-bold uppercase tracking-widest text-secondary text-left">
                  <th className="py-3">Booking ID</th>
                  <th className="py-3">Scooty</th>
                  <th className="py-3">Customer</th>
                  <th className="py-3">Date</th>
                  <th className="py-3">Status</th>
                  <th className="py-3"></th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((b) => (
                  <tr key={b.id} className="border-t border-outline-variant/20">
                    <td className="py-4 font-bold">{b.id.slice(0, 8).toUpperCase()}</td>
                    <td className="py-4">{b.scooter?.name || "—"}</td>
                    <td className="py-4">{b.rider_name || "—"}</td>
                    <td className="py-4 text-secondary">
                      {new Date(b.pickup_datetime).toLocaleDateString("en-IN", {
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="py-4">
                      <StatusPill status={displayStatus(b.status)} />
                    </td>
                    <td className="py-4 text-right">
                      <button className="text-sm font-bold text-primary">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Fleet preview */}
      <div className="mt-8">
        <h3 className="text-xl font-extrabold mb-4">Your fleet</h3>
        {fleet.length === 0 ? (
          <div className="bg-surface-container-lowest rounded-lg p-12 text-center">
            <Icon name="two_wheeler" className="!text-[48px] text-secondary/50" />
            <h4 className="text-xl font-extrabold mt-4">
              Add your first scooty
            </h4>
            <p className="text-sm text-secondary mt-2 max-w-md mx-auto">
              List your scooty and start earning. First booking usually lands
              within 48 hours.
            </p>
            <Link
              href="/vendor/add"
              className="inline-block mt-6 cta-gradient text-on-primary-fixed rounded-full px-8 py-3 font-bold hover:opacity-95 active:scale-95 transition"
            >
              + Add scooty
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {fleet.slice(0, 4).map((s) => (
              <div
                key={s.id}
                className="bg-surface-container-lowest rounded-lg overflow-hidden"
              >
                <div className="relative aspect-[4/3] bg-surface-container-high">
                  {s.image ? (
                    <Image
                      src={s.image}
                      alt={s.name}
                      fill
                      sizes="25vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Icon
                        name="two_wheeler"
                        className="!text-[48px] text-secondary/30"
                      />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="font-bold">{s.name}</div>
                  <div className="text-xs text-secondary mt-1">
                    ₹{s.price_per_day}/day · {s.available} avail
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </VendorLayout>
  );
}

function FleetRow({
  label,
  count,
  color,
}: {
  label: string;
  count: number;
  color: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-3 h-3 rounded-full ${color}`} />
      <span className="flex-1 text-sm font-semibold">{label}</span>
      <span className="font-bold">{count}</span>
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
    <span
      className={`rounded-full px-3 py-1 text-xs font-bold ${map[status] || ""}`}
    >
      {status}
    </span>
  );
}
