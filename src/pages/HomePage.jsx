// ────────────────────────────────────────────────────────────────────────────
// HomePage.jsx
// ────────────────────────────────────────────────────────────────────────────
// One-page experience. Every navbar item maps to a section on this page:
//   #home  → Hero
//   #about → About
//   #attractions → Attractions teaser grid
//   #homestays → Homestay teaser grid
//   #builder → Package Builder teaser + CTA
//   #gallery → Auto-playing gallery carousel
//   #contact → Quick contact strip
//
// Detail pages (/attractions/:slug, /homestays/:slug, /builder, /gallery,
// /contact) still exist and are linked from each section.
// ────────────────────────────────────────────────────────────────────────────

import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight, Compass, Home as HomeIcon, Sparkles, Camera, MessageSquare,
  Clock, Plus, Users, MapPin, Phone, Instagram,
} from 'lucide-react'
import Hero from '../components/Hero'
import About from '../components/About'
import GalleryCarousel from '../components/GalleryCarousel'
import attractions from '../data/attractionsData'
import homestays from '../data/homestaysData'
import { useLanguage } from '../context/LanguageContext'
import { useCurrency } from '../context/CurrencyContext'
import MotionHeading from '../components/ui/MotionHeading'
import ImageOrPlaceholder from '../components/ui/ImageOrPlaceholder'
import { socialLinks, contactPhoneDisplay, contactPhoneTel } from '../data/socialLinks'

// Inline TikTok glyph (lucide-react doesn't ship one).
function TikTokIcon({ size = 18, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V9.13a8.21 8.21 0 0 0 4.93 1.65V7.34a4.86 4.86 0 0 1-2-.65Z" />
    </svg>
  )
}

export default function HomePage() {
  const { t, lang } = useLanguage()
  const { format } = useCurrency()

  const featured = attractions.slice(0, 6)
  const stays    = homestays

  return (
    <>
      {/* SECTION: HOME (Hero already has id="home") */}
      <Hero />

      {/* SECTION: ABOUT (id="about" baked in) */}
      <About />

      {/* SECTION: ATTRACTIONS — teaser grid */}
      <section id="attractions" className="relative py-20 lg:py-24 overflow-hidden scroll-mt-24">
        <div className="absolute inset-0 bg-slate-950/45" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
            <div>
              <MotionHeading>
                <span className="section-badge">
                  <Compass size={14} />
                  {t.attractions.sectionBadge}
                </span>
              </MotionHeading>
              <MotionHeading delay={0.1}>
                <h2 className="section-heading text-left">{t.attractions.heading}</h2>
              </MotionHeading>
            </div>
            <Link to="/attractions" className="btn-soft">
              {t.attractions.viewDetails} <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featured.map((a, i) => {
              const d = a[lang]
              return (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.15 }}
                  transition={{ duration: 0.55, delay: i * 0.06 }}
                >
                  <Link
                    to={`/attractions/${a.slug}`}
                    className="block rounded-3xl overflow-hidden card card-lift group h-full"
                  >
                    <div className="h-44 relative">
                      <ImageOrPlaceholder
                        src={a.image}
                        alt={d.name}
                        gradient={a.gradient}
                        icon={a.icon}
                        className="w-full h-full"
                      />
                    </div>
                    <div className="p-4">
                      <p className="text-[10px] uppercase tracking-wider text-forest-300 font-semibold mb-1">
                        {d.tag}
                      </p>
                      <h3 className="font-bold text-white text-sm mb-2 group-hover:text-forest-300 transition-colors">
                        {d.name}
                      </h3>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-forest-300 font-bold">
                          {format(a.price)}
                        </span>
                        <span className="text-slate-400 group-hover:text-white inline-flex items-center gap-1">
                          {t.attractions.viewDetails}
                          <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* SECTION: HOMESTAYS — optional accommodation teaser */}
      <section id="homestays" className="relative py-20 lg:py-24 overflow-hidden scroll-mt-24">
        <div className="absolute inset-0 bg-slate-950/60" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-4">
            <div>
              <MotionHeading>
                <span className="section-badge">
                  <HomeIcon size={14} />
                  {t.homestays.sectionBadge}
                </span>
              </MotionHeading>
              <MotionHeading delay={0.1}>
                <h2 className="section-heading text-left">{t.homestays.heading}</h2>
              </MotionHeading>
            </div>
            <Link to="/homestays" className="btn-soft">
              {t.homestays.viewDetails} <ArrowRight size={14} />
            </Link>
          </div>
          <p className="text-sm text-ocean-200/80 mb-8 max-w-2xl">
            {t.homestays.subheading}
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {stays.map((h, i) => {
              const d = h[lang]
              return (
                <motion.div
                  key={h.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.15 }}
                  transition={{ duration: 0.55, delay: i * 0.1 }}
                >
                  <Link
                    to={`/homestays/${h.slug}`}
                    className="block rounded-3xl overflow-hidden card card-lift group h-full"
                  >
                    <div className="h-52 relative">
                      <ImageOrPlaceholder
                        src={h.images?.[0]}
                        alt={d.name}
                        gradient={h.gradient}
                        icon={h.icon}
                        className="w-full h-full"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-white mb-1 group-hover:text-forest-300 transition-colors">
                        {d.name}
                      </h3>
                      <p className="text-xs text-slate-400 mb-3">{d.tagline}</p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-forest-300 font-black">
                          {format(h.priceFrom)}
                          <span className="text-[10px] text-slate-400 ml-1">/ {t.homestays.perNight}</span>
                        </span>
                        <ArrowRight size={14} className="text-ocean-300 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* SECTION: PACKAGE BUILDER — teaser + CTA */}
      <section id="builder" className="relative py-20 lg:py-24 overflow-hidden scroll-mt-24">
        <div className="absolute inset-0 bg-gradient-to-br from-forest-700/60 via-ocean-700/50 to-deepsea-700/60" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.25 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 max-w-4xl mx-auto px-4 text-center"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold
                           bg-white/15 text-white border border-white/30 mb-4">
            <Sparkles size={13} /> {t.builder.sectionBadge}
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
            {t.builder.heading}
          </h2>
          <p className="text-white/85 max-w-2xl mx-auto mb-7">
            {t.builder.subheading}
          </p>

          {/* What's included info box */}
          <div className="mx-auto max-w-2xl mb-7 p-4 rounded-2xl bg-slate-950/55 border border-white/20
                          text-left text-sm text-slate-200">
            <p className="font-bold text-white mb-2 flex items-center gap-2">
              <Sparkles size={14} className="text-forest-300" /> {t.builder.includesTitle}
            </p>
            <p className="text-slate-200/85">{t.builder.includesInfo}</p>
            <ul className="mt-3 grid sm:grid-cols-2 gap-1.5 text-[13px] text-slate-200/90">
              <li className="flex items-start gap-1.5"><Plus size={12} className="mt-1 text-forest-300 shrink-0" />{t.builder.includesGuide}</li>
              <li className="flex items-start gap-1.5"><Plus size={12} className="mt-1 text-forest-300 shrink-0" />{t.builder.includesTransport}</li>
              <li className="flex items-start gap-1.5"><Plus size={12} className="mt-1 text-forest-300 shrink-0" />{t.builder.includesEducation}</li>
              <li className="flex items-start gap-1.5"><Plus size={12} className="mt-1 text-forest-300 shrink-0" />{t.builder.includesAudience}</li>
            </ul>
          </div>

          <Link to="/builder" className="btn-primary text-base px-7 py-4">
            <Sparkles size={17} />
            {t.hero.ctaBuild}
          </Link>
        </motion.div>
      </section>

      {/* SECTION: GALLERY — auto-playing carousel */}
      <section id="gallery" className="relative py-20 lg:py-24 overflow-hidden scroll-mt-24">
        <div className="absolute inset-0 bg-slate-950/55" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
            <div>
              <MotionHeading>
                <span className="section-badge">
                  <Camera size={14} /> {t.gallery.sectionBadge}
                </span>
              </MotionHeading>
              <MotionHeading delay={0.1}>
                <h2 className="section-heading text-left">{t.gallery.heading}</h2>
              </MotionHeading>
              <p className="text-xs text-slate-400 mt-1">{t.gallery.autoplayHint}</p>
            </div>
            <Link to="/gallery" className="btn-soft">
              {t.attractions.viewDetails} <ArrowRight size={14} />
            </Link>
          </div>
          <GalleryCarousel />
        </div>
      </section>

      {/* SECTION: CONTACT — quick strip */}
      <section id="contact" className="relative py-20 lg:py-24 overflow-hidden scroll-mt-24">
        <div className="absolute inset-0 bg-slate-950/65" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <MotionHeading>
            <span className="section-badge">
              <MessageSquare size={14} /> {t.contact.sectionBadge}
            </span>
          </MotionHeading>
          <MotionHeading delay={0.1}>
            <h2 className="section-heading">{t.contact.heading}</h2>
          </MotionHeading>
          <MotionHeading delay={0.2}>
            <p className="section-subheading">{t.contact.subheading}</p>
          </MotionHeading>

          <div className="mt-8 grid sm:grid-cols-3 gap-4">
            <div className="card p-5 flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-forest-500 to-ocean-500
                              flex items-center justify-center shrink-0">
                <MapPin size={18} className="text-white" />
              </div>
              <div className="text-left">
                <p className="text-[11px] uppercase tracking-wide text-slate-400 font-semibold">{t.contact.addressTitle}</p>
                <p className="text-white text-sm font-semibold">{t.contact.address}</p>
              </div>
            </div>
            <a href={contactPhoneTel} className="card p-5 flex items-center gap-3 hover:border-forest-400/40 transition-colors">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-ocean-500 to-deepsea-500
                              flex items-center justify-center shrink-0">
                <Phone size={18} className="text-white" />
              </div>
              <div className="text-left">
                <p className="text-[11px] uppercase tracking-wide text-slate-400 font-semibold">{t.contact.phoneTitle}</p>
                <p className="text-white text-sm font-semibold">{contactPhoneDisplay}</p>
              </div>
            </a>
            <div className="card p-5 flex items-center gap-3">
              <p className="text-[11px] uppercase tracking-wide text-slate-400 font-semibold mr-2">
                {t.contact.socialTitle}
              </p>
              <a
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-gradient-to-br hover:from-pink-500 hover:to-yellow-400
                           text-white flex items-center justify-center transition-all hover:scale-110"
              >
                <Instagram size={17} />
              </a>
              <a
                href={socialLinks.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-black hover:text-white text-white
                           flex items-center justify-center transition-all hover:scale-110"
              >
                <TikTokIcon size={17} />
              </a>
            </div>
          </div>

          <Link to="/contact" className="btn-soft mt-8 inline-flex">
            {t.contact.formBtn} <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </>
  )
}
