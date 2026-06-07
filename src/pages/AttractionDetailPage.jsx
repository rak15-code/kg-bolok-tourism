// ────────────────────────────────────────────────────────────────────────────
// AttractionDetailPage.jsx
// ────────────────────────────────────────────────────────────────────────────
// /attractions/:slug — full detail page for one attraction.
//
//  • Image carousel (auto-advance + manual prev/next, falls back to a
//    gradient placeholder when images are missing).
//  • Lists all sub-packages (when the attraction has them), pricing,
//    duration, highlights.
//  • "Add to Package" pushes the selection into BuilderContext.
// ────────────────────────────────────────────────────────────────────────────

import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, Clock, Plus, Check, Sparkles, Star, MapPin, Compass,
  ChevronLeft, ChevronRight, AlertTriangle,
} from 'lucide-react'
import { getAttractionBySlug } from '../data/attractionsData'
import { useLanguage } from '../context/LanguageContext'
import { useBuilder } from '../context/BuilderContext'
import { useCurrency } from '../context/CurrencyContext'
import ImageOrPlaceholder from '../components/ui/ImageOrPlaceholder'
import NotFoundPage from './NotFoundPage'

export default function AttractionDetailPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { t, lang } = useLanguage()
  const { format } = useCurrency()
  const at = t.attractions

  const attraction = getAttractionBySlug(slug)
  const { addAttraction, isAttractionAdded } = useBuilder()

  // ── Hooks must be unconditional — declare BEFORE the early return. ──
  const images = attraction?.images?.length
    ? attraction.images
    : [attraction?.image].filter(Boolean)
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (!images.length || paused) return
    const id = setInterval(() => {
      setActive((i) => (i + 1) % images.length)
    }, 4500)
    return () => clearInterval(id)
  }, [images.length, paused])

  if (!attraction) return <NotFoundPage />

  const data = attraction[lang]
  const added = isAttractionAdded(attraction.id)
  const notes = attraction.notes?.[lang]

  const goPrev = () => setActive((i) => (i - 1 + images.length) % images.length)
  const goNext = () => setActive((i) => (i + 1) % images.length)

  return (
    <article className="relative pt-28 pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <Link
          to="/attractions"
          className="inline-flex items-center gap-2 text-sm font-semibold text-white/70
                     hover:text-forest-300 transition-colors mb-6"
        >
          <ArrowLeft size={15} />
          {at.backToList}
        </Link>

        <div className="grid lg:grid-cols-5 gap-10">

          {/* LEFT — carousel + description */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-3"
          >
            {/* ── IMAGE CAROUSEL ── */}
            <div
              className="relative rounded-3xl overflow-hidden ring-1 ring-white/15 shadow-2xl
                         h-[360px] md:h-[480px] group bg-slate-950/30"
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0"
                >
                  <ImageOrPlaceholder
                    src={images[active]}
                    alt={data.name}
                    gradient={attraction.gradient}
                    icon={attraction.icon}
                    className="w-full h-full"
                    iconClassName="text-8xl"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Tag */}
              <div className="absolute top-5 left-5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
                              bg-black/45 backdrop-blur-md text-forest-200 text-xs font-semibold
                              border border-forest-300/30 z-10">
                <Sparkles size={12} />
                {data.tag}
              </div>

              {/* Bottom strip */}
              <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                                bg-white/10 backdrop-blur-xl border border-white/20 text-white text-xs">
                  <MapPin size={12} className="text-ocean-300" />
                  Kg Bolok, Pahang
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
                                bg-amber-500/20 backdrop-blur-xl border border-amber-300/40 text-amber-200 text-xs font-bold">
                  <Star size={12} className="fill-amber-300 text-amber-300" />
                  4.9
                </div>
              </div>

              {/* Manual nav */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={goPrev}
                    aria-label="Previous image"
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-20
                               w-10 h-10 rounded-full bg-black/45 hover:bg-black/65 text-white
                               flex items-center justify-center backdrop-blur-md
                               opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={goNext}
                    aria-label="Next image"
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-20
                               w-10 h-10 rounded-full bg-black/45 hover:bg-black/65 text-white
                               flex items-center justify-center backdrop-blur-md
                               opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronRight size={18} />
                  </button>

                  {/* Dots */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                    {images.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActive(i)}
                        aria-label={`Show image ${i + 1}`}
                        className={`w-2.5 h-2.5 rounded-full transition-all ${
                          i === active
                            ? 'bg-white scale-125'
                            : 'bg-white/40 hover:bg-white/70'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-slate-200 text-base md:text-lg leading-relaxed mt-8"
            >
              {data.description}
            </motion.p>

            {/* Packages list */}
            {attraction.packages?.length > 0 && (
              <div className="mt-10">
                <h2 className="text-xs font-bold uppercase tracking-wider text-forest-300 mb-3">
                  {at.packages}
                </h2>
                <div className="space-y-2">
                  {attraction.packages.map((p) => {
                    const pd = p[lang]
                    return (
                      <div
                        key={p.key}
                        className="flex items-start justify-between gap-3 p-4 rounded-2xl
                                   bg-white/5 border border-white/10"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-bold">{pd.name}</p>
                          <p className="text-sm text-slate-300">{pd.desc}</p>
                          <p className="text-[11px] text-slate-400 mt-1 inline-flex items-center gap-1">
                            <Clock size={11} />
                            {p.duration[lang]}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-forest-300 font-black text-lg">
                            {format(p.price)}
                          </div>
                          <div className="text-[10px] text-slate-400">{at.perPerson}</div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {notes && (
                  <div className="mt-4 flex items-start gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-300/30
                                  text-amber-200 text-xs">
                    <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                    <div>
                      <p className="font-bold">{at.notesTitle}</p>
                      <p className="text-amber-100/85">{notes}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>

          {/* RIGHT — booking card */}
          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="card-glass p-6 sticky top-28">
              <h1 className="text-3xl md:text-4xl font-black text-white leading-tight mb-2">
                {data.name}
              </h1>
              <div className="flex items-center gap-3 text-sm text-slate-300 mb-6">
                <span className="inline-flex items-center gap-1.5">
                  <Clock size={14} className="text-ocean-300" />
                  {attraction.duration[lang]}
                </span>
              </div>

              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-4xl font-black gradient-text">{format(attraction.price)}</span>
                <span className="text-slate-400 text-sm">/ {at.perPerson}</span>
              </div>

              {/* Highlights */}
              <h3 className="text-xs font-bold uppercase tracking-wider text-forest-300 mb-3">
                {at.highlights}
              </h3>
              <ul className="space-y-2 mb-7">
                {data.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-slate-200">
                    <Check size={15} className="text-forest-300 mt-0.5 shrink-0" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>

              {/* Add to package CTA */}
              <button
                disabled={added}
                onClick={() => {
                  addAttraction(attraction)
                  navigate('/builder')
                }}
                className={`w-full py-4 rounded-2xl font-bold text-white transition-all
                            flex items-center justify-center gap-2 active:scale-95
                            ${added
                              ? 'bg-forest-700/60 cursor-not-allowed'
                              : 'bg-gradient-to-r from-forest-500 to-ocean-500 hover:shadow-xl hover:shadow-ocean-500/30'}`}
              >
                {added ? <Check size={17} /> : <Plus size={17} />}
                {added ? at.addedToPackage : at.addToPackage}
              </button>

              <Link
                to="/attractions"
                className="mt-3 w-full inline-flex justify-center btn-soft"
              >
                <Compass size={14} /> {at.backToList}
              </Link>
            </div>
          </motion.aside>
        </div>
      </div>
    </article>
  )
}
