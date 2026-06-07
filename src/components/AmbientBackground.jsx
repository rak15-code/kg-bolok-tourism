// ────────────────────────────────────────────────────────────────────────────
// AmbientBackground.jsx
// ────────────────────────────────────────────────────────────────────────────
// A fixed, layered background that lives behind every page:
//   - deep eco gradient base
//   - 4 animated colored blobs (subtle parallax)
//   - a fine noise grid for texture
// Designed to make sure NO section ever feels visually blank.
// ────────────────────────────────────────────────────────────────────────────

import { motion } from 'framer-motion'

export default function AmbientBackground() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none select-none overflow-hidden"
      style={{ zIndex: -10 }}
    >
      {/* Base eco gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#022c22] via-[#053b3b] to-[#0c1f47]" />

      {/* Animated colour blobs */}
      <motion.div
        className="blob bg-forest-500"
        style={{ width: 520, height: 520, top: '-10%', left: '-8%' }}
        animate={{ x: [0, 40, -20, 0], y: [0, 30, -10, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="blob bg-ocean-500"
        style={{ width: 460, height: 460, top: '30%', right: '-12%' }}
        animate={{ x: [0, -30, 20, 0], y: [0, 25, -15, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="blob bg-deepsea-500"
        style={{ width: 520, height: 520, bottom: '-12%', left: '15%' }}
        animate={{ x: [0, 30, -25, 0], y: [0, -20, 15, 0] }}
        transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="blob bg-forest-400"
        style={{ width: 380, height: 380, top: '55%', right: '20%' }}
        animate={{ x: [0, -20, 30, 0], y: [0, 10, -25, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
      />

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
