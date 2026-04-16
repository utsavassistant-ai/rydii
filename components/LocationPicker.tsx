"use client";
import { useEffect, useRef, useState, useId } from "react";
import { Icon } from "@/components/Icon";

type Mode = "hub" | "delivery";

interface Props {
  /** "pickup" or "drop" — controls labels and field names */
  type: "pickup" | "drop";
  /** Primary hub name shown in hub option */
  hubName: string;
  city: string;
  /** Additional fee shown when delivery is selected */
  fee?: number;
}

const HUBS = [
  "HSR Layout Hub",
  "Koramangala Hub",
  "Indiranagar Hub",
  "Whitefield Hub",
  "BTM Layout Hub",
];

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

export function LocationPicker({ type, hubName, city, fee = 79 }: Props) {
  const uid = useId();
  const [mode, setMode] = useState<Mode>("hub");
  const [address, setAddress] = useState("");
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [mapReady, setMapReady] = useState(false);

  const mapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const markerInstance = useRef<google.maps.Marker | null>(null);

  const isPickup = type === "pickup";
  const fieldPrefix = isPickup ? "pickup" : "drop";
  const label = isPickup ? "Pickup location" : "Drop-off location";
  const hubLabel = isPickup ? "Pick up from hub" : "Return to hub";
  const deliveryLabel = isPickup
    ? `Deliver to my location (+₹${fee})`
    : `Pick up from my location (+₹${fee})`;

  // Load Google Maps when delivery panel opens
  useEffect(() => {
    if (mode !== "delivery") return;
    if (!API_KEY) { setMapReady(true); return; }

    let cancelled = false;

    async function init() {
      const { setOptions, importLibrary } = await import("@googlemaps/js-api-loader");
      setOptions({ key: API_KEY, v: "weekly" });
      await importLibrary("maps");
      await importLibrary("places");
      if (cancelled || !mapRef.current || !inputRef.current) return;

      // Default center: city
      const center = { lat: 12.9716, lng: 77.5946 }; // Bangalore fallback
      const map = new google.maps.Map(mapRef.current, {
        center,
        zoom: 14,
        disableDefaultUI: true,
        zoomControl: true,
        styles: [{ featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] }],
      });

      const marker = new google.maps.Marker({
        position: center,
        map,
        draggable: true,
        title: "Drag to adjust location",
      });

      const autocomplete = new google.maps.places.Autocomplete(inputRef.current!, {
        componentRestrictions: { country: "in" },
        fields: ["geometry", "formatted_address"],
      });

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (!place.geometry?.location) return;
        const pos = { lat: place.geometry.location.lat(), lng: place.geometry.location.lng() };
        map.panTo(pos);
        map.setZoom(16);
        marker.setPosition(pos);
        setAddress(place.formatted_address ?? inputRef.current!.value);
        setLat(pos.lat);
        setLng(pos.lng);
      });

      marker.addListener("dragend", () => {
        const pos = marker.getPosition();
        if (!pos) return;
        setLat(pos.lat());
        setLng(pos.lng());
        // reverse geocode
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: pos }, (results, status) => {
          if (status === "OK" && results?.[0]) {
            setAddress(results[0].formatted_address);
            if (inputRef.current) inputRef.current.value = results[0].formatted_address;
          }
        });
      });

      mapInstance.current = map;
      markerInstance.current = marker;
      setMapReady(true);

      // Try geolocation to center map
      navigator.geolocation?.getCurrentPosition(
        (pos) => {
          const p = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          map.panTo(p);
          marker.setPosition(p);
          setLat(p.lat);
          setLng(p.lng);
        },
        () => {},
        { timeout: 4000, maximumAge: 60_000 }
      );
    }

    init().catch(() => setMapReady(true));
    return () => { cancelled = true; };
  }, [mode]);

  return (
    <div className="space-y-3">
      <div className="text-xs font-bold uppercase tracking-widest text-secondary">{label}</div>

      {/* Hub option */}
      <label
        className={`flex items-start gap-3 rounded-lg p-4 cursor-pointer transition-colors ${
          mode === "hub"
            ? "bg-surface-container-lowest ring-2 ring-primary-container"
            : "bg-surface-container-low hover:bg-surface-container"
        }`}
      >
        <input
          type="radio"
          name={`${uid}-mode`}
          value="hub"
          checked={mode === "hub"}
          onChange={() => setMode("hub")}
          className="mt-0.5 accent-primary-container"
        />
        <div className="flex-1">
          <div className="font-semibold">{hubLabel}</div>
          {mode === "hub" && (
            <select
              name={`${fieldPrefix}_hub`}
              defaultValue={hubName}
              className="mt-2 bg-surface-container rounded-lg px-3 py-2 text-sm font-bold w-full focus:ring-0 border-none"
            >
              <option value={hubName}>{hubName}, {city}</option>
              {HUBS.filter((h) => h !== hubName).map((h) => (
                <option key={h}>{h}, {city}</option>
              ))}
            </select>
          )}
        </div>
        <div className="text-xs font-bold text-green-600 bg-green-50 rounded-full px-2 py-0.5 shrink-0">
          Free
        </div>
      </label>

      {/* Delivery option */}
      <label
        className={`flex items-start gap-3 rounded-lg p-4 cursor-pointer transition-colors ${
          mode === "delivery"
            ? "bg-surface-container-lowest ring-2 ring-primary-container"
            : "bg-surface-container-low hover:bg-surface-container"
        }`}
      >
        <input
          type="radio"
          name={`${uid}-mode`}
          value="delivery"
          checked={mode === "delivery"}
          onChange={() => setMode("delivery")}
          className="mt-0.5 accent-primary-container"
        />
        <div className="flex-1">
          <div className="font-semibold">{deliveryLabel}</div>

          {/* Map panel — only rendered when delivery mode active */}
          {mode === "delivery" && (
            <div className="mt-3 space-y-2" onClick={(e) => e.preventDefault()}>
              {/* Address search */}
              <div className="relative">
                <Icon
                  name="search"
                  className="!text-[18px] text-secondary absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder={API_KEY ? "Search address…" : "Enter your address"}
                  className="w-full bg-surface-container rounded-lg pl-9 pr-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary-container border-none"
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              {/* Map (Google Maps or fallback) */}
              {API_KEY ? (
                <div className="rounded-lg overflow-hidden relative bg-surface-container-high" style={{ height: 260 }}>
                  <div ref={mapRef} className="w-full h-full" />
                  {!mapReady && (
                    <div className="absolute inset-0 flex items-center justify-center bg-surface-container-high">
                      <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                    </div>
                  )}
                  <div className="absolute bottom-2 right-2 bg-surface-container-lowest/90 rounded-lg px-2 py-1 text-[10px] text-secondary">
                    Drag pin to adjust
                  </div>
                </div>
              ) : (
                <div className="rounded-lg bg-surface-container-high p-4 text-sm text-secondary flex items-center gap-2">
                  <Icon name="info" className="!text-[16px] shrink-0" />
                  <span>Add <code className="font-mono text-xs bg-surface-container px-1 rounded">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> to enable live map.</span>
                </div>
              )}

              {/* Confirmed address readout */}
              {address && (
                <div className="flex items-start gap-2 rounded-lg bg-primary-container/20 px-3 py-2 text-sm">
                  <Icon name="location_on" className="!text-[16px] text-primary shrink-0 mt-0.5" fill />
                  <span className="text-on-surface font-medium">{address}</span>
                </div>
              )}
            </div>
          )}
        </div>
        <Icon
          name={isPickup ? "local_shipping" : "hail"}
          className="!text-[20px] text-primary shrink-0 mt-0.5"
        />
      </label>

      {/* Hidden form fields */}
      <input type="hidden" name={`${fieldPrefix}_mode`} value={mode} />
      <input type="hidden" name={`${fieldPrefix}_address`} value={address} />
      {lat !== null && <input type="hidden" name={`${fieldPrefix}_lat`} value={lat} />}
      {lng !== null && <input type="hidden" name={`${fieldPrefix}_lng`} value={lng} />}
      {mode === "delivery" && <input type="hidden" name={`${fieldPrefix}_fee`} value={fee} />}
    </div>
  );
}
