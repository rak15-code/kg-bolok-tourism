// ────────────────────────────────────────────────────────────────────────────
// ContactPage.jsx — info cards + simple message form.
// Phone & social handles come from src/data/socialLinks.js — edit there once.
// ────────────────────────────────────────────────────────────────────────────

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  MapPin, Phone, Mail, Send, MessageSquare, Instagram, CheckCircle2,
} from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import MotionHeading from '../components/ui/MotionHeading'
import {
  socialLinks, contactPhoneDisplay, contactPhoneTel,
} from '../data/socialLinks'

// Inline TikTok glyph (lucide-react has no TikTok icon).
function TikTokIcon({ size = 18, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V9.13a8.21 8.21 0 0 0 4.93 1.65V7.34a4.86 4.86 0 0 1-2-.65Z" />
    </svg>
  )
}

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }
const item = {
  hidden:  { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] } },
}

export default function ContactPage() {
  const { t } = useLanguage()
  const c = t.contact

  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }))
  const handleSubmit = (e) => {
    e.preventDefault()
    setSent(true)
    setTimeout(() => setSent(false), 5000)
    setForm({ name: '', email: '', message: '' })
  }

  const cards = [
    { icon: MapPin, gradient: 'from-forest-500 to-ocean-500',  title: c.addressTitle, value: c.address,             link: null },
    { icon: Phone,  gradient: 'from-ocean-500 to-deepsea-500', title: c.phoneTitle,   value: contactPhoneDisplay,   link: contactPhoneTel },
    { icon: Mail,   gradient: 'from-forest-400 to-ocean-400',  title: c.emailTitle,   value: c.email,               link: `mailto:${c.email}` },
  ]

  return (
    <section className="relative pt-32 pb-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-14">
          <MotionHeading>
            <span className="section-badge">
              <MessageSquare size={14} /> {c.sectionBadge}
            </span>
          </MotionHeading>
          <MotionHeading delay={0.1}>
            <h1 className="section-heading">{c.heading}</h1>
          </MotionHeading>
          <MotionHeading delay={0.15}>
            <div className="accent-divider mb-6" />
          </MotionHeading>
          <MotionHeading delay={0.2}>
            <p className="section-subheading">{c.subheading}</p>
          </MotionHeading>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">

          {/* LEFT — info */}
          <div className="space-y-5">
            <motion.div
              className="space-y-4"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.2 }}
              variants={stagger}
            >
              {cards.map(({ icon: Icon, gradient, title, value, link }) => (
                <motion.div
                  key={title}
                  variants={item}
                  className="flex items-center gap-5 p-5 rounded-2xl card hover:border-forest-400/30 transition-all"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient}
                                   flex items-center justify-center shrink-0
                                   shadow-lg shadow-forest-900/40`}>
                    <Icon size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-400 mb-0.5">{title}</p>
                    {link ? (
                      <a href={link} className="text-white font-semibold hover:text-forest-300 transition-colors">
                        {value}
                      </a>
                    ) : (
                      <p className="text-white font-semibold">{value}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* SOCIAL — Instagram + TikTok only */}
            <MotionHeading delay={0.1}>
              <div className="p-5 card">
                <p className="text-sm font-semibold text-slate-300 mb-4">{c.socialTitle}</p>
                <div className="flex gap-3">
                  <motion.a
                    href={socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.12 }}
                    whileTap={{ scale: 0.92 }}
                    className="w-11 h-11 rounded-xl bg-white/10 hover:bg-gradient-to-br hover:from-pink-500 hover:to-yellow-400
                               hover:text-white text-white/80
                               flex items-center justify-center transition-all duration-200"
                    aria-label="Instagram"
                  >
                    <Instagram size={18} />
                  </motion.a>
                  <motion.a
                    href={socialLinks.tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.12 }}
                    whileTap={{ scale: 0.92 }}
                    className="w-11 h-11 rounded-xl bg-white/10 hover:bg-black
                               hover:text-white text-white/80
                               flex items-center justify-center transition-all duration-200"
                    aria-label="TikTok"
                  >
                    <TikTokIcon size={18} />
                  </motion.a>
                </div>
              </div>
            </MotionHeading>

            <MotionHeading delay={0.15}>
              <div className="rounded-2xl overflow-hidden border border-white/10 h-52
                              bg-gradient-to-br from-forest-700 to-ocean-700
                              flex flex-col items-center justify-center gap-2 text-white">
                <MapPin size={32} className="opacity-70" />
                <p className="font-semibold text-sm">Kg Bolok, Pahang</p>
                <p className="text-xs opacity-70">{c.mapSoon}</p>
              </div>
            </MotionHeading>
          </div>

          {/* RIGHT — form */}
          <motion.div
            className="card p-8"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65, delay: 0.1 }}
            viewport={{ once: false, amount: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="label">{c.formName}</label>
                <input
                  type="text" name="name" value={form.name} onChange={handleChange} required
                  placeholder={c.formNamePlaceholder} className="input-field"
                />
              </div>
              <div>
                <label className="label">{c.formEmail}</label>
                <input
                  type="email" name="email" value={form.email} onChange={handleChange} required
                  placeholder={c.formEmailPlaceholder} className="input-field"
                />
              </div>
              <div>
                <label className="label">{c.formMessage}</label>
                <textarea
                  name="message" value={form.message} onChange={handleChange} required rows={5}
                  placeholder={c.formMessagePlaceholder} className="input-field resize-none"
                />
              </div>

              {sent && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-forest-300 bg-forest-500/10 border
                             border-forest-400/30 rounded-xl px-4 py-3 text-sm font-medium"
                >
                  <CheckCircle2 size={15} /> {c.formSuccess}
                </motion.div>
              )}

              <motion.button
                type="submit"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-forest-500 to-ocean-500
                           text-white font-bold transition-all duration-200
                           flex items-center justify-center gap-2 shadow-lg shadow-ocean-900/30"
              >
                <Send size={17} />
                {c.formBtn}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
