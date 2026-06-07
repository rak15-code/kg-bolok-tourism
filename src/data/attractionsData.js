// ────────────────────────────────────────────────────────────────────────────
// attractionsData.js
// ────────────────────────────────────────────────────────────────────────────
// Single source of truth for every attraction shown in Kg Bolok Tourism.
//
// To edit prices: change the `price` field (RM, per person base) on each
// attraction.  For attractions that offer multiple sub-packages, edit the
// `packages` array — the cheapest entry in `packages` is shown on cards.
//
// Image directory convention:
//   /public/images/attractions/<slug>/<slug>-1.jpg, -2.jpg, -3.jpg
// Missing images automatically fall back to gradient+icon mockups
// (see components/ui/ImageOrPlaceholder.jsx).
// ────────────────────────────────────────────────────────────────────────────

const attractionsData = [
  {
    id: 1,
    slug: "elephant-conservation-centre",
    category: "Wildlife",
    icon: "🐘",
    image: "/images/attractions/elephant/elephant-1.jpg",
    images: [
      "/images/attractions/elephant/elephant-1.jpg",
      "/images/attractions/elephant/elephant-2.jpeg",
      "/images/attractions/elephant/elephant-3.jpg",
    ],
    gradient: "from-forest-500 to-ocean-500",
    // basePrice is the cheapest entry used on cards / package builder
    basePrice: 70,
    price: 70,
    duration: { en: "45 min – 1.5 hours", bm: "45 minit – 1.5 jam" },
    en: {
      name: "National Elephant Conservation Centre",
      tag: "Wildlife & Conservation",
      description:
        "A conservation and educational attraction where visitors can learn about elephant care and conservation. Choose from a regular guided service, deeper educational tour, or the special bathing-with-young-elephant experience.",
      highlights: [
        "Learn about elephant rescue & conservation",
        "Guided by trained handlers",
        "Educational tour option for groups",
        "Optional bathing experience with young elephants",
      ],
    },
    bm: {
      name: "Pusat Konservasi Gajah Kebangsaan",
      tag: "Hidupan Liar & Konservasi",
      description:
        "Tarikan pendidikan dan konservasi di mana pelawat dapat mempelajari penjagaan dan pemuliharaan gajah. Pilih perkhidmatan biasa, lawatan pendidikan, atau pengalaman istimewa memandikan anak gajah.",
      highlights: [
        "Pelajari penyelamatan & pemuliharaan gajah",
        "Dipandu oleh pengendali terlatih",
        "Pilihan lawatan pendidikan untuk kumpulan",
        "Pilihan pengalaman memandikan anak gajah",
      ],
    },
    packages: [
      {
        key: "regular",
        en: { name: "Regular Service", desc: "Max 10 persons / group" },
        bm: { name: "Perkhidmatan Biasa", desc: "Maks 10 orang / kumpulan" },
        price: 70,
        duration: { en: "45 min – 1 hour", bm: "45 minit – 1 jam" },
      },
      {
        key: "educational",
        en: { name: "Educational Tour", desc: "Max 7 persons / group" },
        bm: { name: "Lawatan Pendidikan", desc: "Maks 7 orang / kumpulan" },
        price: 130,
        duration: { en: "1 hour – 1.5 hours", bm: "1 jam – 1.5 jam" },
      },
      {
        key: "bathing-foreigner-adult",
        en: { name: "Bathing — Foreigner Adult", desc: "4–5 minutes session" },
        bm: { name: "Mandi — Dewasa Asing", desc: "Sesi 4–5 minit" },
        price: 40,
        duration: { en: "4 – 5 minutes", bm: "4 – 5 minit" },
      },
      {
        key: "bathing-foreigner-child",
        en: { name: "Bathing — Foreigner Child", desc: "4–5 minutes session" },
        bm: { name: "Mandi — Kanak-Kanak Asing", desc: "Sesi 4–5 minit" },
        price: 20,
        duration: { en: "4 – 5 minutes", bm: "4 – 5 minit" },
      },
      {
        key: "bathing-local-adult",
        en: { name: "Bathing — Local Adult", desc: "4–5 minutes session" },
        bm: { name: "Mandi — Dewasa Tempatan", desc: "Sesi 4–5 minit" },
        price: 20,
        duration: { en: "4 – 5 minutes", bm: "4 – 5 minit" },
      },
      {
        key: "bathing-local-child",
        en: { name: "Bathing — Local Child", desc: "4–5 minutes session" },
        bm: { name: "Mandi — Kanak-Kanak Tempatan", desc: "Sesi 4–5 minit" },
        price: 10,
        duration: { en: "4 – 5 minutes", bm: "4 – 5 minit" },
      },
    ],
    notes: {
      en: "Guide fee compulsory for bathing sessions: RM30 / group of 6 persons.",
      bm: "Bayaran pemandu wajib untuk sesi mandi: RM30 / kumpulan 6 orang.",
    },
  },

  {
    id: 2,
    slug: "deerland",
    category: "Wildlife",
    icon: "🦌",
    image: "/images/attractions/deerland/deerland-1.jpg",
    images: [
      "/images/attractions/deerland/deerland-1.jpg",
      "/images/attractions/deerland/deerland-2.jpg",
      "/images/attractions/deerland/deerland-3.jpeg",
    ],
    gradient: "from-forest-400 to-ocean-400",
    basePrice: 8,
    price: 8,
    duration: { en: "1.5 hours", bm: "1.5 jam" },
    en: {
      name: "Deerland",
      tag: "Wildlife",
      description:
        "A family-friendly deer sanctuary where you can feed gentle deer and learn about local wildlife. Different ticket types are available based on age and ID status.",
      highlights: [
        "Hand-feeding session",
        "Family-friendly trail",
        "OKU-friendly pricing",
        "Educational signage throughout",
      ],
    },
    bm: {
      name: "Deerland",
      tag: "Hidupan Liar",
      description:
        "Taman rusa mesra keluarga di mana anda boleh suapi rusa dan belajar mengenai hidupan liar tempatan. Pelbagai jenis tiket mengikut umur dan status IC.",
      highlights: [
        "Sesi suapan tangan",
        "Laluan mesra keluarga",
        "Harga mesra OKU",
        "Papan tanda pendidikan",
      ],
    },
    packages: [
      {
        key: "with-ic-child",
        en: { name: "With IC — Age 3–11", desc: "Children with Malaysian IC" },
        bm: { name: "Dengan IC — Umur 3–11", desc: "Kanak-kanak dengan IC Malaysia" },
        price: 5,
        duration: { en: "1.5 hours", bm: "1.5 jam" },
      },
      {
        key: "with-ic-adult",
        en: { name: "With IC — Age 12+", desc: "Adults with Malaysian IC" },
        bm: { name: "Dengan IC — 12 tahun ke atas", desc: "Dewasa dengan IC Malaysia" },
        price: 8,
        duration: { en: "1.5 hours", bm: "1.5 jam" },
      },
      {
        key: "with-ic-oku",
        en: { name: "With IC — OKU", desc: "Persons with disability (with IC)" },
        bm: { name: "Dengan IC — OKU", desc: "Orang Kurang Upaya (dengan IC)" },
        price: 3,
        duration: { en: "1.5 hours", bm: "1.5 jam" },
      },
      {
        key: "no-ic-child",
        en: { name: "Without IC — Age 3–11", desc: "Children, no Malaysian IC" },
        bm: { name: "Tanpa IC — Umur 3–11", desc: "Kanak-kanak, tanpa IC Malaysia" },
        price: 8,
        duration: { en: "1.5 hours", bm: "1.5 jam" },
      },
      {
        key: "no-ic-adult",
        en: { name: "Without IC — Age 12+", desc: "Adults, no Malaysian IC" },
        bm: { name: "Tanpa IC — 12 tahun ke atas", desc: "Dewasa, tanpa IC Malaysia" },
        price: 13,
        duration: { en: "1.5 hours", bm: "1.5 jam" },
      },
      {
        key: "no-ic-oku",
        en: { name: "Without IC — OKU", desc: "Persons with disability (no IC)" },
        bm: { name: "Tanpa IC — OKU", desc: "Orang Kurang Upaya (tanpa IC)" },
        price: 6,
        duration: { en: "1.5 hours", bm: "1.5 jam" },
      },
    ],
  },

  {
    id: 3,
    slug: "che-wong",
    category: "Cultural Heritage",
    icon: "🪶",
    image: "/images/attractions/che-wong/che-wong-1.jpg",
    images: [
      "/images/attractions/che-wong/che-wong-1.jpg",
      "/images/attractions/che-wong/che-wong-2.jpg",
      "/images/attractions/che-wong/che-wong-3.jpeg",
    ],
    gradient: "from-deepsea-500 to-ocean-600",
    basePrice: 15,
    price: 15,
    duration: { en: "2 hours", bm: "2 jam" },
    en: {
      name: "Perkampungan Orang Asli Che Wong",
      tag: "Indigenous Culture",
      description:
        "Kampung Bolok is the ONLY place in Malaysia where the Che Wong Orang Asli troupe is found. Meet the community, hear their stories, and learn about their unique customs and language.",
      highlights: [
        "Meet the Che Wong community",
        "Learn their unique language and traditions",
        "Walk through their settlement with a local guide",
        "Photography permitted respectfully",
      ],
    },
    bm: {
      name: "Perkampungan Orang Asli Che Wong",
      tag: "Budaya Orang Asli",
      description:
        "Kampung Bolok adalah SATU-SATUNYA tempat di Malaysia di mana suku Orang Asli Che Wong ditemui. Temui komuniti, dengar kisah mereka, dan pelajari adat unik dan bahasa mereka.",
      highlights: [
        "Bertemu komuniti Che Wong",
        "Pelajari bahasa dan tradisi unik mereka",
        "Lawatan ke perkampungan dengan pemandu tempatan",
        "Fotografi dibenarkan dengan hormat",
      ],
    },
  },

  {
    id: 4,
    slug: "padi-polybag",
    category: "Agriculture",
    icon: "🌾",
    image: "/images/attractions/padi-polybag/padi-1.jpg",
    images: [
      "/images/attractions/padi-polybag/padi-1.jpg",
      "/images/attractions/padi-polybag/padi-2.jpeg",
      "/images/attractions/padi-polybag/padi-3.jpg",
    ],
    gradient: "from-forest-400 to-ocean-500",
    basePrice: 12,
    price: 12,
    duration: { en: "1 hour", bm: "1 jam" },
    en: {
      name: "Tanaman Padi Dalam Polybag",
      tag: "Agriculture & Education",
      description:
        "An interactive farming experience: visitors learn how rice is grown in polybags, plant their own, and can bring the product back home as a take-away souvenir.",
      highlights: [
        "Hands-on rice planting in polybags",
        "Learn the full padi growth cycle",
        "Take your own polybag plant home",
        "Suitable for school groups & families",
      ],
    },
    bm: {
      name: "Tanaman Padi Dalam Polybag",
      tag: "Pertanian & Pendidikan",
      description:
        "Pengalaman bertani interaktif: pelawat belajar cara padi ditanam dalam polybag, menanam sendiri, dan boleh membawa pulang hasil sebagai cenderahati.",
      highlights: [
        "Tanam padi sendiri dalam polybag",
        "Belajar kitaran tumbesaran padi",
        "Bawa pulang polybag tanaman anda",
        "Sesuai untuk pelajar & keluarga",
      ],
    },
  },

  {
    id: 5,
    slug: "ecomeg",
    category: "Eco-Tourism",
    icon: "🌱",
    image: "/images/attractions/ecomeg/ecomeg-1.jpg",
    images: [
      "/images/attractions/ecomeg/ecomeg-1.jpg",
    ],
    gradient: "from-forest-500 to-ocean-400",
    basePrice: 10,
    price: 10,
    duration: { en: "1 hour", bm: "1 jam" },
    en: {
      name: "ECOMEG",
      tag: "Eco-Tourism Research",
      description:
        "A research place related to eco-tourism. Discover ongoing local sustainability projects, native plants, and the science behind preserving Kg Bolok's natural environment.",
      highlights: [
        "Guided eco-research tour",
        "Native plant identification",
        "Sustainability talks",
        "Great for student field trips",
      ],
    },
    bm: {
      name: "ECOMEG",
      tag: "Penyelidikan Eko-Pelancongan",
      description:
        "Pusat penyelidikan berkaitan eko-pelancongan. Lihat projek kemampanan tempatan, tumbuhan asli, dan sains pemuliharaan alam Kg Bolok.",
      highlights: [
        "Lawatan eko-penyelidikan berpandu",
        "Pengenalan tumbuhan asli",
        "Ceramah kemampanan",
        "Sesuai untuk lawatan pelajar",
      ],
    },
  },

  {
    id: 6,
    slug: "kuih-haluwe",
    category: "Culinary",
    icon: "🍯",
    image: "/images/attractions/kuih-haluwe/haluwe-1.jpeg",
    images: [
      "/images/attractions/kuih-haluwe/haluwe-1.jpeg",
      "/images/attractions/kuih-haluwe/haluwe-2.jpeg",
      "/images/attractions/kuih-haluwe/haluwe-3.jpeg",
    ],
    gradient: "from-ocean-400 to-forest-500",
    basePrice: 12,
    price: 12,
    duration: { en: "1.5 hours", bm: "1.5 jam" },
    en: {
      name: "Making of Kuih Haluwe",
      tag: "Culinary Art",
      description:
        "Kuih Haluwe refers to traditional Malay confections — either a glossy gelatinous dessert similar to Halwa Maskat, or a crispy sugar-coated dough snack. Make it yourself.",
      highlights: [
        "Hands-on traditional kuih making",
        "Learn original Malay confection recipes",
        "Taste your own creation",
        "Take leftover kuih home",
      ],
    },
    bm: {
      name: "Pembuatan Kuih Haluwe",
      tag: "Seni Masakan",
      description:
        "Kuih Haluwe merujuk kepada manisan tradisional Melayu — sama ada manisan jeli berkilat seperti Halwa Maskat, atau snek doh bersalut gula. Buat sendiri.",
      highlights: [
        "Pembuatan kuih tradisional sendiri",
        "Belajar resipi asal manisan Melayu",
        "Rasai hasil tangan sendiri",
        "Bawa pulang lebihan kuih",
      ],
    },
  },

  {
    id: 7,
    slug: "silat",
    category: "Cultural Performance",
    icon: "🥋",
    image: "/images/attractions/silat/silat-1.jpeg",
    images: [
      "/images/attractions/silat/silat-1.jpeg",
      "/images/attractions/silat/silat-2.jpeg",
    ],
    gradient: "from-deepsea-500 to-forest-600",
    basePrice: 15,
    price: 15,
    duration: { en: "45 minutes", bm: "45 minit" },
    en: {
      name: "Silat Kampung Bolok",
      tag: "Martial Arts",
      description:
        "A display of traditional Malay martial arts performed by Kg Bolok's local silat troupe. Watch live demonstrations and learn the philosophy behind every move.",
      highlights: [
        "Live silat performance",
        "Cultural briefing on Malay martial arts",
        "Try a basic stance with the master",
        "Photo session with the troupe",
      ],
    },
    bm: {
      name: "Silat Kampung Bolok",
      tag: "Seni Bela Diri",
      description:
        "Persembahan seni bela diri Melayu tradisional oleh kumpulan silat tempatan Kg Bolok. Saksikan demonstrasi langsung dan pelajari falsafah setiap gerakan.",
      highlights: [
        "Persembahan silat langsung",
        "Taklimat budaya seni mempertahankan diri Melayu",
        "Cuba kuda-kuda asas bersama guru",
        "Sesi foto bersama kumpulan",
      ],
    },
  },

  {
    id: 8,
    slug: "tarian-piring",
    category: "Cultural Performance",
    icon: "💃",
    image: "/images/attractions/tarian-piring/tarian-1.jpeg",
    images: [
      "/images/attractions/tarian-piring/tarian-1.jpeg",
      "/images/attractions/tarian-piring/tarian-2.jpg",
      "/images/attractions/tarian-piring/tarian-3.jpeg",
    ],
    gradient: "from-ocean-500 to-forest-600",
    basePrice: 15,
    price: 15,
    duration: { en: "1 hour", bm: "1 jam" },
    en: {
      name: "Tarian Piring",
      tag: "Cultural Dance",
      description:
        "A traditional dance performance from Kampung Bolok — rhythmic plate-balancing movements in vibrant costume, telling stories of Malay heritage.",
      highlights: [
        "Live traditional dance performance",
        "Costume photo opportunity",
        "Try a basic plate-dance step",
        "Q&A with dancers",
      ],
    },
    bm: {
      name: "Tarian Piring",
      tag: "Tarian Budaya",
      description:
        "Persembahan tarian tradisional dari Kampung Bolok — pergerakan berirama dengan piring di kostum berwarna, menceritakan warisan Melayu.",
      highlights: [
        "Persembahan tarian tradisional langsung",
        "Peluang foto bersama kostum",
        "Cuba langkah asas tarian piring",
        "Soal jawab bersama penari",
      ],
    },
  },

  {
    id: 9,
    slug: "tapai-pulut",
    category: "Culinary",
    icon: "🍚",
    image: "/images/attractions/tapai-pulut/tapai-1.jpg",
    images: [
      "/images/attractions/tapai-pulut/tapai-1.jpg",
      "/images/attractions/tapai-pulut/tapai-2.jpeg",
      "/images/attractions/tapai-pulut/tapai-3.webp",
    ],
    gradient: "from-forest-500 to-ocean-500",
    basePrice: 10,
    price: 10,
    duration: { en: "1 hour", bm: "1 jam" },
    en: {
      name: "Making of Tapai Pulut",
      tag: "Traditional Dessert",
      description:
        "A traditional Southeast Asian dessert made from fermented glutinous rice — soft, sticky, glossy, sweet, mildly tart, with a subtle natural fermented aroma.",
      highlights: [
        "Hands-on fermentation demo",
        "Learn the traditional wrap technique",
        "Sample fresh tapai pulut",
        "Recipe card to take home",
      ],
    },
    bm: {
      name: "Pembuatan Tapai Pulut",
      tag: "Pencuci Mulut Tradisional",
      description:
        "Pencuci mulut tradisional Asia Tenggara diperbuat daripada beras pulut yang difermentasi — lembut, melekit, berkilat, manis, sedikit masam, dengan aroma fermentasi semula jadi.",
      highlights: [
        "Demo fermentasi sendiri",
        "Belajar teknik balut tradisional",
        "Rasai tapai pulut segar",
        "Kad resipi untuk dibawa pulang",
      ],
    },
  },

  {
    id: 10,
    slug: "pakdak-din-lemang",
    category: "Culinary",
    icon: "🎋",
    image: "/images/attractions/lemang/lemang-1.jpg",
    images: [
      "/images/attractions/lemang/lemang-1.jpg",
      "/images/attractions/lemang/lemang-2.jpg",
      "/images/attractions/lemang/lemang-3.webp",
    ],
    gradient: "from-ocean-500 to-forest-500",
    basePrice: 12,
    price: 12,
    duration: { en: "1.5 hours", bm: "1.5 jam" },
    en: {
      name: "Pakdak Din Lemang",
      tag: "Traditional Delicacy",
      description:
        "A traditional delicacy made from glutinous rice, coconut milk, and salt, roasted inside bamboo lined with banana leaves. Creamy texture, smoky aroma.",
      highlights: [
        "Watch live bamboo roasting",
        "Learn the lemang preparation steps",
        "Taste fresh-from-the-fire lemang",
        "Meet 'Pakdak Din', the local master",
      ],
    },
    bm: {
      name: "Pakdak Din Lemang",
      tag: "Juadah Tradisional",
      description:
        "Juadah tradisional dari beras pulut, santan, dan garam, dibakar dalam buluh berlapik daun pisang. Tekstur lembut berkrim, aroma berasap.",
      highlights: [
        "Saksikan bakar buluh langsung",
        "Pelajari langkah penyediaan lemang",
        "Rasai lemang baru turun dari api",
        "Bertemu 'Pakdak Din', tuan masakan tempatan",
      ],
    },
  },

  {
    id: 11,
    slug: "bahulu",
    category: "Culinary",
    icon: "🍰",
    image: "/images/attractions/bahulu/bahulu-1.jpg",
    images: [
      "/images/attractions/bahulu/bahulu-1.jpg",
      "/images/attractions/bahulu/bahulu-2.jpeg",
      "/images/attractions/bahulu/bahulu-3.webp",
    ],
    gradient: "from-forest-400 to-ocean-400",
    basePrice: 10,
    price: 10,
    duration: { en: "1.5 hours", bm: "1.5 jam" },
    en: {
      name: "Making of Bahulu",
      tag: "Culinary Art",
      description:
        "A traditional cake-making experience using the conventional method — without an oven. Visitors learn how bahulu is made the old-school way over charcoal.",
      highlights: [
        "Conventional non-oven baking method",
        "Hands-on session with brass moulds",
        "Take home your own bahulu",
        "Tea pairing included",
      ],
    },
    bm: {
      name: "Pembuatan Bahulu",
      tag: "Seni Masakan",
      description:
        "Pengalaman membuat kek tradisional menggunakan kaedah konvensional — tanpa ketuhar. Pelawat belajar cara bahulu dibuat secara tradisional di atas bara.",
      highlights: [
        "Kaedah bakar tradisi tanpa ketuhar",
        "Sesi tangan dengan acuan tembaga",
        "Bawa pulang bahulu sendiri",
        "Padanan teh disertakan",
      ],
    },
  },

  {
    id: 12,
    slug: "dodol",
    category: "Culinary",
    icon: "🍮",
    image: "/images/attractions/dodol/dodol-1.jpeg",
    images: [
      "/images/attractions/dodol/dodol-1.jpeg",
      "/images/attractions/dodol/dodol-2.jpeg",
      "/images/attractions/dodol/dodol-3.jpeg",
    ],
    gradient: "from-deepsea-500 to-ocean-500",
    basePrice: 12,
    price: 12,
    duration: { en: "2 hours", bm: "2 jam" },
    en: {
      name: "Dodol Warisan",
      tag: "Heritage Confection",
      description:
        "Dodol is a sticky and sweet Southeast Asian confection with a thick, chewy, caramel-like texture. Made by slowly cooking glutinous rice flour, coconut milk and palm sugar.",
      highlights: [
        "Live slow-cook demonstration",
        "Try stirring the giant kawah",
        "Sample fresh warm dodol",
        "Heritage recipe explained",
      ],
    },
    bm: {
      name: "Dodol Warisan",
      tag: "Manisan Warisan",
      description:
        "Dodol adalah manisan Asia Tenggara yang melekit dan manis dengan tekstur pekat, kenyal, seperti karamel. Dibuat dengan memasak tepung pulut, santan dan gula merah perlahan.",
      highlights: [
        "Demonstrasi masak perlahan langsung",
        "Cuba kacau kawah besar",
        "Rasai dodol panas segar",
        "Penjelasan resipi warisan",
      ],
    },
  },

  {
    id: 13,
    slug: "pok-gee-mee-bandung",
    category: "Culinary",
    icon: "🍜",
    image: "/images/attractions/mee-bandung/mee-bandung-1.jpg",
    images: [
      "/images/attractions/mee-bandung/mee-bandung-1.jpg",
      "/images/attractions/mee-bandung/mee-bandung-2.jpg",
      "/images/attractions/mee-bandung/mee-bandung-3.webp",
    ],
    gradient: "from-ocean-500 to-deepsea-500",
    basePrice: 10,
    price: 10,
    duration: { en: "45 minutes", bm: "45 minit" },
    en: {
      name: "Pok Gee Corner Mee Bandung",
      tag: "Local Cuisine",
      description:
        "A Malaysian noodle dish inspired by Mee Bandung — yellow noodles in a rich, sweet, spicy and savoury gravy. A village favourite at Pok Gee Corner.",
      highlights: [
        "Taste authentic kampung-style mee bandung",
        "Watch the gravy being prepared",
        "Meet the owner of Pok Gee Corner",
        "Friendly halal & student-priced",
      ],
    },
    bm: {
      name: "Pok Gee Corner Mee Bandung",
      tag: "Masakan Tempatan",
      description:
        "Hidangan mi Malaysia yang diinspirasikan dari Mee Bandung — mi kuning dalam kuah pekat, manis, pedas dan berperisa. Kegemaran kampung di Pok Gee Corner.",
      highlights: [
        "Rasai mee bandung kampung yang autentik",
        "Saksikan kuah disediakan",
        "Bertemu pemilik Pok Gee Corner",
        "Mesra halal & harga pelajar",
      ],
    },
  },
];

// Helper — find one attraction by URL slug (used by AttractionDetail page).
export const getAttractionBySlug = (slug) =>
  attractionsData.find((a) => a.slug === slug);

export default attractionsData;
