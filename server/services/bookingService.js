// ────────────────────────────────────────────────────────────────────────────
// services/bookingService.js
// ────────────────────────────────────────────────────────────────────────────
// All reads/writes to the `bookings` table live here. Uses the service-role
// Supabase client, so it bypasses RLS (the public can never read bookings).
//
// Every function degrades gracefully when Supabase isn't configured: it logs
// and returns a synthetic in-memory record so the Mock payment flow still works
// end-to-end with zero setup.
// ────────────────────────────────────────────────────────────────────────────

import crypto from 'node:crypto'
import supabase, { isSupabaseReady } from './supabaseClient.js'

// Human-friendly, collision-resistant reference, e.g. KGB-LXQ8F2-A1B2C3
export function generateReference() {
  return (
    'KGB-' +
    Date.now().toString(36).toUpperCase() +
    '-' +
    crypto.randomBytes(3).toString('hex').toUpperCase()
  )
}

// Normalise the frontend payload into a `bookings` row.
function toRow({ reference, customer, booking, totals, currency, provider, lang }) {
  return {
    booking_reference: reference,
    customer_name: customer.name,
    customer_email: customer.email,
    customer_phone: customer.phone || null,
    selected_attractions: booking.attractions || [],
    selected_homestay: booking.homestays?.length ? booking.homestays : null,
    subtotal: Number(totals.subtotal ?? totals.total ?? 0),
    discount_percentage: Number(totals.discountPercentage ?? 0),
    total_amount: Number(totals.total ?? 0),
    currency: currency || 'MYR',
    payment_provider: provider || 'mock',
    payment_status: 'pending',
    payment_reference: null,
    visit_date: booking.startDate || null,
    special_request: booking.request || null,
    lang: lang || 'en',
  }
}

// Create a pending booking. Returns the created row (DB) or a synthetic one.
export async function createBooking(input) {
  const row = toRow(input)

  if (!isSupabaseReady()) {
    console.warn('[booking] Supabase off — not persisting', row.booking_reference)
    return { id: null, ...row }
  }

  const { data, error } = await supabase
    .from('bookings')
    .insert(row)
    .select()
    .single()

  if (error) throw new Error(`Failed to save booking: ${error.message}`)
  return data
}

// Update a booking's payment status. Match by payment_reference first
// (what the gateway knows), then fall back to our booking_reference.
export async function updateBookingStatus({
  bookingReference,
  paymentReference,
  status,
  newPaymentReference,
}) {
  if (!isSupabaseReady()) {
    console.warn('[booking] Supabase off — cannot update status', bookingReference || paymentReference)
    return null
  }

  const patch = { payment_status: status }
  if (newPaymentReference) patch.payment_reference = newPaymentReference

  let query = supabase.from('bookings').update(patch)
  if (paymentReference) query = query.eq('payment_reference', paymentReference)
  else if (bookingReference) query = query.eq('booking_reference', bookingReference)
  else throw new Error('updateBookingStatus needs a reference')

  const { data, error } = await query.select().maybeSingle()
  if (error) throw new Error(`Failed to update booking: ${error.message}`)
  return data
}

// Save the gateway's payment id back onto the booking right after creation.
export async function attachPaymentReference(bookingReference, paymentReference) {
  if (!isSupabaseReady() || !paymentReference) return
  const { error } = await supabase
    .from('bookings')
    .update({ payment_reference: paymentReference })
    .eq('booking_reference', bookingReference)
  if (error) console.error('[booking] attach payment ref failed:', error.message)
}

export async function getByReference(bookingReference) {
  if (!isSupabaseReady()) return null
  const { data } = await supabase
    .from('bookings').select('*').eq('booking_reference', bookingReference).maybeSingle()
  return data
}

export async function getByPaymentReference(paymentReference) {
  if (!isSupabaseReady()) return null
  const { data } = await supabase
    .from('bookings').select('*').eq('payment_reference', paymentReference).maybeSingle()
  return data
}
