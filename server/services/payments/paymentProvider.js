// ════════════════════════════════════════════════════════════════════════════
// services/payments/paymentProvider.js
// ════════════════════════════════════════════════════════════════════════════
// The Adapter Pattern entry point. The rest of the app imports the ACTIVE
// payment provider from here and never cares which concrete gateway it is —
// both expose the identical contract:
//
//     name
//     createPayment(input) → { url, providerReference, status, raw }
//     verifyWebhook(req)   → { valid, bookingReference, paymentReference, status }
//
// ┌──────────────────────────────────────────────────────────────────────────┐
// │  TO SWITCH PROVIDERS — change ONE line below.                             │
// │  Comment out the Mock import and uncomment the HitPay import (or set      │
// │  PAYMENT_PROVIDER=hitpay in the environment, which wins if present).      │
// └──────────────────────────────────────────────────────────────────────────┘

import mockProvider   from './providers/mockProvider.js'
import hitpayProvider from './providers/hitpayProvider.js'

// 👇 The single switch. Default: Mock.
//    For production, replace this line with:  const active = hitpayProvider
const active =
  process.env.PAYMENT_PROVIDER === 'hitpay' ? hitpayProvider : mockProvider

console.log(`[payments] active provider: ${active.name}`)

export default active
