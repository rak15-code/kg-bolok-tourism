// PaymentSuccessPage.jsx — /payment/success
// Reached after the user pays on HitPay (configured as backend redirect URL).
// Clears the package from BuilderContext on first mount.

import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle2, Home, Sparkles } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import { useBuilder } from '../context/BuilderContext'

export default function PaymentSuccessPage() {
  const { t } = useLanguage()
  const p = t.payment
  const { clear } = useBuilder()
  const [params] = useSearchParams()
  const reference = params.get('reference') || params.get('payment_id') || ''

  useEffect(() => { clear() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section className="min-h-screen flex items-center justify-center pt-24 pb-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="card-glass max-w-lg w-full text-center p-10"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 180 }}
          className="w-20 h-20 rounded-full bg-gradient-to-br from-forest-400 to-ocean-500
                     mx-auto mb-6 flex items-center justify-center shadow-2xl shadow-ocean-900/40"
        >
          <CheckCircle2 size={40} className="text-white" />
        </motion.div>

        <h1 className="text-3xl font-black text-white mb-3">{p.successTitle}</h1>
        <p className="text-slate-300 mb-6 leading-relaxed">{p.successMessage}</p>

        {reference && (
          <p className="text-xs font-mono text-slate-400 mb-6 bg-white/5 rounded-xl px-3 py-2">
            Ref: {reference}
          </p>
        )}

        <Link to="/" className="btn-primary">
          <Home size={15} />
          {p.successBackHome}
        </Link>

        <div className="mt-6 inline-flex items-center gap-2 text-forest-300 text-xs">
          <Sparkles size={12} />
          We'll email your itinerary shortly.
        </div>
      </motion.div>
    </section>
  )
}
