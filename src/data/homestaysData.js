// ────────────────────────────────────────────────────────────────────────────
// homestaysData.js
// ────────────────────────────────────────────────────────────────────────────
// Source of truth for every homestay shown on the Homestays page.
//
// Edit prices: change `price` on each entry of `rooms[]`.
// `priceFrom` is the cheapest room — used in the list card.
//
// Image convention: /public/images/homestays/<slug>/<slug>-1.jpg, -2.jpg, -3.jpg
// Missing images automatically fall back to gradient+icon mockups.
// ────────────────────────────────────────────────────────────────────────────

const homestaysData = [
  {
    id: 1,
    slug: "noah-chalet",
    icon: "🏡",
    gradient: "from-forest-500 to-ocean-600",
    priceFrom: 90,
    rating: 4.8,
    capacity: 20, // 6 rooms × 2 + 2 rooms × 4
    images: [
      "/images/homestays/noah-chalet/noah-1.webp",
      "/images/homestays/noah-chalet/noah-2.jpg",
      "/images/homestays/noah-chalet/noah-3.webp",
    ],
    en: {
      name: "Noah Chalet",
      tagline: "Comfortable chalet stay in Kg Bolok",
      description:
        "Noah Chalet offers a relaxing stay with 6 rooms accommodating 2 people each, plus 2 larger rooms accommodating 4 people each — perfect for couples, friends, and small families.",
      facilities: [
        "Air-conditioning",
        "Wi-Fi included",
        "Private bathroom",
        "Hot shower",
        "Breakfast available",
        "Free parking",
      ],
    },
    bm: {
      name: "Noah Chalet",
      tagline: "Penginapan chalet selesa di Kg Bolok",
      description:
        "Noah Chalet menawarkan penginapan yang santai dengan 6 bilik untuk 2 orang setiap satu, dan 2 bilik lebih besar untuk 4 orang — sesuai untuk pasangan, rakan, dan keluarga kecil.",
      facilities: [
        "Penghawa dingin",
        "Wi-Fi disediakan",
        "Bilik air peribadi",
        "Pancuran air panas",
        "Sarapan tersedia",
        "Letak kereta percuma",
      ],
    },
    rooms: [
      {
        key: "double",
        en: { name: "2-Person Room", desc: "Comfortable room for 2 guests" },
        bm: { name: "Bilik 2 Orang", desc: "Bilik selesa untuk 2 tetamu" },
        price: 90,
        guests: 2,
      },
      {
        key: "quad",
        en: { name: "4-Person Room", desc: "Family-style room for 4 guests" },
        bm: { name: "Bilik 4 Orang", desc: "Bilik gaya keluarga untuk 4 tetamu" },
        price: 150,
        guests: 4,
      },
    ],
  },

  {
    id: 2,
    slug: "rengit-goat-farm",
    icon: "🐐",
    gradient: "from-ocean-500 to-deepsea-500",
    priceFrom: 85,
    rating: 4.7,
    capacity: 6,
    images: [
      "/images/homestays/rengit-goat-farm/rengit-1.avif",
      "/images/homestays/rengit-goat-farm/rengit-2.avif",
      "/images/homestays/rengit-goat-farm/rengit-3.avif",
    ],
    en: {
      name: "Rengit Goat Farm",
      tagline: "Stay on a working goat farm",
      description:
        "A unique homestay set within a working goat farm. Wake up to the sounds of nature, watch the goats roam, and enjoy fresh farm hospitality.",
      facilities: [
        "Fan / air-cooler",
        "Wi-Fi included",
        "Shared & private bathrooms",
        "Farm tour included",
        "Breakfast available",
        "Free parking",
      ],
    },
    bm: {
      name: "Ladang Kambing Rengit",
      tagline: "Menginap di ladang kambing yang sebenar",
      description:
        "Homestay unik di dalam ladang kambing yang aktif. Bangun dengan bunyi alam, lihat kambing berkeliaran, dan nikmati layanan ladang yang segar.",
      facilities: [
        "Kipas / penyejuk udara",
        "Wi-Fi disediakan",
        "Bilik air kongsi & peribadi",
        "Lawatan ladang disertakan",
        "Sarapan tersedia",
        "Letak kereta percuma",
      ],
    },
    rooms: [
      {
        key: "standard",
        en: { name: "Standard Room", desc: "Sleeps 2 guests" },
        bm: { name: "Bilik Standard", desc: "Untuk 2 tetamu" },
        price: 85,
        guests: 2,
      },
      {
        key: "family",
        en: { name: "Family Room", desc: "Sleeps 4 guests" },
        bm: { name: "Bilik Keluarga", desc: "Untuk 4 tetamu" },
        price: 140,
        guests: 4,
      },
    ],
  },

  {
    id: 3,
    slug: "inap-di-kebun",
    icon: "🌳",
    gradient: "from-deepsea-500 to-forest-600",
    priceFrom: 140,
    rating: 4.9,
    capacity: 18, // 1 full homestay 10pax + roomstay (2 rooms × 4)
    images: [
      "/images/homestays/inap-di-kebun/inap-1.webp",
      "/images/homestays/inap-di-kebun/inap-2.webp",
      "/images/homestays/inap-di-kebun/inap-3.webp",
    ],
    en: {
      name: "Inap Di Kebun",
      tagline: "Garden retreat with full-house or roomstay option",
      description:
        "A peaceful 'in the garden' retreat. Book the full homestay (3 rooms, 10 guests) for groups, or pick a roomstay option (4 guests per room) for smaller parties.",
      facilities: [
        "Air-conditioning",
        "Wi-Fi included",
        "Private bathroom",
        "Garden view",
        "Breakfast available",
        "Free parking",
      ],
    },
    bm: {
      name: "Inap Di Kebun",
      tagline: "Penginapan tenang dalam kebun — pilih rumah penuh atau bilik",
      description:
        "Penginapan tenang di dalam kebun. Tempah rumah penuh (3 bilik, 10 tetamu) untuk kumpulan, atau pilih bilik (4 tetamu setiap bilik) untuk kumpulan kecil.",
      facilities: [
        "Penghawa dingin",
        "Wi-Fi disediakan",
        "Bilik air peribadi",
        "Pemandangan kebun",
        "Sarapan tersedia",
        "Letak kereta percuma",
      ],
    },
    rooms: [
      {
        key: "roomstay",
        en: { name: "Roomstay (4 pax)", desc: "Single room, 4 guests" },
        bm: { name: "Inap Bilik (4 orang)", desc: "Satu bilik, 4 tetamu" },
        price: 140,
        guests: 4,
      },
      {
        key: "full-homestay",
        en: { name: "Full Homestay (10 pax)", desc: "Entire 3-room homestay, 10 guests" },
        bm: { name: "Homestay Penuh (10 orang)", desc: "Seluruh homestay 3 bilik, 10 tetamu" },
        price: 280,
        guests: 10,
      },
    ],
  },
];

export const getHomestayBySlug = (slug) =>
  homestaysData.find((h) => h.slug === slug);

export default homestaysData;
