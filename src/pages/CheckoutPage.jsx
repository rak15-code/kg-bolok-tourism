// ────────────────────────────────────────────────────────────────────────────
// CheckoutPage.jsx — /checkout
// Collects the user's contact details and calls our backend to create a HitPay
// payment request. On success, the browser is redirected to HitPay's checkout
// URL. The success/cancel return URLs are configured on the backend.
// ────────────────────────────────────────────────────────────────────────────

import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ShieldCheck, ArrowLeft, Loader2, AlertTriangle, Lock,
} from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import { useBuilder } from '../context/BuilderContext'
import { useCurrency } from '../context/CurrencyContext'
import { calculateTotal } from '../utils/pricing'
import { createPayment } from '../services/paymentService'
import MotionHeading from '../components/ui/MotionHeading'

export default function CheckoutPage() {
  const { t, lang } = useLanguage()
  const p = t.payment
  const navigate = useNavigate()
  const { attractions, homestays, visitors, days } = useBuilder()
  const { format } = useCurrency()
  const totals = calculateTotal({ attractions, homestays, visitors })

  const [form, setForm] = useState({
    name: '', email: '', phone: '', startDate: '', request: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const empty = attractions.length === 0 && homestays.length === 0

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const payload = {
        customer: form,
        booking: {
          attractions: attractions.map((a) => ({
            id: a.id, slug: a.slug, name: a.en.name, price: a.price,
          })),
          homestays: homestays.map((h) => ({
            slug: h.homestay.slug,
            name: h.homestay.en.name,
            roomKey: h.room.key,
            roomName: h.room.en.name,
            price: h.room.price,
            nights: h.nights,
          })),
          visitors, days,
          startDate: form.startDate,
          request: form.request,
        },
        total: totals.total,
        currency: 'MYR',
        lang,
      }
      const { url } = await createPayment(payload)
      window.location.assign(url)
    } catch (err) {
      setError(err.message || 'Unknown error')
      setLoading(false)
    }
  }

  if (empty) {
    return (
      <section className="pt-32 pb-24 px-4 text-center min-h-[60vh]">
        <h1 className="section-heading">{t.builder.empty}</h1>
        <p className="section-subheading mb-6">{t.builder.emptyHint}</p>
        <Link to="/builder" className="btn-primary">
          <ArrowLeft size={15} /> {t.builder.heading}
        </Link>
      </section>
    )
  }

  return (
    <section className="relative pt-32 pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <Link
          to="/builder"
          className="inline-flex items-center gap-2 text-sm font-semibold text-white/70
                     hover:text-forest-300 transition-colors mb-6"
        >
          <ArrowLeft size={15} /> {t.builder.heading}
        </Link>

        <div className="text-center mb-10">
          <MotionHeading>
            <h1 className="section-heading">{p.heading}</h1>
          </MotionHeading>
          <MotionHeading delay={0.1}>
            <div className="accent-divider mb-5" />
          </MotionHeading>
          <MotionHeading delay={0.15}>
            <p className="section-subheading inline-flex items-center justify-center gap-2">
              <ShieldCheck size={15} className="text-forest-300" />
              {p.subheading}
            </p>
          </MotionHeading>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">

          {/* CONTACT FORM */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-3 card p-7 space-y-5"
          >
            <h2 className="text-white font-bold text-lg mb-2">{p.contactTitle}</h2>

            <div>
              <label className="label">{p.labelName}</label>
              <input
                name="name" required value={form.name} onChange={handleChange}
                placeholder={p.placeholderName} className="input-field"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label">{p.labelEmail}</label>
                <input
                  type="email" name="email" required value={form.email} onChange={handleChange}
                  placeholder={p.placeholderEmail} className="input-field"
                />
              </div>
              <div>
                <label className="label">{p.labelPhone}</label>
                <input
                  type="tel" name="phone" required value={form.phone} onChange={handleChange}
                  placeholder={p.placeholderPhone} className="input-field"
                />
              </div>
            </div>

            <div>
              <label className="label">{p.labelDate}</label>
              <input
                type="date" name="startDate" required value={form.startDate} onChange={handleChange}
                className="input-field"
              />
            </div>

            <div>
              <label className="label">{p.labelRequest}</label>
              <textarea
                name="request" rows={3} value={form.request} onChange={handleChange}
                placeholder={p.placeholderRequest} className="input-field resize-none"
              />
            </div>

            {error && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-400/40
                              text-red-200 text-sm">
                <AlertTriangle size={15} className="shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">{p.errorTitle}</p>
                  <p className="text-red-200/80 text-xs">{error}</p>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-forest-500 to-ocean-500
                         text-white font-bold transition-all duration-200
                         flex items-center justify-center gap-2 shadow-lg shadow-ocean-900/30
                         active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading
                ? <><Loader2 size={17} className="animate-spin" />{p.processing}</>
                : <><Lock size={15} />{p.payBtn} — {format(totals.total)}</>
              }
            </button>

            <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <ShieldCheck size={11} /> {p.poweredBy}
            </p>
          </motion.form>

          {/* SUMMARY */}
          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <div className="card-glass p-6 sticky top-28">
              <h2 className="text-white font-bold text-lg mb-4">{p.orderTitle}</h2>

              {attractions.length > 0 && (
                <div className="mb-4">
                  <p className="text-[10px] uppercase tracking-wider text-forest-300 font-bold mb-2">
                    {t.attractions.sectionBadge}
                  </p>
                  <ul className="space-y-1.5">
                    {attractions.map((a) => (
                      <li key={a.id} className="flex justify-between text-sm text-slate-200">
                        <span className="truncate pr-2">{a[lang].name} × {visitors}</span>
                        <span className="shrink-0">{format(a.price * visitors)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {homestays.length > 0 && (
                <div className="mb-4">
                  <p className="text-[10px] uppercase tracking-wider text-forest-300 font-bold mb-2">
                    {t.homestays.sectionBadge}
                  </p>
                  <ul className="space-y-1.5">
                    {homestays.map(({ homestay, room, nights }) => (
                      <li key={homestay.slug} className="flex justify-between text-sm text-slate-200">
                        <span className="truncate pr-2">
                          {homestay[lang].name} · {room[lang].name} × {nights}
                        </span>
                        <span className="shrink-0">{format(room.price * nights)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="border-t border-white/10 pt-3 space-y-1.5 text-sm">
                <div className="flex justify-between text-slate-300">
                  <span>{t.builder.subtotal}</span>
                  <span>{format(totals.subtotal)}</span>
                </div>
                {totals.discountAmount > 0 && (
                  <div className="flex justify-between text-forest-300">
                    <span>{t.builder.discount} ({Math.round(totals.discountTier.rate * 100)}%)</span>
                    <span>- {format(totals.discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between items-baseline pt-3 mt-2 border-t border-white/10">
                  <span className="text-white/70">{t.builder.total}</span>
                  <span className="text-2xl font-black gradient-text">{format(totals.total)}</span>
                </div>
              </div>
            </div>
          </motion.aside>
        </div>
      </div>
    </section>
  )
}
