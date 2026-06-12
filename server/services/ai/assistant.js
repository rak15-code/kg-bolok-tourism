// ────────────────────────────────────────────────────────────────────────────
// services/ai/assistant.js
// ────────────────────────────────────────────────────────────────────────────
// The AI travel assistant. Answers visitor questions, grounded in the live
// knowledge base. Provider-agnostic: streams text via the active AI provider
// (Gemini or Claude). Returns an async generator of text chunks.
// ────────────────────────────────────────────────────────────────────────────

import aiProvider, { isAiReady } from './aiProvider.js'
import { buildKnowledgeBase } from './knowledge.js'

function systemPrompt(lang) {
  const bm = lang === 'bm'
  return `${buildKnowledgeBase(lang)}

You are the friendly AI travel assistant for Kampung Bolok Tourism. Help visitors plan their trip: recommend attractions and packages, explain prices, suggest itineraries, and answer questions about the village.

Rules:
- Only use facts from the knowledge base above. If you don't know, say so and suggest contacting the team.
- Be concise and warm. Use short paragraphs or bullet points.
- When relevant, mention the relevant attraction/package by name and its price, and gently suggest building a package or trying a featured package.
- ${bm ? 'Reply in Bahasa Melayu.' : 'Reply in English.'}
- Respond only with your final answer — do not include exploratory reasoning or meta-commentary.`
}

// messages: [{ role: 'user'|'assistant', content: string }]
export async function* streamChat({ messages = [], lang = 'en' }) {
  if (!isAiReady()) throw new Error('AI is not configured on the server.')

  // Keep only the last ~12 turns to bound cost/latency.
  const trimmed = messages
    .filter((m) => m && m.content && (m.role === 'user' || m.role === 'assistant'))
    .slice(-12)
    .map((m) => ({ role: m.role, content: String(m.content).slice(0, 4000) }))

  if (!trimmed.length || trimmed[0].role !== 'user') {
    throw new Error('Conversation must start with a user message.')
  }

  yield* aiProvider.streamText({
    system: systemPrompt(lang),
    messages: trimmed,
    maxTokens: 1024,
  })
}
