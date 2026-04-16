"use client";
import { useEffect, useRef, useState } from "react";
import { cities } from "@/lib/scooters";

export function CitySelect({ defaultValue = "Bangalore" }: { defaultValue?: string }) {
  const ref = useRef<HTMLSelectElement>(null);
  const [detecting, setDetecting] = useState(false);
  const [detected, setDetected] = useState(false);

  useEffect(() => {
    if (!navigator.geolocation) return;
    setDetecting(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude: lat, longitude: lon } = pos.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`,
            { headers: { "Accept-Language": "en" } }
          );
          const data = await res.json();
          const rawCity: string =
            data.address?.city ||
            data.address?.town ||
            data.address?.county ||
            "";
          const match = cities.find((c) =>
            rawCity.toLowerCase().includes(c.toLowerCase()) ||
            c.toLowerCase().includes(rawCity.toLowerCase())
          );
          if (match && ref.current) {
            ref.current.value = match;
            setDetected(true);
          }
        } catch {
          // silently fail
        } finally {
          setDetecting(false);
        }
      },
      () => setDetecting(false),
      { timeout: 6000, maximumAge: 60_000 }
    );
  }, []);

  return (
    <div className="flex flex-col px-4 py-2 md:py-0 md:border-r md:border-outline-variant/30">
      <label className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-1 flex items-center gap-1.5">
        Location
        {detecting && (
          <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse" title="Detecting location…" />
        )}
        {detected && !detecting && (
          <span className="inline-block w-2 h-2 rounded-full bg-green-500" title="Location detected" />
        )}
      </label>
      <select
        ref={ref}
        name="city"
        defaultValue={defaultValue}
        className="bg-transparent border-none p-0 focus:ring-0 text-on-surface font-semibold"
      >
        {cities.map((c) => (
          <option key={c}>{c}</option>
        ))}
      </select>
    </div>
  );
}
