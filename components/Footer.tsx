import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-32 bg-inverse-surface text-inverse-on-surface">
      <div className="max-w-screen-xl mx-auto px-6 py-16 grid md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <div className="text-3xl font-black tracking-tighter">
            rydii<span className="text-primary-container">.</span>
          </div>
          <p className="mt-4 max-w-sm text-inverse-on-surface/70 font-body">
            India&apos;s leading scooty rental aggregator. Redefining urban
            mobility, one ride at a time.
          </p>
        </div>
        <div>
          <div className="font-headline font-bold mb-4">Riders</div>
          <ul className="space-y-2 text-inverse-on-surface/70">
            <li>
              <Link href="/browse">Explore scootys</Link>
            </li>
            <li>
              <Link href="/bookings">My bookings</Link>
            </li>
            <li>
              <Link href="/browse?category=Electric">Electric fleet</Link>
            </li>
          </ul>
        </div>
        <div>
          <div className="font-headline font-bold mb-4">Vendors</div>
          <ul className="space-y-2 text-inverse-on-surface/70">
            <li>
              <Link href="/vendor">Vendor dashboard</Link>
            </li>
            <li>
              <Link href="/vendor/add">List your scooty</Link>
            </li>
            <li>
              <Link href="/vendor/bookings">Manage bookings</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-inverse-on-surface/10 py-6 px-6 text-center text-sm text-inverse-on-surface/50">
        © {new Date().getFullYear()} Rydii. Built for the urban commuter.
      </div>
    </footer>
  );
}
