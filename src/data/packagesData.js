// ────────────────────────────────────────────────────────────────────────────
// packagesData.js
// ────────────────────────────────────────────────────────────────────────────
// The featured / promotional packages shown ABOVE the Custom Package Builder.
//
// This file is the STATIC FALLBACK. When Supabase is configured, the live
// values come from the `packages` table (managed in the admin dashboard) and
// these are only used if the DB is unreachable. Keep the shapes in sync.
//
// `attractionSlugs` / `homestaySlug` let "Book This Package" pre-fill the
// Package Builder with exactly these experiences.
// ────────────────────────────────────────────────────────────────────────────

const packagesData = [
  {
    slug: 'family-adventure',
    icon: '🐘',
    gradient: 'from-forest-500 to-ocean-500',
    originalPrice: 180,
    discountedPrice: 149,
    discountPercentage: 17,
    currency: 'MYR',
    attractionSlugs: ['elephant-conservation-centre', 'deerland', 'bahulu'],
    homestaySlug: null,
    en: {
      title: 'Family Adventure Package',
      includes: [
        'Elephant Regular Service',
        'Deerland',
        'Bahulu Making',
        'Transport',
        'Tour Guide',
      ],
    },
    bm: {
      title: 'Pakej Pengembaraan Keluarga',
      includes: [
        'Perkhidmatan Biasa Gajah',
        'Deerland',
        'Pembuatan Bahulu',
        'Pengangkutan',
        'Pemandu Pelancong',
      ],
    },
  },

  {
    slug: 'culture-heritage',
    icon: '🪶',
    gradient: 'from-deepsea-500 to-ocean-600',
    originalPrice: 220,
    discountedPrice: 179,
    discountPercentage: 19,
    currency: 'MYR',
    attractionSlugs: ['che-wong', 'tarian-piring', 'silat', 'tapai-pulut'],
    homestaySlug: null,
    en: {
      title: 'Culture & Heritage Package',
      includes: [
        'Che Wong Cultural Experience',
        'Tarian Piring',
        'Silat Kampung Bolok',
        'Tapai Pulut Making',
        'Transport',
        'Tour Guide',
      ],
    },
    bm: {
      title: 'Pakej Budaya & Warisan',
      includes: [
        'Pengalaman Budaya Che Wong',
        'Tarian Piring',
        'Silat Kampung Bolok',
        'Pembuatan Tapai Pulut',
        'Pengangkutan',
        'Pemandu Pelancong',
      ],
    },
  },
]

export default packagesData
