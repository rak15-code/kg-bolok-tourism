// admin/pages/AdminPackagesPage.jsx — featured packages CRUD + discount %.
import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { list, insert, update, remove } from '../lib/db'
import {
  PageHeader, Card, Spinner, Empty, Button, Field, Input, Modal, Badge,
} from '../components/ui'
import ListEditor from '../components/ListEditor'

const blank = () => ({
  slug: '', title_en: '', title_bm: '', includes_en: [], includes_bm: [],
  original_price: 0, discounted_price: 0, discount_percentage: 0, currency: 'MYR',
  icon: '🎁', gradient: 'from-forest-500 to-ocean-500', attraction_slugs: [],
  homestay_slug: '', is_active: true, sort_order: 0,
})

// Auto-derive discount % from prices so the badge always matches.
function pct(original, discounted) {
  const o = Number(original) || 0, d = Number(discounted) || 0
  return o > 0 ? Math.round(((o - d) / o) * 100) : 0
}

export default function AdminPackagesPage() {
  const [rows, setRows] = useState(null)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const load = () => list('packages', { order: 'sort_order', ascending: true }).then(setRows)
  useEffect(() => { load() }, [])

  async function save() {
    setSaving(true); setError(null)
    try {
      const e = editing
      const payload = {
        slug: e.slug, title_en: e.title_en, title_bm: e.title_bm,
        includes_en: e.includes_en, includes_bm: e.includes_bm,
        original_price: Number(e.original_price), discounted_price: Number(e.discounted_price),
        discount_percentage: pct(e.original_price, e.discounted_price),
        currency: e.currency, icon: e.icon, gradient: e.gradient,
        attraction_slugs: e.attraction_slugs, homestay_slug: e.homestay_slug || null,
        is_active: e.is_active, sort_order: Number(e.sort_order) || 0,
      }
      if (e.id) await update('packages', e.id, payload)
      else await insert('packages', payload)
      setEditing(null); load()
    } catch (err) { setError(err.message) } finally { setSaving(false) }
  }

  async function del(row) {
    if (!confirm(`Delete "${row.title_en}"?`)) return
    await remove('packages', row.id); load()
  }

  if (!rows) return <Spinner label="Loading packages…" />

  return (
    <>
      <PageHeader title="Featured Packages" subtitle={`${rows.length} total`}
        action={<Button onClick={() => { setEditing(blank()); setError(null) }}><Plus size={16} /> Add package</Button>} />

      {rows.length === 0 ? <Empty>No packages yet.</Empty> : (
        <div className="grid sm:grid-cols-2 gap-4">
          {rows.map((r) => (
            <Card key={r.id} className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">{r.icon}</span>
                <h3 className="font-bold text-white">{r.title_en}</h3>
                {!r.is_active && <Badge tone="slate">hidden</Badge>}
              </div>
              <p className="text-sm text-slate-300">
                <span className="line-through text-slate-500">RM {Number(r.original_price).toFixed(0)}</span>{' '}
                <span className="font-bold text-forest-300">RM {Number(r.discounted_price).toFixed(0)}</span>{' '}
                <Badge tone="amber">-{r.discount_percentage}%</Badge>
              </p>
              <div className="flex gap-2 mt-3">
                <Button variant="soft" onClick={() => { setEditing({ ...blank(), ...r }); setError(null) }}><Pencil size={14} /> Edit</Button>
                <Button variant="danger" onClick={() => del(r)}><Trash2 size={14} /></Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={!!editing} onClose={() => setEditing(null)} wide
             title={editing?.id ? 'Edit package' : 'New package'}>
        {editing && (
          <div>
            <div className="grid sm:grid-cols-2 gap-x-4">
              <Field label="Slug"><Input value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} /></Field>
              <Field label="Icon (emoji)"><Input value={editing.icon} onChange={(e) => setEditing({ ...editing, icon: e.target.value })} /></Field>
              <Field label="Title (EN)"><Input value={editing.title_en} onChange={(e) => setEditing({ ...editing, title_en: e.target.value })} /></Field>
              <Field label="Title (BM)"><Input value={editing.title_bm} onChange={(e) => setEditing({ ...editing, title_bm: e.target.value })} /></Field>
              <Field label="Original price (RM)"><Input type="number" value={editing.original_price} onChange={(e) => setEditing({ ...editing, original_price: e.target.value })} /></Field>
              <Field label="Discounted price (RM)" hint={`Discount: ${pct(editing.original_price, editing.discounted_price)}%`}>
                <Input type="number" value={editing.discounted_price} onChange={(e) => setEditing({ ...editing, discounted_price: e.target.value })} />
              </Field>
              <Field label="Gradient"><Input value={editing.gradient} onChange={(e) => setEditing({ ...editing, gradient: e.target.value })} /></Field>
              <Field label="Homestay slug (optional)"><Input value={editing.homestay_slug || ''} onChange={(e) => setEditing({ ...editing, homestay_slug: e.target.value })} /></Field>
            </div>

            <div className="grid sm:grid-cols-2 gap-x-4">
              <ListEditor label="Includes (EN)" value={editing.includes_en} onChange={(v) => setEditing({ ...editing, includes_en: v })} />
              <ListEditor label="Includes (BM)" value={editing.includes_bm} onChange={(v) => setEditing({ ...editing, includes_bm: v })} />
            </div>

            <ListEditor label="Attraction slugs (prefill builder)" placeholder="e.g. deerland"
              value={editing.attraction_slugs} onChange={(v) => setEditing({ ...editing, attraction_slugs: v })} />

            <label className="flex items-center gap-2 text-sm text-slate-300 mb-4">
              <input type="checkbox" checked={editing.is_active} onChange={(e) => setEditing({ ...editing, is_active: e.target.checked })} /> Active on site
            </label>

            {error && <p className="text-sm text-red-300 mb-3">{error}</p>}
            <div className="flex gap-2 justify-end">
              <Button variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
              <Button onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save'}</Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}
