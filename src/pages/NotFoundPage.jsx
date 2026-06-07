// NotFoundPage.jsx — 404 fallback used by the router AND by detail pages
// when a slug doesn't match any data entry.

import { Link } from 'react-router-dom'
import { Home, MapPinOff } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

export default function NotFoundPage() {
  const { t } = useLanguage()
  return (
    <section className="min-h-screen flex items-center justify-center px-4 pt-24 pb-16">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-3xl mx-auto mb-6
                        bg-gradient-to-br from-forest-500 to-ocean-500
                        flex items-center justify-center shadow-2xl shadow-ocean-900/40">
          <MapPinOff size={32} className="text-white" />
        </div>
        <h1 className="text-3xl font-black text-white mb-2">{t.common.notFound}</h1>
        <p className="text-slate-300 mb-8">{t.common.notFoundDesc}</p>
        <Link to="/" className="btn-primary">
          <Home size={16} />
          {t.common.goHome}
        </Link>
      </div>
    </section>
  )
}
