// ────────────────────────────────────────────────────────────────────────────
// Hero.jsx — full-screen cinematic intro.
// "Pahang's Hidden Gem" is now an elegant glassmorphism CARD sitting ABOVE the
// heading, vertically separated from the CTAs, so it never collides on any
// breakpoint.
// ────────────────────────────────────────────────────────────────────────────

import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ChevronDown, MapPin, Star, Sparkles, Compass } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

export default function Hero() {
  const { t } = useLanguage()
  const heroRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })

  // Parallax layers — each drifts at its own rate
  const badgeY    = useTransform(scrollYProgress, [0, 0.8], [0, -40])
  const badgeOp   = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  const headingY  = useTransform(scrollYProgress, [0, 0.8], [0, -60])
  const taglineY  = useTransform(scrollYProgress, [0, 0.8], [0, -100])
  const buttonsY  = useTransform(scrollYProgress, [0, 0.8], [0, -80])
  const statsY    = useTransform(scrollYProgress, [0, 0.8], [0, -130])
  const chevOp    = useTransform(scrollYProgress, [0, 0.2], [1, 0])

  return (
    <section
      ref={heroRef}
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-16"
    >
      {/* Tinted overlay over the global ambient background — extra contrast for hero text */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at top, rgba(0,0,0,0.0) 0%, rgba(2,28,28,0.45) 60%, rgba(2,28,28,0.85) 100%)',
        }}
      />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">

        {/* ── Pahang's Hidden Gem — glassmorphism PILL CARD, centered above heading ── */}
        <motion.div
          style={{ y: badgeY, opacity: badgeOp, willChange: 'transform, opacity' }}
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mb-8 md:mb-10"
        >
          <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full
                          bg-white/10 backdrop-blur-2xl border border-white/25
                          shadow-2xl shadow-black/30">
            <div className="flex items-center gap-1.5">
              <Sparkles size={14} className="text-forest-300" />
              <Star size={11} className="text-amber-300 fill-amber-300" />
              <Star size={11} className="text-amber-300 fill-amber-300" />
              <Star size={11} className="text-amber-300 fill-amber-300" />
              <Star size={11} className="text-amber-300 fill-amber-300" />
              <Star size={11} className="text-amber-300 fill-amber-300" />
            </div>
            <div className="h-4 w-px bg-white/25" />
            <p className="text-white font-bold text-sm md:text-base tracking-wide">
              {t.hero.badge}
            </p>
            <div className="hidden sm:flex items-center gap-1.5 pl-1">
              <MapPin size={11} className="text-ocean-300" />
              <span className="text-white/65 text-[11px] font-medium">
                {t.hero.pahangLabel}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Heading */}
        <motion.div
          style={{ y: headingY, willChange: 'transform' }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white
                         leading-[1.05] mb-4 tracking-tight">
            {t.hero.heading}
            <span className="block mt-3">
              <span className="gradient-text">{t.hero.headingHighlight}</span>
            </span>
          </h1>
        </motion.div>

        {/* Tagline */}
        <motion.p
          style={{ y: taglineY, willChange: 'transform' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="text-base md:text-xl text-slate-200/85 max-w-2xl mx-auto mt-3 mb-10
                     leading-relaxed italic"
        >
          {t.hero.tagline}
        </motion.p>

        {/* CTAs */}
        <motion.div
          style={{ y: buttonsY, willChange: 'transform' }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.55 }}
          className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto"
        >
          <Link to="/builder" className="btn-primary text-base px-7 py-4">
            <Sparkles size={17} />
            {t.hero.ctaBuild}
          </Link>
          <Link to="/attractions" className="btn-outline text-base px-7 py-4">
            <Compass size={17} />
            {t.hero.ctaExplore}
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          style={{ y: statsY, willChange: 'transform' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.75 }}
          className="mt-14 grid grid-cols-3 gap-3 sm:gap-5 max-w-md mx-auto w-full"
        >
          {[
            { value: '10+',  label: t.hero.stat1 },
            { value: '500+', label: t.hero.stat2 },
            { value: '50+',  label: t.hero.stat3 },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl p-4 bg-white/10 backdrop-blur-xl border border-white/15
                         text-center"
            >
              <div className="text-2xl md:text-3xl font-black gradient-text">{stat.value}</div>
              <div className="text-[11px] md:text-xs text-white/70 mt-1 leading-tight">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/55"
        style={{ opacity: chevOp }}
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
      >
        <ChevronDown size={28} />
      </motion.div>
    </section>
  )
}
