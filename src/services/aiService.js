// ────────────────────────────────────────────────────────────────────────────
// aiService.js  (FRONTEND)
// ────────────────────────────────────────────────────────────────────────────
// Talks to our own backend AI endpoints, which proxy Claude. The browser never
// holds the Anthropic key. Responses are streamed as chunked text/plain; we
// decode and surface each delta via an onDelta callback.
// ────────────────────────────────────────────────────────────────────────────

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

async function streamPost(path, body, onDelta, signal) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal,
  })

  if (!res.ok) {
    // Errors come back as JSON (e.g. 503 when AI isn't configured).
    let msg = `Request failed (${res.status})`
    try { const j = await res.json(); msg = j.error || msg } catch { /* ignore */ }
    throw new Error(msg)
  }

  if (!res.body) {
    // No streaming support — fall back to a single text read.
    const text = await res.text()
    onDelta?.(text)
    return text
  }

  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let full = ''
  while (true) {
    const { value, done } = await reader.read()
    if (done) break
    const chunk = decoder.decode(value, { stream: true })
    if (chunk) { full += chunk; onDelta?.(chunk) }
  }
  full += decoder.decode() // flush any trailing multibyte
  return full
}

// messages: [{ role: 'user'|'assistant', content }]
export function streamChat({ messages, lang }, onDelta, signal) {
  return streamPost('/api/ai/chat', { messages, lang }, onDelta, signal)
}
