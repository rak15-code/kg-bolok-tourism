// admin/pages/AdminAttractionsPage.jsx — CRUD + pricing + images for attractions.
import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { list, insert, update, remove } from '../lib/db'
import {
  PageHeader, Card, Spinner, Empty, Button, Field, Input, Textarea, Modal, Badge,
} from '../components/ui'
import ListEditor from '../components/ListEditor'
import ImageUploader from '../components/ImageUploader'
import { BUCKETS } from '../lib/storage'

const blank = () => ({
  slug: '', category: '', icon: '🌿', gradient: 'from-forest-500 to-ocean-500',
  base_price: 0, price: 0, is_active: true, image: '', images: [],
  content: { en: { name: '', tag: '', description: '', highlights: [] },
             bm: { name: '', tag: '', description: '', highlights: [] } },
  packages: null, notes: null, sort_order: 0,
})

export default function AdminAttractionsPage() {
  const [rows, setRows] = useState(null)
  const [editing, setEditing] = useState(null)   // row or blank()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const load = () => list('attractions', { order: 'sort_order', ascending: true }).then(setRows)
  useEffect(() => { load() }, [])

  // images stored as [{url,path}] in the editor; persisted as string[] of urls.
  function openEdit(row) {
    const imgs = (row.images || []).map((u) => (typeof u === 'string' ? { url: u, path: null } : u))
    setEditing({ ...blank(), ...row, _images: imgs })
    setError(null)
  }
  function openNew() { setEditing({ ...blank(), _images: [] }); setError(null) }

  async function save() {
    setSaving(true); setError(null)
    try {
      const e = editing
      const payload = {
        slug: e.slug, category: e.category, icon: e.icon, gradient: e.gradient,
        base_price: Number(e.base_price), price: Number(e.price), is_active: e.is_active,
        images: (e._images || []).map((i) => i.url),
        image: (e._images || [])[0]?.url || e.image || null,
        content: e.content, packages: e.packages, notes: e.notes,
        sort_order: Number(e.sort_order) || 0,
      }
      if (e.id) await update('attractions', e.id, payload)
      else await insert('attractions', payload)
      setEditing(null); load()
    } catch (err) { setError(err.message) } finally { setSaving(false) }
  }

  async function del(row) {
    if (!confirm(`Delete "${row.content?.en?.name || row.slug}"?`)) return
    await remove('attractions', row.id); load()
  }

  function setContent(lang, key, val) {
    setEditing((e) => ({ ...e, content: { ...e.content, [lang]: { ...e.content[lang], [key]: val } } }))
  }

  if (!rows) return <Spinner label="Loading attractions…" />

  return (
    <>
      <PageHeader title="Attractions" subtitle={`${rows.length} total`}
        action={<Button onClick={openNew}><Plus size={16} /> Add attraction</Button>} />

      {rows.length === 0 ? <Empty>No attractions yet.</Empty> : (
        <div className="grid sm:grid-cols-2 gap-4">
          {rows.map((r) => (
            <Card key={r.id} className="p-4 flex gap-4 items-start">
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${r.gradient} flex items-center justify-center text-2xl shrink-0`}>
                {r.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-white truncate">{r.content?.en?.name || r.slug}</h3>
                  {!r.is_active && <Badge tone="slate">hidden</Badge>}
                </div>
                <p className="text-xs text-slate-400">{r.category} · RM {Number(r.price).toFixed(0)}</p>
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
             title={editing?.id ? 'Edit attraction' : 'New attraction'}>
        {editing && (
          <div>
            <div className="grid sm:grid-cols-2 gap-x-4">
              <Field label="Slug (URL)"><Input value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} /></Field>
              <Field label="Category"><Input value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })} /></Field>
              <Field label="Icon (emoji)"><Input value={editing.icon} onChange={(e) => setEditing({ ...editing, icon: e.target.value })} /></Field>
              <Field label="Gradient (tailwind)"><Input value={editing.gradient} onChange={(e) => setEditing({ ...editing, gradient: e.target.value })} /></Field>
              <Field label="Price (RM)"><Input type="number" value={editing.price} onChange={(e) => setEditing({ ...editing, price: e.target.value })} /></Field>
              <Field label="Base price (RM)"><Input type="number" value={editing.base_price} onChange={(e) => setEditing({ ...editing, base_price: e.target.value })} /></Field>
            </div>

            <ImageUploader bucket={BUCKETS.attraction} folder={editing.slug || 'misc'} multiple
              value={editing._images} onChange={(imgs) => setEditing({ ...editing, _images: imgs })} label="Images" />

            <div className="grid sm:grid-cols-2 gap-x-4 mt-2">
              <div>
                <p className="text-xs font-bold text-forest-300 mb-2">English</p>
                <Field label="Name"><Input value={editing.content.en.name} onChange={(e) => setContent('en', 'name', e.target.value)} /></Field>
                <Field label="Tag"><Input value={editing.content.en.tag} onChange={(e) => setContent('en', 'tag', e.target.value)} /></Field>
                <Field label="Description"><Textarea rows={3} value={editing.content.en.description} onChange={(e) => setContent('en', 'description', e.target.value)} /></Field>
                <ListEditor label="Highlights" value={editing.content.en.highlights} onChange={(v) => setContent('en', 'highlights', v)} />
              </div>
              <div>
                <p className="text-xs font-bold text-ocean-300 mb-2">Bahasa Melayu</p>
                <Field label="Nama"><Input value={editing.content.bm.name} onChange={(e) => setContent('bm', 'name', e.target.value)} /></Field>
                <Field label="Tag"><Input value={editing.content.bm.tag} onChange={(e) => setContent('bm', 'tag', e.target.value)} /></Field>
                <Field label="Penerangan"><Textarea rows={3} value={editing.content.bm.description} onChange={(e) => setContent('bm', 'description', e.target.value)} /></Field>
                <ListEditor label="Tarikan utama" value={editing.content.bm.highlights} onChange={(v) => setContent('bm', 'highlights', v)} />
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm text-slate-300 mb-4">
              <input type="checkbox" checked={editing.is_active} onChange={(e) => setEditing({ ...editing, is_active: e.target.checked })} />
              Visible on site
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
