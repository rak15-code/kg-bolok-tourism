// ────────────────────────────────────────────────────────────────────────────
// config/env.js — environment validation & summary (Render-ready).
// ────────────────────────────────────────────────────────────────────────────
// Validates the env on boot. HARD-FAILS only on misconfigurations that would
// silently break payments in production (e.g. HitPay selected but no key).
// Everything optional is reported as a warning so dev keeps working.
// ────────────────────────────────────────────────────────────────────────────

import 'dotenv/config'

export function validateEnv() {
  const provider = process.env.PAYMENT_PROVIDER || 'mock'
  const isProd = process.env.NODE_ENV === 'production'
  const errors = []
  const warnings = []

  // Payments
  if (provider === 'hitpay') {
    if (!process.env.HITPAY_API_KEY) errors.push('HITPAY_API_KEY is required when PAYMENT_PROVIDER=hitpay')
    if (!process.env.HITPAY_SALT) warnings.push('HITPAY_SALT not set — webhook signatures cannot be verified')
    if (!process.env.HITPAY_WEBHOOK_URL) warnings.push('HITPAY_WEBHOOK_URL not set — bookings won\'t auto-update on payment')
  }

  // Supabase (persistence)
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const msg = 'Supabase not configured (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY) — bookings will NOT be saved'
    if (isProd) errors.push(msg)
    else warnings.push(msg)
  }

  // Email
  if ((process.env.EMAIL_PROVIDER || 'resend') === 'resend' && !process.env.RESEND_API_KEY) {
    warnings.push('RESEND_API_KEY not set — emails fall back to console logging')
  }

  // AI (assistant + virtual tour)
  const aiProvider = process.env.AI_PROVIDER || 'gemini'
  if (aiProvider === 'gemini' && !process.env.GEMINI_API_KEY) {
    warnings.push('GEMINI_API_KEY not set — AI assistant & virtual tour are disabled')
  }
  if (aiProvider === 'anthropic' && !process.env.ANTHROPIC_API_KEY) {
    warnings.push('ANTHROPIC_API_KEY not set — AI assistant & virtual tour are disabled')
  }

  // CORS in production
  if (isProd && !process.env.ALLOWED_ORIGIN) {
    warnings.push('ALLOWED_ORIGIN not set in production — CORS will reject browser requests')
  }

  warnings.forEach((w) => console.warn(`⚠️  ${w}`))
  if (errors.length) {
    errors.forEach((e) => console.error(`❌ ${e}`))
    throw new Error('Environment validation failed — see errors above.')
  }

  return { provider, isProd }
}

// Parse the comma-separated ALLOWED_ORIGIN list into an array for CORS.
export function allowedOrigins() {
  return (process.env.ALLOWED_ORIGIN || 'http://localhost:5173')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}
