// admin/components/AdminGuard.jsx — gate for the dashboard.
// Renders the nested admin routes only for a signed-in admin; otherwise
// redirects to the login page (or shows a config/permission notice).

import { Navigate, Outlet } from 'react-router-dom'
import { Loader2, ShieldAlert } from 'lucide-react'
import { useAdminAuth } from '../context/AdminAuthContext'

export default function AdminGuard() {
  const { configured, loading, session, isAdmin, signOut } = useAdminAuth()

  if (!configured) {
    return (
      <Centered>
        <ShieldAlert className="text-amber-400 mb-3" size={36} />
        <h1 className="text-xl font-bold mb-2">Supabase not configured</h1>
        <p className="text-slate-400 text-sm max-w-sm">
          Set <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> in your
          <code> .env</code>, then reload.
        </p>
      </Centered>
    )
  }

  if (loading) {
    return (
      <Centered>
        <Loader2 className="animate-spin text-forest-400" size={32} />
      </Centered>
    )
  }

  if (!session) return <Navigate to="/admin/login" replace />

  if (!isAdmin) {
    return (
      <Centered>
        <ShieldAlert className="text-red-400 mb-3" size={36} />
        <h1 className="text-xl font-bold mb-2">Not authorized</h1>
        <p className="text-slate-400 text-sm mb-5">
          This account doesn't have the <strong>admin</strong> role.
        </p>
        <button onClick={signOut} className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-sm font-semibold">
          Sign out
        </button>
      </Centered>
    )
  }

  return <Outlet />
}

function Centered({ children }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      {children}
    </div>
  )
}
