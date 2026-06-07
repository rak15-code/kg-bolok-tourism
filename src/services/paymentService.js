// ────────────────────────────────────────────────────────────────────────────
// paymentService.js  (FRONTEND)
// ────────────────────────────────────────────────────────────────────────────
// Talks to our own backend (server/), which in turn talks to HitPay.
// We NEVER call HitPay directly from the browser — that would leak the API key.
//
// Backend URL is read from the Vite env var `VITE_API_BASE_URL`.
// In development, set it in `.env` at the project root:
//   VITE_API_BASE_URL=http://localhost:5000
// ────────────────────────────────────────────────────────────────────────────

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

// Send the booking + total to backend; receive back HitPay's checkout URL.
//
// payload shape:
//   {
//     customer: { name, email, phone },
//     booking:  {
//       attractions: [{ id, name, price }],
//       homestays:   [{ slug, room, nights }],
//       visitors, days, startDate, request,
//     },
//     total: number  // in RM
//   }
//
// Returns: { url: '<HitPay checkout url>', reference: '<our order id>' }
export async function createPayment(payload) {
  const res = await fetch(`${API_BASE}/api/payments/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Payment service responded ${res.status}: ${text || 'no detail'}`)
  }

  const data = await res.json()
  if (!data?.url) throw new Error('Payment service did not return a checkout url')
  return data
}
