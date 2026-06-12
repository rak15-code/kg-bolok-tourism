// ────────────────────────────────────────────────────────────────────────────
// email/templates/bookingCreated.js
// ────────────────────────────────────────────────────────────────────────────
// Sent immediately when a booking is created (payment still pending).
// Bilingual: picks EN or BM from booking.lang. Returns { subject, html, text }.
// ────────────────────────────────────────────────────────────────────────────

import { layout, itemsTable, money, escapeHtml } from './layout.js'

export default function bookingCreated(booking) {
  const bm = booking.lang === 'bm'

  const t = bm ? {
    subject: `Tempahan diterima — ${booking.booking_reference}`,
    title: 'Tempahan Diterima',
    hi: `Hai ${booking.customer_name},`,
    intro: 'Terima kasih! Kami telah menerima tempahan anda. Bayaran sedang diproses — anda akan menerima e-mel pengesahan sebaik sahaja pembayaran selesai.',
    refLabel: 'Rujukan tempahan',
    visitLabel: 'Tarikh lawatan',
    itemsLabel: 'Pengalaman dipilih',
    totalLabel: 'Jumlah',
    contactLabel: 'Maklumat hubungan',
    none: 'Tiada',
  } : {
    subject: `Booking received — ${booking.booking_reference}`,
    title: 'Booking Received',
    hi: `Hi ${booking.customer_name},`,
    intro: 'Thank you! We have received your booking. Your payment is being processed — you will get a confirmation email as soon as it completes.',
    refLabel: 'Booking reference',
    visitLabel: 'Visit date',
    itemsLabel: 'Selected experiences',
    totalLabel: 'Total',
    contactLabel: 'Contact details',
    none: 'None',
  }

  const bodyHtml = `
    <p style="margin:0 0 14px;font-size:15px;">${escapeHtml(t.hi)}</p>
    <p style="margin:0 0 20px;color:#cbd5e1;line-height:1.6;">${escapeHtml(t.intro)}</p>

    <div style="background:#0b1120;border:1px solid #1f2937;border-radius:12px;padding:14px 16px;margin-bottom:18px;">
      <div style="font-size:12px;color:#94a3b8;text-transform:uppercase;letter-spacing:.5px;">${t.refLabel}</div>
      <div style="font-size:18px;font-weight:800;color:#fff;font-family:monospace;">${escapeHtml(booking.booking_reference)}</div>
    </div>

    <div style="font-size:12px;color:#94a3b8;text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px;">${t.itemsLabel}</div>
    ${itemsTable(booking, booking.lang)}

    <div style="display:flex;justify-content:space-between;margin-top:14px;font-size:18px;font-weight:800;color:#fff;">
      <span>${t.totalLabel}</span><span>${money(booking.total_amount, booking.currency)}</span>
    </div>

    <hr style="border:none;border-top:1px solid #1f2937;margin:20px 0;"/>
    <div style="font-size:13px;color:#cbd5e1;line-height:1.7;">
      <strong style="color:#fff;">${t.visitLabel}:</strong> ${escapeHtml(booking.visit_date || t.none)}<br/>
      <strong style="color:#fff;">${t.contactLabel}:</strong> ${escapeHtml(booking.customer_email)}${booking.customer_phone ? ' · ' + escapeHtml(booking.customer_phone) : ''}
    </div>`

  const text =
    `${t.hi}\n${t.intro}\n\n${t.refLabel}: ${booking.booking_reference}\n` +
    `${t.totalLabel}: ${money(booking.total_amount, booking.currency)}\n` +
    `${t.visitLabel}: ${booking.visit_date || t.none}`

  return { subject: t.subject, html: layout({ title: t.title, bodyHtml }), text }
}
