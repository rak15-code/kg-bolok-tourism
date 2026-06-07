// ────────────────────────────────────────────────────────────────────────────
// PackageBuilderPage.jsx — /builder
//
// • Attractions are REQUIRED.
// • Homestay is OPTIONAL — there's an explicit "No homestay needed" choice.
// • Discount applies to the attraction count only (3 → 15%, 5 → 20%, 7 → 25%).
// • All prices respect the active currency selection.
// • Includes an info box for tour guide / transport / education / audience.
// ────────────────────────────────────────────────────────────────────────────

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles, Plus, Trash2, Users, CalendarDays, ArrowRight, Compass, Home,
  CheckCircle2, BadgePercent, Info, Bus, GraduationCap, UserCheck, X,
} from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import { useBuilder } from '../context/BuilderContext'
import { useCurrency } from '../context/CurrencyContext'
import MotionHeading from '../components/ui/MotionHeading'
import {
  calculateTotal, DISCOUNT_TIERS, getDiscountTier,
} from '../utils/pricing'

export default function PackageBuilderPage() {
  const { t, lang } = useLanguage()
  const b = t.builder
  const navigate = useNavigate()
  const { format } = useCurrency()
  const {
    attractions, homestays, visitors, days,
    setVisitors, setDays, removeAttraction, removeHomestay,
    setHomestayNights, clear,
  } = useBuilder()

  // Local UI state — has the user explicitly chosen to skip homestay?
  // (Persists for the current session.)
  const [skipHomestay, setSkipHomestay] = useState(() => homestays.length === 0)

  const totals = calculateTotal({ attractions, homestays, visitors })
  const tier = getDiscountTier(attractions.length)

  // figure out the NEXT tier (for the "add N more for X% off" hint)
  const nextTier = DISCOUNT_TIERS.find((dt) => dt.min > attractions.length)
  const tierProgressLabel = nextTier
    ? b.tierProgress1
        .replace('{n}', nextTier.min - attractions.length)
        .replace('{pct}', Math.round(nextTier.rate * 100))
    : b.tierProgressMax

  // Empty = no attractions. (Homestay alone shouldn't be allowed.)
  const empty = attractions.length === 0

  return (
    <section className="relative pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-12">
          <MotionHeading>
            <span className="section-badge">
              <Sparkles size={14} />
              {b.sectionBadge}
            </span>
          </MotionHeading>
          <MotionHeading delay={0.1}>
            <h1 className="section-heading">{b.heading}</h1>
          </MotionHeading>
          <MotionHeading delay={0.15}>
            <div className="accent-divider mb-6" />
          </MotionHeading>
          <MotionHeading delay={0.2}>
            <p className="section-subheading">{b.subheading}</p>
          </MotionHeading>
        </div>

        {/* Includes info box */}
        <MotionHeading delay={0.2}>
          <div className="mb-8 p-5 rounded-2xl card border-forest-400/30
                          bg-gradient-to-br from-forest-500/10 to-ocean-500/10">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-forest-500 to-ocean-500
                              flex items-center justify-center shrink-0">
                <Info size={18} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="text-white font-bold mb-1">{b.includesTitle}</p>
                <p className="text-sm text-slate-200/85 leading-relaxed">{b.includesInfo}</p>
                <div className="mt-3 grid sm:grid-cols-2 gap-2 text-[13px] text-slate-200">
                  <Bullet icon={UserCheck}     text={b.includesGuide} />
                  <Bullet icon={Bus}           text={b.includesTransport} />
                  <Bullet icon={GraduationCap} text={b.includesEducation} />
                  <Bullet icon={Users}         text={b.includesAudience} />
                </div>
              </div>
            </div>
          </div>
        </MotionHeading>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* ─────────── LEFT (2/3): SELECTIONS ─────────── */}
          <div className="lg:col-span-2 space-y-8">

            {/* STEP 1 — attractions (required) */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white font-bold text-lg">{b.step1}</h2>
                <Link to="/attractions" className="btn-soft">
                  <Compass size={13} /> {b.browseAttractions}
                </Link>
              </div>

              {attractions.length === 0 ? (
                <EmptyHint icon={Compass} text={b.noAttractions} />
              ) : (
                <div className="space-y-2">
                  <AnimatePresence>
                    {attractions.map((a) => {
                      const d = a[lang]
                      return (
                        <motion.div
                          key={a.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/10"
                        >
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${a.gradient}
                                          flex items-center justify-center text-2xl shrink-0`}>
                            {a.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-semibold truncate">{d.name}</p>
                            <p className="text-xs text-slate-400">
                              {format(a.price)} × {visitors} = {format(a.price * visitors)}
                            </p>
                          </div>
                          <button
                            onClick={() => removeAttraction(a.id)}
                            className="p-2 rounded-lg text-slate-400 hover:text-red-400
                                       hover:bg-red-500/10 transition-colors"
                            aria-label={b.remove}
                          >
                            <Trash2 size={16} />
                          </button>
                        </motion.div>
                      )
                    })}
                  </AnimatePresence>
                </div>
              )}

              {/* Discount tier indicator */}
              <div className="mt-5 p-4 rounded-2xl bg-gradient-to-br from-forest-500/15 to-ocean-500/15
                              border border-forest-400/25">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-bold text-white flex items-center gap-2">
                    <BadgePercent size={15} className="text-forest-300" />
                    {b.tierProgressTitle}: {tier[lang]}
                  </p>
                  <p className="text-xs text-forest-300 font-semibold">
                    {Math.round(tier.rate * 100)}% off
                  </p>
                </div>
                <div className="flex gap-1.5">
                  {DISCOUNT_TIERS.map((dt) => {
                    const active = attractions.length >= dt.min
                    return (
                      <div
                        key={dt.min}
                        className={`flex-1 h-1.5 rounded-full ${
                          active
                            ? 'bg-gradient-to-r from-forest-400 to-ocean-400'
                            : 'bg-white/10'
                        }`}
                      />
                    )
                  })}
                </div>
                <p className="text-[11px] text-slate-300 mt-2">{tierProgressLabel}</p>
              </div>
            </div>

            {/* STEP 2 — homestays (optional) */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white font-bold text-lg">{b.step2}</h2>
                <Link to="/homestays" className="btn-soft">
                  <Home size={13} /> {b.browseHomestays}
                </Link>
              </div>

              {/* No homestay needed toggle */}
              <button
                type="button"
                onClick={() => {
                  // Clear any homestays the user might have, and lock the choice.
                  homestays.forEach((h) => removeHomestay(h.homestay.slug))
                  setSkipHomestay(true)
                }}
                className={`w-full mb-3 px-4 py-3 rounded-2xl text-left transition-colors flex items-center gap-3
                            ${skipHomestay && homestays.length === 0
                              ? 'bg-gradient-to-r from-forest-500/20 to-ocean-500/20 border border-forest-400/40'
                              : 'bg-white/5 border border-white/10 hover:bg-white/10'}`}
              >
                <span className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0
                                  ${skipHomestay && homestays.length === 0
                                    ? 'bg-forest-500 border-forest-400'
                                    : 'border-white/30'}`}>
                  {skipHomestay && homestays.length === 0 && (
                    <CheckCircle2 size={12} className="text-white" />
                  )}
                </span>
                <div className="flex-1">
                  <p className="text-white text-sm font-semibold">{t.homestays.skipHomestay}</p>
                  <p className="text-xs text-slate-400">{t.homestays.skipHomestayHint}</p>
                </div>
              </button>

              {homestays.length === 0 ? (
                <EmptyHint icon={Home} text={b.noHomestays} />
              ) : (
                <div className="space-y-3">
                  <AnimatePresence>
                    {homestays.map(({ homestay, room, nights }) => {
                      const d = homestay[lang]
                      const rd = room[lang]
                      return (
                        <motion.div
                          key={homestay.slug}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="flex flex-col sm:flex-row items-stretch gap-3 p-3
                                     rounded-2xl bg-white/5 border border-white/10"
                        >
                          <div className={`w-full sm:w-20 h-20 sm:h-auto rounded-xl
                                          bg-gradient-to-br ${homestay.gradient}
                                          flex items-center justify-center text-3xl shrink-0`}>
                            {homestay.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-semibold truncate">{d.name}</p>
                            <p className="text-xs text-slate-300">{rd.name}</p>
                            <p className="text-xs text-slate-400 mt-1">
                              {format(room.price)} × {nights} {b.nights.toLowerCase()} = {format(room.price * nights)}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <div>
                              <label className="text-[10px] text-slate-400 block">{b.nights}</label>
                              <input
                                type="number"
                                min={1}
                                value={nights}
                                onChange={(e) =>
                                  setHomestayNights(homestay.slug, e.target.value)
                                }
                                className="w-16 px-2 py-1 rounded-lg bg-white/10 border border-white/20
                                           text-white text-sm text-center focus:outline-none
                                           focus:ring-2 focus:ring-ocean-400"
                              />
                            </div>
                            <button
                              onClick={() => removeHomestay(homestay.slug)}
                              className="p-2 rounded-lg text-slate-400 hover:text-red-400
                                         hover:bg-red-500/10 transition-colors"
                              aria-label={b.remove}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </motion.div>
                      )
                    })}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* STEP 3 — group size + days */}
            <div className="card p-6">
              <h2 className="text-white font-bold text-lg mb-4">{b.step3}</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="label flex items-center gap-2">
                    <Users size={13} /> {b.visitors}
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={visitors}
                    onChange={(e) => setVisitors(e.target.value)}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="label flex items-center gap-2">
                    <CalendarDays size={13} /> {b.days}
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={days}
                    onChange={(e) => setDays(e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ─────────── RIGHT (1/3): SUMMARY ─────────── */}
          <aside className="lg:col-span-1">
            <div className="card-glass p-6 sticky top-28">
              <h2 className="text-white font-bold text-lg mb-1">{b.summaryTitle}</h2>
              <p className="text-xs text-slate-400 mb-5">{b.hint}</p>

              {empty ? (
                <div className="py-8 text-center">
                  <div className="w-14 h-14 rounded-2xl mx-auto mb-3
                                  bg-gradient-to-br from-forest-500/30 to-ocean-500/30
                                  flex items-center justify-center">
                    <Plus size={22} className="text-white/70" />
                  </div>
                  <p className="text-white font-semibold mb-1">{b.empty}</p>
                  <p className="text-xs text-slate-400">{b.emptyHint}</p>
                </div>
              ) : (
                <>
                  <Row label={b.attractionsSubtotal} value={format(totals.attractionsSubtotal)} />
                  <Row
                    label={b.homestaysSubtotal}
                    value={homestays.length === 0 ? '—' : format(totals.homestaysSubtotal)}
                  />
                  {homestays.length === 0 && (
                    <p className="text-[11px] text-slate-400 -mt-1 mb-1.5 italic">
                      {b.noHomestaySelected}
                    </p>
                  )}
                  <div className="my-3 border-t border-white/10" />
                  <Row label={b.subtotal} value={format(totals.subtotal)} />
                  {totals.discountAmount > 0 && (
                    <Row
                      label={`${b.discount} (${Math.round(totals.discountTier.rate * 100)}%)`}
                      value={`- ${format(totals.discountAmount)}`}
                      color="text-forest-300"
                    />
                  )}
                  <div className="my-3 border-t border-white/10" />
                  <div className="flex items-end justify-between mb-5">
                    <span className="text-white/70 text-sm">{b.total}</span>
                    <span className="text-3xl font-black gradient-text">
                      {format(totals.total)}
                    </span>
                  </div>

                  <button
                    onClick={() => navigate('/checkout')}
                    className="w-full py-4 rounded-2xl font-bold text-white
                               bg-gradient-to-r from-forest-500 to-ocean-500
                               hover:shadow-xl hover:shadow-ocean-500/30 transition-all
                               flex items-center justify-center gap-2 active:scale-95"
                  >
                    <CheckCircle2 size={17} />
                    {b.proceed}
                    <ArrowRight size={16} />
                  </button>

                  <button
                    onClick={() => { clear(); setSkipHomestay(false) }}
                    className="w-full mt-2 py-2.5 rounded-2xl text-sm text-slate-300
                               hover:text-red-300 hover:bg-red-500/10 transition-colors
                               flex items-center justify-center gap-2"
                  >
                    <Trash2 size={13} /> {b.clear}
                  </button>
                </>
              )}
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}

function Row({ label, value, color = 'text-white' }) {
  return (
    <div className="flex items-center justify-between text-sm mb-1.5">
      <span className="text-slate-300">{label}</span>
      <span className={`${color} font-semibold`}>{value}</span>
    </div>
  )
}

function EmptyHint({ icon: Icon, text }) {
  return (
    <div className="py-8 text-center rounded-xl border border-dashed border-white/15">
      <Icon size={26} className="text-slate-400 mx-auto mb-2" />
      <p className="text-sm text-slate-400">{text}</p>
    </div>
  )
}

function Bullet({ icon: Icon, text }) {
  return (
    <span className="flex items-start gap-1.5">
      <Icon size={13} className="text-forest-300 mt-0.5 shrink-0" />
      <span>{text}</span>
    </span>
  )
}
