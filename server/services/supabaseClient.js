// ────────────────────────────────────────────────────────────────────────────
// services/supabaseClient.js  (BACKEND)
// ────────────────────────────────────────────────────────────────────────────
// Server-side Supabase client. Uses the SERVICE ROLE key, which bypasses Row
// Level Security — so it can insert bookings / email logs that the public can
// never read. This key is SECRET and must NEVER reach the browser.
//
// If Supabase env vars are missing, we export `null` and log a warning instead
// of crashing. That lets the Mock payment flow run locally with zero setup;
// persistence is simply skipped until you add the keys.
// ────────────────────────────────────────────────────────────────────────────

import { createClient } from '@supabase/supabase-js'

const url = process.env.SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

let supabase = null

if (url && serviceKey) {
  supabase = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
} else {
  console.warn(
    '[supabase] SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set — ' +
    'database persistence is DISABLED (payments still work via Mock).'
  )
}

// True when the DB is wired up. Callers should check this before persisting.
export const isSupabaseReady = () => supabase !== null

export default supabase
