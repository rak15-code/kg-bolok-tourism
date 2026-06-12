// ────────────────────────────────────────────────────────────────────────────
// lib/supabaseClient.js  (FRONTEND)
// ────────────────────────────────────────────────────────────────────────────
// Browser Supabase client. Uses the ANON (public) key, which is *designed* to
// be shipped to the browser — it can only do what Row Level Security allows
// (read public content, and let an authenticated admin manage their data).
//
// The SERVICE ROLE key is NEVER used here. It lives only on the backend.
//
// Configure in the project-root `.env`:
//   VITE_SUPABASE_URL=https://xxxx.supabase.co
//   VITE_SUPABASE_ANON_KEY=eyJ...
//
// If the vars are absent, we export `null` so the public site still renders
// from its static data files (graceful degradation).
// ────────────────────────────────────────────────────────────────────────────

import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase =
  url && anonKey
    ? createClient(url, anonKey, {
        auth: { persistSession: true, autoRefreshToken: true },
      })
    : null

// Helper for components/contexts that want to know if the DB is available.
export const isSupabaseConfigured = () => supabase !== null

export default supabase
