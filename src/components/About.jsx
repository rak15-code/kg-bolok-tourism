// ────────────────────────────────────────────────────────────────────────────
// About.jsx — "A village alive with nature and culture".
// The old "Eco Tourism" badge has been removed — the collage now sits cleanly
// with extra breathing room.
// ────────────────────────────────────────────────────────────────────────────

import { motion } from 'framer-motion'
import { Leaf, Music, Users, Utensils, CheckCircle } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import attractions from '../data/attractionsData'
import MotionHeading from './ui/MotionHeading'
import ImageOrPlaceholder from './ui/ImageOrPlaceholder'

const listVariants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.12 } },
}
const listItem = {
  hidden:  { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] } },
}
const cardVariants = {
  hidden:  { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
}

export default function About() {
  const { t, lang } = useLanguage()
  const ab = t.about

  const cards = [
    { icon: Leaf,     color: 'from-forest-500 to-ocean-500',  title: ab.card1Title, desc: ab.card1Desc },
    { icon: Music,    color: 'from-ocean-500 to-deepsea-500', title: ab.card2Title, desc: ab.card2Desc },
    { icon: Users,    color: 'from-forest-400 to-ocean-400',  title: ab.card3Title, desc: ab.card3Desc },
    { icon: Utensils, color: 'from-ocean-400 to-forest-500',  title: ab.card4Title, desc: ab.card4Desc },
  ]

  const highlights = [
    { emoji: '🏠', title: ab.highlight1, desc: ab.highlight1Desc },
    { emoji: '🐘', title: ab.highlight2, desc: ab.highlight2Desc },
    { emoji: '💃', title: ab.highlight3, desc: ab.highlight3Desc },
    { emoji: '🍽️', title: ab.highlight4, desc: ab.highlight4Desc },
  ]

  // Pick four representative attractions for the collage.
  const collageItems = attractions.slice(0, 4)

  return (
    <section id="about" className="relative py-20 lg:py-28 overflow-hidden scroll-mt-24">
      <div className="absolute inset-0 bg-slate-950/55 backdrop-blur-sm pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="text-center mb-16">
          <MotionHeading>
            <span className="section-badge">
              <Leaf size={14} />
              {ab.sectionBadge}
            </span>
          </MotionHeading>
          <MotionHeading delay={0.1}>
            <h2 className="section-heading">{ab.heading}</h2>
          </MotionHeading>
          <MotionHeading delay={0.15}>
            <div className="accent-divider mb-6" />
          </MotionHeading>
          <MotionHeading delay={0.2}>
            <p className="section-subheading">{ab.intro}</p>
          </MotionHeading>
        </div>

        {/* Two-column: collage + highlights */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">

          {/* Left — collage (cleaner, no Eco Tourism badge) */}
          <MotionHeading direction="right" delay={0.05}>
            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/15">
                <div className="grid grid-cols-2 grid-rows-2 h-80 md:h-96">
                  {collageItems.map((a, i) => (
                    <div
                      key={i}
                      className="relative overflow-hidden group"
                    >
                      <ImageOrPlaceholder
                        src={a.image}
                        alt={a[lang].name}
                        gradient={a.gradient}
                        icon={a.icon}
                        iconClassName="text-4xl md:text-5xl"
                        className="w-full h-full group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />
                      <div className="absolute bottom-0 inset-x-0 p-2">
                        <p className="text-white text-[10px] font-semibold text-center drop-shadow-lg">
                          {a[lang].name}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </MotionHeading>

          {/* Right — highlight points */}
          <motion.ul
            className="space-y-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            variants={listVariants}
          >
            {highlights.map((h) => (
              <motion.li
                key={h.title}
                variants={listItem}
                className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10
                           hover:bg-white/10 hover:border-forest-400/30 transition-all duration-200 group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-forest-500 to-ocean-500
                                flex items-center justify-center text-2xl shrink-0
                                group-hover:scale-110 transition-transform shadow-lg shadow-forest-900/30">
                  {h.emoji}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-white mb-0.5">{h.title}</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">{h.desc}</p>
                </div>
                <CheckCircle size={18} className="text-forest-300 shrink-0 mt-1
                              opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.li>
            ))}
          </motion.ul>
        </div>

        {/* Feature cards row */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map(({ icon: Icon, color, title, desc }, i) => (
            <motion.div
              key={title}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.2 }}
              className="card card-lift p-6 text-center group"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color}
                              flex items-center justify-center mx-auto mb-4
                              shadow-lg shadow-forest-900/30
                              group-hover:scale-110 transition-transform duration-300`}>
                <Icon size={24} className="text-white" />
              </div>
              <h3 className="font-bold text-white mb-2">{title}</h3>
              <p className="text-slate-300 text-sm leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
