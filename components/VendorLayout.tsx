import Link from "next/link";
import { Icon } from "./Icon";

const nav = [
  { label: "Dashboard", icon: "dashboard", href: "/vendor" },
  { label: "Add scooty", icon: "add_circle", href: "/vendor/add" },
  { label: "Bookings", icon: "event_note", href: "/vendor/bookings" },
  { label: "Earnings", icon: "payments", href: "/vendor" },
  { label: "Settings", icon: "settings", href: "/vendor" },
];

export function VendorLayout({
  active,
  children,
  title,
  action,
}: {
  active: string;
  children: React.ReactNode;
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface-container-low flex">
      <aside className="hidden md:flex w-64 bg-surface-container-lowest flex-col p-6 sticky top-0 h-screen">
        <Link href="/" className="text-2xl font-black tracking-tighter mb-10">
          rydii<span className="text-primary-container">.</span>
        </Link>
        <nav className="space-y-1 flex-1">
          {nav.map((n) => {
            const isActive = n.label === active;
            return (
              <Link
                key={n.label}
                href={n.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-full font-bold text-sm transition ${
                  isActive
                    ? "bg-primary-container text-on-primary-fixed"
                    : "text-secondary hover:bg-surface-container"
                }`}
              >
                <Icon name={n.icon} className="!text-[20px]" />
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="bg-surface-container-low rounded-lg p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center">
            <Icon name="store" className="text-on-primary-fixed" />
          </div>
          <div>
            <div className="font-bold text-sm">Karan&apos;s Rentals</div>
            <div className="text-xs text-secondary">Superhost</div>
          </div>
        </div>
      </aside>
      <main className="flex-1">
        <header className="bg-surface-container-lowest px-8 py-5 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3 bg-surface-container-low rounded-full px-4 py-2 w-80">
            <Icon name="search" className="!text-[18px] text-secondary" />
            <input
              placeholder="Search bookings, riders, scootys…"
              className="flex-1 bg-transparent border-none p-0 focus:ring-0 text-sm"
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-secondary">
              <Icon name="help" />
            </button>
            <button className="p-2 text-secondary">
              <Icon name="notifications" />
            </button>
          </div>
        </header>
        <div className="p-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-primary">
                Vendor portal
              </div>
              <h1 className="text-4xl font-extrabold tracking-tighter mt-2">
                {title}
              </h1>
            </div>
            {action}
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
