// admin/components/ui.jsx — small reusable building blocks for dashboard pages.
import { Loader2, X } from 'lucide-react'

export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
      <div>
        <h1 className="text-2xl font-black text-white">{title}</h1>
        {subtitle && <p className="text-sm text-slate-400 mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

export function Card({ children, className = '' }) {
  return (
    <div className={`bg-slate-900 border border-slate-800 rounded-2xl ${className}`}>{children}</div>
  )
}

export function Button({ children, variant = 'primary', className = '', ...rest }) {
  const styles = {
    primary: 'bg-gradient-to-r from-forest-500 to-ocean-500 text-white hover:shadow-lg',
    soft: 'bg-white/10 text-white hover:bg-white/15 border border-white/10',
    danger: 'bg-red-500/15 text-red-300 hover:bg-red-500/25 border border-red-400/20',
    ghost: 'text-slate-300 hover:text-white hover:bg-white/5',
  }
  return (
    <button {...rest}
      className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition active:scale-95
                  disabled:opacity-60 inline-flex items-center justify-center gap-2 ${styles[variant]} ${className}`}>
      {children}
    </button>
  )
}

export function Field({ label, children, hint }) {
  return (
    <label className="block mb-4">
      <span className="block text-xs font-semibold text-slate-300 mb-1.5">{label}</span>
      {children}
      {hint && <span className="block text-[11px] text-slate-500 mt-1">{hint}</span>}
    </label>
  )
}

export function Input(props) {
  return (
    <input {...props}
      className={`w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm
                  focus:outline-none focus:ring-2 focus:ring-forest-500 ${props.className || ''}`} />
  )
}

export function Textarea(props) {
  return (
    <textarea {...props}
      className={`w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm
                  focus:outline-none focus:ring-2 focus:ring-forest-500 resize-y ${props.className || ''}`} />
  )
}

export function Select(props) {
  return (
    <select {...props}
      className={`w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm
                  focus:outline-none focus:ring-2 focus:ring-forest-500 ${props.className || ''}`} />
  )
}

export function Spinner({ label }) {
  return (
    <div className="flex items-center gap-2 text-slate-400 py-10 justify-center">
      <Loader2 className="animate-spin" size={20} /> {label || 'Loading…'}
    </div>
  )
}

export function Empty({ children }) {
  return (
    <div className="text-center text-slate-500 py-12 border border-dashed border-slate-800 rounded-2xl">
      {children}
    </div>
  )
}

export function Badge({ children, tone = 'slate' }) {
  const tones = {
    slate: 'bg-slate-700/50 text-slate-300',
    green: 'bg-emerald-500/15 text-emerald-300',
    amber: 'bg-amber-500/15 text-amber-300',
    red: 'bg-red-500/15 text-red-300',
    blue: 'bg-sky-500/15 text-sky-300',
  }
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${tones[tone]}`}>
      {children}
    </span>
  )
}

export function Modal({ open, onClose, title, children, wide }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto bg-black/60"
         onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()}
           className={`bg-slate-900 border border-slate-800 rounded-2xl w-full my-8
                       ${wide ? 'max-w-3xl' : 'max-w-lg'}`}>
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <h2 className="text-lg font-bold text-white">{title}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={20} /></button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}
