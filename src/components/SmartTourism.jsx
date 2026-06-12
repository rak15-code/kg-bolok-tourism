// ────────────────────────────────────────────────────────────────────────────
// SmartTourism.jsx — "Kampung Bolok Smart Tourism" homepage section.
// ────────────────────────────────────────────────────────────────────────────
// Three parts:
//   A. Meet Kampung Bolok — pre-generated MP4 video showcase (<VideoShowcase/>)
//   B. Sahabat Bolok AI — promo card + CTA that opens the floating chat widget
//   C. Smart Tourism Features — quick feature grid
//
// The "Chat with Sahabat Bolok AI" CTA dispatches a window CustomEvent that the
// global <AiAssistant/> listens for — keeps the two components decoupled.
// ────────────────────────────────────────────────────────────────────────────

import { motion } from 'framer-motion'
import { Sparkles, Film, Bot, MessageCircle } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import MotionHeading from './ui/MotionHeading'
import VideoShowcase from './VideoShowcase'

export function openSahabatAi() {
  window.dispatchEvent(new CustomEvent('open-sahabat-ai'))
}

export default function SmartTourism() {
  const { t } = useLanguage()
  const s = t.smartTourism

  return (
    <section id="smart-tourism" className="relative py-20 lg:py-24 overflow-hidden scroll-mt-24">
      <div className="absolute inset-0 bg-slate-950/55" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-12">
          <MotionHeading>
            <span className="section-badge">
              <Sparkles size={14} /> {s.sectionBadge}
            </span>
          </MotionHeading>
          <MotionHeading delay={0.1}>
            <h2 className="section-heading">{s.heading}</h2>
          </MotionHeading>
          <MotionHeading delay={0.15}>
            <div className="accent-divider mb-5" />
          </MotionHeading>
          <MotionHeading delay={0.2}>
            <p className="section-subheading">{s.subheading}</p>
          </MotionHeading>
        </div>

        {/* A. Video showcase */}
        <div className="mb-16">
          <div className="flex items-center gap-2 mb-5">
            <Film size={18} className="text-forest-300" />
            <h3 className="text-lg font-bold text-white">{s.videoTitle}</h3>
          </div>
          <VideoShowcase />
        </div>

        {/* B. Sahabat Bolok AI promo */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl p-7 sm:p-10
                     bg-gradient-to-br from-forest-700/70 via-ocean-700/55 to-deepsea-700/60
                     border border-white/15"
        >
          <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-forest-400/20 blur-3xl pointer-events-none" />
          <div className="relative grid md:grid-cols-[auto,1fr,auto] items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center shrink-0">
              <Bot size={30} className="text-white" />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wider font-bold text-forest-200 mb-1">
                {s.aiPromoTag}
              </p>
              <h3 className="text-2xl font-black text-white mb-1.5">{s.aiPromoHeading}</h3>
              <p className="text-white/85 text-sm max-w-xl">{s.aiPromoText}</p>
            </div>
            <button
              onClick={openSahabatAi}
              className="btn-primary text-base px-6 py-3.5 shrink-0"
            >
              <MessageCircle size={18} /> {s.aiPromoCta}
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
