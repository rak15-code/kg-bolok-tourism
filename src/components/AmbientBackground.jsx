// ────────────────────────────────────────────────────────────────────────────
// AmbientBackground.jsx
// ────────────────────────────────────────────────────────────────────────────
// A fixed, layered background that lives behind every page:
//   0. deep eco gradient base (always present — also the fallback)
//   1. GLOBAL website photo (/images/hero/web-bg.jpg) — heavily blurred,
//      with a subtle parallax drift on scroll
//   2. green + blue gradient overlay (premium eco-tourism tint)
//   3. animated colour blobs + fine grain for depth
//
// ── DROP YOUR BACKGROUND PHOTO HERE ─────────────────────────────────────────
//   public/images/hero/web-bg.jpg
//   If the file is missing the eco gradient base shows through — nothing breaks.
//
// Text readability is protected: the photo is blurred + darkened by overlays,
// and each page section adds its own translucent panel on top.
// ────────────────────────────────────────────────────────────────────────────

import { motion, useScroll, useTransform } from 'framer-motion'

const BG_IMAGE = '/images/hero/web-bg.jpg'

export default function AmbientBackground() {
  // Whole-page scroll → gentle vertical parallax for the photo layer.
  const { scrollY } = useScroll()
  const photoY = useTransform(scrollY, [0, 1500], [0, 140])

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none select-none overflow-hidden"
      style={{ zIndex: -10 }}
    >
      {/* 0. Base eco gradient (fallback if the photo is missing) */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#022c22] via-[#053b3b] to-[#0c1f47]" />

      {/* 1. Global photo — softly blurred + parallax. Scaled up so the blur
            edges and the parallax drift never reveal the viewport border. */}
      <motion.div
        style={{
          y: photoY,
          backgroundImage: `url(${BG_IMAGE})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(14px) saturate(1.15)',
          willChange: 'transform',
        }}
        className="absolute -inset-[8%]"
      />

      {/* No colour tint — just the blurred photo. Only a soft top vignette
          keeps the navbar text readable. */}

      {/* Top vignette so the navbar text stays readable */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/40 to-transparent" />

      {/* Subtle noise / grain */}
      <div
        className="absolute inset-0 opacity-30 mix-blend-overlay"
        style={{
          backgroundImage:
            'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '3px 3px',
        }}
      />
    </div>
  )
}
