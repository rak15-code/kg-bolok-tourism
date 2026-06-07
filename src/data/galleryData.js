// ────────────────────────────────────────────────────────────────────────────
// galleryData.js
// ────────────────────────────────────────────────────────────────────────────
// Items shown on the homepage gallery carousel and Gallery page.
//
// Auto-built from attractions + homestays — every image you add under
//   /public/images/attractions/<slug>/  and  /public/images/homestays/<slug>/
// automatically appears in the gallery. No code changes needed.
//
// If an image file is missing, the tile gracefully falls back to a gradient
// + emoji mockup (see ImageOrPlaceholder).
// ────────────────────────────────────────────────────────────────────────────

import attractions from "./attractionsData";
import homestays from "./homestaysData";

// Expand each attraction into one gallery item PER image.
const attractionItems = attractions.flatMap((a) =>
  (a.images?.length ? a.images : [a.image]).map((src) => ({
    src,
    emoji: a.icon,
    gradient: a.gradient,
    en: { title: a.en.name, tag: a.en.tag },
    bm: { title: a.bm.name, tag: a.bm.tag },
  }))
);

// Same for homestays.
const homestayItems = homestays.flatMap((h) =>
  (h.images?.length ? h.images : []).map((src) => ({
    src,
    emoji: h.icon,
    gradient: h.gradient,
    en: { title: h.en.name, tag: "Homestay" },
    bm: { title: h.bm.name, tag: "Homestay" },
  }))
);

const galleryData = [...attractionItems, ...homestayItems];

export default galleryData;
