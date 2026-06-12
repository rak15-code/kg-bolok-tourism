// ────────────────────────────────────────────────────────────────────────────
// email/providers/resendProvider.js
// ────────────────────────────────────────────────────────────────────────────
// Sends real email via Resend (https://resend.com). Implements the email
// provider contract:  send({ to, subject, html, text }) → { id }
// ────────────────────────────────────────────────────────────────────────────

import { Resend } from 'resend'

let client = null
function getClient() {
  if (!client) {
    const key = process.env.RESEND_API_KEY
    if (!key) throw new Error('RESEND_API_KEY is not set — check server/.env')
    client = new Resend(key)
  }
  return client
}

const resendProvider = {
  name: 'resend',
  async send({ to, subject, html, text }) {
    const { data, error } = await getClient().emails.send({
      from: process.env.EMAIL_FROM || 'Kg Bolok Tourism <onboarding@resend.dev>',
      to: [to],
      subject,
      html,
      text,
      ...(process.env.EMAIL_REPLY_TO ? { reply_to: process.env.EMAIL_REPLY_TO } : {}),
    })
    if (error) throw new Error(error.message || 'Resend send failed')
    return { id: data?.id }
  },
}

export default resendProvider
