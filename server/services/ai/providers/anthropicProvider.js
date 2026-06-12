// ────────────────────────────────────────────────────────────────────────────
// services/ai/providers/anthropicProvider.js
// ────────────────────────────────────────────────────────────────────────────
// Claude implementation of the AI provider contract (kept available so you can
// switch back by setting AI_PROVIDER=anthropic). Same interface as Gemini.
// ────────────────────────────────────────────────────────────────────────────

import client, { AI_MODEL, isAiReady } from '../anthropicClient.js'

const anthropicProvider = {
  name: 'anthropic',
  model: AI_MODEL,
  ready: () => isAiReady(),

  async *streamText({ system, messages, maxTokens }) {
    const stream = client.messages.stream({
      model: AI_MODEL,
      max_tokens: maxTokens,
      thinking: { type: 'disabled' },
      system,
      messages: messages.map((m) => ({ role: m.role, content: String(m.content) })),
    })
    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta?.type === 'text_delta') {
        yield event.delta.text
      }
    }
  },
}

export default anthropicProvider
