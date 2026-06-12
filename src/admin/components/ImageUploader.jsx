// admin/components/ImageUploader.jsx
// Reusable image manager for a Supabase Storage bucket.
//   • Upload (drag/click)  • Preview thumbnails  • Delete
// Works in two modes:
//   value = string  (single image URL)        → onChange(url, path)
//   value = array   ([{ url, path }])          → onChange(nextArray)
// Stores the public URL (for the DB) AND the object path (for deletion).

import { useRef, useState } from 'react'
import { ImagePlus, Trash2, Loader2 } from 'lucide-react'
import { uploadImage, deleteImage } from '../lib/storage'

export default function ImageUploader({
  bucket, folder = '', multiple = false, value, onChange, label = 'Images',
}) {
  const inputRef = useRef(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

  const items = multiple
    ? (Array.isArray(value) ? value : [])
    : (value ? [typeof value === 'string' ? { url: value, path: null } : value] : [])

  async function handleFiles(files) {
    setError(null); setBusy(true)
    try {
      const uploaded = []
      for (const file of files) uploaded.push(await uploadImage(bucket, file, folder))
      if (multiple) onChange([...(Array.isArray(value) ? value : []), ...uploaded])
      else onChange(uploaded[0].url, uploaded[0].path)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  async function handleDelete(item, idx) {
    setError(null)
    try {
      if (item.path) await deleteImage(bucket, item.path)
      if (multiple) onChange((Array.isArray(value) ? value : []).filter((_, i) => i !== idx))
      else onChange('', null)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-slate-300">{label}</span>
        <span className="text-[11px] text-slate-500">{bucket}</span>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {items.map((item, idx) => (
          <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden border border-slate-700">
            <img src={item.url} alt="" className="w-full h-full object-cover"
                 onError={(e) => { e.currentTarget.style.opacity = 0.3 }} />
            <button type="button" onClick={() => handleDelete(item, idx)}
                    className="absolute top-1.5 right-1.5 p-1.5 rounded-lg bg-black/60 text-red-300
                               opacity-0 group-hover:opacity-100 transition hover:bg-red-500/80 hover:text-white">
              <Trash2 size={14} />
            </button>
          </div>
        ))}

        {(multiple || items.length === 0) && (
          <button type="button" onClick={() => inputRef.current?.click()} disabled={busy}
                  className="aspect-square rounded-xl border-2 border-dashed border-slate-700
                             flex flex-col items-center justify-center gap-1 text-slate-400
                             hover:border-forest-500 hover:text-forest-300 transition disabled:opacity-50">
            {busy ? <Loader2 className="animate-spin" size={20} /> : <ImagePlus size={20} />}
            <span className="text-[11px]">{busy ? 'Uploading…' : 'Upload'}</span>
          </button>
        )}
      </div>

      <input ref={inputRef} type="file" accept="image/*" multiple={multiple} className="hidden"
             onChange={(e) => e.target.files?.length && handleFiles(Array.from(e.target.files))} />
      {error && <p className="text-xs text-red-300 mt-2">{error}</p>}
    </div>
  )
}
