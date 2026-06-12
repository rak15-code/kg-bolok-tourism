// ────────────────────────────────────────────────────────────────────────────
// email/emailService.js
// ────────────────────────────────────────────────────────────────────────────
// High-level email API used by the rest of the app. It:
//   1. renders the right reusable template (bilingual),
//   2. sends via the active email provider (Resend / log),
//   3. records the attempt in the Supabase `email_logs` table.
//
// Exposes:
//   sendBookingCreatedEmail(booking)
//   sendPaymentConfirmedEmail(booking)
// ────────────────────────────────────────────────────────────────────────────

import emailProvider from './emailProvider.js'
import bookingCreated from './templates/bookingCreated.js'
import paymentConfirmed from './templates/paymentConfirmed.js'
import supabase, { isSupabaseReady } from '../supabaseClient.js'

async function logEmail({ booking, type, subject, status, error }) {
  if (!isSupabaseReady()) return
  const { error: dbErr } = await supabase.from('email_logs').insert({
    booking_id: booking?.id || null,
    to_email: booking?.customer_email || 'unknown',
    type,
    subject: subject || null,
    provider: emailProvider.name,
    status,
    error: error || null,
  })
  if (dbErr) console.error('[email_logs] write failed:', dbErr.message)
}

async function dispatch(type, render, booking) {
  if (!booking?.customer_email) {
    console.warn(`[email] ${type}: no recipient, skipping`)
    return
  }
  const { subject, html, text } = render(booking)
  try {
    await emailProvider.send({ to: booking.customer_email, subject, html, text })
    await logEmail({ booking, type, subject, status: 'sent' })
  } catch (err) {
    await logEmail({ booking, type, subject, status: 'failed', error: err.message })
    throw err
  }
}

export function sendBookingCreatedEmail(booking) {
  return dispatch('booking_created', bookingCreated, booking)
}

export function sendPaymentConfirmedEmail(booking) {
  return dispatch('payment_confirmed', paymentConfirmed, booking)
}
