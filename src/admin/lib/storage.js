// ────────────────────────────────────────────────────────────────────────────
// admin/lib/storage.js — Supabase Storage helpers (upload / delete / URL).
// Buckets: hero-images, gallery-images, attraction-images, homestay-images.
// All four are public-read; writes require an admin session (enforced by RLS).
// ────────────────────────────────────────────────────────────────────────────

import { supabase } from '../../lib/supabaseClient'

export const BUCKETS = {
  hero: 'hero-images',
  gallery: 'gallery-images',
  attraction: 'attraction-images',
  homestay: 'homestay-images',
}

function ensure() {
  if (!supabase) throw new Error('Supabase is not configured.')
  return supabase
}

// Build a collision-resistant object path without Math.random/Date in a way
// that's fine for the browser (these APIs ARE available here).
function uniqueName(file) {
  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase()
  const stamp = Date.now().toString(36)
  const rand = Math.random().toString(36).slice(2, 8)
  return `${stamp}-${rand}.${ext}`
}

// Upload a File to a bucket; returns { path, url } (public URL stored in DB).
export async function uploadImage(bucket, file, folder = '') {
  const db = ensure()
  const path = (folder ? folder.replace(/\/$/, '') + '/' : '') + uniqueName(file)
  const { error } = await db.storage.from(bucket).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type || undefined,
  })
  if (error) throw error
  const { data } = db.storage.from(bucket).getPublicUrl(path)
  return { path, url: data.publicUrl }
}

// Delete an object by its stored path.
export async function deleteImage(bucket, path) {
  if (!path) return
  const { error } = await ensure().storage.from(bucket).remove([path])
  if (error) throw error
}

export function publicUrl(bucket, path) {
  if (!supabase || !path) return null
  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl
}
