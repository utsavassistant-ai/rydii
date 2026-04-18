# Database Setup

## Prerequisites

Install the [Supabase CLI](https://supabase.com/docs/guides/cli):
```bash
npm install -g supabase
```

Link to the remote project:
```bash
supabase link --project-ref agcplrbpklcxihbpurxx
```

## Apply migrations

Push all migrations to the remote Supabase project:
```bash
supabase db push
```

Or apply them manually via the Supabase SQL Editor in the order listed under `migrations/`.

## Seed data

Inserts 3 vendor accounts + 6 scooters. Safe to re-run (uses `ON CONFLICT DO NOTHING/UPDATE`).

```bash
supabase db execute --project-ref agcplrbpklcxihbpurxx \
  --file supabase/seed.sql
```

Or paste `seed.sql` contents directly into the Supabase SQL Editor.

### Test vendor credentials

| Email                  | Password     | Fleet            |
|------------------------|--------------|------------------|
| karan@rydii.test       | Rydii@2024!  | Honda, Suzuki    |
| chargeup@rydii.test    | Rydii@2024!  | Ather, Ola       |
| volt@rydii.test        | Rydii@2024!  | TVS, Bajaj       |

## Migration files

| File | Description |
|------|-------------|
| `20240101000001_initial_schema.sql` | Tables (`profiles`, `scooters`, `bookings`), indexes, auto-profile trigger |
| `20240101000002_rls_policies.sql`   | Row Level Security policies for all tables |

## RLS policy summary

| Table    | SELECT                                    | INSERT                          | UPDATE                    | DELETE          |
|----------|-------------------------------------------|---------------------------------|---------------------------|-----------------|
| profiles | Own row + all vendor profiles             | Trigger only (service role)     | Own row                   | —               |
| scooters | Public (anyone can browse)                | Vendor: vendor_id = auth.uid()  | Vendor: own scooters       | Vendor: own     |
| bookings | Rider: own bookings; Vendor: their fleet  | Rider: user_id = auth.uid()     | Vendor: status updates     | — (soft cancel) |

## Generate TypeScript types

After schema changes, regenerate types:
```bash
supabase gen types typescript \
  --project-ref agcplrbpklcxihbpurxx \
  > lib/database.types.ts
```
