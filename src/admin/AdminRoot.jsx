// admin/AdminRoot.jsx — wraps the whole /admin subtree in the auth provider.
import { Outlet } from 'react-router-dom'
import { AdminAuthProvider } from './context/AdminAuthContext'

export default function AdminRoot() {
  return (
    <AdminAuthProvider>
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <Outlet />
      </div>
    </AdminAuthProvider>
  )
}
