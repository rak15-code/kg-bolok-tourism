// ────────────────────────────────────────────────────────────────────────────
// email/providers/logProvider.js
// ────────────────────────────────────────────────────────────────────────────
// A no-op email provider that just logs to the console. Used when
// EMAIL_PROVIDER=log (or when no Resend key is set), so the whole booking flow
// works in dev without sending real email. Same contract as resendProvider.
// ────────────────────────────────────────────────────────────────────────────

const logProvider = {
  name: 'log',
  async send({ to, subject }) {
    console.log(`[email:log] would send "${subject}" → ${to}`)
    return { id: 'log-' + Date.now().toString(36) }
  },
}

export default logProvider
