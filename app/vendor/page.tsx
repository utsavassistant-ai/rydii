import Link from "next/link";
import Image from "next/image";
import { VendorLayout } from "@/components/VendorLayout";
import { Icon } from "@/components/Icon";
import { scooters } from "@/lib/scooters";

const stats = [
  { label: "Total bookings", value: "2,450", delta: "+12%", icon: "event_note" },
  { label: "Earnings (YTD)", value: "₹4.2L", delta: "+18%", icon: "payments" },
  { label: "Active scootys", value: "18", delta: "+2", icon: "two_wheeler" },
  { label: "Avg rating", value: "4.8 ★", delta: "+0.1", icon: "star" },
];

const recent = [
  { id: "RYD284512", scooter: "Honda Activa 6G", customer: "Aditya Verma", date: "Oct 25", status: "Upcoming" },
  { id: "RYD284491", scooter: "Ather 450X", customer: "Priya Singh", date: "Oct 24", status: "Ongoing" },
  { id: "RYD284400", scooter: "TVS Jupiter 125", customer: "Rahul Mehta", date: "Oct 22", status: "Completed" },
  { id: "RYD284311", scooter: "Suzuki Access 125", customer: "Neha Rao", date: "Oct 20", status: "Completed" },
];

export default function VendorDashboard() {
  return (
    <VendorLayout
      active="Dashboard"
      title="Hi Karan 👋"
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
              <span className="text-xs font-bold text-tertiary bg-tertiary-container/20 rounded-full px-2 py-0.5">
                {s.delta}
              </span>
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
            <FleetRow label="On ride" count={12} color="bg-tertiary" />
            <FleetRow label="Available" count={4} color="bg-primary-container" />
            <FleetRow label="Maintenance" count={2} color="bg-error" />
          </div>
          <div className="mt-6 pt-6 border-t border-outline-variant/20">
            <div className="text-xs font-bold uppercase tracking-widest text-secondary">
              Fleet health
            </div>
            <div className="text-3xl font-extrabold mt-1">92%</div>
            <div className="h-2 bg-surface-container-high rounded-full mt-3 overflow-hidden">
              <div className="h-full cta-gradient" style={{ width: "92%" }} />
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
              {recent.map((r) => (
                <tr key={r.id} className="border-t border-outline-variant/20">
                  <td className="py-4 font-bold">{r.id}</td>
                  <td className="py-4">{r.scooter}</td>
                  <td className="py-4">{r.customer}</td>
                  <td className="py-4 text-secondary">{r.date}</td>
                  <td className="py-4">
                    <StatusPill status={r.status} />
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
      </div>

      {/* Fleet preview */}
      <div className="mt-8">
        <h3 className="text-xl font-extrabold mb-4">Your fleet</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {scooters.slice(0, 4).map((s) => (
            <div
              key={s.id}
              className="bg-surface-container-lowest rounded-lg overflow-hidden"
            >
              <div className="relative aspect-[4/3] bg-surface-container-high">
                <Image src={s.image} alt={s.name} fill sizes="25vw" className="object-cover" />
              </div>
              <div className="p-4">
                <div className="font-bold">{s.name}</div>
                <div className="text-xs text-secondary mt-1">₹{s.pricePerDay}/day · {s.available} avail</div>
              </div>
            </div>
          ))}
        </div>
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
