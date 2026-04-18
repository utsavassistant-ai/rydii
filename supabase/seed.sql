-- ============================================================
-- rydii: Seed data
-- Creates 3 vendor accounts + 6 scooters for local dev / fresh starts.
--
-- Apply to remote:
--   supabase db execute --project-ref agcplrbpklcxihbpurxx \
--     --file supabase/seed.sql
--
-- Or via Supabase SQL editor.
--
-- Test vendor credentials:
--   karan@rydii.test   / Rydii@2024!
--   chargeup@rydii.test / Rydii@2024!
--   volt@rydii.test    / Rydii@2024!
-- ============================================================

-- -------------------------------------------------------
-- Vendor auth accounts
-- Fixed UUIDs so scooters can reference vendor_id deterministically.
-- -------------------------------------------------------

-- Vendor 1: Karan's Rentals
INSERT INTO auth.users (
  instance_id, id, aud, role,
  email, encrypted_password,
  email_confirmed_at, last_sign_in_at,
  raw_app_meta_data, raw_user_meta_data,
  is_super_admin, is_sso_user,
  created_at, updated_at,
  confirmation_token, recovery_token,
  email_change_token_new, email_change
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  'a0000000-0000-0000-0000-000000000001',
  'authenticated', 'authenticated',
  'karan@rydii.test',
  crypt('Rydii@2024!', gen_salt('bf')),
  NOW(), NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Karan Singh","role":"vendor"}',
  false, false,
  NOW(), NOW(),
  '', '', '', ''
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (
  id, user_id, identity_data, provider,
  last_sign_in_at, created_at, updated_at
)
VALUES (
  'a0000000-0000-0000-0000-000000000001',
  'a0000000-0000-0000-0000-000000000001',
  '{"sub":"a0000000-0000-0000-0000-000000000001","email":"karan@rydii.test"}'::jsonb,
  'email',
  NOW(), NOW(), NOW()
)
ON CONFLICT (id) DO NOTHING;

-- Vendor 2: ChargeUp
INSERT INTO auth.users (
  instance_id, id, aud, role,
  email, encrypted_password,
  email_confirmed_at, last_sign_in_at,
  raw_app_meta_data, raw_user_meta_data,
  is_super_admin, is_sso_user,
  created_at, updated_at,
  confirmation_token, recovery_token,
  email_change_token_new, email_change
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  'a0000000-0000-0000-0000-000000000002',
  'authenticated', 'authenticated',
  'chargeup@rydii.test',
  crypt('Rydii@2024!', gen_salt('bf')),
  NOW(), NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"ChargeUp Fleet","role":"vendor"}',
  false, false,
  NOW(), NOW(),
  '', '', '', ''
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (
  id, user_id, identity_data, provider,
  last_sign_in_at, created_at, updated_at
)
VALUES (
  'a0000000-0000-0000-0000-000000000002',
  'a0000000-0000-0000-0000-000000000002',
  '{"sub":"a0000000-0000-0000-0000-000000000002","email":"chargeup@rydii.test"}'::jsonb,
  'email',
  NOW(), NOW(), NOW()
)
ON CONFLICT (id) DO NOTHING;

-- Vendor 3: Volt Rentals
INSERT INTO auth.users (
  instance_id, id, aud, role,
  email, encrypted_password,
  email_confirmed_at, last_sign_in_at,
  raw_app_meta_data, raw_user_meta_data,
  is_super_admin, is_sso_user,
  created_at, updated_at,
  confirmation_token, recovery_token,
  email_change_token_new, email_change
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  'a0000000-0000-0000-0000-000000000003',
  'authenticated', 'authenticated',
  'volt@rydii.test',
  crypt('Rydii@2024!', gen_salt('bf')),
  NOW(), NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Volt Rentals","role":"vendor"}',
  false, false,
  NOW(), NOW(),
  '', '', '', ''
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (
  id, user_id, identity_data, provider,
  last_sign_in_at, created_at, updated_at
)
VALUES (
  'a0000000-0000-0000-0000-000000000003',
  'a0000000-0000-0000-0000-000000000003',
  '{"sub":"a0000000-0000-0000-0000-000000000003","email":"volt@rydii.test"}'::jsonb,
  'email',
  NOW(), NOW(), NOW()
)
ON CONFLICT (id) DO NOTHING;

-- Ensure profiles exist (trigger fires on INSERT, but guard with ON CONFLICT)
INSERT INTO public.profiles (id, full_name, role)
VALUES
  ('a0000000-0000-0000-0000-000000000001', 'Karan Singh',   'vendor'),
  ('a0000000-0000-0000-0000-000000000002', 'ChargeUp Fleet', 'vendor'),
  ('a0000000-0000-0000-0000-000000000003', 'Volt Rentals',  'vendor')
ON CONFLICT (id) DO UPDATE
  SET full_name = EXCLUDED.full_name,
      role      = EXCLUDED.role;

-- -------------------------------------------------------
-- Scooters
-- -------------------------------------------------------
INSERT INTO public.scooters (
  slug, name, brand, category,
  price_per_day, rating, reviews_count,
  engine, mileage, range_km, top_speed,
  city, hub,
  image, gallery, amenities, description,
  available, vendor_id
)
VALUES

-- Honda Activa 6G — Karan's Rentals
(
  'honda-activa-6g', 'Honda Activa 6G', 'Honda', 'Petrol',
  499, 4.8, 128,
  '110cc', '50 kmpl', NULL, '85 km/h',
  'Bangalore', 'HSR Layout Hub',
  '/scooters/honda-activa-6g/hero.jpg',
  ARRAY['/scooters/honda-activa-6g/hero.jpg', '/scooters/honda-activa-6g/card.jpg'],
  ARRAY['Helmet', 'Phone Mount', 'Fuel Start'],
  'India''s best-selling scooter. Smooth automatic transmission, silent start, and best-in-class mileage. Perfect for daily commutes through urban chaos.',
  4, 'a0000000-0000-0000-0000-000000000001'
),

-- TVS Jupiter 125 — Volt Rentals
(
  'tvs-jupiter-125', 'TVS Jupiter 125', 'TVS', 'Petrol',
  449, 4.6, 85,
  '125cc', '55 kmpl', NULL, '90 km/h',
  'Bangalore', 'Indiranagar Hub',
  '/scooters/tvs-jupiter-125/hero.jpg',
  ARRAY['/scooters/tvs-jupiter-125/hero.jpg', '/scooters/tvs-jupiter-125/card.jpg'],
  ARRAY['Helmet', 'Large Boot', 'External Fuel Fill'],
  'Bigger engine, bigger boot, bigger comfort. TVS Jupiter 125 handles long commutes and weekend runs with equal ease.',
  3, 'a0000000-0000-0000-0000-000000000003'
),

-- Ather 450X — ChargeUp
(
  'ather-450x', 'Ather 450X Gen 3', 'Ather', 'Electric',
  699, 4.9, 210,
  NULL, NULL, '146 km', '90 km/h',
  'Bangalore', 'Koramangala Hub',
  'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=1200&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80'
  ],
  ARRAY['Free Charging', 'Smart Dashboard', 'Helmet'],
  'India''s smartest electric scooter. 0-40 km/h in 3.3s, warp mode, and over-the-air updates. Save ₹200/day on fuel.',
  2, 'a0000000-0000-0000-0000-000000000002'
),

-- Suzuki Access 125 — Karan's Rentals
(
  'suzuki-access-125', 'Suzuki Access 125', 'Suzuki', 'Petrol',
  549, 4.7, 54,
  '125cc', '48 kmpl', NULL, '88 km/h',
  'Bangalore', 'Whitefield Hub',
  '/scooters/suzuki-access-125/hero.jpg',
  ARRAY['/scooters/suzuki-access-125/hero.jpg', '/scooters/suzuki-access-125/card.jpg'],
  ARRAY['Helmet', 'USB Charging'],
  'Premium ride quality with a powerful 125cc engine. Suzuki Access delivers smooth acceleration and stable cornering.',
  5, 'a0000000-0000-0000-0000-000000000001'
),

-- Ola S1 Pro — ChargeUp
(
  'ola-s1-pro', 'Ola S1 Pro Gen 2', 'Ola', 'Electric',
  649, 4.5, 95,
  NULL, NULL, '195 km', '120 km/h',
  'Bangalore', 'HSR Layout Hub',
  '/scooters/ola-s1-pro/hero.jpg',
  ARRAY['/scooters/ola-s1-pro/hero.jpg', '/scooters/ola-s1-pro/card.jpg'],
  ARRAY['Free Charging', 'Smart Dashboard', 'Helmet', 'Boot Space'],
  'Top-of-the-line electric scooter. 195km range, 120km/h top speed, and premium ride quality.',
  1, 'a0000000-0000-0000-0000-000000000002'
),

-- Bajaj Chetak — Volt Rentals
(
  'bajaj-chetak', 'Bajaj Chetak Premium', 'Bajaj', 'Electric',
  599, 4.4, 42,
  NULL, NULL, '108 km', '73 km/h',
  'Bangalore', 'Indiranagar Hub',
  'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80',
  ARRAY['https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80'],
  ARRAY['Smart Dashboard', 'Helmet', 'Chrome Finish'],
  'Retro meets modern. Metal body, classic silhouette, all-electric drivetrain.',
  3, 'a0000000-0000-0000-0000-000000000003'
)

ON CONFLICT (slug) DO UPDATE SET
  name          = EXCLUDED.name,
  price_per_day = EXCLUDED.price_per_day,
  rating        = EXCLUDED.rating,
  reviews_count = EXCLUDED.reviews_count,
  amenities     = EXCLUDED.amenities,
  description   = EXCLUDED.description,
  available     = EXCLUDED.available,
  vendor_id     = EXCLUDED.vendor_id;
