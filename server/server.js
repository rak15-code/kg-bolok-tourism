// ────────────────────────────────────────────────────────────────────────────
// server.js — Express entrypoint.
//
// Run locally:
//   1) cd server && cp .env.example .env  (fill in HitPay sandbox keys)
//   2) npm install
//   3) npm run dev      (auto-reload) or  npm start
//
// The frontend reads VITE_API_BASE_URL from its own .env to know where to talk.
// ────────────────────────────────────────────────────────────────────────────

import express from 'express'
import cors    from 'cors'
import dotenv  from 'dotenv'

import paymentsRouter from './routes/payments.js'
import errorHandler   from './middleware/errorHandler.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Lock CORS to the dev frontend by default; widen for production via env.
app.use(cors({
  origin: process.env.ALLOWED_ORIGIN || 'http://localhost:5173',
  methods: ['GET', 'POST'],
}))

app.use(express.json({ limit: '256kb' }))

// Friendly root — confirms the API is up if you hit it in a browser.
app.get('/', (_req, res) => {
  res.json({
    name: 'Kg Bolok Tourism API',
    status: 'running',
    note: 'This is a JSON API, not a website. The website runs on Vite (default :5173).',
    endpoints: {
      health:           'GET  /api/health',
      createPayment:    'POST /api/payments/create',
      hitpayWebhook:    'POST /api/payments/webhook',
    },
  })
})

// Health probe
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, name: 'Kg Bolok Tourism API', ts: Date.now() })
})

// Mount payment routes
app.use('/api/payments', paymentsRouter)

// JSON 404 for any unknown path (instead of the default "Cannot GET /...")
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    method: req.method,
    path: req.originalUrl,
  })
})

// Unified error handler (last)
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`\n🌿  Kg Bolok backend running on http://localhost:${PORT}`)
  console.log(`    CORS origin: ${process.env.ALLOWED_ORIGIN || 'http://localhost:5173'}`)
  console.log(`    HitPay base: ${process.env.HITPAY_API_BASE || '(unset — using sandbox default)'}\n`)
})
