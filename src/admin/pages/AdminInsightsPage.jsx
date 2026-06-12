// admin/pages/AdminInsightsPage.jsx — /admin/insights
// ────────────────────────────────────────────────────────────────────────────
// MOCK AI insights, ADMIN ONLY. Rendered inside the AdminGuard-protected admin
// shell, so public users can NEVER reach analytics, revenue, recommendations or
// customer data. All figures here are illustrative/mock — no real model runs.
// ────────────────────────────────────────────────────────────────────────────

import { useEffect, useState } from 'react'
import { Sparkles, TrendingUp, Lightbulb, Lock } from 'lucide-react'
import { supabase } from '../../lib/supabaseClient'
import { PageHeader, Card, Badge, Spinner } from '../components/ui'

// Mock weekly booking trend (used when there's no live data).
const MOCK_TREND = [
  { label: 'Mon', value: 8 },  { label: 'Tue', value: 12 },
  { label: 'Wed', value: 6 },  { label: 'Thu', value: 14 },
  { label: 'Fri', value: 22 }, { label: 'Sat', value: 31 },
  { label: 'Sun', value: 27 },
]

// Mock AI recommendation cards.
const RECOMMENDATIONS = [
  {
    tone: 'green',
    tag: 'Demand',
    title: 'Weekend Family Adventure surge',
    body: 'Bookings for the Family Adventure Package spike ~3× on Fri–Sun. Consider a limited weekend allocation or a small weekday discount to balance load.',
  },
  {
    tone: 'blue',
    tag: 'Bundle',
    title: 'Pair Tarian Piring with Dodol making',
    body: 'Guests who book cultural performances frequently add a food experience. Suggesting Dodol-making at checkout could lift average order value.',
  },
  {
    tone: 'amber',
    tag: 'Retention',
    title: 'Follow up on pending payments',
    body: 'A share of bookings stall at the payment step. A gentle reminder within 24h typically recovers a meaningful portion of pending carts.',
  },
]

export default function AdminInsightsPage() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    (async () => {
      if (!supabase) { setStats({ total: 0, live: false }); return }
      const { data } = await supabase.from('bookings').select('payment_status,total_amount,created_at')
      const rows = data || []
      const paid = rows.filter((r) => r.payment_status === 'paid')
      const revenue = paid.reduce((s, r) => s + Number(r.total_amount || 0), 0)
      setStats({
        total: rows.length,
        conversion: rows.length ? Math.round((paid.length / rows.length) * 100) : 0,
        avgValue: paid.length ? Math.round(revenue / paid.length) : 0,
        live: rows.length > 0,
      })
    })()
  }, [])

  if (!stats) return <Spinner />

  const max = Math.max(...MOCK_TREND.map((d) => d.value))

  return (
    <>
      <PageHeader
        title="AI Insights"
        subtitle="Mock AI-assisted analytics — for the team only."
        action={<Badge tone="slate"><Lock size={11} className="mr-1" /> Admin only</Badge>}
      />

      <div className="mb-4 flex items-center gap-2 text-xs text-amber-300/90">
        <Sparkles size={14} />
        Illustrative insights — figures are mocked for demonstration{stats.live ? ' (blended with live totals)' : ''}.
      </div>

      {/* KPI strip */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total bookings', value: stats.total },
          { label: 'Conversion (paid)', value: `${stats.conversion ?? 64}%` },
          { label: 'Avg. order value', value: `RM ${stats.avgValue || 168}` },
        ].map((c) => (
          <Card key={c.label} className="p-5">
            <div className="text-2xl font-black text-white">{c.value}</div>
            <div className="text-xs text-slate-400 mt-1">{c.label}</div>
          </Card>
        ))}
      </div>

      {/* Booking trend */}
      <Card className="p-5 mb-8">
        <div className="flex items-center gap-2 mb-5">
          <TrendingUp size={18} className="text-emerald-300" />
          <h2 className="font-bold text-white">Booking trend (this week)</h2>
        </div>
        <div className="flex items-end gap-3 h-40">
          {MOCK_TREND.map((d) => (
            <div key={d.label} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex-1 flex items-end">
                <div
                  className="w-full rounded-t-lg bg-gradient-to-t from-forest-500 to-ocean-400"
                  style={{ height: `${(d.value / max) * 100}%` }}
                  title={`${d.value} bookings`}
                />
              </div>
              <span className="text-[11px] text-slate-400">{d.label}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* AI recommendation cards */}
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb size={18} className="text-amber-300" />
        <h2 className="font-bold text-white">Recommendations</h2>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        {RECOMMENDATIONS.map((r) => (
          <Card key={r.title} className="p-5 flex flex-col">
            <Badge tone={r.tone}>{r.tag}</Badge>
            <h3 className="font-bold text-white mt-3 mb-1.5">{r.title}</h3>
            <p className="text-sm text-slate-400 leading-relaxed">{r.body}</p>
          </Card>
        ))}
      </div>
    </>
  )
}
