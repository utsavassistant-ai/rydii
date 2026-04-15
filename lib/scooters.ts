export type Scooter = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: "Electric" | "Petrol";
  pricePerDay: number;
  rating: number;
  reviews: number;
  engine?: string;
  mileage?: string;
  range?: string;
  topSpeed: string;
  city: string;
  hub: string;
  vendor: { name: string; rating: number; superhost: boolean; since: number };
  image: string;
  gallery: string[];
  amenities: string[];
  description: string;
  available: number;
};

export const scooters: Scooter[] = [
  {
    id: "honda-activa-6g",
    slug: "honda-activa-6g",
    name: "Honda Activa 6G",
    brand: "Honda",
    category: "Petrol",
    pricePerDay: 499,
    rating: 4.8,
    reviews: 128,
    engine: "110cc",
    mileage: "50 kmpl",
    topSpeed: "85 km/h",
    city: "Bangalore",
    hub: "HSR Layout Hub",
    vendor: {
      name: "Karan's Rentals",
      rating: 4.9,
      superhost: true,
      since: 2021,
    },
    image:
      "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=1200&q=80",
    ],
    amenities: ["Helmet", "Phone Mount", "Fuel Start"],
    description:
      "India's best-selling scooter. Smooth automatic transmission, silent start, and best-in-class mileage. Perfect for daily commutes through urban chaos.",
    available: 4,
  },
  {
    id: "tvs-jupiter-125",
    slug: "tvs-jupiter-125",
    name: "TVS Jupiter 125",
    brand: "TVS",
    category: "Petrol",
    pricePerDay: 449,
    rating: 4.6,
    reviews: 85,
    engine: "125cc",
    mileage: "55 kmpl",
    topSpeed: "90 km/h",
    city: "Bangalore",
    hub: "Indiranagar Hub",
    vendor: { name: "Volt Rentals", rating: 4.7, superhost: true, since: 2022 },
    image:
      "https://images.unsplash.com/photo-1611241443322-b5bce1a37ea0?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1611241443322-b5bce1a37ea0?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80",
    ],
    amenities: ["Helmet", "Large Boot", "External Fuel Fill"],
    description:
      "Bigger engine, bigger boot, bigger comfort. TVS Jupiter 125 handles long commutes and weekend runs with equal ease.",
    available: 3,
  },
  {
    id: "ather-450x",
    slug: "ather-450x",
    name: "Ather 450X Gen 3",
    brand: "Ather",
    category: "Electric",
    pricePerDay: 699,
    rating: 4.9,
    reviews: 210,
    range: "146 km",
    topSpeed: "90 km/h",
    city: "Bangalore",
    hub: "Koramangala Hub",
    vendor: { name: "ChargeUp", rating: 4.9, superhost: true, since: 2020 },
    image:
      "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80",
    ],
    amenities: ["Free Charging", "Smart Dashboard", "Helmet"],
    description:
      "India's smartest electric scooter. 0-40 km/h in 3.3s, warp mode, and over-the-air updates. Save ₹200/day on fuel.",
    available: 2,
  },
  {
    id: "suzuki-access-125",
    slug: "suzuki-access-125",
    name: "Suzuki Access 125",
    brand: "Suzuki",
    category: "Petrol",
    pricePerDay: 549,
    rating: 4.7,
    reviews: 54,
    engine: "125cc",
    mileage: "48 kmpl",
    topSpeed: "88 km/h",
    city: "Bangalore",
    hub: "Whitefield Hub",
    vendor: { name: "Karan's Rentals", rating: 4.9, superhost: true, since: 2021 },
    image:
      "https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?auto=format&fit=crop&w=1200&q=80",
    ],
    amenities: ["Helmet", "USB Charging"],
    description:
      "Premium ride quality with a powerful 125cc engine. Suzuki Access delivers smooth acceleration and stable cornering.",
    available: 5,
  },
  {
    id: "ola-s1-pro",
    slug: "ola-s1-pro",
    name: "Ola S1 Pro Gen 2",
    brand: "Ola",
    category: "Electric",
    pricePerDay: 649,
    rating: 4.5,
    reviews: 95,
    range: "195 km",
    topSpeed: "120 km/h",
    city: "Bangalore",
    hub: "HSR Layout Hub",
    vendor: { name: "ChargeUp", rating: 4.9, superhost: true, since: 2020 },
    image:
      "https://images.unsplash.com/photo-1591638848542-54db6ff1d5a0?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1591638848542-54db6ff1d5a0?auto=format&fit=crop&w=1200&q=80",
    ],
    amenities: ["Free Charging", "Smart Dashboard", "Helmet", "Boot Space"],
    description:
      "Top-of-the-line electric scooter. 195km range, 120km/h top speed, and premium ride quality.",
    available: 1,
  },
  {
    id: "bajaj-chetak",
    slug: "bajaj-chetak",
    name: "Bajaj Chetak Premium",
    brand: "Bajaj",
    category: "Electric",
    pricePerDay: 599,
    rating: 4.4,
    reviews: 42,
    range: "108 km",
    topSpeed: "73 km/h",
    city: "Bangalore",
    hub: "Indiranagar Hub",
    vendor: { name: "Volt Rentals", rating: 4.7, superhost: true, since: 2022 },
    image:
      "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80",
    ],
    amenities: ["Smart Dashboard", "Helmet", "Chrome Finish"],
    description:
      "Retro meets modern. Metal body, classic silhouette, all-electric drivetrain.",
    available: 3,
  },
];

export function getScooterBySlug(slug: string): Scooter | undefined {
  return scooters.find((s) => s.slug === slug);
}

export const cities = ["Bangalore", "Delhi", "Mumbai", "Goa", "Pune", "Hyderabad"];
export const brands = Array.from(new Set(scooters.map((s) => s.brand)));
