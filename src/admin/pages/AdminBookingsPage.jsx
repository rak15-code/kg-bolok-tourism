// admin/pages/AdminBookingsPage.jsx — view / search / filter bookings.
import { useEffect, useMemo, useState } from 'react'
import { Search, Eye } from 'lucide-react'
import { list, update } from '../lib/db'
import { PageHeader, Card, Spinner, Empty, Badge, Input, Select, Modal, Button } from '../components/ui'

const STATUS_TONE = {
  paid: 'green', pending: 'amber', failed: 'red', cancelled: 'slate', refunded: 'blue',
}
const STATUSES = ['all', 'pending', 'paid', 'failed', 'cancelled', 'refunded']

export default function AdminBookingsPage() {
  const [rows, setRows] = useState(null)
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('all')
  const [active, setActive] = useState(null)

  const load = () => list('bookings', { order: 'created_at', ascending: false }).then(setRows)
  useEffect(() => { load() }, [])

  const filtered = useMemo(() => {
    if (!rows) return []
    const needle = q.trim().toLowerCase()
    return rows.filter((r) => {
      if (status !== 'all' && r.payment_status !== status) return false
      if (!needle) return true
      return [r.customer_name, r.customer_email, r.booking_reference, r.customer_phone]
        .some((v) => (v || '').toLowerCase().includes(needle))
    })
  }, [rows, q, status])

  async function setStatusFor(id, newStatus) {
    await update('bookings', id, { payment_status: newStatus })
    load()
    setActive((a) => (a && a.id === id ? { ...a, payment_status: newStatus } : a))
  }

  if (!rows) return <Spinner label="Loading bookings…" />

  return (
    <>
      <PageHeader title="Bookings" subtitle={`${rows.length} total`} />

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, email, reference…"
                 className="pl-9" />
        </div>
        <Select value={status} onChange={(e) => setStatus(e.target.value)} className="sm:w-48">
          {STATUSES.map((s) => <option key={s} value={s}>{s === 'all' ? 'All statuses' : s}</option>)}
        </Select>
      </div>

      {filtered.length === 0 ? <Empty>No bookings match.</Empty> : (
        <Card className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-800">
                <th className="p-3 font-semibold">Reference</th>
                <th className="p-3 font-semibold">Customer</th>
                <th className="p-3 font-semibold">Total</th>
                <th className="p-3 font-semibold">Status</th>
                <th className="p-3 font-semibold">Date</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-b border-slate-800/60 hover:bg-white/5">
                  <td className="p-3 font-mono text-xs text-slate-300">{r.booking_reference}</td>
                  <td className="p-3">
                    <div className="text-white">{r.customer_name}</div>
                    <div className="text-xs text-slate-500">{r.customer_email}</div>
                  </td>
                  <td className="p-3 text-white">{r.currency} {Number(r.total_amount).toFixed(2)}</td>
                  <td className="p-3"><Badge tone={STATUS_TONE[r.payment_status] || 'slate'}>{r.payment_status}</Badge></td>
                  <td className="p-3 text-slate-400 text-xs">{new Date(r.created_at).toLocaleDateString()}</td>
                  <td className="p-3 text-right">
                    <button onClick={() => setActive(r)} className="text-slate-400 hover:text-white"><Eye size={17} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      <Modal open={!!active} onClose={() => setActive(null)} title="Booking details" wide>
        {active && (
          <div className="space-y-4 text-sm">
            <Row k="Reference" v={active.booking_reference} mono />
            <Row k="Customer" v={`${active.customer_name} · ${active.customer_email}${active.customer_phone ? ' · ' + active.customer_phone : ''}`} />
            <Row k="Visit date" v={active.visit_date || '—'} />
            <Row k="Provider" v={active.payment_provider} />
            <Row k="Payment ref" v={active.payment_reference || '—'} mono />
            <div>
              <div className="text-slate-400 text-xs mb-1">Attractions</div>
              <ul className="list-disc list-inside text-slate-200">
                {(active.selected_attractions || []).map((a, i) => <li key={i}>{a.name || a.slug}</li>)}
                {(active.selected_attractions || []).length === 0 && <li className="list-none text-slate-500">None</li>}
              </ul>
            </div>
            <div>
              <div className="text-slate-400 text-xs mb-1">Homestay</div>
              <div className="text-slate-200">
                {Array.isArray(active.selected_homestay) && active.selected_homestay.length
                  ? active.selected_homestay.map((h, i) => <div key={i}>{h.name} · {h.roomName} × {h.nights}</div>)
                  : <span className="text-slate-500">None (day trip)</span>}
              </div>
            </div>
            {active.special_request && <Row k="Request" v={active.special_request} />}
            <div className="flex justify-between pt-2 border-t border-slate-800 text-base">
              <span className="text-slate-300">Total</span>
              <span className="font-black text-white">{active.currency} {Number(active.total_amount).toFixed(2)}</span>
            </div>

            <div>
              <div className="text-slate-400 text-xs mb-2">Update payment status</div>
              <div className="flex flex-wrap gap-2">
                {['pending', 'paid', 'failed', 'cancelled', 'refunded'].map((s) => (
                  <Button key={s} variant={active.payment_status === s ? 'primary' : 'soft'}
                          onClick={() => setStatusFor(active.id, s)}>{s}</Button>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}

function Row({ k, v, mono }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-slate-400 text-xs">{k}</span>
      <span className={`text-slate-200 text-right ${mono ? 'font-mono text-xs' : ''}`}>{v}</span>
    </div>
  )
}
