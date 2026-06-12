// ────────────────────────────────────────────────────────────────────────────
// VideoShowcase.jsx — "Meet Kampung Bolok" AUTOPLAY video carousel.
// ────────────────────────────────────────────────────────────────────────────
//  • One pre-generated MP4 plays automatically (muted, as browsers require),
//    then auto-advances to the next video when it ends — no play button.
//  • Language-aware: English serves /videos/english, Malay /videos/malay.
//  • Thumbnail indicators + arrows allow manual navigation.
//  • Unmute toggle lets visitors hear audio.
//  • If a video file is missing/broken → shows the thumbnail and auto-advances,
//    never crashes.
// ────────────────────────────────────────────────────────────────────────────

import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Volume2, VolumeX, AlertCircle } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import { getAiVideos } from '../data/aiVideos'
import ImageOrPlaceholder from './ui/ImageOrPlaceholder'

const FALLBACK_MS = 6000 // how long to show a missing video's thumbnail before advancing

export default function VideoShowcase() {
  const { t, lang } = useLanguage()
  const sv = t.smartTourism
  const videos = useMemo(() => getAiVideos(lang), [lang])

  const [index, setIndex] = useState(0)
  const [muted, setMuted] = useState(true)
  const [errored, setErrored] = useState(false)
  const videoRef = useRef(null)

  const active = videos[index]
  const go = (i) => setIndex((i + videos.length) % videos.length)
  const next = () => go(index + 1)
  const prev = () => go(index - 1)

  // Reset the error state whenever the active clip (or language) changes.
  useEffect(() => { setErrored(false) }, [index, lang])

  // If the current video is missing/broken, hold its thumbnail briefly then move on.
  useEffect(() => {
    if (!errored) return
    const id = setTimeout(next, FALLBACK_MS)
    return () => clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errored, index])

  return (
    <div className="grid lg:grid-cols-[1fr,auto] gap-5 items-stretch">
      {/* Stage */}
      <div className="relative rounded-3xl overflow-hidden ring-1 ring-white/10 bg-black shadow-2xl">
        <div className="relative aspect-video">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${lang}-${active.id}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0"
            >
              {errored ? (
                <div className="relative w-full h-full">
                  <ImageOrPlaceholder
                    src={active.thumbnail}
                    alt={active.title}
                    gradient="from-forest-600 to-ocean-700"
                    className="w-full h-full"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/55 text-center px-6">
                    <AlertCircle size={26} className="text-amber-300 mb-2" />
                    <p className="text-white text-sm font-semibold">{sv.videoComingSoon}</p>
                  </div>
                </div>
              ) : (
                <video
                  ref={videoRef}
                  key={active.videoUrl}
                  src={active.videoUrl}
                  poster={active.thumbnail}
                  autoPlay
                  muted={muted}
                  playsInline
                  preload="auto"
                  onEnded={next}
                  onError={() => setErrored(true)}
                  className="w-full h-full object-cover"
                />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Caption overlay */}
          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6
                          bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none">
            <h3 className="text-white font-black text-lg sm:text-xl drop-shadow">{active.title}</h3>
            <p className="text-slate-200/90 text-xs sm:text-sm mt-1 max-w-xl drop-shadow">{active.description}</p>
          </div>

          {/* Mute / unmute */}
          <button
            onClick={() => setMuted((m) => !m)}
            aria-label={muted ? sv.unmuteLabel : sv.muteLabel}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70
                       text-white flex items-center justify-center transition-colors"
          >
            {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>

          {/* Prev / next arrows */}
          <button
            onClick={prev}
            aria-label={sv.prevLabel}
            className="absolute top-1/2 -translate-y-1/2 left-3 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70
                       text-white flex items-center justify-center transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={next}
            aria-label={sv.nextLabel}
            className="absolute top-1/2 -translate-y-1/2 right-3 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70
                       text-white flex items-center justify-center transition-colors"
          >
            <ChevronRight size={20} />
          </button>

          {/* Progress dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            {videos.map((v, i) => (
              <button
                key={v.id}
                onClick={() => go(i)}
                aria-label={`${sv.playLabel}: ${v.title}`}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? 'w-6 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Thumbnail rail (click to jump) — horizontal on mobile, vertical on desktop */}
      <div className="flex lg:flex-col gap-3 lg:w-40 overflow-x-auto lg:overflow-visible pb-1">
        {videos.map((v, i) => (
          <button
            key={v.id}
            onClick={() => go(i)}
            className={`group relative shrink-0 w-32 lg:w-full aspect-video rounded-2xl overflow-hidden
                        ring-2 transition-all ${
                          i === index ? 'ring-forest-400' : 'ring-white/10 hover:ring-white/30'
                        }`}
            aria-label={v.title}
          >
            <ImageOrPlaceholder
              src={v.thumbnail}
              alt={v.title}
              gradient="from-forest-500 to-ocean-600"
              className="w-full h-full"
            />
            <div className={`absolute inset-0 transition-colors ${i === index ? 'bg-black/0' : 'bg-black/40 group-hover:bg-black/20'}`} />
            <span className="absolute bottom-1.5 left-2 right-2 text-left text-white text-[10px] font-semibold
                             leading-tight drop-shadow truncate">
              {v.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
