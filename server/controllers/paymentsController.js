// ────────────────────────────────────────────────────────────────────────────
// controllers/paymentsController.js
// ────────────────────────────────────────────────────────────────────────────
// Thin HTTP layer. It is PROVIDER-AGNOSTIC: it talks to `paymentProvider`
// (the active adapter) and `bookingService` (Supabase). Swapping Mock↔HitPay
// requires no changes here.
//
// Flow:
//   POST /api/payments/create        → save pending booking, get checkout url
//   GET  /api/payments/mock/complete → (mock only) simulate gateway success
//   POST /api/payments/webhook       → gateway confirms payment server-to-server
// ────────────────────────────────────────────────────────────────────────────

import provider from '../services/payments/paymentProvider.js'
import {
  generateReference, createBooking, updateBookingStatus,
  attachPaymentReference, getByReference,
} from '../services/bookingService.js'
import {
  sendBookingCreatedEmail, sendPaymentConfirmedEmail,
} from '../services/email/emailService.js'

// Build a human-friendly description for the gateway checkout page.
function describe(booking) {
  const lines = []
  if (booking.attractions?.length)
    lines.push(`${booking.attractions.length} attraction(s) × ${booking.visitors || 1} pax`)
  if (booking.homestays?.length)
    lines.push(`${booking.homestays.length} homestay stay(s)`)
  return `Kg Bolok Tourism — ${lines.join(', ') || 'Custom package'}`
}

export async function createPayment(req, res, next) {
  try {
    const {
      customer = {}, booking = {},
      total, subtotal, discountPercentage,
      currency = 'MYR', lang = 'en',
    } = req.body || {}

    // ── Boundary validation ──
    if (!customer.name || !customer.email)
      return res.status(400).json({ error: 'Customer name and email are required.' })
    if (!total || Number(total) <= 0)
      return res.status(400).json({ error: 'Total must be a positive number.' })
    if (!booking.attractions?.length && !booking.homestays?.length)
      return res.status(400).json({ error: 'Booking must include attractions or a homestay.' })

    const reference = generateReference()

    // 1. Persist a PENDING booking first, so the webhook has a row to update.
    const saved = await createBooking({
      reference, customer, booking,
      totals: { total, subtotal, discountPercentage },
      currency, provider: provider.name, lang,
    })

    // 2. Ask the active provider to create the payment.
    const backendBaseUrl = `${req.protocol}://${req.get('host')}`
    const { url, providerReference, status } = await provider.createPayment({
      amount: Number(total),
      currency,
      reference,
      description: describe(booking),
      customer,
      successUrl: process.env.PAYMENT_SUCCESS_URL || 'http://localhost:5173/payment/success',
      failedUrl: process.env.PAYMENT_FAILED_URL || 'http://localhost:5173/payment/failed',
      webhookUrl: `${backendBaseUrl}/api/payments/webhook`,
      backendBaseUrl,
    })

    // 3. Remember the gateway's payment id on our booking row.
    if (providerReference) await attachPaymentReference(reference, providerReference)

    // 4. Fire the "booking received" email (non-blocking failures).
    sendBookingCreatedEmail(saved).catch((e) => console.error('[email] booking-created:', e.message))

    return res.json({ url, reference, providerReference, status })
  } catch (err) {
    next(err)
  }
}

// MOCK ONLY — simulates the gateway completing the payment, then redirects.
export async function mockComplete(req, res, next) {
  try {
    const { reference, payment_reference, redirect } = req.query
    if (!reference) return res.status(400).send('Missing reference')

    const updated = await updateBookingStatus({
      bookingReference: reference,
      status: 'paid',
      newPaymentReference: payment_reference,
    })

    const bookingRow = updated || (await getByReference(reference))
    if (bookingRow) {
      sendPaymentConfirmedEmail(bookingRow).catch((e) =>
        console.error('[email] payment-confirmed:', e.message))
    }

    const dest = redirect
      ? `${redirect}?reference=${encodeURIComponent(reference)}&status=paid`
      : '/'
    return res.redirect(302, dest)
  } catch (err) {
    next(err)
  }
}

export async function handleWebhook(req, res, next) {
  try {
    const result = provider.verifyWebhook(req)
    if (!result.valid) {
      console.warn('[webhook] invalid signature — ignoring')
      return res.status(400).end()
    }

    const updated = await updateBookingStatus({
      bookingReference: result.bookingReference,
      paymentReference: result.paymentReference,
      status: result.status,
      newPaymentReference: result.paymentReference,
    })

    // Send the confirmation email only on a fresh transition to "paid".
    if (result.status === 'paid' && updated) {
      sendPaymentConfirmedEmail(updated).catch((e) =>
        console.error('[email] payment-confirmed:', e.message))
    }

    console.log(`[webhook] ${result.bookingReference || result.paymentReference} → ${result.status}`)
    return res.status(200).end()
  } catch (err) {
    next(err)
  }
}
