"use client";
import { useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { cities, brands } from "@/lib/scooters";

interface Props {
  city: string;
  category?: string;
  brand?: string;
  sort: string;
  count: number;
}

function buildUrl(
  base: { city: string; category?: string; brand?: string; sort: string },
  patch: Partial<typeof base>
) {
  const merged = { ...base, ...patch };
  const entries = Object.entries(merged).filter(([, v]) => v) as [string, string][];
  if (!entries.length) return "/browse";
  return `/browse?${new URLSearchParams(entries).toString()}`;
}

function Chip({
  label,
  active,
  href,
  onNavigate,
}: {
  label: string;
  active: boolean;
  href: string;
  onNavigate: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
        active
          ? "bg-primary-container text-on-primary-fixed"
          : "bg-surface-container-high text-on-surface-variant"
      }`}
    >
      {label}
    </Link>
  );
}

export function MobileFilterSheet({ city, category, brand, sort, count }: Props) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  const base = { city, category, brand, sort };
  const activeCount =
    (category ? 1 : 0) +
    (brand ? 1 : 0) +
    (city && city !== "Bangalore" ? 1 : 0);

  return (
    <>
      {/* Trigger */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 rounded-full bg-surface-container-high px-4 py-2 text-sm font-bold"
      >
        <Icon name="tune" className="!text-[18px]" />
        Filters
        {activeCount > 0 && (
          <span className="ml-0.5 w-5 h-5 rounded-full bg-primary-container text-on-primary-fixed text-[10px] font-extrabold flex items-center justify-center">
            {activeCount}
          </span>
        )}
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={close}
        />
      )}

      {/* Bottom sheet */}
      <div
        className={`fixed inset-x-0 bottom-0 z-50 rounded-t-3xl bg-surface shadow-ambient transition-transform duration-300 ease-out ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-outline-variant" />
        </div>

        <div className="overflow-y-auto max-h-[78vh] px-6 pb-6 pt-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-extrabold">Filter & Sort</h3>
            <button onClick={close} className="p-2 rounded-full bg-surface-container-high">
              <Icon name="close" className="!text-[20px]" />
            </button>
          </div>

          {/* Sort */}
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-secondary mb-3">Sort by</div>
            <div className="flex flex-wrap gap-2">
              {[
                { value: "popularity", label: "Popularity" },
                { value: "price", label: "Price" },
                { value: "rating", label: "Rating" },
              ].map((s) => (
                <Chip
                  key={s.value}
                  label={s.label}
                  active={sort === s.value}
                  href={buildUrl(base, { sort: s.value })}
                  onNavigate={close}
                />
              ))}
            </div>
          </div>

          {/* City */}
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-secondary mb-3">City</div>
            <div className="flex flex-wrap gap-2">
              {cities.map((c) => (
                <Chip
                  key={c}
                  label={c}
                  active={c === city}
                  href={buildUrl(base, { city: c })}
                  onNavigate={close}
                />
              ))}
            </div>
          </div>

          {/* Category */}
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-secondary mb-3">Category</div>
            <div className="flex flex-wrap gap-2">
              <Chip label="All" active={!category} href={buildUrl(base, { category: undefined })} onNavigate={close} />
              <Chip label="Electric" active={category === "Electric"} href={buildUrl(base, { category: "Electric" })} onNavigate={close} />
              <Chip label="Petrol" active={category === "Petrol"} href={buildUrl(base, { category: "Petrol" })} onNavigate={close} />
            </div>
          </div>

          {/* Brand */}
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-secondary mb-3">Brand</div>
            <div className="flex flex-wrap gap-2">
              <Chip label="All" active={!brand} href={buildUrl(base, { brand: undefined })} onNavigate={close} />
              {brands.map((b) => (
                <Chip key={b} label={b} active={brand === b} href={buildUrl(base, { brand: b })} onNavigate={close} />
              ))}
            </div>
          </div>

          {/* Delivery */}
          <label className="flex items-center gap-3 bg-surface-container-low rounded-xl p-4 cursor-pointer">
            <input type="checkbox" className="accent-primary-container w-4 h-4" />
            <span className="font-semibold">Free delivery to my location</span>
          </label>

          {/* CTA */}
          <button
            onClick={close}
            className="w-full cta-gradient text-on-primary-fixed rounded-full py-4 font-bold text-lg"
          >
            Show {count} result{count !== 1 ? "s" : ""}
          </button>
        </div>
      </div>
    </>
  );
}
