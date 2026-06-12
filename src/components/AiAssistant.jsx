// ────────────────────────────────────────────────────────────────────────────
// AiAssistant.jsx — floating, site-wide AI chat widget.
// Bilingual, streams replies from our backend (which proxies Claude).
// ────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Loader2, Sparkles, Trash2 } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import { streamChat } from '../services/aiService'
import SimpleMarkdown from './ui/SimpleMarkdown'

export default function AiAssistant() {
  const { t, lang } = useLanguage()
  const a = t.ai
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([])   // {role, content}
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const scrollRef = useRef(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, open])

  // Open the chat when a "Chat with Sahabat Bolok AI" CTA fires the event.
  useEffect(() => {
    const openChat = () => setOpen(true)
    window.addEventListener('open-sahabat-ai', openChat)
    return () => window.removeEventListener('open-sahabat-ai', openChat)
  }, [])

  async function send(e) {
    e?.preventDefault()
    const text = input.trim()
    if (!text || busy) return
    setInput('')
    const next = [...messages, { role: 'user', content: text }]
    setMessages([...next, { role: 'assistant', content: '' }])
    setBusy(true)
    try {
      await streamChat({ messages: next, lang }, (delta) => {
        setMessages((m) => {
          const copy = [...m]
          copy[copy.length - 1] = { role: 'assistant', content: copy[copy.length - 1].content + delta }
          return copy
        })
      })
    } catch (err) {
      setMessages((m) => {
        const copy = [...m]
        copy[copy.length - 1] = { role: 'assistant', content: a.error, error: true }
        return copy
      })
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      {/* Launcher */}
      <motion.button
        onClick={() => setOpen((v) => !v)}
        aria-label={a.openLabel}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        className="fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full shadow-2xl shadow-ocean-900/50
                   bg-gradient-to-br from-forest-500 to-ocean-500 text-white
                   flex items-center justify-center"
      >
        {/* Pulsing attention ring (only while the chat is closed) */}
        {!open && (
          <motion.span
            aria-hidden="true"
            className="absolute inset-0 rounded-full bg-forest-400"
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
          />
        )}
        <span className="relative z-10">
          {open ? <X size={24} /> : <MessageCircle size={24} />}
        </span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-5 z-50 w-[calc(100vw-2.5rem)] sm:w-96 h-[32rem] max-h-[75vh]
                       rounded-3xl overflow-hidden flex flex-col
                       bg-slate-900/95 backdrop-blur-xl border border-white/15 shadow-2xl"
          >
            {/* Header */}
            <div className="px-4 py-3 bg-gradient-to-r from-forest-600 to-ocean-600 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
                <Sparkles size={18} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-sm leading-tight">{a.assistantTitle}</p>
                <p className="text-white/70 text-[11px]">{a.assistantTagline}</p>
              </div>
              {messages.length > 0 && (
                <button onClick={() => setMessages([])} aria-label={a.clear}
                        className="text-white/70 hover:text-white p-1"><Trash2 size={16} /></button>
              )}
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-4 space-y-3">
              {messages.length === 0 && (
                <div className="text-sm text-slate-300 bg-white/5 rounded-2xl p-3">{a.greeting}</div>
              )}
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm
                    ${m.role === 'user'
                      ? 'bg-gradient-to-br from-forest-500 to-ocean-500 text-white'
                      : `bg-white/8 ${m.error ? 'text-red-200' : 'text-slate-100'}`}`}>
                    {m.role === 'assistant'
                      ? (m.content
                          ? <SimpleMarkdown text={m.content} />
                          : <Loader2 size={15} className="animate-spin text-slate-400" />)
                      : m.content}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <form onSubmit={send} className="p-3 border-t border-white/10">
              <div className="flex items-end gap-2">
                <textarea
                  rows={1}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
                  placeholder={a.placeholder}
                  className="flex-1 resize-none max-h-28 px-3 py-2.5 rounded-xl bg-white/10 border border-white/15
                             text-white text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-forest-400"
                />
                <button type="submit" disabled={busy || !input.trim()} aria-label={a.send}
                        className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-br from-forest-500 to-ocean-500
                                   text-white flex items-center justify-center disabled:opacity-50 active:scale-95">
                  {busy ? <Loader2 size={17} className="animate-spin" /> : <Send size={16} />}
                </button>
              </div>
              <p className="text-[10px] text-slate-500 mt-1.5 text-center">{a.poweredBy}</p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
