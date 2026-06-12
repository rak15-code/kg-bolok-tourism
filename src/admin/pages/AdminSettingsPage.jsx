// admin/pages/AdminSettingsPage.jsx — phone, socials, currency rates, theme.
import { useEffect, useState } from 'react'
import { Save, Check } from 'lucide-react'
import { supabase } from '../../lib/supabaseClient'
import { PageHeader, Card, Spinner, Button, Field, Input } from '../components/ui'

const CURRENCIES = ['MYR', 'USD', 'SGD', 'INR', 'EUR']
const THEME_KEYS = [['primary', 'Primary'], ['secondary', 'Secondary'], ['accent', 'Accent']]

export default function AdminSettingsPage() {
  const [s, setS] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('settings').select('*').eq('id', 1).maybeSingle()
      setS(data || { id: 1, currency_rates: { MYR: 1 }, theme: {} })
    })()
  }, [])

  const setField = (k, v) => setS((p) => ({ ...p, [k]: v }))
  const setRate = (c, v) => setS((p) => ({ ...p, currency_rates: { ...p.currency_rates, [c]: Number(v) } }))
  const setTheme = (k, v) => setS((p) => ({ ...p, theme: { ...p.theme, [k]: v } }))

  async function save() {
    setSaving(true); setError(null); setSaved(false)
    try {
      const { error: err } = await supabase.from('settings').upsert({ ...s, id: 1 })
      if (err) throw err
      setSaved(true); setTimeout(() => setSaved(false), 2500)
    } catch (err) { setError(err.message) } finally { setSaving(false) }
  }

  if (!s) return <Spinner label="Loading settings…" />

  return (
    <>
      <PageHeader title="Settings" subtitle="Site-wide configuration."
        action={<Button onClick={save} disabled={saving}>
          {saved ? <Check size={16} /> : <Save size={16} />} {saved ? 'Saved' : saving ? 'Saving…' : 'Save'}
        </Button>} />

      <div className="grid lg:grid-cols-2 gap-5">
        <Card className="p-5">
          <h2 className="font-bold text-white mb-4">Contact & Social</h2>
          <Field label="Phone (tel)"><Input value={s.phone || ''} onChange={(e) => setField('phone', e.target.value)} /></Field>
          <Field label="Phone (display)"><Input value={s.phone_display || ''} onChange={(e) => setField('phone_display', e.target.value)} /></Field>
          <Field label="WhatsApp"><Input value={s.whatsapp || ''} onChange={(e) => setField('whatsapp', e.target.value)} /></Field>
          <Field label="Instagram URL"><Input value={s.instagram || ''} onChange={(e) => setField('instagram', e.target.value)} /></Field>
          <Field label="TikTok URL"><Input value={s.tiktok || ''} onChange={(e) => setField('tiktok', e.target.value)} /></Field>
          <Field label="Email"><Input value={s.email || ''} onChange={(e) => setField('email', e.target.value)} /></Field>
          <Field label="Address"><Input value={s.address || ''} onChange={(e) => setField('address', e.target.value)} /></Field>
        </Card>

        <div className="space-y-5">
          <Card className="p-5">
            <h2 className="font-bold text-white mb-1">Currency rates</h2>
            <p className="text-xs text-slate-400 mb-4">How much of each currency equals 1 MYR.</p>
            {CURRENCIES.map((c) => (
              <Field key={c} label={c}>
                <Input type="number" step="0.001" value={s.currency_rates?.[c] ?? ''}
                       disabled={c === 'MYR'} onChange={(e) => setRate(c, e.target.value)} />
              </Field>
            ))}
          </Card>

          <Card className="p-5">
            <h2 className="font-bold text-white mb-4">Theme colors</h2>
            {THEME_KEYS.map(([k, label]) => (
              <div key={k} className="flex items-center gap-3 mb-3">
                <input type="color" value={s.theme?.[k] || '#2f9e44'} onChange={(e) => setTheme(k, e.target.value)}
                       className="w-10 h-10 rounded-lg bg-transparent border border-slate-700 cursor-pointer" />
                <div className="flex-1">
                  <div className="text-sm text-white">{label}</div>
                  <Input value={s.theme?.[k] || ''} onChange={(e) => setTheme(k, e.target.value)} className="mt-1" />
                </div>
              </div>
            ))}
          </Card>
        </div>
      </div>

      {error && <p className="text-sm text-red-300 mt-4">{error}</p>}
    </>
  )
}
