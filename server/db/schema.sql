-- ============================================================================
-- Kg Bolok Tourism — Supabase schema
-- ============================================================================
-- HOW TO RUN
--   1. Open your Supabase project → SQL Editor → New query.
--   2. Paste this ENTIRE file and click "Run".
--   3. Then run  db/seed.sql  to load the initial content.
--   4. Create your admin user (see db/README.md → "Create the admin user").
--
-- This script is idempotent: you can safely run it more than once.
-- It creates every table, the `admin` role mechanism, Row Level Security
-- policies, and the four Storage buckets used for images.
-- ============================================================================

-- Needed for gen_random_uuid()
create extension if not exists "pgcrypto";


-- ────────────────────────────────────────────────────────────────────────────
-- 1. PROFILES + ADMIN ROLE
-- ────────────────────────────────────────────────────────────────────────────
-- Every auth user gets a row in public.profiles. `role` is either
-- 'customer' (default) or 'admin'. Only 'admin' rows may access the dashboard.

create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  email       text,
  full_name   text,
  role        text not null default 'customer' check (role in ('customer', 'admin')),
  created_at  timestamptz not null default now()
);

-- Auto-create a profile row whenever a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data ->> 'full_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Helper used by every admin-only policy below.
-- SECURITY DEFINER so it can read profiles without recursive RLS issues.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;


-- ────────────────────────────────────────────────────────────────────────────
-- 2. BOOKINGS
-- ────────────────────────────────────────────────────────────────────────────
-- The exact fields requested, plus a couple of operational extras
-- (visit_date, special_request, lang, updated_at).

create table if not exists public.bookings (
  id                   uuid primary key default gen_random_uuid(),
  booking_reference    text unique not null,
  customer_name        text not null,
  customer_email       text not null,
  customer_phone       text,
  selected_attractions jsonb not null default '[]'::jsonb,
  selected_homestay    jsonb,                       -- null = day trip
  subtotal             numeric(10,2) not null default 0,
  discount_percentage  numeric(5,2)  not null default 0,
  total_amount         numeric(10,2) not null default 0,
  currency             text not null default 'MYR',
  payment_provider     text not null default 'mock',
  payment_status       text not null default 'pending'
                         check (payment_status in ('pending','paid','failed','cancelled','refunded')),
  payment_reference    text,
  visit_date           date,
  special_request      text,
  lang                 text default 'en',
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

create index if not exists bookings_status_idx     on public.bookings (payment_status);
create index if not exists bookings_created_idx     on public.bookings (created_at desc);
create index if not exists bookings_reference_idx   on public.bookings (booking_reference);
create index if not exists bookings_pay_ref_idx     on public.bookings (payment_reference);


-- ────────────────────────────────────────────────────────────────────────────
-- 3. ATTRACTIONS
-- ────────────────────────────────────────────────────────────────────────────
-- Mirrors the shape of src/data/attractionsData.js so the front end can use
-- DB rows and static rows interchangeably. Bilingual + nested data live in jsonb.

create table if not exists public.attractions (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  category    text,
  icon        text,
  gradient    text,
  image       text,
  images      jsonb not null default '[]'::jsonb,
  base_price  numeric(10,2) not null default 0,
  price       numeric(10,2) not null default 0,
  duration    jsonb,                 -- { en, bm }
  content     jsonb not null default '{}'::jsonb,   -- { en:{name,tag,description,highlights}, bm:{...} }
  packages    jsonb,                 -- optional sub-packages
  notes       jsonb,                 -- { en, bm }
  sort_order  int not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists attractions_active_idx on public.attractions (is_active, sort_order);


-- ────────────────────────────────────────────────────────────────────────────
-- 4. HOMESTAYS
-- ────────────────────────────────────────────────────────────────────────────

create table if not exists public.homestays (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  icon        text,
  gradient    text,
  price_from  numeric(10,2) not null default 0,
  rating      numeric(2,1)  default 5.0,
  capacity    int default 0,
  images      jsonb not null default '[]'::jsonb,
  content     jsonb not null default '{}'::jsonb,   -- { en:{name,tagline,description,facilities}, bm:{...} }
  rooms       jsonb not null default '[]'::jsonb,   -- [{ key, en, bm, price, guests }]
  sort_order  int not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists homestays_active_idx on public.homestays (is_active, sort_order);


-- ────────────────────────────────────────────────────────────────────────────
-- 5. GALLERY
-- ────────────────────────────────────────────────────────────────────────────

create table if not exists public.gallery_images (
  id          uuid primary key default gen_random_uuid(),
  bucket      text not null default 'gallery-images',
  path        text,                  -- object path inside the bucket
  url         text not null,         -- public URL stored for fast reads
  title_en    text,
  title_bm    text,
  tag_en      text,
  tag_bm      text,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now()
);
create index if not exists gallery_order_idx on public.gallery_images (sort_order);


-- ────────────────────────────────────────────────────────────────────────────
-- 6. PACKAGES (featured)
-- ────────────────────────────────────────────────────────────────────────────

create table if not exists public.packages (
  id                   uuid primary key default gen_random_uuid(),
  slug                 text unique not null,
  title_en             text not null,
  title_bm             text not null,
  includes_en          jsonb not null default '[]'::jsonb,
  includes_bm          jsonb not null default '[]'::jsonb,
  original_price       numeric(10,2) not null default 0,
  discounted_price     numeric(10,2) not null default 0,
  discount_percentage  numeric(5,2)  not null default 0,
  currency             text not null default 'MYR',
  icon                 text,
  gradient             text default 'from-forest-500 to-ocean-500',
  attraction_slugs     jsonb not null default '[]'::jsonb,  -- prefill the builder
  homestay_slug        text,
  is_active            boolean not null default true,
  sort_order           int not null default 0,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);
create index if not exists packages_active_idx on public.packages (is_active, sort_order);


-- ────────────────────────────────────────────────────────────────────────────
-- 7. SETTINGS (single row, id = 1)
-- ────────────────────────────────────────────────────────────────────────────

create table if not exists public.settings (
  id              int primary key default 1 check (id = 1),
  phone           text,
  phone_display   text,
  whatsapp        text,
  instagram       text,
  tiktok          text,
  email           text,
  address         text,
  currency_rates  jsonb not null default '{}'::jsonb,   -- { MYR:1, USD:0.21, ... }
  theme           jsonb not null default '{}'::jsonb,   -- { primary, secondary, accent }
  updated_at      timestamptz not null default now()
);


-- ────────────────────────────────────────────────────────────────────────────
-- 8. EMAIL LOGS
-- ────────────────────────────────────────────────────────────────────────────

create table if not exists public.email_logs (
  id          uuid primary key default gen_random_uuid(),
  booking_id  uuid references public.bookings (id) on delete set null,
  to_email    text not null,
  type        text not null,          -- 'booking_created' | 'payment_confirmed' | ...
  subject     text,
  provider    text default 'resend',
  status      text not null default 'sent' check (status in ('sent','failed','skipped')),
  error       text,
  created_at  timestamptz not null default now()
);
create index if not exists email_logs_booking_idx on public.email_logs (booking_id);
create index if not exists email_logs_created_idx  on public.email_logs (created_at desc);


-- ────────────────────────────────────────────────────────────────────────────
-- 9. updated_at trigger
-- ────────────────────────────────────────────────────────────────────────────

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare t text;
begin
  foreach t in array array['bookings','attractions','homestays','packages','settings']
  loop
    execute format('drop trigger if exists touch_%1$s on public.%1$s', t);
    execute format(
      'create trigger touch_%1$s before update on public.%1$s
       for each row execute function public.touch_updated_at()', t);
  end loop;
end $$;


-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================
-- Public (anon) can READ active content. Only admins can write.
-- Bookings / email_logs are never readable by anon. The backend uses the
-- SERVICE ROLE key, which bypasses RLS entirely, to insert bookings/logs.
-- ============================================================================

alter table public.profiles        enable row level security;
alter table public.bookings        enable row level security;
alter table public.attractions     enable row level security;
alter table public.homestays       enable row level security;
alter table public.gallery_images  enable row level security;
alter table public.packages        enable row level security;
alter table public.settings        enable row level security;
alter table public.email_logs      enable row level security;

-- ── profiles ────────────────────────────────────────────────────────────────
drop policy if exists "own profile read"  on public.profiles;
create policy "own profile read" on public.profiles
  for select using (auth.uid() = id or public.is_admin());

drop policy if exists "own profile update" on public.profiles;
create policy "own profile update" on public.profiles
  for update using (auth.uid() = id);

-- ── public-readable content tables ───────────────────────────────────────────
-- helper macro repeated per table: anon/auth can read; admin can write.

-- attractions
drop policy if exists "attractions read"  on public.attractions;
create policy "attractions read"  on public.attractions for select using (true);
drop policy if exists "attractions write" on public.attractions;
create policy "attractions write" on public.attractions for all
  using (public.is_admin()) with check (public.is_admin());

-- homestays
drop policy if exists "homestays read"  on public.homestays;
create policy "homestays read"  on public.homestays for select using (true);
drop policy if exists "homestays write" on public.homestays;
create policy "homestays write" on public.homestays for all
  using (public.is_admin()) with check (public.is_admin());

-- gallery
drop policy if exists "gallery read"  on public.gallery_images;
create policy "gallery read"  on public.gallery_images for select using (true);
drop policy if exists "gallery write" on public.gallery_images;
create policy "gallery write" on public.gallery_images for all
  using (public.is_admin()) with check (public.is_admin());

-- packages
drop policy if exists "packages read"  on public.packages;
create policy "packages read"  on public.packages for select using (true);
drop policy if exists "packages write" on public.packages;
create policy "packages write" on public.packages for all
  using (public.is_admin()) with check (public.is_admin());

-- settings
drop policy if exists "settings read"  on public.settings;
create policy "settings read"  on public.settings for select using (true);
drop policy if exists "settings write" on public.settings;
create policy "settings write" on public.settings for all
  using (public.is_admin()) with check (public.is_admin());

-- ── admin-only readable tables ───────────────────────────────────────────────
-- bookings: only admins can read; inserts/updates go through the service role.
drop policy if exists "bookings admin read"  on public.bookings;
create policy "bookings admin read"  on public.bookings for select using (public.is_admin());
drop policy if exists "bookings admin write" on public.bookings;
create policy "bookings admin write" on public.bookings for all
  using (public.is_admin()) with check (public.is_admin());

-- email_logs: admins read only; service role writes.
drop policy if exists "email_logs admin read" on public.email_logs;
create policy "email_logs admin read" on public.email_logs for select using (public.is_admin());


-- ============================================================================
-- STORAGE BUCKETS
-- ============================================================================
-- Four public-read buckets. Writes (upload/delete) are admin-only.

insert into storage.buckets (id, name, public)
values
  ('hero-images',      'hero-images',      true),
  ('gallery-images',   'gallery-images',   true),
  ('attraction-images','attraction-images',true),
  ('homestay-images',  'homestay-images',  true)
on conflict (id) do update set public = excluded.public;

-- Public read for all four buckets.
drop policy if exists "kgbolok public read" on storage.objects;
create policy "kgbolok public read" on storage.objects
  for select using (
    bucket_id in ('hero-images','gallery-images','attraction-images','homestay-images')
  );

-- Admin can upload / update / delete in those buckets.
drop policy if exists "kgbolok admin write" on storage.objects;
create policy "kgbolok admin write" on storage.objects
  for all
  using (
    bucket_id in ('hero-images','gallery-images','attraction-images','homestay-images')
    and public.is_admin()
  )
  with check (
    bucket_id in ('hero-images','gallery-images','attraction-images','homestay-images')
    and public.is_admin()
  );

-- Seed the single settings row so the app always has one to read/update.
insert into public.settings (id, phone, phone_display, instagram, tiktok, email, address, currency_rates, theme)
values (
  1,
  '+60127594506',
  '+60 12-759 4506',
  'https://instagram.com/transformers_of_t',
  'https://www.tiktok.com/@transformers.of.t',
  'info@kgboloktourism.my',
  'Kg Bolok, Pahang, Malaysia',
  '{"MYR":1,"USD":0.21,"SGD":0.28,"INR":17.8,"EUR":0.19}'::jsonb,
  '{"primary":"#2f9e44","secondary":"#1c7ed6","accent":"#0c8599"}'::jsonb
)
on conflict (id) do nothing;

-- Done. Now run db/seed.sql, then create your admin user (db/README.md).
