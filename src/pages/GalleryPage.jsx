// ────────────────────────────────────────────────────────────────────────────
// GalleryPage.jsx — auto-playing carousel + tap-to-zoom grid.
// Source data: src/data/galleryData.js (auto-built from attractions + homestays).
// Falls back to gradient mockups when images aren't available yet.
// ────────────────────────────────────────────────────────────────────────────

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import MotionHeading from '../components/ui/MotionHeading'
import ImageOrPlaceholder from '../components/ui/ImageOrPlaceholder'
import GalleryCarousel from '../components/GalleryCarousel'
import galleryItems from '../data/galleryData'

const tileVariants = {
  hidden:  { opacity: 0, scale: 0.85, y: 30 },
  visible: (i) => ({
    opacity: 1, scale: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.04, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
}

export default function GalleryPage() {
  const { t, lang } = useLanguage()
  const g = t.gallery
  const [lightbox, setLightbox] = useState(null)

  const prev = () => setLightbox((i) => (i - 1 + galleryItems.length) % galleryItems.length)
  const next = () => setLightbox((i) => (i + 1) % galleryItems.length)

  return (
    <section className="relative pt-32 pb-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-10">
          <MotionHeading>
            <span className="section-badge">
              <Camera size={14} /> {g.sectionBadge}
            </span>
          </MotionHeading>
          <MotionHeading delay={0.1}>
            <h1 className="section-heading">{g.heading}</h1>
          </MotionHeading>
          <MotionHeading delay={0.15}>
            <div className="accent-divider mb-6" />
          </MotionHeading>
          <MotionHeading delay={0.2}>
            <p className="section-subheading">{g.subheading}</p>
          </MotionHeading>
          <p className="text-xs text-slate-400 mt-2">{g.autoplayHint}</p>
        </div>

        {/* Auto-playing carousel */}
        <div className="mb-14">
          <GalleryCarousel />
        </div>

        {/* Full grid (click to zoom) */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.1 }}
        >
          {galleryItems.map((item, i) => {
            const data = item[lang]
            const isWide = i === 0 || i === 4 || i === 8
            return (
              <motion.div
                key={i}
                custom={i}
                variants={tileVariants}
                onClick={() => setLightbox(i)}
                className={`relative overflow-hidden rounded-2xl cursor-pointer group
                            ${isWide ? 'col-span-2' : 'col-span-1'}`}
              >
                <div className="relative h-48 md:h-56">
                  <ImageOrPlaceholder
                    src={item.src}
                    alt={data.title}
                    gradient={item.gradient}
                    icon={item.emoji}
                    className="w-full h-full"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/45
                                  transition-all duration-300 flex items-end p-4">
                    <div className="translate-y-4 group-hover:translate-y-0 opacity-0
                                    group-hover:opacity-100 transition-all duration-300">
                      <p className="text-white font-bold text-sm">{data.title}</p>
                      <p className="text-white/70 text-xs">{data.tag}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
          >
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-4 right-4 text-white/70 hover:text-white z-50
                         w-10 h-10 flex items-center justify-center rounded-full bg-white/10
                         hover:bg-white/20 transition-colors"
            >
              <X size={22} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); prev() }}
              className="absolute left-4 text-white/70 hover:text-white z-50
                         w-10 h-10 flex items-center justify-center rounded-full bg-white/10
                         hover:bg-white/20 transition-colors"
            >
              <ChevronLeft size={22} />
            </button>

            <motion.div
              className="max-w-lg w-full"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="h-72 md:h-96 rounded-3xl overflow-hidden">
                <ImageOrPlaceholder
                  src={galleryItems[lightbox].src}
                  alt={galleryItems[lightbox][lang].title}
                  gradient={galleryItems[lightbox].gradient}
                  icon={galleryItems[lightbox].emoji}
                  className="w-full h-full"
                  iconClassName="text-8xl md:text-9xl"
                />
              </div>
              <div className="text-center mt-4">
                <p className="text-white font-bold text-lg">{galleryItems[lightbox][lang].title}</p>
                <p className="text-white/45 text-sm">{lightbox + 1} / {galleryItems.length}</p>
              </div>
            </motion.div>

            <button
              onClick={(e) => { e.stopPropagation(); next() }}
              className="absolute right-4 text-white/70 hover:text-white z-50
                         w-10 h-10 flex items-center justify-center rounded-full bg-white/10
                         hover:bg-white/20 transition-colors"
            >
              <ChevronRight size={22} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
