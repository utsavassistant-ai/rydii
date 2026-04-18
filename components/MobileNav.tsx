"use client";
import { useState } from "react";
import Link from "next/link";
import { Icon } from "./Icon";

const links = [
  { href: "/browse",   label: "Explore" },
  { href: "/bookings", label: "Bookings" },
  { href: "/vendor",   label: "List your Scooty" },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        className="md:hidden p-2 text-on-surface"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close menu" : "Open menu"}
      >
        <Icon name={open ? "close" : "menu"} />
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 bg-surface/95 backdrop-blur-xl border-t border-outline-variant/20 px-6 py-4 flex flex-col gap-1 shadow-lg md:hidden">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="font-bold text-on-surface py-3 border-b border-outline-variant/10 last:border-none hover:text-primary transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
