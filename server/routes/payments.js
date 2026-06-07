// ────────────────────────────────────────────────────────────────────────────
// routes/payments.js — express router mounted at /api/payments
// ────────────────────────────────────────────────────────────────────────────

import { Router } from 'express'
import { createPayment, handleWebhook } from '../controllers/paymentsController.js'

const router = Router()

// POST /api/payments/create
//   Body: { customer, booking, total, currency, lang }
//   → returns { url, reference }
router.post('/create', createPayment)

// POST /api/payments/webhook
//   HitPay calls this server-to-server when a payment is completed.
//   We verify the HMAC signature, then could persist to a DB, send email, etc.
router.post('/webhook', handleWebhook)

export default router
