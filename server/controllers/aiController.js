// ────────────────────────────────────────────────────────────────────────────
// controllers/aiController.js
// ────────────────────────────────────────────────────────────────────────────
// HTTP layer for the AI features. Streams the model's text back to the browser
// as it's generated (chunked text/plain), so the UI renders progressively.
// Provider-agnostic: consumes an async generator of text chunks.
// ────────────────────────────────────────────────────────────────────────────

import { isAiReady } from '../services/ai/aiProvider.js'
import { streamChat } from '../services/ai/assistant.js'

// Pipe an async generator of text chunks to the HTTP response.
async function pipeStream(makeGenerator, res, next) {
  if (!isAiReady()) {
    return res.status(503).json({ error: 'AI is not configured on the server.' })
  }
  try {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8')
    res.setHeader('Cache-Control', 'no-cache, no-transform')
    res.setHeader('X-Accel-Buffering', 'no') // disable proxy buffering (nginx/Render)

    for await (const chunk of makeGenerator()) {
      res.write(chunk)
    }
    res.end()
  } catch (err) {
    console.error('[ai] stream error:', err.message)
    if (!res.headersSent) return next(err)
    res.end()
  }
}

// POST /api/ai/chat   { messages: [{role,content}], lang }
export function chat(req, res, next) {
  const { messages = [], lang = 'en' } = req.body || {}
  return pipeStream(() => streamChat({ messages, lang }), res, next)
}
