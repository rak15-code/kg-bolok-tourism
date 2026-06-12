// ────────────────────────────────────────────────────────────────────────────
// email/templates/paymentConfirmed.js
// ────────────────────────────────────────────────────────────────────────────
// Sent when payment_status transitions to "paid". Bilingual.
// ────────────────────────────────────────────────────────────────────────────

import { layout, itemsTable, money, escapeHtml } from './layout.js'

export default function paymentConfirmed(booking) {
  const bm = booking.lang === 'bm'

  const t = bm ? {
    subject: `Pembayaran disahkan — ${booking.booking_reference}`,
    title: 'Pembayaran Disahkan ✓',
    hi: `Hai ${booking.customer_name},`,
    intro: 'Pembayaran anda telah berjaya dan tempahan anda kini disahkan. Kami tidak sabar untuk menyambut anda di Kg Bolok!',
    refLabel: 'Rujukan tempahan',
    payRefLabel: 'Rujukan pembayaran',
    visitLabel: 'Tarikh lawatan',
    itemsLabel: 'Pengalaman anda',
    totalLabel: 'Jumlah dibayar',
    none: 'Tiada',
    footer: 'Pasukan kami akan menghubungi anda dengan butiran jadual perjalanan.',
  } : {
    subject: `Payment confirmed — ${booking.booking_reference}`,
    title: 'Payment Confirmed ✓',
    hi: `Hi ${booking.customer_name},`,
    intro: 'Your payment was successful and your booking is now confirmed. We can\'t wait to welcome you to Kg Bolok!',
    refLabel: 'Booking reference',
    payRefLabel: 'Payment reference',
    visitLabel: 'Visit date',
    itemsLabel: 'Your experiences',
    totalLabel: 'Total paid',
    none: 'None',
    footer: 'Our team will reach out with your itinerary details.',
  }

  const bodyHtml = `
    <p style="margin:0 0 14px;font-size:15px;">${escapeHtml(t.hi)}</p>
    <p style="margin:0 0 20px;color:#cbd5e1;line-height:1.6;">${escapeHtml(t.intro)}</p>

    <div style="background:#0b1120;border:1px solid #14532d;border-radius:12px;padding:14px 16px;margin-bottom:18px;">
      <div style="font-size:12px;color:#94a3b8;text-transform:uppercase;letter-spacing:.5px;">${t.refLabel}</div>
      <div style="font-size:18px;font-weight:800;color:#fff;font-family:monospace;">${escapeHtml(booking.booking_reference)}</div>
      ${booking.payment_reference ? `<div style="font-size:12px;color:#64748b;margin-top:6px;">${t.payRefLabel}: ${escapeHtml(booking.payment_reference)}</div>` : ''}
    </div>

    <div style="font-size:12px;color:#94a3b8;text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px;">${t.itemsLabel}</div>
    ${itemsTable(booking, booking.lang)}

    <div style="display:flex;justify-content:space-between;margin-top:14px;font-size:18px;font-weight:800;color:#4ade80;">
      <span>${t.totalLabel}</span><span>${money(booking.total_amount, booking.currency)}</span>
    </div>

    <hr style="border:none;border-top:1px solid #1f2937;margin:20px 0;"/>
    <div style="font-size:13px;color:#cbd5e1;line-height:1.7;">
      <strong style="color:#fff;">${t.visitLabel}:</strong> ${escapeHtml(booking.visit_date || t.none)}<br/>
      ${escapeHtml(t.footer)}
    </div>`

  const text =
    `${t.hi}\n${t.intro}\n\n${t.refLabel}: ${booking.booking_reference}\n` +
    `${t.totalLabel}: ${money(booking.total_amount, booking.currency)}`

  return { subject: t.subject, html: layout({ title: t.title, bodyHtml, accent: '#16a34a' }), text }
}
