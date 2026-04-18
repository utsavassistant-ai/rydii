-- ============================================================
-- rydii: Row Level Security (RLS) policies
-- All tables require RLS enabled; policies enforce ownership.
-- ============================================================

-- -------------------------------------------------------
-- profiles
-- -------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
DROP POLICY IF EXISTS "profiles: own read"     ON public.profiles;
CREATE POLICY "profiles: own read"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Vendor profiles are publicly readable (needed for scooty detail page vendor card)
DROP POLICY IF EXISTS "profiles: vendor public read" ON public.profiles;
CREATE POLICY "profiles: vendor public read"
  ON public.profiles FOR SELECT
  USING (role = 'vendor');

-- Users can update only their own profile
DROP POLICY IF EXISTS "profiles: own update"   ON public.profiles;
CREATE POLICY "profiles: own update"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Profile INSERT is handled exclusively by the trigger (service role only).
-- No direct INSERT policy for authenticated users.


-- -------------------------------------------------------
-- scooters
-- -------------------------------------------------------
ALTER TABLE public.scooters ENABLE ROW LEVEL SECURITY;

-- Anyone can browse scooters (public marketplace)
DROP POLICY IF EXISTS "scooters: public read"  ON public.scooters;
CREATE POLICY "scooters: public read"
  ON public.scooters FOR SELECT
  USING (true);

-- Vendors can list their own scooters
DROP POLICY IF EXISTS "scooters: vendor insert" ON public.scooters;
CREATE POLICY "scooters: vendor insert"
  ON public.scooters FOR INSERT
  WITH CHECK (
    auth.uid() = vendor_id
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'vendor'
    )
  );

-- Vendors can update only their own scooters
DROP POLICY IF EXISTS "scooters: vendor update" ON public.scooters;
CREATE POLICY "scooters: vendor update"
  ON public.scooters FOR UPDATE
  USING (auth.uid() = vendor_id)
  WITH CHECK (auth.uid() = vendor_id);

-- Vendors can delete only their own scooters
DROP POLICY IF EXISTS "scooters: vendor delete" ON public.scooters;
CREATE POLICY "scooters: vendor delete"
  ON public.scooters FOR DELETE
  USING (auth.uid() = vendor_id);


-- -------------------------------------------------------
-- bookings
-- -------------------------------------------------------
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Riders can see their own bookings
DROP POLICY IF EXISTS "bookings: rider read"   ON public.bookings;
CREATE POLICY "bookings: rider read"
  ON public.bookings FOR SELECT
  USING (user_id = auth.uid());

-- Vendors can see bookings for scooters they own
DROP POLICY IF EXISTS "bookings: vendor read"  ON public.bookings;
CREATE POLICY "bookings: vendor read"
  ON public.bookings FOR SELECT
  USING (
    scooter_id IN (
      SELECT id FROM public.scooters WHERE vendor_id = auth.uid()
    )
  );

-- Authenticated riders can create bookings (user_id must match themselves)
DROP POLICY IF EXISTS "bookings: rider insert" ON public.bookings;
CREATE POLICY "bookings: rider insert"
  ON public.bookings FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND user_id = auth.uid()
  );

-- Vendors can update status on bookings for their scooters
-- (e.g. mark active, completed, cancelled)
DROP POLICY IF EXISTS "bookings: vendor update" ON public.bookings;
CREATE POLICY "bookings: vendor update"
  ON public.bookings FOR UPDATE
  USING (
    scooter_id IN (
      SELECT id FROM public.scooters WHERE vendor_id = auth.uid()
    )
  )
  WITH CHECK (
    scooter_id IN (
      SELECT id FROM public.scooters WHERE vendor_id = auth.uid()
    )
  );

-- No DELETE on bookings — soft cancel via status field only.
