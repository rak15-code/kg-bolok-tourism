// ────────────────────────────────────────────────────────────────────────────
// SimpleMarkdown.jsx — minimal, dependency-free markdown renderer.
// Handles: # / ## / ### headings, - and * bullets, 1. numbered lists,
// **bold**, and blank-line-separated paragraphs. Good enough for AI replies.
// ────────────────────────────────────────────────────────────────────────────

function renderInline(text, keyPrefix) {
  // Split on **bold** while keeping the delimiters' content.
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((p, i) => {
    if (p.startsWith('**') && p.endsWith('**')) {
      return <strong key={`${keyPrefix}-b${i}`} className="font-bold text-white">{p.slice(2, -2)}</strong>
    }
    return <span key={`${keyPrefix}-t${i}`}>{p}</span>
  })
}

export default function SimpleMarkdown({ text = '', className = '' }) {
  const lines = String(text).split('\n')
  const blocks = []
  let list = null  // { ordered, items: [] }

  const flushList = (key) => {
    if (!list) return
    const Tag = list.ordered ? 'ol' : 'ul'
    blocks.push(
      <Tag key={`list-${key}`} className={`${list.ordered ? 'list-decimal' : 'list-disc'} pl-5 space-y-1 my-2`}>
        {list.items.map((it, i) => <li key={i}>{renderInline(it, `li-${key}-${i}`)}</li>)}
      </Tag>
    )
    list = null
  }

  lines.forEach((raw, idx) => {
    const line = raw.trimEnd()
    if (!line.trim()) { flushList(idx); return }

    const h = line.match(/^(#{1,3})\s+(.*)$/)
    const bullet = line.match(/^[-*]\s+(.*)$/)
    const numbered = line.match(/^\d+\.\s+(.*)$/)

    if (bullet) {
      if (!list || list.ordered) { flushList(idx); list = { ordered: false, items: [] } }
      list.items.push(bullet[1]); return
    }
    if (numbered) {
      if (!list || !list.ordered) { flushList(idx); list = { ordered: true, items: [] } }
      list.items.push(numbered[1]); return
    }
    flushList(idx)
    if (h) {
      const level = h[1].length
      const size = level === 1 ? 'text-lg' : level === 2 ? 'text-base' : 'text-sm'
      blocks.push(<p key={`h-${idx}`} className={`${size} font-bold text-white mt-3 mb-1`}>{renderInline(h[2], `h-${idx}`)}</p>)
    } else {
      blocks.push(<p key={`p-${idx}`} className="my-1.5 leading-relaxed">{renderInline(line, `p-${idx}`)}</p>)
    }
  })
  flushList('end')

  return <div className={className}>{blocks}</div>
}
