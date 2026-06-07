// ────────────────────────────────────────────────────────────────────────────
// AttractionsPage.jsx — full listing of all attractions.
// Each card is a <Link> that routes to /attractions/<slug>.
// ────────────────────────────────────────────────────────────────────────────

import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Compass, ArrowRight, Clock } from 'lucide-react'
import attractions from '../data/attractionsData'
import { useLanguage } from '../context/LanguageContext'
import { useCurrency } from '../context/CurrencyContext'
import MotionHeading from '../components/ui/MotionHeading'
import ImageOrPlaceholder from '../components/ui/ImageOrPlaceholder'

const cardVariants = {
  hidden:  { opacity: 0, y: 40, scale: 0.96 },
  visible: (i) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.55, delay: i * 0.06, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
}

export default function AttractionsPage() {
  const { t, lang } = useLanguage()
  const { format } = useCurrency()
  const at = t.attractions

  return (
    <section className="relative pt-32 pb-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-14">
          <MotionHeading>
            <span className="section-badge">
              <Compass size={14} />
              {at.sectionBadge}
            </span>
          </MotionHeading>
          <MotionHeading delay={0.1}>
            <h1 className="section-heading">{at.heading}</h1>
          </MotionHeading>
          <MotionHeading delay={0.15}>
            <div className="accent-divider mb-6" />
          </MotionHeading>
          <MotionHeading delay={0.2}>
            <p className="section-subheading">{at.subheading}</p>
          </MotionHeading>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {attractions.map((a, i) => {
            const data = a[lang]
            return (
              <motion.div
                key={a.id}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.15 }}
              >
                <Link
                  to={`/attractions/${a.slug}`}
                  className="block rounded-3xl overflow-hidden group card card-lift"
                >
                  {/* Hero image / placeholder */}
                  <div className="h-52 relative">
                    <ImageOrPlaceholder
                      src={a.image}
                      alt={data.name}
                      gradient={a.gradient}
                      icon={a.icon}
                      className="w-full h-full"
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full
                                    text-[11px] font-bold bg-black/40 backdrop-blur-md
                                    text-forest-200 border border-forest-300/30">
                      {data.tag}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-5">
                    <h3 className="font-bold text-white text-lg mb-1 group-hover:text-forest-300
                                   transition-colors">
                      {data.name}
                    </h3>
                    <p className="text-slate-300 text-sm leading-relaxed line-clamp-2 mb-4">
                      {data.description}
                    </p>

                    <div className="flex items-center justify-between pt-3 border-t border-white/10">
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Clock size={13} />
                        {a.duration[lang]}
                      </div>
                      <div className="text-right">
                        <div className="text-forest-300 font-black">{format(a.price)}</div>
                        <div className="text-[10px] text-slate-400">{at.perPerson}</div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between text-sm font-semibold text-ocean-300
                                    group-hover:text-white transition-colors">
                      {at.viewDetails}
                      <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
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
