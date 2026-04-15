import Link from "next/link";
import Image from "next/image";
import { Icon } from "./Icon";
import { Scooter } from "@/lib/scooters";

export function ScooterCard({ scooter }: { scooter: Scooter }) {
  return (
    <Link
      href={`/scooty/${scooter.slug}`}
      className="group relative block rounded-lg bg-surface-container-lowest overflow-hidden transition-all active:scale-[0.98] hover:-translate-y-1 duration-300"
    >
      <div className="relative aspect-[4/3] bg-surface-container-high overflow-hidden">
        <Image
          src={scooter.image}
          alt={scooter.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4 flex gap-2">
          <span className="rounded-full bg-surface-container-lowest/95 backdrop-blur px-3 py-1 text-xs font-bold text-on-surface">
            {scooter.category}
          </span>
          {scooter.available <= 2 && (
            <span className="rounded-full bg-error px-3 py-1 text-xs font-bold text-on-error">
              Only {scooter.available} left
            </span>
          )}
        </div>
        <div className="absolute top-4 right-4 rounded-full bg-surface-container-lowest/95 backdrop-blur px-3 py-1 text-xs font-bold flex items-center gap-1">
          <Icon name="star" className="!text-[14px] text-primary-container" fill />
          {scooter.rating}
        </div>
      </div>
      <div className="p-6 space-y-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-secondary">
            {scooter.brand}
          </div>
          <h3 className="text-2xl font-extrabold tracking-tight mt-1">
            {scooter.name}
          </h3>
        </div>
        <div className="flex flex-wrap gap-2">
          <SpecChip
            icon={scooter.category === "Electric" ? "bolt" : "local_gas_station"}
            label={scooter.range || scooter.mileage || ""}
          />
          <SpecChip icon="speed" label={scooter.topSpeed} />
        </div>
        <div className="flex items-baseline justify-between pt-2">
          <div>
            <span className="text-3xl font-extrabold">
              ₹{scooter.pricePerDay}
            </span>
            <span className="text-secondary text-sm">/day</span>
          </div>
          <div className="rounded-full cta-gradient text-on-primary-fixed px-5 py-2 text-sm font-bold">
            Book
          </div>
        </div>
      </div>
    </Link>
  );
}

function SpecChip({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="inline-flex items-center gap-1 bg-surface-container-high rounded-sm px-2 py-1">
      <Icon name={icon} className="!text-[14px] text-on-surface-variant" />
      <span className="text-xs font-semibold text-on-surface-variant">
        {label}
      </span>
    </div>
  );
}
