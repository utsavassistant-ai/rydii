-- ============================================================
-- rydii: Initial schema
-- Tables: profiles, scooters, bookings
-- Trigger: auto-create profile on user signup
-- ============================================================

-- -------------------------------------------------------
-- profiles
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id           UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name    TEXT,
  phone        TEXT,
  role         TEXT        NOT NULL DEFAULT 'rider' CHECK (role IN ('rider', 'vendor')),
  avatar_url   TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -------------------------------------------------------
-- scooters
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.scooters (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug           TEXT        UNIQUE NOT NULL,
  name           TEXT        NOT NULL,
  brand          TEXT        NOT NULL,
  category       TEXT        NOT NULL CHECK (category IN ('Electric', 'Petrol')),
  price_per_day  INTEGER     NOT NULL,
  rating         NUMERIC(3,2) NOT NULL DEFAULT 0,
  reviews_count  INTEGER     NOT NULL DEFAULT 0,
  engine         TEXT,
  mileage        TEXT,
  range_km       TEXT,
  top_speed      TEXT        NOT NULL,
  city           TEXT        NOT NULL,
  hub            TEXT        NOT NULL,
  image          TEXT,
  gallery        TEXT[]      NOT NULL DEFAULT '{}',
  amenities      TEXT[]      NOT NULL DEFAULT '{}',
  description    TEXT,
  available      INTEGER     NOT NULL DEFAULT 1,
  vendor_id      UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS scooters_vendor_id_idx ON public.scooters(vendor_id);
CREATE INDEX IF NOT EXISTS scooters_city_idx       ON public.scooters(city);
CREATE INDEX IF NOT EXISTS scooters_category_idx   ON public.scooters(category);
CREATE INDEX IF NOT EXISTS scooters_brand_idx      ON public.scooters(brand);

-- -------------------------------------------------------
-- bookings
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.bookings (
  id                    UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  scooter_id            UUID        NOT NULL REFERENCES public.scooters(id) ON DELETE CASCADE,
  pickup_datetime       TIMESTAMPTZ NOT NULL,
  drop_datetime         TIMESTAMPTZ NOT NULL,
  pickup_mode           TEXT        NOT NULL DEFAULT 'hub' CHECK (pickup_mode IN ('hub', 'delivery')),
  pickup_hub            TEXT,
  pickup_address        TEXT,
  pickup_lat            DOUBLE PRECISION,
  pickup_lng            DOUBLE PRECISION,
  drop_mode             TEXT        NOT NULL DEFAULT 'hub' CHECK (drop_mode IN ('hub', 'delivery')),
  drop_hub              TEXT,
  drop_address          TEXT,
  drop_lat              DOUBLE PRECISION,
  drop_lng              DOUBLE PRECISION,
  days                  INTEGER     NOT NULL CHECK (days > 0),
  base_price            INTEGER     NOT NULL CHECK (base_price >= 0),
  delivery_fee          INTEGER     NOT NULL DEFAULT 0 CHECK (delivery_fee >= 0),
  platform_fee          INTEGER     NOT NULL DEFAULT 0 CHECK (platform_fee >= 0),
  insurance_fee         INTEGER     NOT NULL DEFAULT 0 CHECK (insurance_fee >= 0),
  gst                   INTEGER     NOT NULL DEFAULT 0 CHECK (gst >= 0),
  total                 INTEGER     NOT NULL CHECK (total >= 0),
  payment_method        TEXT        NOT NULL DEFAULT 'upi',
  status                TEXT        NOT NULL DEFAULT 'confirmed'
                                    CHECK (status IN ('confirmed', 'active', 'completed', 'cancelled')),
  rider_name            TEXT,
  rider_phone           TEXT,
  rider_email           TEXT,
  rider_licence         TEXT,
  promo_code            TEXT,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS bookings_user_id_idx     ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS bookings_scooter_id_idx  ON public.bookings(scooter_id);
CREATE INDEX IF NOT EXISTS bookings_status_idx      ON public.bookings(status);
CREATE INDEX IF NOT EXISTS bookings_created_at_idx  ON public.bookings(created_at DESC);

-- -------------------------------------------------------
-- Auto-create profile on signup
-- -------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'full_name',
    COALESCE(NEW.raw_user_meta_data ->> 'role', 'rider')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
