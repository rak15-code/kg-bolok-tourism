// ────────────────────────────────────────────────────────────────────────────
// ImageOrPlaceholder.jsx
// ────────────────────────────────────────────────────────────────────────────
// Tries to render an <img>; if it fails (because real images aren't in /public
// yet) it falls back to a beautiful gradient + icon mockup. This means the
// website looks finished today, and will look REAL the moment images are
// dropped in. No code changes required to swap in real photos.
// ────────────────────────────────────────────────────────────────────────────

import { useState } from 'react'

export default function ImageOrPlaceholder({
  src,
  alt = '',
  gradient = 'from-forest-500 to-ocean-500',
  icon = '🌿',
  className = '',
  iconClassName = 'text-6xl md:text-7xl',
}) {
  const [failed, setFailed] = useState(!src)

  if (failed) {
    return (
      <div
        className={`relative bg-gradient-to-br ${gradient} flex items-center justify-center
                    overflow-hidden ${className}`}
        aria-label={alt}
      >
        <span className={`opacity-85 ${iconClassName} drop-shadow-2xl`} aria-hidden="true">
          {icon}
        </span>
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        {/* subtle shine bar */}
        <div className="absolute -left-1/3 top-0 w-1/2 h-full
                        bg-gradient-to-r from-transparent via-white/15 to-transparent
                        rotate-12 pointer-events-none" />
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      className={`object-cover ${className}`}
      loading="lazy"
    />
  )
}
