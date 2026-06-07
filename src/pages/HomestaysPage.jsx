// ────────────────────────────────────────────────────────────────────────────
// HomestaysPage.jsx — list of all homestay properties.
// ────────────────────────────────────────────────────────────────────────────

import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Home, Star, Users, Sparkles } from 'lucide-react'
import homestays from '../data/homestaysData'
import { useLanguage } from '../context/LanguageContext'
import { useCurrency } from '../context/CurrencyContext'
import MotionHeading from '../components/ui/MotionHeading'
import ImageOrPlaceholder from '../components/ui/ImageOrPlaceholder'

const cardVariants = {
  hidden:  { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.55, delay: i * 0.08, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
}

export default function HomestaysPage() {
  const { t, lang } = useLanguage()
  const { format } = useCurrency()
  const hs = t.homestays

  return (
    <section className="relative pt-32 pb-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-14">
          <MotionHeading>
            <span className="section-badge">
              <Home size={14} />
              {hs.sectionBadge}
            </span>
          </MotionHeading>
          <MotionHeading delay={0.1}>
            <h1 className="section-heading">{hs.heading}</h1>
          </MotionHeading>
          <MotionHeading delay={0.15}>
            <div className="accent-divider mb-6" />
          </MotionHeading>
          <MotionHeading delay={0.2}>
            <p className="section-subheading">{hs.subheading}</p>
          </MotionHeading>
        </div>

        {/* "Homestay is optional" banner */}
        <MotionHeading delay={0.25}>
          <div className="mb-8 mx-auto max-w-3xl p-4 rounded-2xl border border-forest-400/30
                          bg-gradient-to-r from-forest-500/10 to-ocean-500/10
                          flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div className="flex items-start gap-3">
              <Sparkles size={18} className="text-forest-300 mt-0.5 shrink-0" />
              <div>
                <p className="text-white font-semibold text-sm">{hs.skipHomestay}</p>
                <p className="text-xs text-slate-300">{hs.skipHomestayHint}</p>
              </div>
            </div>
            <Link to="/builder" className="btn-soft whitespace-nowrap">
              {t.builder.heading} <ArrowRight size={14} />
            </Link>
          </div>
        </MotionHeading>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
          {homestays.map((h, i) => {
            const data = h[lang]
            return (
              <motion.div
                key={h.id}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.15 }}
              >
                <Link
                  to={`/homestays/${h.slug}`}
                  className="block rounded-3xl overflow-hidden group card card-lift h-full"
                >
                  <div className="h-56 relative">
                    <ImageOrPlaceholder
                      src={h.images?.[0]}
                      alt={data.name}
                      gradient={h.gradient}
                      icon={h.icon}
                      className="w-full h-full"
                    />
                    <div className="absolute top-3 right-3 inline-flex items-center gap-1 px-2.5 py-1
                                    rounded-full bg-amber-500/25 backdrop-blur-md
                                    border border-amber-300/40 text-amber-200 text-xs font-bold">
                      <Star size={11} className="fill-amber-300 text-amber-300" />
                      {h.rating}
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="font-bold text-white text-lg mb-1
                                   group-hover:text-forest-300 transition-colors">
                      {data.name}
                    </h3>
                    <p className="text-slate-400 text-sm mb-4">{data.tagline}</p>

                    <div className="flex items-center gap-4 text-xs text-slate-300 mb-4">
                      <span className="inline-flex items-center gap-1">
                        <Users size={13} className="text-ocean-300" />
                        {hs.capacity.replace('{n}', h.capacity)}
                      </span>
                    </div>

                    <div className="flex items-end justify-between pt-3 border-t border-white/10">
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-wide">{hs.from}</div>
                        <div className="text-forest-300 font-black text-xl leading-tight">
                          {format(h.priceFrom)}
                        </div>
                        <div className="text-[10px] text-slate-400">{hs.perNight}</div>
                      </div>
                      <div className="inline-flex items-center gap-1 text-sm font-semibold
                                      text-ocean-300 group-hover:text-white transition-colors">
                        {hs.viewDetails}
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
