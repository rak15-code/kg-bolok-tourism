// admin/components/AdminLayout.jsx — sidebar shell for the dashboard.
import { useState } from 'react'
import { NavLink, Outlet, Link } from 'react-router-dom'
import {
  LayoutDashboard, Sparkles, CalendarCheck, Compass, Home, Images,
  Package, Settings, LogOut, Menu, X, ExternalLink,
} from 'lucide-react'
import { useAdminAuth } from '../context/AdminAuthContext'

const NAV = [
  { to: '/admin',             label: 'Dashboard',   icon: LayoutDashboard, end: true },
  { to: '/admin/insights',    label: 'AI Insights', icon: Sparkles },
  { to: '/admin/bookings',    label: 'Bookings',    icon: CalendarCheck },
  { to: '/admin/attractions', label: 'Attractions', icon: Compass },
  { to: '/admin/homestays',   label: 'Homestays',   icon: Home },
  { to: '/admin/gallery',     label: 'Gallery',     icon: Images },
  { to: '/admin/packages',    label: 'Packages',    icon: Package },
  { to: '/admin/settings',    label: 'Settings',    icon: Settings },
]

export default function AdminLayout() {
  const { user, signOut } = useAdminAuth()
  const [open, setOpen] = useState(false)

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className={`fixed lg:static z-40 inset-y-0 left-0 w-64 bg-slate-900 border-r border-slate-800
                         flex flex-col transition-transform duration-200
                         ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-forest-400 font-bold">Kg Bolok</div>
            <div className="text-lg font-black text-white">Admin</div>
          </div>
          <button className="lg:hidden text-slate-400" onClick={() => setOpen(false)}><X size={20} /></button>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition
                 ${isActive ? 'bg-gradient-to-r from-forest-500/20 to-ocean-500/20 text-white border border-forest-400/30'
                            : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
              <Icon size={17} /> {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-slate-800">
          <Link to="/" target="_blank"
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-white/5">
            <ExternalLink size={14} /> View site
          </Link>
          <div className="px-3 py-2 text-[11px] text-slate-500 truncate">{user?.email}</div>
          <button onClick={signOut}
                  className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold
                             text-red-300 hover:bg-red-500/10 transition">
            <LogOut size={16} /> Sign out
          </button>
        </div>
      </aside>

      {open && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setOpen(false)} />}

      {/* Main */}
      <div className="flex-1 min-w-0">
        <header className="lg:hidden sticky top-0 z-20 bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center gap-3">
          <button onClick={() => setOpen(true)} className="text-slate-300"><Menu size={22} /></button>
          <span className="font-bold text-white">Kg Bolok Admin</span>
        </header>
        <main className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
