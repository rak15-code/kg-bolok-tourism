// admin/pages/AdminHomestaysPage.jsx — CRUD + room pricing + images.
import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, X } from 'lucide-react'
import { list, insert, update, remove } from '../lib/db'
import {
  PageHeader, Card, Spinner, Empty, Button, Field, Input, Textarea, Modal, Badge,
} from '../components/ui'
import ListEditor from '../components/ListEditor'
import ImageUploader from '../components/ImageUploader'
import { BUCKETS } from '../lib/storage'

const blank = () => ({
  slug: '', icon: '🏡', gradient: 'from-forest-500 to-ocean-600',
  price_from: 0, rating: 4.8, capacity: 0, is_active: true, images: [],
  content: { en: { name: '', tagline: '', description: '', facilities: [] },
             bm: { name: '', tagline: '', description: '', facilities: [] } },
  rooms: [], sort_order: 0,
})

export default function AdminHomestaysPage() {
  const [rows, setRows] = useState(null)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const load = () => list('homestays', { order: 'sort_order', ascending: true }).then(setRows)
  useEffect(() => { load() }, [])

  function openEdit(row) {
    const imgs = (row.images || []).map((u) => (typeof u === 'string' ? { url: u, path: null } : u))
    setEditing({ ...blank(), ...row, _images: imgs }); setError(null)
  }
  function openNew() { setEditing({ ...blank(), _images: [] }); setError(null) }

  function setContent(lang, key, val) {
    setEditing((e) => ({ ...e, content: { ...e.content, [lang]: { ...e.content[lang], [key]: val } } }))
  }

  // ── rooms editor ──
  const addRoom = () => setEditing((e) => ({
    ...e, rooms: [...(e.rooms || []), { key: '', en: { name: '', desc: '' }, bm: { name: '', desc: '' }, price: 0, guests: 2 }],
  }))
  const setRoom = (i, patch) => setEditing((e) => ({
    ...e, rooms: e.rooms.map((r, idx) => (idx === i ? { ...r, ...patch } : r)),
  }))
  const delRoom = (i) => setEditing((e) => ({ ...e, rooms: e.rooms.filter((_, idx) => idx !== i) }))

  async function save() {
    setSaving(true); setError(null)
    try {
      const e = editing
      const payload = {
        slug: e.slug, icon: e.icon, gradient: e.gradient,
        price_from: Number(e.price_from), rating: Number(e.rating), capacity: Number(e.capacity),
        is_active: e.is_active, images: (e._images || []).map((i) => i.url),
        content: e.content, rooms: (e.rooms || []).map((r) => ({ ...r, price: Number(r.price), guests: Number(r.guests) })),
        sort_order: Number(e.sort_order) || 0,
      }
      if (e.id) await update('homestays', e.id, payload)
      else await insert('homestays', payload)
      setEditing(null); load()
    } catch (err) { setError(err.message) } finally { setSaving(false) }
  }

  async function del(row) {
    if (!confirm(`Delete "${row.content?.en?.name || row.slug}"?`)) return
    await remove('homestays', row.id); load()
  }

  if (!rows) return <Spinner label="Loading homestays…" />

  return (
    <>
      <PageHeader title="Homestays" subtitle={`${rows.length} total`}
        action={<Button onClick={openNew}><Plus size={16} /> Add homestay</Button>} />

      {rows.length === 0 ? <Empty>No homestays yet.</Empty> : (
        <div className="grid sm:grid-cols-2 gap-4">
          {rows.map((r) => (
            <Card key={r.id} className="p-4 flex gap-4 items-start">
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${r.gradient} flex items-center justify-center text-2xl shrink-0`}>{r.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-white truncate">{r.content?.en?.name || r.slug}</h3>
                  {!r.is_active && <Badge tone="slate">hidden</Badge>}
                </div>
                <p className="text-xs text-slate-400">From RM {Number(r.price_from).toFixed(0)} · {(r.rooms || []).length} room types</p>
                <div className="flex gap-2 mt-2">
                  <Button variant="soft" onClick={() => openEdit(r)}><Pencil size={14} /> Edit</Button>
                  <Button variant="danger" onClick={() => del(r)}><Trash2 size={14} /></Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={!!editing} onClose={() => setEditing(null)} wide
             title={editing?.id ? 'Edit homestay' : 'New homestay'}>
        {editing && (
          <div>
            <div className="grid sm:grid-cols-2 gap-x-4">
              <Field label="Slug (URL)"><Input value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} /></Field>
              <Field label="Icon (emoji)"><Input value={editing.icon} onChange={(e) => setEditing({ ...editing, icon: e.target.value })} /></Field>
              <Field label="Gradient"><Input value={editing.gradient} onChange={(e) => setEditing({ ...editing, gradient: e.target.value })} /></Field>
              <Field label="Price from (RM)"><Input type="number" value={editing.price_from} onChange={(e) => setEditing({ ...editing, price_from: e.target.value })} /></Field>
              <Field label="Rating"><Input type="number" step="0.1" value={editing.rating} onChange={(e) => setEditing({ ...editing, rating: e.target.value })} /></Field>
              <Field label="Capacity"><Input type="number" value={editing.capacity} onChange={(e) => setEditing({ ...editing, capacity: e.target.value })} /></Field>
            </div>

            <ImageUploader bucket={BUCKETS.homestay} folder={editing.slug || 'misc'} multiple
              value={editing._images} onChange={(imgs) => setEditing({ ...editing, _images: imgs })} label="Images" />

            <div className="grid sm:grid-cols-2 gap-x-4 mt-2">
              <div>
                <p className="text-xs font-bold text-forest-300 mb-2">English</p>
                <Field label="Name"><Input value={editing.content.en.name} onChange={(e) => setContent('en', 'name', e.target.value)} /></Field>
                <Field label="Tagline"><Input value={editing.content.en.tagline} onChange={(e) => setContent('en', 'tagline', e.target.value)} /></Field>
                <Field label="Description"><Textarea rows={3} value={editing.content.en.description} onChange={(e) => setContent('en', 'description', e.target.value)} /></Field>
                <ListEditor label="Facilities" value={editing.content.en.facilities} onChange={(v) => setContent('en', 'facilities', v)} />
              </div>
              <div>
                <p className="text-xs font-bold text-ocean-300 mb-2">Bahasa Melayu</p>
                <Field label="Nama"><Input value={editing.content.bm.name} onChange={(e) => setContent('bm', 'name', e.target.value)} /></Field>
                <Field label="Slogan"><Input value={editing.content.bm.tagline} onChange={(e) => setContent('bm', 'tagline', e.target.value)} /></Field>
                <Field label="Penerangan"><Textarea rows={3} value={editing.content.bm.description} onChange={(e) => setContent('bm', 'description', e.target.value)} /></Field>
                <ListEditor label="Kemudahan" value={editing.content.bm.facilities} onChange={(v) => setContent('bm', 'facilities', v)} />
              </div>
            </div>

            {/* Rooms / pricing */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-300">Rooms & pricing</span>
                <button type="button" onClick={addRoom} className="text-xs text-forest-300 inline-flex items-center gap-1"><Plus size={13} /> Add room</button>
              </div>
              <div className="space-y-3">
                {(editing.rooms || []).map((room, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-800/60 border border-slate-700">
                    <div className="flex justify-between mb-2">
                      <span className="text-[11px] text-slate-400">Room {i + 1}</span>
                      <button type="button" onClick={() => delRoom(i)} className="text-slate-400 hover:text-red-300"><X size={14} /></button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <Input placeholder="key" value={room.key} onChange={(e) => setRoom(i, { key: e.target.value })} />
                      <Input placeholder="EN name" value={room.en?.name || ''} onChange={(e) => setRoom(i, { en: { ...room.en, name: e.target.value } })} />
                      <Input placeholder="BM name" value={room.bm?.name || ''} onChange={(e) => setRoom(i, { bm: { ...room.bm, name: e.target.value } })} />
                      <Input type="number" placeholder="Price" value={room.price} onChange={(e) => setRoom(i, { price: e.target.value })} />
                      <Input type="number" placeholder="Guests" value={room.guests} onChange={(e) => setRoom(i, { guests: e.target.value })} />
                    </div>
                  </div>
                ))}
                {(editing.rooms || []).length === 0 && <p className="text-[11px] text-slate-500">No rooms yet.</p>}
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm text-slate-300 mb-4">
              <input type="checkbox" checked={editing.is_active} onChange={(e) => setEditing({ ...editing, is_active: e.target.checked })} /> Visible on site
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
