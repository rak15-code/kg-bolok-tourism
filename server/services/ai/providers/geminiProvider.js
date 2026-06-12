// ────────────────────────────────────────────────────────────────────────────
// services/ai/providers/geminiProvider.js
// ────────────────────────────────────────────────────────────────────────────
// Google Gemini implementation of the AI provider contract:
//   name, model, ready(), streamText({ system, messages, maxTokens }) → async
//   generator yielding text chunks.
//
// The API key is SECRET and stays server-side. Returns ready()=false when the
// key is absent, so AI degrades gracefully.
// ────────────────────────────────────────────────────────────────────────────

import { GoogleGenAI } from '@google/genai'

const apiKey = process.env.GEMINI_API_KEY
const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash'
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null

const geminiProvider = {
  name: 'gemini',
  model,
  ready: () => ai !== null,

  async *streamText({ system, messages, maxTokens }) {
    // Gemini roles are 'user' | 'model'; system goes in systemInstruction.
    const contents = messages.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: String(m.content) }],
    }))

    const stream = await ai.models.generateContentStream({
      model,
      contents,
      config: { systemInstruction: system, maxOutputTokens: maxTokens },
    })

    for await (const chunk of stream) {
      // `.text` is a getter in @google/genai; guard for the older fn form too.
      const t = typeof chunk.text === 'function' ? chunk.text() : chunk.text
      if (t) yield t
    }
  },
}

export default geminiProvider
