// ════════════════════════════════════════════════════════════════════════════
// aiVideos.js — SINGLE SOURCE OF TRUTH for all AI video showcase content.
// ════════════════════════════════════════════════════════════════════════════
// These are PRE-GENERATED .mp4 files only. No AI video APIs, no script-to-video
// tools, no dynamic generation. You simply drop the .mp4 files into the public
// folders below and register them here.
//
// ── WHERE THE FILES LIVE ────────────────────────────────────────────────────
//   English videos →  public/videos/english/<file>.mp4
//   Malay videos   →  public/videos/malay/<file>.mp4
//   Thumbnails     →  public/thumbnails/<file>.jpg   (shared across languages)
//
// ── LANGUAGE RULE ───────────────────────────────────────────────────────────
//   App language 'en'  → serves from /videos/english/
//   App language 'bm'  → serves from /videos/malay/
//   Switching the site language auto-switches which folder is used. The same
//   `file` name is expected in BOTH folders (e.g. english/elle.mp4 + malay/elle.mp4).
//
// ── GRACEFUL MISSING FILES ──────────────────────────────────────────────────
//   If an .mp4 (or thumbnail) is not present, the UI shows the thumbnail (or a
//   placeholder) and never crashes. Upload the file later and it just works.
// ════════════════════════════════════════════════════════════════════════════

const FOLDER = { en: 'english', bm: 'malay' }

/* ============================================================================
   VIDEO REGISTRY SPACE
   (ADD NEW VIDEOS HERE ONLY)
   ============================================================================

   Each entry shape:

   {
     id:        "elle",                 // unique id (also the default <file>.mp4 name)
     file:      "elle.mp4",             // mp4 filename present in BOTH language folders
     thumbnail: "/thumbnails/elle.jpg", // shared thumbnail image
     en: { title: "Elle", description: "AI cultural storyteller" },
     bm: { title: "Elle", description: "Pencerita budaya AI" },
   }

   ADD NEW VIDEOS BELOW THIS LINE ONLY
   ------------------------------------------------------------------------- */
const registry = [
  {
    id: 'elle',
    file: 'elle.mp4',
    thumbnail: '/thumbnails/elle.jpg',
    en: { title: 'Meet Elle the Elephant', description: 'A gentle giant of Kuala Gandah, brought to life by AI.' },
    bm: { title: 'Kenali Elle si Gajah', description: 'Gajah lembut dari Kuala Gandah, dihidupkan oleh AI.' },
  },
  {
    id: 'deer',
    file: 'deer.mp4',
    thumbnail: '/thumbnails/deer.jpg',
    en: { title: 'Deerland Up Close', description: 'Wander among the friendly deer of Kampung Bolok.' },
    bm: { title: 'Deerland Dari Dekat', description: 'Menjelajah bersama rusa mesra Kampung Bolok.' },
  },
  {
    id: 'dodol',
    file: 'dodol.mp4',
    thumbnail: '/thumbnails/dodol.jpg',
    en: { title: 'The Art of Dodol', description: 'Watch a treasured kampung sweet made the traditional way.' },
    bm: { title: 'Seni Membuat Dodol', description: 'Saksikan manisan kampung yang istimewa dibuat secara tradisional.' },
  },
]
/* --------------------------- END REGISTRY SPACE -------------------------- */

// Resolve the registry into the flat, language-aware shape the UI consumes:
//   { id, title, description, thumbnail, videoUrl, language }
export function getAiVideos(lang = 'en') {
  const folder = FOLDER[lang] || FOLDER.en
  return registry.map((v) => {
    const d = v[lang] || v.en
    return {
      id: v.id,
      title: d.title,
      description: d.description,
      thumbnail: v.thumbnail,
      videoUrl: `/videos/${folder}/${v.file}`,
      language: lang,
    }
  })
}

export default registry
