// ────────────────────────────────────────────────────────────────────────────
// hooks/usePackages.js
// ────────────────────────────────────────────────────────────────────────────
// Returns the featured packages. Starts with the static fallback (so the UI
// paints instantly and works with no DB), then swaps in the live `packages`
// table from Supabase if it's configured and returns rows.
//
// DB rows are normalised back into the same shape as src/data/packagesData.js
// so consumers don't care where the data came from.
// ────────────────────────────────────────────────────────────────────────────

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import staticPackages from '../data/packagesData'

function fromRow(r) {
  return {
    slug: r.slug,
    icon: r.icon,
    gradient: r.gradient || 'from-forest-500 to-ocean-500',
    originalPrice: Number(r.original_price),
    discountedPrice: Number(r.discounted_price),
    discountPercentage: Number(r.discount_percentage),
    currency: r.currency || 'MYR',
    attractionSlugs: r.attraction_slugs || [],
    homestaySlug: r.homestay_slug || null,
    en: { title: r.title_en, includes: r.includes_en || [] },
    bm: { title: r.title_bm, includes: r.includes_bm || [] },
  }
}

export default function usePackages() {
  const [packages, setPackages] = useState(staticPackages)
  const [loading, setLoading] = useState(!!supabase)

  useEffect(() => {
    if (!supabase) return
    let alive = true
    ;(async () => {
      const { data, error } = await supabase
        .from('packages')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })
      if (alive && !error && data?.length) setPackages(data.map(fromRow))
      if (alive) setLoading(false)
    })()
    return () => { alive = false }
  }, [])

  return { packages, loading }
}
