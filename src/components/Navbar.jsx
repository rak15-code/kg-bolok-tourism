// ────────────────────────────────────────────────────────────────────────────
// Navbar.jsx — sticky glass navbar.
//
// Features:
//  • Animated highlight pill that smoothly moves to the active link
//    (uses Framer Motion `layoutId`).
//  • Section scroll-spy: when on `/` (homepage), the highlight follows the
//    section currently in view (Home → About → Attractions → Homestay →
//    Package Builder).
//  • On non-home routes, highlight follows the React Router route.
//  • Currency selector + language toggle + builder cart on the right.
// ────────────────────────────────────────────────────────────────────────────

import { useEffect, useState, useMemo } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Globe, ShoppingBag, Leaf, DollarSign, ChevronDown } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import { useBuilder } from '../context/BuilderContext'
import { useCurrency } from '../context/CurrencyContext'

// Section IDs (must match the <section id="..."> on HomePage).
const SECTION_IDS = ['home', 'about', 'attractions', 'homestays', 'builder']

export default function Navbar() {
  const { lang, toggleLang, t } = useLanguage()
  const { itemCount } = useBuilder()
  const { currency, setCurrency, supported } = useCurrency()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [currencyOpen, setCurrencyOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const isHome = pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => { setOpen(false); setCurrencyOpen(false) }, [pathname])

  // ── SCROLL-SPY: only when on homepage ──
  useEffect(() => {
    if (!isHome) return

    const observers = []
    const setActiveDebounced = (id) => setActiveSection(id)

    // Use a single IntersectionObserver: pick the section whose top is closest
    // to the navbar bottom and visible.
    const visible = new Map()
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.set(e.target.id, e.intersectionRatio)
          else visible.delete(e.target.id)
        }
        if (visible.size > 0) {
          // pick the entry with the largest ratio
          let bestId = null, bestRatio = -1
          for (const [id, r] of visible.entries()) {
            if (r > bestRatio) { bestId = id; bestRatio = r }
          }
          if (bestId) setActiveDebounced(bestId)
        }
      },
      {
        // Trigger when ~30% of a section is in view, accounting for the navbar.
        rootMargin: '-30% 0px -50% 0px',
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
      }
    )

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id)
      if (el) { obs.observe(el); observers.push([obs, el]) }
    })

    return () => obs.disconnect()
  }, [isHome])

  // Smooth-scroll to a section on the home page; if not on home, navigate first.
  const goToSection = (id) => {
    if (!isHome) {
      navigate('/', { state: { scrollTo: id } })
      // Fallback: after navigation, scroll there next tick.
      setTimeout(() => {
        const el = document.getElementById(id)
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 60)
      return
    }
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setActiveSection(id)
    }
  }

  // Honour "navigate('/', { state: { scrollTo: 'about' } })" hand-off.
  const { state } = useLocation()
  useEffect(() => {
    if (isHome && state?.scrollTo) {
      const el = document.getElementById(state.scrollTo)
      if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
    }
  }, [isHome, state])

  // Navbar items reflect homepage sections.
  const links = useMemo(() => ([
    { id: 'home',        label: t.nav.home,        sectionId: 'home' },
    { id: 'about',       label: t.nav.about,       sectionId: 'about' },
    { id: 'attractions', label: t.nav.attractions, sectionId: 'attractions' },
    { id: 'homestays',   label: t.nav.homestays,   sectionId: 'homestays' },
    { id: 'builder',     label: t.nav.builder,     sectionId: 'builder' },
    { id: 'gallery',     label: t.nav.gallery,     sectionId: 'gallery' },
    { id: 'contact',     label: t.nav.contact,     sectionId: 'contact' },
  ]), [t])

  // Which link should appear active?
  const activeId = isHome ? activeSection : (
    pathname.startsWith('/attractions') ? 'attractions' :
    pathname.startsWith('/homestays')   ? 'homestays'   :
    pathname.startsWith('/builder')     ? 'builder'     :
    pathname.startsWith('/gallery')     ? 'gallery'     :
    pathname.startsWith('/contact')     ? 'contact'     :
    'home'
  )

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300
        ${scrolled
          ? 'bg-slate-950/70 backdrop-blur-2xl border-b border-white/10 shadow-xl shadow-black/30'
          : 'bg-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* Brand */}
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-forest-400 to-ocean-500
                            flex items-center justify-center shadow-lg shadow-forest-900/40
                            group-hover:scale-110 transition-transform">
              <Leaf size={18} className="text-white" />
            </div>
            <span className="hidden sm:block font-extrabold text-white text-lg leading-tight tracking-tight">
              {t.nav.brand}
            </span>
          </Link>

          {/* Desktop nav links — animated highlight via layoutId */}
          <div className="hidden lg:flex items-center gap-1 relative">
            {links.map((link) => {
              const isActive = activeId === link.id
              return (
                <button
                  key={link.id}
                  onClick={() => goToSection(link.sectionId)}
                  className={`relative px-4 py-2 rounded-full text-sm font-semibold transition-colors
                              ${isActive ? 'text-white' : 'text-white/75 hover:text-white'}`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-pill"
                      className="absolute inset-0 rounded-full bg-white/15 ring-1 ring-white/25
                                 shadow-lg shadow-ocean-500/10"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </button>
              )
            })}
          </div>

          {/* Right cluster */}
          <div className="flex items-center gap-2">

            {/* Currency selector */}
            <div className="relative">
              <button
                onClick={() => setCurrencyOpen((v) => !v)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-bold
                           bg-white/10 hover:bg-white/20 border border-white/15
                           text-white backdrop-blur-md transition-all hover:scale-105 active:scale-95"
                aria-label="Change currency"
              >
                <DollarSign size={13} />
                {currency}
                <ChevronDown size={11} className={`transition-transform ${currencyOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {currencyOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 min-w-[120px] rounded-2xl
                               bg-slate-950/95 backdrop-blur-2xl border border-white/15
                               shadow-2xl overflow-hidden"
                  >
                    {supported.map((c) => (
                      <button
                        key={c}
                        onClick={() => { setCurrency(c); setCurrencyOpen(false) }}
                        className={`w-full text-left px-4 py-2 text-sm font-semibold transition-colors
                                    ${c === currency
                                      ? 'text-white bg-gradient-to-r from-forest-500/30 to-ocean-500/30'
                                      : 'text-white/80 hover:bg-white/10'}`}
                      >
                        {c}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Package builder cart link */}
            <Link
              to="/builder"
              className="relative flex items-center gap-1.5 px-3 py-2 rounded-full
                         bg-white/10 hover:bg-white/20 border border-white/15
                         backdrop-blur-md text-white text-sm font-semibold
                         transition-all hover:scale-105 active:scale-95"
              aria-label="Open package builder"
            >
              <ShoppingBag size={15} />
              <span className="hidden sm:inline">{t.nav.builder}</span>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1
                                 rounded-full bg-gradient-to-br from-forest-400 to-ocean-400
                                 text-[10px] font-black text-slate-900 flex items-center
                                 justify-center shadow-md ring-2 ring-slate-950">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Language toggle */}
            <button
              onClick={toggleLang}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-bold
                         bg-white/10 hover:bg-white/20 border border-white/15
                         text-white backdrop-blur-md transition-all hover:scale-105 active:scale-95"
              aria-label="Toggle Language"
            >
              <Globe size={14} />
              {lang === 'en' ? 'BM' : 'EN'}
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setOpen((v) => !v)}
              className="lg:hidden p-2 rounded-xl text-white hover:bg-white/10 transition-colors"
              aria-label="Toggle menu"
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu — also uses animated highlight */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden overflow-hidden bg-slate-950/95 backdrop-blur-2xl border-t border-white/10"
          >
            <div className="px-4 py-3 space-y-1 relative">
              {links.map((link) => {
                const isActive = activeId === link.id
                return (
                  <button
                    key={link.id}
                    onClick={() => { goToSection(link.sectionId); setOpen(false) }}
                    className={`relative block w-full text-left px-4 py-3 rounded-xl text-sm font-semibold
                                ${isActive ? 'text-white' : 'text-white/80 hover:bg-white/10'}`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-active-pill-mobile"
                        className="absolute inset-0 rounded-xl bg-gradient-to-r from-forest-500/30 to-ocean-500/30
                                   ring-1 ring-forest-400/30"
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      />
                    )}
                    <span className="relative z-10">{link.label}</span>
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
