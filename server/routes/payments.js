// ────────────────────────────────────────────────────────────────────────────
// routes/payments.js — mounted at /api/payments
// ────────────────────────────────────────────────────────────────────────────

import { Router } from 'express'
import {
  createPayment, handleWebhook, mockComplete,
} from '../controllers/paymentsController.js'

const router = Router()

// POST /api/payments/create
//   Body: { customer, booking, total, subtotal, discountPercentage, currency, lang }
//   → { url, reference, providerReference, status }
router.post('/create', createPayment)

// GET /api/payments/mock/complete   (Mock provider only)
//   The fake gateway "finishes" the payment, then redirects to the success page.
router.get('/mock/complete', mockComplete)

// POST /api/payments/webhook
//   The gateway calls this server-to-server when a payment completes/fails.
//   We verify the signature, then update the booking + send confirmation email.
router.post('/webhook', handleWebhook)

export default router
