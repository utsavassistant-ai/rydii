import Image from "next/image";
import { VendorLayout } from "@/components/VendorLayout";
import { Icon } from "@/components/Icon";
import { scooters } from "@/lib/scooters";

const bookings = [
  {
    id: "RYD284512",
    slug: "honda-activa-6g",
    customer: "Aditya Verma",
    status: "Upcoming",
    from: "Oct 25, 10:00",
    to: "Oct 26, 10:00",
    payment: "Paid · ₹641",
  },
  {
    id: "RYD284491",
    slug: "ather-450x",
    customer: "Priya Singh",
    status: "Ongoing",
    from: "Oct 24, 09:00",
    to: "Oct 26, 18:00",
    payment: "Paid · ₹1,820",
  },
  {
    id: "RYD284400",
    slug: "tvs-jupiter-125",
    customer: "Rahul Mehta",
    status: "Completed",
    from: "Oct 20, 11:00",
    to: "Oct 22, 11:00",
    payment: "Paid · ₹980",
  },
];

export default function VendorBookings() {
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
            {scooters.map((s) => (
              <option key={s.id}>{s.name}</option>
            ))}
          </select>
          <input
            type="date"
            className="rounded-full bg-surface-container-lowest px-5 py-2 text-sm font-bold border-none focus:ring-0"
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_360px] gap-6">
        <div className="space-y-4">
          {bookings.map((b) => {
            const s = scooters.find((x) => x.slug === b.slug)!;
            return (
              <div
                key={b.id}
                className="bg-surface-container-lowest rounded-lg p-5 flex gap-5 items-center"
              >
                <div className="relative w-32 h-24 rounded-lg overflow-hidden bg-surface-container-high shrink-0">
                  <Image src={s.image} alt={s.name} fill sizes="128px" className="object-cover" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="text-xs font-bold uppercase tracking-widest text-secondary">
                      {b.id}
                    </div>
                    <StatusPill status={b.status} />
                  </div>
                  <h3 className="text-lg font-extrabold mt-1">{s.name}</h3>
                  <div className="text-sm text-secondary mt-1 flex flex-wrap gap-4">
                    <span className="flex items-center gap-1">
                      <Icon name="person" className="!text-[14px]" /> {b.customer}
                    </span>
                    <span className="flex items-center gap-1">
                      <Icon name="schedule" className="!text-[14px]" /> {b.from} → {b.to}
                    </span>
                  </div>
                </div>
                <div className="hidden md:block text-right">
                  <div className="font-bold">{b.payment}</div>
                  <button className="mt-2 rounded-full bg-on-surface text-surface px-4 py-1.5 text-xs font-bold">
                    View details
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <aside className="space-y-4">
          <div className="bg-surface-container-lowest rounded-lg p-6">
            <h3 className="text-xl font-extrabold mb-4">Quick details</h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center">
                <Icon name="person" className="text-on-primary-fixed" />
              </div>
              <div>
                <div className="font-bold">Aditya Verma</div>
                <div className="text-xs text-secondary">+91 98xxxx 4421</div>
              </div>
            </div>
            <div className="space-y-3 text-sm">
              <InfoRow label="Period" value="Oct 25 → Oct 26" />
              <InfoRow label="Pickup hub" value="HSR Layout" />
              <InfoRow label="Payment" value="Paid · ₹641" />
              <InfoRow label="Licence" value="Verified" />
            </div>
            <button className="mt-5 w-full cta-gradient text-on-primary-fixed rounded-full py-3 font-bold">
              Confirm pickup
            </button>
          </div>

          <div className="rounded-lg bg-inverse-surface text-inverse-on-surface p-6">
            <div className="text-xs font-bold uppercase tracking-widest text-primary-container">
              Monthly goal
            </div>
            <div className="text-3xl font-extrabold mt-2">₹48,200</div>
            <div className="text-sm text-inverse-on-surface/60 mt-1">
              of ₹60,000 target
            </div>
            <div className="h-2 bg-inverse-on-surface/10 rounded-full mt-4 overflow-hidden">
              <div className="h-full cta-gradient" style={{ width: "80%" }} />
            </div>
          </div>
        </aside>
      </div>
    </VendorLayout>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-secondary">{label}</span>
      <span className="font-bold">{value}</span>
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
