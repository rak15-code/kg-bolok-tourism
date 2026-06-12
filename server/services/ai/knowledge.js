// ────────────────────────────────────────────────────────────────────────────
// services/ai/knowledge.js
// ────────────────────────────────────────────────────────────────────────────
// Builds a compact, factual knowledge base from the site's own data files so the
// AI assistant and virtual tour are GROUNDED in real attractions, prices,
// homestays, and packages — not hallucinated. Bilingual (en | bm).
// ────────────────────────────────────────────────────────────────────────────

import attractions from '../../../src/data/attractionsData.js'
import homestays   from '../../../src/data/homestaysData.js'
import packages    from '../../../src/data/packagesData.js'

export function buildKnowledgeBase(lang = 'en') {
  const L = lang === 'bm' ? 'bm' : 'en'

  const attractionLines = attractions.map((a) => {
    const d = a[L] || a.en
    const price = a.basePrice ?? a.price
    const pkgs = a.packages?.length
      ? ' Options: ' + a.packages.map((p) => `${(p[L] || p.en).name} RM${p.price}`).join('; ') + '.'
      : ''
    return `- ${d.name} (${a.category}, from RM${price}/pax, ~${(a.duration?.[L] || a.duration?.en) || 'varies'}): ${d.description}${pkgs}`
  }).join('\n')

  const homestayLines = homestays.map((h) => {
    const d = h[L] || h.en
    const rooms = (h.rooms || []).map((r) => `${(r[L] || r.en).name} RM${r.price}/night (${r.guests} pax)`).join('; ')
    return `- ${d.name} (from RM${h.priceFrom}/night, rating ${h.rating}): ${d.tagline}. Rooms: ${rooms}.`
  }).join('\n')

  const packageLines = packages.map((p) => {
    const d = p[L] || p.en
    return `- ${d.title}: includes ${d.includes.join(', ')}. Was RM${p.originalPrice}, now ONLY RM${p.discountedPrice} (${p.discountPercentage}% off).`
  }).join('\n')

  return `KAMPUNG BOLOK TOURISM — KNOWLEDGE BASE
Location: Kampung Bolok, Pahang, Malaysia. A traditional Malay village with wildlife, indigenous Che Wong culture, traditional crafts, cuisine, and homestays.

ATTRACTIONS:
${attractionLines}

HOMESTAYS:
${homestayLines}

FEATURED PACKAGES (promotions):
${packageLines}

BOOKING: Visitors build a custom package on the website (choose attractions + optional homestay), or pick a featured package. Bundle discounts: 3 attractions = 15% off, 5 = 20%, 7 = 25%. All packages include a tour guide and transport. Currencies: MYR (base), USD, SGD, INR, EUR.`
}
