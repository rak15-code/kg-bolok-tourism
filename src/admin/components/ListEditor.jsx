// admin/components/ListEditor.jsx — edit an array of short strings.
import { Plus, X } from 'lucide-react'
import { Input } from './ui'

export default function ListEditor({ label, value = [], onChange, placeholder }) {
  const items = Array.isArray(value) ? value : []
  const set = (i, v) => onChange(items.map((it, idx) => (idx === i ? v : it)))
  const add = () => onChange([...items, ''])
  const del = (i) => onChange(items.filter((_, idx) => idx !== i))

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-semibold text-slate-300">{label}</span>
        <button type="button" onClick={add}
                className="text-xs text-forest-300 hover:text-forest-200 inline-flex items-center gap-1">
          <Plus size={13} /> Add
        </button>
      </div>
      <div className="space-y-2">
        {items.map((it, i) => (
          <div key={i} className="flex gap-2">
            <Input value={it} placeholder={placeholder} onChange={(e) => set(i, e.target.value)} />
            <button type="button" onClick={() => del(i)}
                    className="px-2 rounded-lg text-slate-400 hover:text-red-300 hover:bg-red-500/10">
              <X size={16} />
            </button>
          </div>
        ))}
        {items.length === 0 && <p className="text-[11px] text-slate-500">No items yet.</p>}
      </div>
    </div>
  )
}
