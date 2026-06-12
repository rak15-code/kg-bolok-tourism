// ────────────────────────────────────────────────────────────────────────────
// MainLayout.jsx
// ────────────────────────────────────────────────────────────────────────────
// The persistent shell around every routed page:
//   - fixed ambient blue/green background
//   - sticky Navbar
//   - <Outlet> for the routed page
//   - Footer
//
// Scroll-restores to top on every route change.
// ────────────────────────────────────────────────────────────────────────────

import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import AmbientBackground from '../components/AmbientBackground'
import AiAssistant from '../components/AiAssistant'

export default function MainLayout() {
  const { pathname } = useLocation()

  // Reset scroll to top on every navigation
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' })
  }, [pathname])

  return (
    <div className="font-sans antialiased text-white min-h-screen relative overflow-x-hidden">
      <AmbientBackground />
      <Navbar />
      <main className="relative z-10">
        <Outlet />
      </main>
      <Footer />
      <AiAssistant />
    </div>
  )
}
