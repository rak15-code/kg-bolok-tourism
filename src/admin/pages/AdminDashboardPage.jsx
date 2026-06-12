// admin/pages/AdminDashboardPage.jsx — /admin overview
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  CalendarCheck, CircleDollarSign, Clock, CheckCircle2,
  Sparkles, ArrowRight,
} from 'lucide-react'
import { supabase } from '../../lib/supabaseClient'
import { PageHeader, Card, Badge, Spinner } from '../components/ui'

// Build mock-but-context-aware "AI improvement suggestions" from the live stats.
// Admin only — rendered inside the AdminGuard-protected shell.
function buildSuggestions(stats) {
  const out = []
  const conversion = stats.total ? Math.round((stats.paid / stats.total) * 100) : 0

  if (stats.pending > 0) {
    out.push({
      tone: 'amber',
      tag: 'Recover revenue',
      title: `Follow up on ${stats.pending} pending booking${stats.pending > 1 ? 's' : ''}`,
      body: 'These guests started but never paid. A friendly reminder within 24h typically recovers a good share of them.',
    })
  }
  if (stats.total > 0 && conversion < 60) {
    out.push({
      tone: 'blue',
      tag: 'Conversion',
      title: `Lift checkout conversion (now ~${conversion}%)`,
      body: 'Add trust signals near the pay button — guest reviews, a clear refund note, and the WhatsApp contact.',
    })
  }
  // Always-on best-practice suggestions.
  out.push({
    tone: 'green',
    tag: 'Performance',
    title: 'Compress homepage media',
    body: 'The background photo and video thumbnails are large. Serving WebP/JPG under ~300 KB will speed up mobile load and SEO.',
  })
  out.push({
    tone: 'blue',
    tag: 'Content',
    title: 'Add more real photos & a short intro video',
    body: 'Listings with 3+ authentic photos convert noticeably better. Fill any attractions/homestays still using placeholders.',
  })
  out.push({
    tone: 'green',
    tag: 'Bundle',
    title: 'Promote the weekend Family Adventure package',
    body: 'Weekend demand runs highest. Feature it on the homepage hero or offer a small weekday discount to balance load.',
  })
  return out.slice(0, 4)
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('bookings').select('payment_status,total_amount')
      const rows = data || []
      const paid = rows.filter((r) => r.payment_status === 'paid')
      setStats({
        total: rows.length,
        paid: paid.length,
        pending: rows.filter((r) => r.payment_status === 'pending').length,
        revenue: paid.reduce((s, r) => s + Number(r.total_amount || 0), 0),
      })
    })()
  }, [])

  if (!stats) return <Spinner />

  const suggestions = buildSuggestions(stats)

  const cards = [
    { label: 'Total bookings', value: stats.total, icon: CalendarCheck, tone: 'text-sky-300' },
    { label: 'Paid', value: stats.paid, icon: CheckCircle2, tone: 'text-emerald-300' },
    { label: 'Pending', value: stats.pending, icon: Clock, tone: 'text-amber-300' },
    { label: 'Revenue (paid)', value: `RM ${stats.revenue.toLocaleString('en-MY')}`, icon: CircleDollarSign, tone: 'text-forest-300' },
  ]

  return (
    <>
      <PageHeader title="Dashboard" subtitle="Overview of your tourism bookings." />
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((c) => (
          <Card key={c.label} className="p-5">
            <c.icon className={`${c.tone} mb-3`} size={22} />
            <div className="text-2xl font-black text-white">{c.value}</div>
            <div className="text-xs text-slate-400 mt-1">{c.label}</div>
          </Card>
        ))}
      </div>

      {/* AI improvement suggestions (mock, admin only) */}
      <Card className="p-5 mb-8">
        <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-forest-300" />
            <h2 className="font-bold text-white">AI Improvement Suggestions</h2>
            <Badge tone="slate">Mock</Badge>
          </div>
          <Link to="/admin/insights"
                className="text-xs font-semibold text-forest-300 hover:text-forest-200 inline-flex items-center gap-1">
            View full insights <ArrowRight size={13} />
          </Link>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          {suggestions.map((s) => (
            <div key={s.title} className="rounded-xl bg-white/5 border border-white/5 p-4">
              <Badge tone={s.tone}>{s.tag}</Badge>
              <h3 className="font-semibold text-white text-sm mt-2.5 mb-1">{s.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-5">
        <h2 className="font-bold text-white mb-3">Manage</h2>
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            ['AI Insights', '/admin/insights'], ['Bookings', '/admin/bookings'],
            ['Attractions', '/admin/attractions'], ['Homestays', '/admin/homestays'],
            ['Gallery', '/admin/gallery'], ['Packages', '/admin/packages'],
            ['Settings', '/admin/settings'],
          ].map(([label, to]) => (
            <Link key={to} to={to}
                  className="px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-sm font-semibold text-white transition">
              {label} →
            </Link>
          ))}
        </div>
      </Card>
    </>
  )
}
