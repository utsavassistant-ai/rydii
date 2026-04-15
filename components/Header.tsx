import Link from "next/link";
import { Icon } from "./Icon";

export function Header() {
  return (
    <header className="w-full top-0 sticky z-50 bg-surface/80 backdrop-blur-xl">
      <div className="flex justify-between items-center px-6 py-4 w-full max-w-screen-xl mx-auto">
        <div className="flex items-center gap-10">
          <Link
            href="/"
            className="text-2xl font-black tracking-tighter text-on-surface"
          >
            rydii<span className="text-primary-container">.</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8 font-headline font-bold">
            <Link href="/browse" className="text-on-surface hover:opacity-80">
              Explore
            </Link>
            <Link href="/bookings" className="text-secondary hover:opacity-80">
              Bookings
            </Link>
            <Link href="/vendor" className="text-secondary hover:opacity-80">
              List your Scooty
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <button
            aria-label="Location"
            className="hidden sm:flex p-2 text-secondary hover:opacity-80"
          >
            <Icon name="location_on" />
          </button>
          <button
            aria-label="Notifications"
            className="p-2 text-secondary hover:opacity-80"
          >
            <Icon name="notifications" />
          </button>
          <div className="w-10 h-10 rounded-full overflow-hidden bg-surface-container-high ring-2 ring-primary-container/40 flex items-center justify-center">
            <Icon name="person" className="text-secondary" />
          </div>
        </div>
      </div>
    </header>
  );
}
