// ────────────────────────────────────────────────────────────────────────────
// services/ai/anthropicClient.js
// ────────────────────────────────────────────────────────────────────────────
// Server-side Anthropic (Claude) client. The API key is SECRET and stays here —
// the browser never talks to Anthropic directly (same rule as payments).
//
// Returns null when ANTHROPIC_API_KEY is absent, so the rest of the app can
// degrade gracefully (the AI features simply report "unavailable").
// ────────────────────────────────────────────────────────────────────────────

import Anthropic from '@anthropic-ai/sdk'

const apiKey = process.env.ANTHROPIC_API_KEY

// Default to the most capable model; override with ANTHROPIC_MODEL if desired.
export const AI_MODEL = process.env.ANTHROPIC_MODEL || 'claude-opus-4-8'

const client = apiKey ? new Anthropic({ apiKey }) : null

// Note: provider selection + readiness messaging is handled by aiProvider.js.
export const isAiReady = () => client !== null
export default client
