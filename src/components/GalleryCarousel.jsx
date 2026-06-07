// ────────────────────────────────────────────────────────────────────────────
// GalleryCarousel.jsx
// ────────────────────────────────────────────────────────────────────────────
// Auto-scrolling marquee carousel of attraction + homestay images.
// • Smooth continuous CSS-keyframe animation (no JS interval needed).
// • Pauses on hover (handled via `group-hover` on the inner track).
// • Items duplicated end-to-end so the loop is seamless.
// • Each tile uses <ImageOrPlaceholder>, so missing photos look beautiful too.
// ────────────────────────────────────────────────────────────────────────────

import { useLanguage } from '../context/LanguageContext'
import galleryData from '../data/galleryData'
import ImageOrPlaceholder from './ui/ImageOrPlaceholder'

export default function GalleryCarousel({
  speedSec = 60,     // higher = slower
  showCaption = true,
}) {
  const { lang } = useLanguage()
  // Duplicate the list once so the animation can wrap seamlessly.
  const items = [...galleryData, ...galleryData]

  return (
    <div
      className="group relative overflow-hidden rounded-3xl ring-1 ring-white/10
                 bg-slate-950/35 backdrop-blur-sm"
      aria-label="Auto-playing gallery carousel"
    >
      {/* Edge fade for a polished look */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 z-10
                      bg-gradient-to-r from-slate-950/80 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 z-10
                      bg-gradient-to-l from-slate-950/80 to-transparent" />

      <div
        className="flex gap-4 py-4 pl-4 will-change-transform
                   animate-marquee group-hover:[animation-play-state:paused]"
        style={{ animationDuration: `${speedSec}s` }}
      >
        {items.map((item, i) => {
          const data = item[lang]
          return (
            <div
              key={i}
              className="shrink-0 w-56 md:w-64 h-40 md:h-48 rounded-2xl overflow-hidden
                         relative ring-1 ring-white/10 shadow-lg"
            >
              <ImageOrPlaceholder
                src={item.src}
                alt={data?.title || ''}
                gradient={item.gradient}
                icon={item.emoji}
                className="w-full h-full"
              />
              {showCaption && (
                <div className="absolute inset-x-0 bottom-0 p-3
                                bg-gradient-to-t from-black/75 via-black/40 to-transparent">
                  <p className="text-white text-xs font-bold truncate">{data?.title}</p>
                  <p className="text-white/65 text-[10px]">{data?.tag}</p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
