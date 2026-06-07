// ────────────────────────────────────────────────────────────────────────────
// controllers/paymentsController.js
// ────────────────────────────────────────────────────────────────────────────
// Thin HTTP layer — validates input, delegates HitPay calls to hitpayService.
// ────────────────────────────────────────────────────────────────────────────

import crypto from 'node:crypto'
import { createHitPayRequest, verifyHitPaySignature } from '../services/hitpayService.js'

// Generates a short order reference shown to the user.
const newReference = () =>
  'KGB-' + Date.now().toString(36).toUpperCase() + '-' + crypto.randomBytes(3).toString('hex').toUpperCase()

export async function createPayment(req, res, next) {
  try {
    const { customer = {}, booking = {}, total, currency = 'MYR' } = req.body || {}

    // ── Minimal validation (boundary check; the frontend already enforces) ──
    if (!customer.name || !customer.email)
      return res.status(400).json({ error: 'Customer name and email are required.' })
    if (!total || Number(total) <= 0)
      return res.status(400).json({ error: 'Total must be a positive number.' })
    if (!Array.isArray(booking.attractions) && !Array.isArray(booking.homestays))
      return res.status(400).json({ error: 'Booking must include attractions or homestays.' })

    const reference = newReference()

    // Compose a human-friendly description for the HitPay checkout page.
    const lines = []
    if (booking.attractions?.length)
      lines.push(`${booking.attractions.length} attraction(s) × ${booking.visitors} pax`)
    if (booking.homestays?.length)
      lines.push(`${booking.homestays.length} homestay stay(s)`)
    const description = `Kg Bolok Tourism — ${lines.join(', ') || 'Custom package'}`

    const { url } = await createHitPayRequest({
      amount: Number(total),
      currency,
      email: customer.email,
      name:  customer.name,
      phone: customer.phone || '',
      reference,
      description,
    })

    // In a real deployment, persist {reference, customer, booking, total} to a DB
    // here so the webhook can update its status later. For now we return only.
    return res.json({ url, reference })
  } catch (err) {
    next(err)
  }
}

export async function handleWebhook(req, res, next) {
  try {
    const signature = req.headers['hitpay-signature']
    const isValid = verifyHitPaySignature(req.body, signature)

    if (!isValid) {
      console.warn('[webhook] invalid HitPay signature — ignoring payload')
      return res.status(400).end()
    }

    // TODO: update your DB / send a confirmation email here.
    console.log('[webhook] payment update:', req.body)
    return res.status(200).end()
  } catch (err) {
    next(err)
  }
}
