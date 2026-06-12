// ────────────────────────────────────────────────────────────────────────────
// server.js — Express entrypoint (Render-ready).
//
// Local:
//   cd server && cp .env.example .env   # mock works with no extra keys
//   npm install && npm run dev
//
// Production (Render): set env vars in the dashboard; start command `npm start`.
// ────────────────────────────────────────────────────────────────────────────

import express from 'express'
import cors    from 'cors'

import { validateEnv, allowedOrigins } from './config/env.js'
import logger        from './middleware/logger.js'
import errorHandler  from './middleware/errorHandler.js'
import paymentsRouter from './routes/payments.js'
import aiRouter from './routes/ai.js'
import paymentProvider from './services/payments/paymentProvider.js'
import { isSupabaseReady } from './services/supabaseClient.js'
import emailProvider from './services/email/emailProvider.js'
import { isAiReady, providerName, modelName } from './services/ai/aiProvider.js'

const { provider, isProd } = validateEnv()

const app = express()
const PORT = process.env.PORT || 5000

app.set('trust proxy', 1) // Render/other proxies — correct req.protocol for redirects

// ── CORS (allow-list, supports multiple comma-separated origins) ──
const origins = allowedOrigins()
app.use(cors({
  origin(origin, cb) {
    // allow same-origin / curl / server-to-server (no Origin header)
    if (!origin || origins.includes(origin)) return cb(null, true)
    return cb(new Error(`CORS: origin ${origin} not allowed`))
  },
  methods: ['GET', 'POST'],
}))

// ── Body parsing — JSON for our API, urlencoded for HitPay's webhook ──
app.use(express.json({ limit: '256kb' }))
app.use(express.urlencoded({ extended: false, limit: '256kb' }))

app.use(logger)

// ── Health probe (Render health check → GET /health) ──
function health(_req, res) {
  res.json({
    status: 'ok',
    name: 'Kg Bolok Tourism API',
    uptime: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
    env: isProd ? 'production' : 'development',
    paymentProvider: paymentProvider.name,
    emailProvider: emailProvider.name,
    database: isSupabaseReady() ? 'connected' : 'disabled',
    ai: isAiReady() ? `enabled (${providerName}/${modelName})` : 'disabled',
  })
}
app.get('/health', health)
app.get('/api/health', health)

// ── Friendly root ──
app.get('/', (_req, res) => {
  res.json({
    name: 'Kg Bolok Tourism API',
    status: 'running',
    endpoints: {
      health:        'GET  /health',
      createPayment: 'POST /api/payments/create',
      webhook:       'POST /api/payments/webhook',
    },
  })
})

// ── Routes ──
app.use('/api/payments', paymentsRouter)
app.use('/api/ai', aiRouter)

// ── JSON 404 ──
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found', method: req.method, path: req.originalUrl })
})

// ── Unified error handler (last) ──
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`\n🌿  Kg Bolok backend on :${PORT}  [${isProd ? 'production' : 'development'}]`)
  console.log(`    payments: ${provider}  ·  db: ${isSupabaseReady() ? 'on' : 'off'}  ·  email: ${emailProvider.name}  ·  ai: ${isAiReady() ? 'on' : 'off'}`)
  console.log(`    CORS: ${origins.join(', ')}\n`)
})
