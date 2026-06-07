// PaymentCancelPage.jsx — /payment/cancel
// HitPay redirects here when the user cancels or the payment fails.
// The package is NOT cleared, so the user can try again.

import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { XCircle, ArrowLeft } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

export default function PaymentCancelPage() {
  const { t } = useLanguage()
  const p = t.payment

  return (
    <section className="min-h-screen flex items-center justify-center pt-24 pb-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="card-glass max-w-lg w-full text-center p-10"
      >
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-500 to-red-500
                        mx-auto mb-6 flex items-center justify-center shadow-2xl shadow-red-900/40">
          <XCircle size={40} className="text-white" />
        </div>
        <h1 className="text-3xl font-black text-white mb-3">{p.cancelTitle}</h1>
        <p className="text-slate-300 mb-7 leading-relaxed">{p.cancelMessage}</p>
        <Link to="/checkout" className="btn-primary">
          <ArrowLeft size={15} />
          {p.cancelRetry}
        </Link>
      </motion.div>
    </section>
  )
}
