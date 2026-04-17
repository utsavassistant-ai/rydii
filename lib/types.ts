export type Profile = {
  id: string;
  full_name: string | null;
  phone: string | null;
  role: "rider" | "vendor";
  avatar_url: string | null;
  created_at: string;
};

export type DbScooter = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: "Electric" | "Petrol";
  price_per_day: number;
  rating: number;
  reviews_count: number;
  engine: string | null;
  mileage: string | null;
  range_km: string | null;
  top_speed: string;
  city: string;
  hub: string;
  image: string | null;
  gallery: string[];
  amenities: string[];
  description: string | null;
  available: number;
  vendor_id: string | null;
  created_at: string;
};

export type Booking = {
  id: string;
  user_id: string;
  scooter_id: string;
  pickup_datetime: string;
  drop_datetime: string;
  pickup_mode: "hub" | "delivery";
  pickup_hub: string | null;
  pickup_address: string | null;
  pickup_lat: number | null;
  pickup_lng: number | null;
  drop_mode: "hub" | "delivery";
  drop_hub: string | null;
  drop_address: string | null;
  drop_lat: number | null;
  drop_lng: number | null;
  days: number;
  base_price: number;
  delivery_fee: number;
  platform_fee: number;
  insurance_fee: number;
  gst: number;
  total: number;
  payment_method: string;
  status: "confirmed" | "active" | "completed" | "cancelled";
  rider_name: string | null;
  rider_phone: string | null;
  rider_email: string | null;
  rider_licence: string | null;
  promo_code: string | null;
  created_at: string;
  // joined
  scooter?: DbScooter;
};
