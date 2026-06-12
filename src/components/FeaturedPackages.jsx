// ────────────────────────────────────────────────────────────────────────────
// FeaturedPackages.jsx
// ────────────────────────────────────────────────────────────────────────────
// Promotional package cards shown ABOVE the Custom Package Builder.
//   • Original price crossed out + discount badge
//   • Animated cards (framer-motion)
//   • Big "ONLY RM149" / "ONLY RM179" price
//   • "Book This Package"  → flat promo price → checkout
//   • "Customize Instead"  → loads attractions into the builder to edit
// Bilingual + responsive.
// ────────────────────────────────────────────────────────────────────────────

import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles, Check, BadgePercent, ArrowRight, Settings2 } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import { useCurrency } from '../context/CurrencyContext'
import { useBuilder } from '../context/BuilderContext'
import usePackages from '../hooks/usePackages'
import { getAttractionBySlug } from '../data/attractionsData'
import MotionHeading from './ui/MotionHeading'

export default function FeaturedPackages() {
  const { t, lang } = useLanguage()
  const { format } = useCurrency()
  const { loadPackage } = useBuilder()
  const { packages } = usePackages()
  const navigate = useNavigate()
  const fp = t.featuredPackages

  // Resolve a package's attraction slugs into real attraction objects so the
  // builder can price/edit them.
  const resolveAttractions = (pkg) =>
    (pkg.attractionSlugs || [])
      .map((slug) => getAttractionBySlug(slug))
      .filter(Boolean)

  const onBook = (pkg) => {
    loadPackage(pkg, resolveAttractions(pkg), { flat: true })
    navigate('/checkout')
  }
  const onCustomize = (pkg) => {
    loadPackage(pkg, resolveAttractions(pkg), { flat: false })
    navigate('/builder')
  }

  if (!packages?.length) return null

  return (
    <section id="packages" className="relative py-20 lg:py-24 overflow-hidden scroll-mt-24">
      <div className="absolute inset-0 bg-slate-950/50" />
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <MotionHeading>
            <span className="section-badge">
              <Sparkles size={14} /> {fp.sectionBadge}
            </span>
          </MotionHeading>
          <MotionHeading delay={0.1}>
            <h2 className="section-heading">{fp.heading}</h2>
          </MotionHeading>
          <MotionHeading delay={0.15}>
            <div className="accent-divider mb-5" />
          </MotionHeading>
          <MotionHeading delay={0.2}>
            <p className="section-subheading">{fp.subheading}</p>
          </MotionHeading>
        </div>

        <div className="grid md:grid-cols-2 gap-7">
          {packages.map((pkg, i) => {
            const d = pkg[lang] || pkg.en
            const pct = pkg.discountPercentage
            return (
              <motion.div
                key={pkg.slug}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.6, delay: i * 0.12 }}
                whileHover={{ y: -8 }}
                className="relative card card-lift p-7 flex flex-col overflow-hidden"
              >
                {/* glow */}
                <div className={`absolute -top-24 -right-24 w-56 h-56 rounded-full
                                 bg-gradient-to-br ${pkg.gradient} opacity-20 blur-3xl pointer-events-none`} />

                {/* discount badge */}
                {pct > 0 && (
                  <div className="absolute top-5 right-5 inline-flex items-center gap-1 px-3 py-1.5
                                  rounded-full bg-gradient-to-r from-amber-400 to-red-500
                                  text-white text-xs font-black shadow-lg">
                    <BadgePercent size={13} /> -{pct}%
                  </div>
                )}

                {/* header */}
                <div className="flex items-center gap-3 mb-5">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${pkg.gradient}
                                   flex items-center justify-center text-3xl shrink-0 shadow-lg`}>
                    {pkg.icon}
                  </div>
                  <h3 className="text-xl font-black text-white leading-tight pr-16">{d.title}</h3>
                </div>

                {/* includes */}
                <ul className="space-y-2.5 mb-6 flex-1">
                  {d.includes.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-200">
                      <span className="w-5 h-5 rounded-full bg-forest-500/20 text-forest-300
                                       flex items-center justify-center shrink-0 mt-0.5">
                        <Check size={12} strokeWidth={3} />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>

                {/* price */}
                <div className="mb-5">
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400 line-through text-lg">
                      {format(pkg.originalPrice)}
                    </span>
                    <span className="text-[11px] uppercase tracking-wider font-bold text-amber-300">
                      {fp.save} {format(pkg.originalPrice - pkg.discountedPrice)}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-[13px] uppercase tracking-wider font-black text-forest-300">
                      {fp.only}
                    </span>
                    <span className="text-4xl font-black gradient-text">
                      {format(pkg.discountedPrice)}
                    </span>
                  </div>
                </div>

                {/* actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => onBook(pkg)}
                    className="flex-1 py-3.5 rounded-2xl font-bold text-white
                               bg-gradient-to-r from-forest-500 to-ocean-500
                               hover:shadow-xl hover:shadow-ocean-500/30 transition-all
                               flex items-center justify-center gap-2 active:scale-95"
                  >
                    {fp.book} <ArrowRight size={16} />
                  </button>
                  <button
                    onClick={() => onCustomize(pkg)}
                    className="flex-1 py-3.5 rounded-2xl font-semibold text-white
                               bg-white/10 border border-white/15 hover:bg-white/15 transition-all
                               flex items-center justify-center gap-2 active:scale-95"
                  >
                    <Settings2 size={15} /> {fp.customize}
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
