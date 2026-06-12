// ────────────────────────────────────────────────────────────────────────────
// email/templates/layout.js
// ────────────────────────────────────────────────────────────────────────────
// Reusable HTML shell shared by every email template, plus small helpers.
// Keeping the chrome here means individual templates only describe their body.
// ────────────────────────────────────────────────────────────────────────────

const BRAND = 'Kg Bolok Tourism'

// Minimal, email-client-safe currency formatting (MYR etc.).
export function money(amount, currency = 'MYR') {
  const n = Number(amount || 0)
  const symbols = { MYR: 'RM', USD: 'US$', SGD: 'S$', INR: '₹', EUR: '€' }
  const sym = symbols[currency] || currency + ' '
  return `${sym} ${n.toLocaleString('en-MY', { maximumFractionDigits: 2 })}`
}

export function escapeHtml(s = '') {
  return String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

// Wrap a body fragment in the branded shell. `accent` tints the header.
export function layout({ title, bodyHtml, accent = '#2f9e44' }) {
  return `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width">
<title>${escapeHtml(title)}</title></head>
<body style="margin:0;background:#0b1120;font-family:Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#e2e8f0;">
  <div style="max-width:560px;margin:0 auto;padding:24px;">
    <div style="background:linear-gradient(135deg,${accent},#1c7ed6);border-radius:18px 18px 0 0;padding:28px 28px 22px;">
      <div style="font-size:13px;letter-spacing:1px;text-transform:uppercase;color:rgba(255,255,255,.85);">${BRAND}</div>
      <div style="font-size:22px;font-weight:800;color:#fff;margin-top:6px;">${escapeHtml(title)}</div>
    </div>
    <div style="background:#111827;border:1px solid #1f2937;border-top:none;border-radius:0 0 18px 18px;padding:28px;">
      ${bodyHtml}
    </div>
    <p style="text-align:center;color:#64748b;font-size:12px;margin-top:18px;line-height:1.6;">
      ${BRAND} · Kg Bolok, Pahang, Malaysia<br/>
      This is an automated message — please do not reply directly.
    </p>
  </div>
</body></html>`
}

// Build the "what you booked" table rows from a booking record.
export function itemsTable(booking, lang = 'en') {
  const L = lang === 'bm'
  const rows = []

  for (const a of booking.selected_attractions || []) {
    rows.push(`<tr>
      <td style="padding:8px 0;border-bottom:1px solid #1f2937;">${escapeHtml(a.name || a.slug || '')}</td>
      <td style="padding:8px 0;border-bottom:1px solid #1f2937;text-align:right;color:#94a3b8;">
        ${money(a.price, booking.currency)}</td></tr>`)
  }

  const stays = Array.isArray(booking.selected_homestay)
    ? booking.selected_homestay
    : booking.selected_homestay ? [booking.selected_homestay] : []
  for (const h of stays) {
    const label = `${h.name || h.slug || ''}${h.roomName ? ' · ' + h.roomName : ''}${h.nights ? ' × ' + h.nights + (L ? ' malam' : ' nights') : ''}`
    rows.push(`<tr>
      <td style="padding:8px 0;border-bottom:1px solid #1f2937;">${escapeHtml(label)}</td>
      <td style="padding:8px 0;border-bottom:1px solid #1f2937;text-align:right;color:#94a3b8;">
        ${money((h.price || 0) * (h.nights || 1), booking.currency)}</td></tr>`)
  }

  if (!rows.length) rows.push(`<tr><td style="padding:8px 0;color:#94a3b8;">—</td><td></td></tr>`)
  return `<table style="width:100%;border-collapse:collapse;font-size:14px;">${rows.join('')}</table>`
}
