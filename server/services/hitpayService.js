// ────────────────────────────────────────────────────────────────────────────
// services/hitpayService.js
// ────────────────────────────────────────────────────────────────────────────
// All HitPay HTTP calls live in this file. Keeps secrets server-side.
//
// Docs:  https://hit-pay.com/docs.html
// Sandbox base: https://api.sandbox.hit-pay.com/v1
// Live base:    https://api.hit-pay.com/v1
// ────────────────────────────────────────────────────────────────────────────

import crypto from 'node:crypto'
import fetch  from 'node-fetch'

const {
  HITPAY_API_KEY,
  HITPAY_API_BASE = 'https://api.sandbox.hit-pay.com/v1',
  HITPAY_SALT,
  HITPAY_REDIRECT_URL,
  HITPAY_CANCEL_URL,
  HITPAY_WEBHOOK_URL,
} = process.env

/**
 * Creates a HitPay payment request.
 * Returns the checkout URL that the frontend should redirect the user to.
 */
export async function createHitPayRequest({
  amount, currency = 'MYR',
  email, name, phone,
  reference, description,
}) {
  if (!HITPAY_API_KEY) {
    throw new Error('HITPAY_API_KEY is not set — check server/.env')
  }

  // HitPay expects an x-www-form-urlencoded body.
  const body = new URLSearchParams()
  body.append('amount',       amount.toFixed(2))
  body.append('currency',     currency)
  body.append('email',        email)
  body.append('name',         name)
  if (phone)              body.append('phone', phone)
  body.append('purpose',      description)
  body.append('reference_number', reference)
  if (HITPAY_REDIRECT_URL) body.append('redirect_url', HITPAY_REDIRECT_URL)
  if (HITPAY_CANCEL_URL)   body.append('cancel_url',   HITPAY_CANCEL_URL)
  if (HITPAY_WEBHOOK_URL)  body.append('webhook',      HITPAY_WEBHOOK_URL)

  const res = await fetch(`${HITPAY_API_BASE}/payment-requests`, {
    method: 'POST',
    headers: {
      'X-BUSINESS-API-KEY': HITPAY_API_KEY,
      'X-Requested-With':   'XMLHttpRequest',
      'Content-Type':       'application/x-www-form-urlencoded',
    },
    body,
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`HitPay error ${res.status}: ${text || 'no detail'}`)
  }

  const json = await res.json()
  if (!json.url) {
    throw new Error('HitPay response did not include a checkout url')
  }
  return { url: json.url, id: json.id, raw: json }
}

/**
 * Verifies a webhook payload using the salt (HMAC-SHA256).
 * HitPay sends a header containing the HMAC of the request body using your
 * dashboard salt. If the recomputed HMAC matches, the payload is genuine.
 */
export function verifyHitPaySignature(payload, signatureFromHeader) {
  if (!HITPAY_SALT) return false
  if (!signatureFromHeader) return false

  // Body may arrive as a parsed object; recreate the deterministic string.
  const serialized = typeof payload === 'string'
    ? payload
    : JSON.stringify(payload)

  const expected = crypto
    .createHmac('sha256', HITPAY_SALT)
    .update(serialized)
    .digest('hex')

  return crypto.timingSafeEqual(
    Buffer.from(expected),
    Buffer.from(String(signatureFromHeader))
  )
}
