// ════════════════════════════════════════════════════════════════════════════
// services/ai/aiProvider.js
// ════════════════════════════════════════════════════════════════════════════
// Adapter selector for the AI provider (same pattern as payments/email).
// Both providers expose: name, model, ready(), streamText({system,messages,maxTokens}).
//
// Switch with AI_PROVIDER=gemini | anthropic (default: gemini).
// ════════════════════════════════════════════════════════════════════════════

import gemini    from './providers/geminiProvider.js'
import anthropic from './providers/anthropicProvider.js'

const active = process.env.AI_PROVIDER === 'anthropic' ? anthropic : gemini

console.log(`[ai] active provider: ${active.name} (${active.model})${active.ready() ? '' : ' — DISABLED (no API key)'}`)

export const isAiReady = () => active.ready()
export const providerName = active.name
export const modelName = active.model
export default active
