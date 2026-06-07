// ────────────────────────────────────────────────────────────────────────────
// HomestayDetailPage.jsx — /homestays/:slug
// User picks a room, sets nights, and adds the stay to their Package.
// (Homestay is OPTIONAL — they can skip it entirely from the builder.)
// ────────────────────────────────────────────────────────────────────────────

import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, Check, Plus, Star, Users, Bed, Wifi, Coffee, ShieldCheck,
  ChevronLeft, ChevronRight,
} from 'lucide-react'
import { getHomestayBySlug } from '../data/homestaysData'
import { useLanguage } from '../context/LanguageContext'
import { useBuilder } from '../context/BuilderContext'
import { useCurrency } from '../context/CurrencyContext'
import ImageOrPlaceholder from '../components/ui/ImageOrPlaceholder'
import NotFoundPage from './NotFoundPage'

export default function HomestayDetailPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { t, lang } = useLanguage()
  const { format } = useCurrency()
  const hs = t.homestays

  const homestay = getHomestayBySlug(slug)
  const { addHomestay, isHomestayAdded, getSelectedRoom } = useBuilder()

  // ── Hooks declared unconditionally ──
  const images = homestay?.images?.length ? homestay.images : []
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const preselected = homestay ? getSelectedRoom(homestay.slug) : null
  const [selectedKey, setSelectedKey] = useState(
    preselected?.key ?? homestay?.rooms[0]?.key
  )
  const [nights, setNights] = useState(1)

  useEffect(() => {
    if (!images.length || paused) return
    const id = setInterval(() => setActive((i) => (i + 1) % images.length), 4500)
    return () => clearInterval(id)
  }, [images.length, paused])

  if (!homestay) return <NotFoundPage />

  const data = homestay[lang]
  const added = isHomestayAdded(homestay.slug)
  const selectedRoom = homestay.rooms.find((r) => r.key === selectedKey)

  const facilityIcon = (label) => {
    const l = label.toLowerCase()
    if (l.includes('wi-fi')) return <Wifi size={14} />
    if (l.includes('breakfast') || l.includes('sarapan')) return <Coffee size={14} />
    if (l.includes('shower') || l.includes('bathroom') || l.includes('mandi') || l.includes('bilik air')) return <Bed size={14} />
    return <Check size={14} />
  }

  const goPrev = () => setActive((i) => (i - 1 + images.length) % images.length)
  const goNext = () => setActive((i) => (i + 1) % images.length)

  return (
    <article className="relative pt-28 pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <Link
          to="/homestays"
          className="inline-flex items-center gap-2 text-sm font-semibold text-white/70
                     hover:text-forest-300 transition-colors mb-6"
        >
          <ArrowLeft size={15} />
          {hs.backToList}
        </Link>

        {/* IMAGE CAROUSEL */}
        <div
          className="relative rounded-3xl overflow-hidden ring-1 ring-white/15 shadow-2xl
                     h-72 md:h-[420px] group bg-slate-950/30 mb-10"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              <ImageOrPlaceholder
                src={images[active]}
                alt={data.name}
                gradient={homestay.gradient}
                icon={homestay.icon}
                className="w-full h-full"
                iconClassName="text-8xl"
              />
            </motion.div>
          </AnimatePresence>
          <div className="absolute top-4 right-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
                          bg-black/45 backdrop-blur-md text-amber-200 text-xs font-bold
                          border border-amber-300/30 z-10">
            <Star size={12} className="fill-amber-300 text-amber-300" />
            {homestay.rating}
          </div>

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
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    aria-label={`Show image ${i + 1}`}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      i === active ? 'bg-white scale-125' : 'bg-white/40 hover:bg-white/70'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <div className="grid lg:grid-cols-5 gap-10">

          {/* LEFT — info & rooms */}
          <div className="lg:col-span-3 space-y-10">

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h1 className="text-3xl md:text-4xl font-black text-white mb-2">{data.name}</h1>
              <p className="text-ocean-300 font-semibold mb-4">{data.tagline}</p>
              <p className="text-slate-200 leading-relaxed">{data.description}</p>
            </motion.div>

            {/* Facilities */}
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-forest-300 mb-3">
                {hs.facilities}
              </h2>
              <div className="grid sm:grid-cols-2 gap-2">
                {data.facilities.map((f, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-white/5 border border-white/10
                               text-sm text-slate-200"
                  >
                    <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-forest-500 to-ocean-500
                                     flex items-center justify-center text-white">
                      {facilityIcon(f)}
                    </span>
                    {f}
                  </div>
                ))}
              </div>
            </div>

            {/* Rooms */}
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-forest-300 mb-3">
                {hs.roomTypes}
              </h2>
              <div className="space-y-3">
                {homestay.rooms.map((room) => {
                  const rd = room[lang]
                  const isPicked = room.key === selectedKey
                  return (
                    <button
                      key={room.key}
                      onClick={() => setSelectedKey(room.key)}
                      className={`w-full text-left rounded-2xl p-4 border transition-all duration-200
                        ${isPicked
                          ? 'border-forest-300 bg-gradient-to-br from-forest-500/15 to-ocean-500/15 ring-1 ring-forest-300/40'
                          : 'border-white/10 bg-white/5 hover:bg-white/10'}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-white">{rd.name}</h3>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full
                                             bg-white/10 text-[10px] font-semibold text-slate-200">
                              <Users size={10} />
                              {room.guests}
                            </span>
                          </div>
                          <p className="text-slate-300 text-sm">{rd.desc}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-forest-300 font-black text-lg">
                            {format(room.price)}
                          </div>
                          <div className="text-[10px] text-slate-400">{hs.perNight}</div>
                        </div>
                      </div>
                      {isPicked && (
                        <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-forest-300">
                          <Check size={13} /> {hs.selectedRoom}
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* RIGHT — booking sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-2"
          >
            <div className="card-glass p-6 sticky top-28 space-y-5">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black gradient-text">
                  {format(selectedRoom?.price ?? homestay.priceFrom)}
                </span>
                <span className="text-slate-400 text-sm">/ {hs.perNight}</span>
              </div>

              <div>
                <label className="label">{hs.nights}</label>
                <input
                  type="number"
                  min={1}
                  value={nights}
                  onChange={(e) => setNights(Math.max(1, Number(e.target.value) || 1))}
                  className="input-field"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-white/10">
                <span className="text-slate-300 text-sm">Subtotal</span>
                <span className="text-white font-black text-lg">
                  {format((selectedRoom?.price ?? 0) * nights)}
                </span>
              </div>

              <button
                onClick={() => {
                  if (!selectedRoom) return
                  addHomestay(homestay, { ...selectedRoom, key: selectedRoom.key }, nights)
                  navigate('/builder')
                }}
                className={`w-full py-4 rounded-2xl font-bold text-white transition-all
                            flex items-center justify-center gap-2 active:scale-95
                            ${added
                              ? 'bg-forest-700/70'
                              : 'bg-gradient-to-r from-forest-500 to-ocean-500 hover:shadow-xl hover:shadow-ocean-500/30'}`}
              >
                {added ? <Check size={17} /> : <Plus size={17} />}
                {added ? hs.addedToPackage : hs.addToPackage}
              </button>

              <p className="text-[11px] text-slate-400 flex items-center gap-1.5 leading-tight">
                <ShieldCheck size={12} className="text-forest-300" />
                Pay later — only when you confirm your final package.
              </p>
            </div>
          </motion.aside>
        </div>
      </div>
    </article>
  )
}
