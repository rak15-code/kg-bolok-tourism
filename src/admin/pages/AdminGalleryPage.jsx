// admin/pages/AdminGalleryPage.jsx — upload / delete / reorder gallery images.
import { useEffect, useRef, useState } from 'react'
import { ImagePlus, Trash2, ArrowUp, ArrowDown, Loader2 } from 'lucide-react'
import { supabase } from '../../lib/supabaseClient'
import { list, insert, update, remove } from '../lib/db'
import { uploadImage, deleteImage, BUCKETS } from '../lib/storage'
import { PageHeader, Card, Spinner, Empty, Button } from '../components/ui'

export default function AdminGalleryPage() {
  const [rows, setRows] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)
  const inputRef = useRef(null)

  const load = () => list('gallery_images', { order: 'sort_order', ascending: true }).then(setRows)
  useEffect(() => { load() }, [])

  async function handleFiles(files) {
    setError(null); setBusy(true)
    try {
      let order = rows?.length || 0
      for (const file of files) {
        const { path, url } = await uploadImage(BUCKETS.gallery, file)
        await insert('gallery_images', { bucket: BUCKETS.gallery, path, url, sort_order: order++ })
      }
      load()
    } catch (err) { setError(err.message) } finally {
      setBusy(false); if (inputRef.current) inputRef.current.value = ''
    }
  }

  async function del(row) {
    if (!confirm('Delete this image?')) return
    try {
      if (row.path) await deleteImage(row.bucket || BUCKETS.gallery, row.path)
      await remove('gallery_images', row.id); load()
    } catch (err) { setError(err.message) }
  }

  // Swap sort_order with the neighbour in the given direction.
  async function move(idx, dir) {
    const a = rows[idx], b = rows[idx + dir]
    if (!a || !b) return
    await Promise.all([
      update('gallery_images', a.id, { sort_order: b.sort_order }),
      update('gallery_images', b.id, { sort_order: a.sort_order }),
    ])
    load()
  }

  if (!rows) return <Spinner label="Loading gallery…" />

  return (
    <>
      <PageHeader title="Gallery" subtitle={`${rows.length} images`}
        action={
          <Button onClick={() => inputRef.current?.click()} disabled={busy || !supabase}>
            {busy ? <Loader2 size={16} className="animate-spin" /> : <ImagePlus size={16} />} Upload
          </Button>
        } />
      <input ref={inputRef} type="file" accept="image/*" multiple className="hidden"
             onChange={(e) => e.target.files?.length && handleFiles(Array.from(e.target.files))} />

      {error && <p className="text-sm text-red-300 mb-3">{error}</p>}

      {rows.length === 0 ? <Empty>No gallery images yet — upload some.</Empty> : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {rows.map((r, i) => (
            <Card key={r.id} className="overflow-hidden group">
              <div className="aspect-square relative">
                <img src={r.url} alt="" className="w-full h-full object-cover"
                     onError={(e) => { e.currentTarget.style.opacity = 0.3 }} />
                <div className="absolute inset-x-0 bottom-0 p-2 flex justify-between
                                bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition">
                  <div className="flex gap-1">
                    <IconBtn disabled={i === 0} onClick={() => move(i, -1)}><ArrowUp size={14} /></IconBtn>
                    <IconBtn disabled={i === rows.length - 1} onClick={() => move(i, 1)}><ArrowDown size={14} /></IconBtn>
                  </div>
                  <IconBtn onClick={() => del(r)} danger><Trash2 size={14} /></IconBtn>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  )
}

function IconBtn({ children, danger, ...rest }) {
  return (
    <button {...rest}
      className={`p-1.5 rounded-lg bg-black/50 text-white disabled:opacity-30
                  ${danger ? 'hover:bg-red-500/80' : 'hover:bg-white/20'}`}>
      {children}
    </button>
  )
}
