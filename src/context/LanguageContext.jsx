// ────────────────────────────────────────────────────────────────────────────
// LanguageContext.jsx
// ────────────────────────────────────────────────────────────────────────────
// Single source of truth for the current language ('en' | 'bm').
// Persists choice to localStorage so the site remembers the user's preference.
//
// Usage:
//   const { lang, toggleLang, t } = useLanguage()
//   t.hero.heading
// ────────────────────────────────────────────────────────────────────────────

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import translations from '../data/translations'

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    if (typeof window === 'undefined') return 'en'
    const saved = window.localStorage.getItem('kgbolok_lang')
    return saved === 'bm' || saved === 'en' ? saved : 'en'
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('kgbolok_lang', lang)
      document.documentElement.lang = lang === 'bm' ? 'ms' : 'en'
    }
  }, [lang])

  const value = useMemo(() => ({
    lang,
    setLang,
    toggleLang: () => setLang((prev) => (prev === 'en' ? 'bm' : 'en')),
    t: translations[lang],
  }), [lang])

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used inside <LanguageProvider>')
  return ctx
}
