// ════════════════════════════════════════════════════════════════════════════
// email/emailProvider.js
// ════════════════════════════════════════════════════════════════════════════
// Adapter selector for email — same pattern as paymentProvider.js.
// Both providers expose:  send({ to, subject, html, text }) → { id }
//
// Defaults to Resend, but falls back to the log provider automatically when no
// RESEND_API_KEY is present, so dev never crashes on a missing key.
// ════════════════════════════════════════════════════════════════════════════

import resendProvider from './providers/resendProvider.js'
import logProvider    from './providers/logProvider.js'

const wantResend =
  (process.env.EMAIL_PROVIDER || 'resend') === 'resend' && !!process.env.RESEND_API_KEY

const active = wantResend ? resendProvider : logProvider

if (!wantResend && (process.env.EMAIL_PROVIDER || 'resend') === 'resend') {
  console.warn('[email] RESEND_API_KEY missing — falling back to log provider.')
}
console.log(`[email] active provider: ${active.name}`)

export default active
