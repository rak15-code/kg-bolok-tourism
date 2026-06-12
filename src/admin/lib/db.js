// ────────────────────────────────────────────────────────────────────────────
// admin/lib/db.js — thin generic CRUD helpers over Supabase for the dashboard.
// All writes are gated server-side by RLS (is_admin()), so a non-admin session
// physically cannot mutate these tables even if they reached this code.
// ────────────────────────────────────────────────────────────────────────────

import { supabase } from '../../lib/supabaseClient'

function ensure() {
  if (!supabase) throw new Error('Supabase is not configured (set VITE_SUPABASE_* env vars).')
  return supabase
}

export async function list(table, { order = 'created_at', ascending = false } = {}) {
  const { data, error } = await ensure().from(table).select('*').order(order, { ascending })
  if (error) throw error
  return data || []
}

export async function insert(table, row) {
  const { data, error } = await ensure().from(table).insert(row).select().single()
  if (error) throw error
  return data
}

export async function update(table, id, patch) {
  const { data, error } = await ensure().from(table).update(patch).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function remove(table, id) {
  const { error } = await ensure().from(table).delete().eq('id', id)
  if (error) throw error
}
