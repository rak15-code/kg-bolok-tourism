// ────────────────────────────────────────────────────────────────────────────
// BuilderContext.jsx
// ────────────────────────────────────────────────────────────────────────────
// Global state for the Package Builder.
// Stores which attractions/homestays the user has selected, group size, days.
// Persists to localStorage so the user's selection survives a page reload.
//
// Exposes:
//   attractions       array of attraction objects
//   homestays         array of { homestay, room, nights }
//   visitors          number
//   days              number
//   addAttraction(a)
//   removeAttraction(id)
//   isAttractionAdded(id) → boolean
//   addHomestay(homestay, room, nights)
//   removeHomestay(slug)
//   isHomestayAdded(slug) → boolean
//   setVisitors(n) / setDays(n)
//   clear()
// ────────────────────────────────────────────────────────────────────────────

import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const BuilderContext = createContext(null)

const STORAGE_KEY = 'kgbolok_builder_v1'

const initial = {
  attractions: [],
  homestays: [],
  visitors: 2,
  days: 1,
  // When set, the user picked a FEATURED package and pays its flat promo price.
  // Any manual edit (add/remove attraction) clears it back to per-person pricing.
  featuredPackage: null,
}

function loadInitial() {
  if (typeof window === 'undefined') return initial
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return initial
    const parsed = JSON.parse(raw)
    return { ...initial, ...parsed }
  } catch {
    return initial
  }
}

export function BuilderProvider({ children }) {
  const [state, setState] = useState(loadInitial)

  // Persist on every change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    }
  }, [state])

  const value = useMemo(() => ({
    ...state,

    addAttraction: (attraction) =>
      setState((s) =>
        s.attractions.some((a) => a.id === attraction.id)
          ? s
          : { ...s, featuredPackage: null, attractions: [...s.attractions, attraction] }
      ),

    removeAttraction: (id) =>
      setState((s) => ({
        ...s,
        featuredPackage: null, // editing breaks the flat promo price
        attractions: s.attractions.filter((a) => a.id !== id),
      })),

    // Load a featured package. `flat` keeps the promo price (Book This Package);
    // false drops to per-person pricing for editing (Customize Instead).
    loadPackage: (pkg, attractionObjects, { flat = true } = {}) =>
      setState((s) => ({
        ...s,
        attractions: attractionObjects,
        homestays: [],
        featuredPackage: flat ? pkg : null,
      })),

    isAttractionAdded: (id) => state.attractions.some((a) => a.id === id),

    addHomestay: (homestay, room, nights = 1) =>
      setState((s) => {
        // Replace any prior selection from the same homestay so only one room
        // per homestay can be in the package.
        const filtered = s.homestays.filter((h) => h.homestay.slug !== homestay.slug)
        return {
          ...s,
          homestays: [...filtered, { homestay, room, nights }],
        }
      }),

    removeHomestay: (slug) =>
      setState((s) => ({
        ...s,
        homestays: s.homestays.filter((h) => h.homestay.slug !== slug),
      })),

    isHomestayAdded: (slug) =>
      state.homestays.some((h) => h.homestay.slug === slug),

    getSelectedRoom: (slug) =>
      state.homestays.find((h) => h.homestay.slug === slug)?.room ?? null,

    setVisitors: (n) =>
      setState((s) => ({ ...s, visitors: Math.max(1, Number(n) || 1) })),

    setDays: (n) =>
      setState((s) => ({ ...s, days: Math.max(1, Number(n) || 1) })),

    setHomestayNights: (slug, nights) =>
      setState((s) => ({
        ...s,
        homestays: s.homestays.map((h) =>
          h.homestay.slug === slug
            ? { ...h, nights: Math.max(1, Number(nights) || 1) }
            : h
        ),
      })),

    clear: () => setState(initial),

    itemCount:
      state.attractions.length +
      state.homestays.length,
  }), [state])

  return (
    <BuilderContext.Provider value={value}>{children}</BuilderContext.Provider>
  )
}

export function useBuilder() {
  const ctx = useContext(BuilderContext)
  if (!ctx) throw new Error('useBuilder must be used inside <BuilderProvider>')
  return ctx
}
