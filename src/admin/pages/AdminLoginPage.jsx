// admin/pages/AdminLoginPage.jsx — /admin/login
// ────────────────────────────────────────────────────────────────────────────
// Gated sign-in for the admin dashboard. Only authorised personnel get through:
//   • Supabase email/password auth, AND
//   • the AdminGuard additionally requires profiles.role === 'admin'.
//
// This screen has three modes:
//   'signin'  — email + password (with a failed-attempt lockout)
//   'forgot'  — request a password-reset email
//   'update'  — set a new password (shown automatically when the user arrives
//               from the reset email link → Supabase PASSWORD_RECOVERY event)
// ────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2, Lock, LogIn, Leaf, Mail, KeyRound, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { useAdminAuth } from '../context/AdminAuthContext'
import { supabase } from '../../lib/supabaseClient'

const MAX_ATTEMPTS = 5      // failed sign-ins before a cooldown
const COOLDOWN_SEC = 30     // seconds the form is locked after too many fails

export default function AdminLoginPage() {
  const { configured, signIn, resetPassword, updatePassword, session, isAdmin } = useAdminAuth()
  const navigate = useNavigate()

  const [mode, setMode] = useState('signin')   // 'signin' | 'forgot' | 'update'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)
  const [notice, setNotice] = useState(null)

  // Lockout state
  const [attempts, setAttempts] = useState(0)
  const [cooldown, setCooldown] = useState(0)

  // Already signed in as admin? Go straight to the dashboard.
  useEffect(() => {
    if (session && isAdmin && mode !== 'update') navigate('/admin', { replace: true })
  }, [session, isAdmin, navigate, mode])

  // Detect arrival from a password-reset email → switch to "set new password".
  useEffect(() => {
    if (!configured) return
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') { setMode('update'); setError(null); setNotice(null) }
    })
    return () => sub.subscription.unsubscribe()
  }, [configured])

  // Cooldown countdown.
  useEffect(() => {
    if (cooldown <= 0) return
    const id = setInterval(() => setCooldown((c) => Math.max(0, c - 1)), 1000)
    return () => clearInterval(id)
  }, [cooldown])

  const locked = cooldown > 0

  const handleSignIn = async (e) => {
    e.preventDefault()
    if (locked) return
    setError(null); setNotice(null); setBusy(true)
    try {
      await signIn(email.trim(), password)
      setAttempts(0)
      navigate('/admin', { replace: true })
    } catch (err) {
      const n = attempts + 1
      if (n >= MAX_ATTEMPTS) {
        setAttempts(0)
        setCooldown(COOLDOWN_SEC)
        setError(`Too many failed attempts. Try again in ${COOLDOWN_SEC}s.`)
      } else {
        setAttempts(n)
        setError(`${err.message || 'Sign-in failed'} (${MAX_ATTEMPTS - n} attempt${MAX_ATTEMPTS - n > 1 ? 's' : ''} left)`)
      }
      setBusy(false)
    }
  }

  const handleForgot = async (e) => {
    e.preventDefault()
    setError(null); setNotice(null); setBusy(true)
    try {
      await resetPassword(email.trim())
      setNotice('If that email belongs to an account, a reset link is on its way. Check your inbox.')
    } catch (err) {
      setError(err.message || 'Could not send reset email')
    } finally {
      setBusy(false)
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return }
    setError(null); setNotice(null); setBusy(true)
    try {
      await updatePassword(password)
      setNotice('Password updated. Redirecting to the dashboard…')
      setTimeout(() => navigate('/admin', { replace: true }), 1200)
    } catch (err) {
      setError(err.message || 'Could not update password')
      setBusy(false)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      {/* Eco brand backdrop */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#022c22] via-[#053b3b] to-[#0c1f47]" />
      <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-forest-500/20 blur-3xl" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-ocean-500/20 blur-3xl" />

      <form
        onSubmit={mode === 'signin' ? handleSignIn : mode === 'forgot' ? handleForgot : handleUpdate}
        className="relative w-full max-w-sm bg-white/10 backdrop-blur-2xl border border-white/15
                   rounded-3xl p-8 shadow-2xl shadow-black/40"
      >
        <div className="flex items-center gap-2 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-forest-400 to-ocean-500
                          flex items-center justify-center shadow-lg shadow-forest-900/40">
            <Leaf size={18} className="text-white" />
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wider text-forest-300 font-bold">Kg Bolok Tourism</div>
            <div className="text-sm font-black text-white">Admin Console</div>
          </div>
        </div>

        {/* Heading per mode */}
        {mode === 'signin' && (
          <>
            <h1 className="text-2xl font-black text-white mb-1 flex items-center gap-2">
              <Lock size={20} className="text-forest-300" /> Sign in
            </h1>
            <p className="text-sm text-slate-300/80 mb-6">Authorised personnel only.</p>
          </>
        )}
        {mode === 'forgot' && (
          <>
            <h1 className="text-2xl font-black text-white mb-1 flex items-center gap-2">
              <KeyRound size={20} className="text-forest-300" /> Reset password
            </h1>
            <p className="text-sm text-slate-300/80 mb-6">We'll email you a secure reset link.</p>
          </>
        )}
        {mode === 'update' && (
          <>
            <h1 className="text-2xl font-black text-white mb-1 flex items-center gap-2">
              <KeyRound size={20} className="text-forest-300" /> Set new password
            </h1>
            <p className="text-sm text-slate-300/80 mb-6">Choose a strong password (min 8 characters).</p>
          </>
        )}

        {!configured && (
          <p className="mb-4 text-xs text-amber-300 bg-amber-500/10 border border-amber-400/30 rounded-lg p-2">
            Supabase env vars are missing — sign-in is disabled.
          </p>
        )}

        {/* Email — shown for sign-in + forgot */}
        {mode !== 'update' && (
          <>
            <label className="block text-xs font-semibold text-slate-200 mb-1">Email</label>
            <div className="relative mb-4">
              <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                     autoComplete="email"
                     className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/10 border border-white/15
                                text-white text-sm placeholder:text-slate-400
                                focus:outline-none focus:ring-2 focus:ring-forest-400" />
            </div>
          </>
        )}

        {/* Password — shown for sign-in + update */}
        {mode !== 'forgot' && (
          <>
            <label className="block text-xs font-semibold text-slate-200 mb-1">
              {mode === 'update' ? 'New password' : 'Password'}
            </label>
            <div className="relative mb-2">
              <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                     autoComplete={mode === 'update' ? 'new-password' : 'current-password'}
                     className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/10 border border-white/15
                                text-white text-sm placeholder:text-slate-400
                                focus:outline-none focus:ring-2 focus:ring-forest-400" />
            </div>
          </>
        )}

        {/* Forgot-password link (sign-in mode only) */}
        {mode === 'signin' && (
          <button type="button"
                  onClick={() => { setMode('forgot'); setError(null); setNotice(null) }}
                  className="text-xs font-semibold text-forest-300 hover:text-forest-200 mb-5">
            Forgot password?
          </button>
        )}

        {error && <p className="mb-4 text-xs text-red-300 bg-red-500/10 border border-red-400/30 rounded-lg p-2">{error}</p>}
        {notice && (
          <p className="mb-4 text-xs text-emerald-300 bg-emerald-500/10 border border-emerald-400/30 rounded-lg p-2 flex items-start gap-1.5">
            <CheckCircle2 size={14} className="mt-px shrink-0" /> {notice}
          </p>
        )}

        <button type="submit" disabled={busy || !configured || locked}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-forest-500 to-ocean-500
                           text-white font-bold flex items-center justify-center gap-2
                           disabled:opacity-60 active:scale-95 transition mt-1">
          {busy ? <Loader2 size={17} className="animate-spin" />
                : mode === 'signin' ? <LogIn size={17} />
                : <KeyRound size={17} />}
          {locked ? `Locked (${cooldown}s)`
            : mode === 'signin' ? 'Sign in'
            : mode === 'forgot' ? 'Send reset link'
            : 'Update password'}
        </button>

        {/* Back to sign-in (from forgot/update) */}
        {mode !== 'signin' && (
          <button type="button"
                  onClick={() => { setMode('signin'); setError(null); setNotice(null); setPassword('') }}
                  className="w-full mt-3 text-xs font-semibold text-slate-300 hover:text-white inline-flex items-center justify-center gap-1">
            <ArrowLeft size={13} /> Back to sign in
          </button>
        )}
      </form>
    </div>
  )
}
