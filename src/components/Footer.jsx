// ────────────────────────────────────────────────────────────────────────────
// Footer.jsx — ocean-deep glass footer.
// Phone & social handles come from src/data/socialLinks.js (edit there only).
// ────────────────────────────────────────────────────────────────────────────

import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail, Instagram, Heart, Leaf } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import {
  socialLinks, contactPhoneDisplay, contactPhoneTel,
} from '../data/socialLinks'

// Inline TikTok glyph (lucide-react has no TikTok icon).
function TikTokIcon({ size = 16, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V9.13a8.21 8.21 0 0 0 4.93 1.65V7.34a4.86 4.86 0 0 1-2-.65Z" />
    </svg>
  )
}

export default function Footer() {
  const { t } = useLanguage()
  const ft  = t.footer
  const nav = t.nav

  const quickLinks = [
    { label: nav.home,        to: '/' },
    { label: nav.attractions, to: '/attractions' },
    { label: nav.homestays,   to: '/homestays' },
    { label: nav.builder,     to: '/builder' },
    { label: nav.gallery,     to: '/gallery' },
    { label: nav.contact,     to: '/contact' },
  ]

  return (
    <footer className="relative bg-slate-950/85 backdrop-blur-xl border-t border-white/10 text-slate-400">

      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-ocean-400 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand column */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-forest-400 to-ocean-500
                              flex items-center justify-center shadow-lg shadow-forest-900/40">
                <Leaf size={18} className="text-white" />
              </div>
              <span className="text-white font-bold text-lg">{nav.brand}</span>
            </div>
            <p className="text-forest-300 font-semibold text-sm mb-2 italic">
              "{ft.tagline}"
            </p>
            <p className="text-sm leading-relaxed mb-6">{ft.description}</p>

            {/* Social — Instagram + TikTok only */}
            <div className="flex gap-3">
              <a
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-lg bg-white/10 hover:bg-gradient-to-br hover:from-pink-500 hover:to-yellow-400
                           hover:text-white flex items-center justify-center transition-all duration-200
                           hover:scale-110"
              >
                <Instagram size={16} />
              </a>
              <a
                href={socialLinks.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="w-9 h-9 rounded-lg bg-white/10 hover:bg-black hover:text-white
                           flex items-center justify-center transition-all duration-200 hover:scale-110"
              >
                <TikTokIcon size={16} />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-white font-bold mb-5">{ft.quickLinks}</h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm hover:text-forest-300 transition-colors duration-200
                               flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-ocean-500
                                     group-hover:bg-forest-300 transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h4 className="text-white font-bold mb-5">{ft.contactInfo}</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-forest-300 shrink-0 mt-0.5" />
                <span>Kg Bolok, Pahang, Malaysia</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-forest-300 shrink-0" />
                <a href={contactPhoneTel} className="hover:text-forest-300 transition-colors">
                  {contactPhoneDisplay}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-forest-300 shrink-0" />
                <span>info@kgboloktourism.my</span>
              </li>
            </ul>
          </div>

          {/* Visit hours */}
          <div>
            <h4 className="text-white font-bold mb-5">{ft.visitHours}</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex flex-col">
                <span className="text-white text-xs font-semibold">Mon – Fri</span>
                <span className="text-ocean-300 text-xs">8:00 AM – 6:00 PM</span>
              </li>
              <li className="flex flex-col">
                <span className="text-white text-xs font-semibold">Sat – Sun</span>
                <span className="text-ocean-300 text-xs">7:00 AM – 8:00 PM</span>
              </li>
              <li className="flex flex-col">
                <span className="text-white text-xs font-semibold">Public Holiday</span>
                <span className="text-ocean-300 text-xs">By Appointment</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5
                        flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm">{ft.copyright}</p>
          <p className="text-sm flex items-center gap-1.5">
            {ft.madeWith}
            <Heart size={13} className="text-red-400 fill-red-400" />
          </p>
        </div>
      </div>
    </footer>
  )
}
