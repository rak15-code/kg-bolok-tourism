// ────────────────────────────────────────────────────────────────────────────
// services/payments/providers/hitpayProvider.js
// ────────────────────────────────────────────────────────────────────────────
// Real payment provider — HitPay. Implements the SAME contract as mockProvider,
// so switching is a one-line change with zero downstream impact.
//
//   createPayment(input) → { url, providerReference, status, raw }
//   verifyWebhook(req)   → { valid, bookingReference, paymentReference, status }
//
// All secrets (API key, salt) stay server-side, read from env. The frontend
// never talks to HitPay directly.
//
// Docs: https://hit-pay.com/docs.html
//   Sandbox base: https://api.sandbox.hit-pay.com/v1
//   Live base:    https://api.hit-pay.com/v1
// ────────────────────────────────────────────────────────────────────────────

import crypto from 'node:crypto'

const API_BASE = process.env.HITPAY_API_BASE || 'https://api.sandbox.hit-pay.com/v1'

const hitpayProvider = {
  name: 'hitpay',

  async createPayment({
    amount, currency = 'MYR', reference, description,
    customer = {}, successUrl, webhookUrl,
  }) {
    const apiKey = process.env.HITPAY_API_KEY
    if (!apiKey) throw new Error('HITPAY_API_KEY is not set — check server/.env')

    const body = new URLSearchParams()
    body.append('amount', Number(amount).toFixed(2))
    body.append('currency', currency)
    body.append('email', customer.email || '')
    body.append('name', customer.name || '')
    if (customer.phone) body.append('phone', customer.phone)
    body.append('purpose', description || 'Kg Bolok Tourism booking')
    body.append('reference_number', reference)
    if (successUrl) body.append('redirect_url', process.env.HITPAY_REDIRECT_URL || successUrl)
    const hook = process.env.HITPAY_WEBHOOK_URL || webhookUrl
    if (hook) body.append('webhook', hook)

    const res = await fetch(`${API_BASE}/payment-requests`, {
      method: 'POST',
      headers: {
        'X-BUSINESS-API-KEY': apiKey,
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    })

    if (!res.ok) {
      const text = await res.text().catch(() => '')
      throw new Error(`HitPay error ${res.status}: ${text || 'no detail'}`)
    }

    const json = await res.json()
    if (!json.url) throw new Error('HitPay response did not include a checkout url')

    return {
      url: json.url,
      providerReference: json.id,   // HitPay payment_request id
      status: json.status || 'pending',
      raw: json,
    }
  },

  // HitPay posts an x-www-form-urlencoded webhook containing an `hmac` field.
  // The HMAC is SHA-256 of the sorted "key+value" pairs (excluding hmac),
  // concatenated with no separators, keyed by your dashboard salt.
  verifyWebhook(req) {
    const salt = process.env.HITPAY_SALT
    const payload = { ...(req.body || {}) }
    const provided = payload.hmac
    delete payload.hmac

    let valid = false
    if (salt && provided) {
      const base = Object.keys(payload)
        .sort()
        .map((k) => `${k}${payload[k]}`)
        .join('')
      const expected = crypto.createHmac('sha256', salt).update(base).digest('hex')
      try {
        valid = crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(String(provided)))
      } catch {
        valid = false
      }
    }

    // HitPay status strings → our canonical statuses.
    const map = { completed: 'paid', failed: 'failed', pending: 'pending' }
    return {
      valid,
      bookingReference: payload.reference_number || null,
      paymentReference: payload.payment_request_id || payload.payment_id || null,
      status: map[payload.status] || 'pending',
    }
  },
}

export default hitpayProvider
