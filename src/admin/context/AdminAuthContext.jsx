// ────────────────────────────────────────────────────────────────────────────
// admin/context/AdminAuthContext.jsx
// ────────────────────────────────────────────────────────────────────────────
// Supabase-auth state for the admin dashboard. Tracks the session, loads the
// user's role from `profiles`, and exposes sign-in / sign-out.
//
// Only users with profiles.role === 'admin' are allowed past the guard.
// ────────────────────────────────────────────────────────────────────────────

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../../lib/supabaseClient'

const AdminAuthContext = createContext(null)

export function AdminAuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [role, setRole] = useState(null)
  const [loading, setLoading] = useState(true)

  // Fetch the signed-in user's role from profiles.
  async function loadRole(userId) {
    if (!userId) return setRole(null)
    const { data } = await supabase
      .from('profiles').select('role').eq('id', userId).maybeSingle()
    setRole(data?.role ?? 'customer')
  }

  useEffect(() => {
    if (!isSupabaseConfigured()) { setLoading(false); return }

    supabase.auth.getSession().then(async ({ data }) => {
      setSession(data.session)
      await loadRole(data.session?.user?.id)
      setLoading(false)
    })

    const { data: sub } = supabase.auth.onAuthStateChange(async (_e, sess) => {
      setSession(sess)
      await loadRole(sess?.user?.id)
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  const value = useMemo(() => ({
    configured: isSupabaseConfigured(),
    loading,
    session,
    user: session?.user ?? null,
    role,
    isAdmin: role === 'admin',
    async signIn(email, password) {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
    },
    // Email the user a password-reset link that returns them to /admin/login.
    async resetPassword(email) {
      const redirectTo = `${window.location.origin}/admin/login`
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo })
      if (error) throw error
    },
    // Set a new password (used after arriving from the reset email link).
    async updatePassword(password) {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error
    },
    async signOut() {
      await supabase.auth.signOut()
      setRole(null)
    },
  }), [loading, session, role])

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext)
  if (!ctx) throw new Error('useAdminAuth must be used inside <AdminAuthProvider>')
  return ctx
}
