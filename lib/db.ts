import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { createClient as createAnonClient } from "@supabase/supabase-js";
import type { DbScooter } from "./types";
import type { Scooter } from "./scooters";

/** Cookieless anon client — safe to call at build time (generateStaticParams) */
function buildClient() {
  return createAnonClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}

/** Map DB row to the existing Scooter shape used by ScooterCard */
export function toScooter(d: DbScooter): Scooter {
  return {
    id: d.id,
    slug: d.slug,
    name: d.name,
    brand: d.brand,
    category: d.category,
    pricePerDay: d.price_per_day,
    rating: Number(d.rating),
    reviews: d.reviews_count,
    engine: d.engine ?? undefined,
    mileage: d.mileage ?? undefined,
    range: d.range_km ?? undefined,
    topSpeed: d.top_speed,
    city: d.city,
    hub: d.hub,
    vendor: { name: "Vendor", rating: 4.5, superhost: false, since: 2024 },
    image: d.image || "/scooters/honda-activa-6g/hero.jpg",
    gallery: d.gallery || [],
    amenities: d.amenities || [],
    description: d.description || "",
    available: d.available,
  };
}

export async function getScooters(filters?: {
  city?: string;
  category?: string;
  brand?: string;
  sort?: string;
}): Promise<DbScooter[]> {
  const supabase = createClient(await cookies());
  let query = supabase.from("scooters").select("*");

  if (filters?.city) query = query.eq("city", filters.city);
  if (filters?.category) query = query.eq("category", filters.category);
  if (filters?.brand) query = query.eq("brand", filters.brand);

  if (filters?.sort === "price") {
    query = query.order("price_per_day", { ascending: true });
  } else if (filters?.sort === "rating") {
    query = query.order("rating", { ascending: false });
  } else {
    query = query.order("reviews_count", { ascending: false });
  }

  const { data } = await query;
  return (data as DbScooter[]) || [];
}

export async function getScooterBySlug(
  slug: string
): Promise<DbScooter | null> {
  const supabase = createClient(await cookies());
  const { data } = await supabase
    .from("scooters")
    .select("*")
    .eq("slug", slug)
    .single();
  return data as DbScooter | null;
}

export async function getAllSlugs(): Promise<string[]> {
  const supabase = buildClient();
  const { data } = await supabase.from("scooters").select("slug");
  return (data || []).map((r) => r.slug);
}

export async function getBrands(): Promise<string[]> {
  const supabase = createClient(await cookies());
  const { data } = await supabase
    .from("scooters")
    .select("brand")
    .order("brand");
  const unique = [...new Set((data || []).map((r) => r.brand))];
  return unique;
}
