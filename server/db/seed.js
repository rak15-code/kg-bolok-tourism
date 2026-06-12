// ────────────────────────────────────────────────────────────────────────────
// db/seed.js — load initial content into Supabase
// ────────────────────────────────────────────────────────────────────────────
// Reads the front end's static data files and upserts them into the
// attractions / homestays / packages tables. Run ONCE after schema.sql:
//
//   cd server
//   node db/seed.js
//
// Requires SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY in server/.env.
// Safe to re-run: rows are upserted by `slug`.
// ────────────────────────────────────────────────────────────────────────────

import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

import attractions from '../../src/data/attractionsData.js'
import homestays   from '../../src/data/homestaysData.js'
import packages    from '../../src/data/packagesData.js'

const url = process.env.SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!url || !key) {
  console.error('✗ SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY missing in server/.env')
  process.exit(1)
}
const db = createClient(url, key, { auth: { persistSession: false } })

const attractionRows = attractions.map((a, i) => ({
  slug: a.slug,
  category: a.category,
  icon: a.icon,
  gradient: a.gradient,
  image: a.image ?? null,
  images: a.images ?? [],
  base_price: a.basePrice ?? a.price ?? 0,
  price: a.price ?? a.basePrice ?? 0,
  duration: a.duration ?? null,
  content: { en: a.en, bm: a.bm },
  packages: a.packages ?? null,
  notes: a.notes ?? null,
  sort_order: i,
  is_active: true,
}))

const homestayRows = homestays.map((h, i) => ({
  slug: h.slug,
  icon: h.icon,
  gradient: h.gradient,
  price_from: h.priceFrom ?? 0,
  rating: h.rating ?? 5.0,
  capacity: h.capacity ?? 0,
  images: h.images ?? [],
  content: { en: h.en, bm: h.bm },
  rooms: h.rooms ?? [],
  sort_order: i,
  is_active: true,
}))

const packageRows = packages.map((p, i) => ({
  slug: p.slug,
  title_en: p.en.title,
  title_bm: p.bm.title,
  includes_en: p.en.includes,
  includes_bm: p.bm.includes,
  original_price: p.originalPrice,
  discounted_price: p.discountedPrice,
  discount_percentage: p.discountPercentage,
  currency: p.currency ?? 'MYR',
  icon: p.icon,
  gradient: p.gradient,
  attraction_slugs: p.attractionSlugs ?? [],
  homestay_slug: p.homestaySlug ?? null,
  is_active: true,
  sort_order: i,
}))

async function upsert(table, rows) {
  const { error } = await db.from(table).upsert(rows, { onConflict: 'slug' })
  if (error) {
    console.error(`✗ ${table}:`, error.message)
    process.exitCode = 1
  } else {
    console.log(`✓ ${table}: ${rows.length} rows`)
  }
}

console.log('Seeding Supabase…')
await upsert('attractions', attractionRows)
await upsert('homestays', homestayRows)
await upsert('packages', packageRows)
console.log('Done.')
