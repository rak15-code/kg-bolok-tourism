// ────────────────────────────────────────────────────────────────────────────
// translations.js
// ────────────────────────────────────────────────────────────────────────────
// Every piece of UI text in English (en) and Bahasa Melayu (bm).
// To add a new string: add it under BOTH `en` and `bm` with the same key.
// Components use the LanguageContext hook to read these.
// ────────────────────────────────────────────────────────────────────────────

const translations = {
  en: {
    nav: {
      brand: "Kg Bolok Tourism",
      home: "Home",
      about: "About",
      attractions: "Attractions",
      homestays: "Homestay",
      builder: "Package Builder",
      gallery: "Gallery",
      contact: "Contact",
      currency: "Currency",
    },

    hero: {
      badge: "Pahang's Hidden Gem",
      pahangLabel: "Pahang, Malaysia",
      heading: "Discover the Magic of",
      headingHighlight: "Kg Bolok",
      tagline:
        "Where nature whispers, culture sings, and every moment becomes a cherished memory. Explore the authentic heart of Pahang.",
      ctaBuild: "Build Your Package",
      ctaExplore: "Explore Attractions",
      stat1: "Unique Attractions",
      stat2: "Happy Visitors",
      stat3: "Years of Heritage",
      ratingLabel: "Rated by visitors",
    },

    about: {
      sectionBadge: "Why Visit Us",
      heading: "Discover the Hidden Gems of Kampung Bolok",
      intro:
        "Just about 100 km from Kuala Lumpur, Kampung Bolok offers a peaceful countryside escape surrounded by forests, rivers and living Malay heritage — close to the city, yet a world away.",
      why1Title: "Only ~100 km from Kuala Lumpur",
      why1Desc:
        "Close to the city, yet a peaceful countryside experience surrounded by forests, rivers and greenery.",
      why2Title: "15 Minutes from Kuala Gandah Elephant Centre",
      why2Desc:
        "Right beside the famous elephant conservation centre — an ideal stop for visitors who love wildlife tourism.",
      why3Title: "Living Cultural Performances",
      why3Desc:
        "Experience Tarian Piring, Silat and Sewang performances still actively practised — a village rich in living heritage.",
      why4Title: "Treasured Traditional Foods",
      why4Desc:
        "Locals preserve recipes like halwa, lempeng and dodol — and even serve unique deer-based kampung dishes.",
      why5Title: "Surrounded by Natural Attractions",
      why5Desc:
        "Air Terjun Nerin & Lengit waterfalls, Deerland, an Orang Asli village and the elephant centre are all close by.",
    },

    attractions: {
      sectionBadge: "What To See & Do",
      heading: "Explore Our Attractions",
      subheading:
        "From wildlife encounters to cultural performances, Kg Bolok has something extraordinary for every traveller.",
      viewDetails: "View Details",
      perPerson: "per person",
      duration: "Duration",
      highlights: "Highlights",
      packages: "Packages & Pricing",
      addToPackage: "Add to Package",
      addedToPackage: "Added to Package",
      backToList: "Back to Attractions",
      yourPackage: "Your Package",
      itemsSelected: "items selected",
      notesTitle: "Important note",
    },

    homestays: {
      sectionBadge: "Where To Stay",
      heading: "Authentic Kampung Stays",
      subheading:
        "Want to spend the night? Pick from our local homestays — completely optional, only add if you'd like to stay over.",
      perNight: "per night",
      from: "From",
      capacity: "Up to {n} guests",
      viewDetails: "View Homestay",
      backToList: "Back to Homestays",
      roomTypes: "Room Types",
      facilities: "Facilities & Amenities",
      selectRoom: "Select this room",
      selectedRoom: "Selected",
      addToPackage: "Add to Package",
      addedToPackage: "Added to Package",
      nights: "Nights",
      guests: "Guests",
      skipHomestay: "No homestay needed",
      skipHomestayHint: "You can build a day-trip package without any homestay.",
    },

    builder: {
      sectionBadge: "Custom Package",
      heading: "Build Your Own Adventure",
      subheading:
        "Pick at least one attraction, optionally add a homestay, choose your group size — the price recalculates instantly with automatic bundle discounts.",
      visitors: "Number of Visitors",
      days: "Number of Days",
      nights: "Nights",
      step1: "1. Choose your attractions (required)",
      step2: "2. Choose your homestay",
      step3: "3. Set group size & dates",
      step4: "4. Review & proceed",
      noAttractions: "Browse the Attractions page to add experiences here.",
      noHomestays: "No homestay added. Homestay is optional — perfect for day trips.",
      browseAttractions: "Browse Attractions",
      browseHomestays: "Browse Homestays",
      remove: "Remove",
      empty: "Your package is empty",
      emptyHint: "Add at least one attraction to see your custom price.",
      summaryTitle: "Package Summary",
      attractionsSubtotal: "Attractions subtotal",
      homestaysSubtotal: "Homestay subtotal",
      subtotal: "Subtotal",
      discount: "Bundle discount",
      total: "Total",
      tierProgressTitle: "Bundle Discount",
      tierProgress1: "Add {n} more attraction(s) for {pct}% off",
      tierProgressMax: "You've unlocked the maximum discount!",
      proceed: "Proceed to Payment",
      clear: "Clear Package",
      hint: "Tip: 3 attractions = 15% off, 5 = 20% off, 7 = 25% off.",
      includesTitle: "What's included",
      includesInfo:
        "All packages include tour guide assistance and transport arrangement. Educational experiences can be included based on selected attractions.",
      includesGuide: "Tour guide included for selected packages",
      includesTransport: "Transport provided",
      includesEducation: "Educational experiences across attractions",
      includesAudience: "Suitable for students, families, and tourists",
      noHomestayOption: "Continue without homestay (day trip)",
      noHomestaySelected: "No homestay selected — day-trip package",
    },

    featuredPackages: {
      sectionBadge: "Best Value",
      heading: "Featured Packages",
      subheading:
        "Ready-made bundles at a special price. Book in one tap, or customize them to make them your own.",
      only: "ONLY",
      save: "Save",
      book: "Book This Package",
      customize: "Customize Instead",
    },

    smartTourism: {
      sectionBadge: "Kampung Bolok Smart Tourism",
      heading: "Experience Kampung Bolok, Smarter",
      subheading:
        "Watch our village come alive on screen, then let our AI companion help you plan the perfect visit.",
      videoTitle: "Meet Kampung Bolok",
      playLabel: "Show video",
      closeLabel: "Close video",
      muteLabel: "Mute",
      unmuteLabel: "Unmute",
      prevLabel: "Previous video",
      nextLabel: "Next video",
      videoComingSoon: "This video is coming soon — check back shortly!",
      aiPromoTag: "AI Travel Companion",
      aiPromoHeading: "Need help planning your visit?",
      aiPromoText:
        "Chat with Sahabat Bolok AI — your friendly bilingual guide for attractions, prices, homestays and ready-made packages.",
      aiPromoCta: "Chat with Sahabat Bolok AI",
    },

    ai: {
      // Assistant widget
      assistantTitle: "Sahabat Bolok AI",
      assistantTagline: "Your friendly Kampung Bolok guide",
      openLabel: "Chat with Sahabat Bolok AI",
      greeting: "Hi! I'm Sahabat Bolok AI, your friendly Kampung Bolok travel companion. Ask me about attractions, prices, homestays, or let me suggest a package for you.",
      placeholder: "Ask anything about your trip...",
      send: "Send",
      clear: "Clear chat",
      thinking: "Thinking...",
      error: "Sorry, the assistant is unavailable right now. Please try again later.",
      poweredBy: "AI can make mistakes — please verify important details.",
    },

    payment: {
      heading: "Secure Checkout",
      subheading: "You'll be redirected to HitPay's secure payment page.",
      contactTitle: "Your Contact Details",
      labelName: "Full Name",
      labelEmail: "Email Address",
      labelPhone: "Phone Number",
      labelDate: "Preferred Start Date",
      labelRequest: "Special Request (Optional)",
      placeholderName: "Enter your full name",
      placeholderEmail: "your@email.com",
      placeholderPhone: "e.g. 012-3456789",
      placeholderRequest: "Dietary needs, accessibility, arrival notes...",
      orderTitle: "Order Summary",
      payBtn: "Pay with HitPay",
      processing: "Creating secure payment...",
      poweredBy: "Powered by HitPay — sandbox/test mode",
      errorTitle: "Payment could not be created",
      tryAgain: "Try again",
      successTitle: "Payment Successful!",
      successMessage:
        "Thank you for your booking! Your custom package is confirmed. Our team will email you the itinerary within 24 hours.",
      successBackHome: "Back to Home",
      cancelTitle: "Payment Cancelled",
      cancelMessage:
        "Your payment was cancelled and no charges were made. Your package is still saved — feel free to try again.",
      cancelRetry: "Return to Checkout",
      failedTitle: "Payment Failed",
      failedMessage:
        "We couldn't complete your payment. No charges were made. Your package is still saved — please try again.",
      failedRetry: "Try Again",
    },

    gallery: {
      sectionBadge: "Photo Gallery",
      heading: "Moments to Remember",
      subheading:
        "A glimpse of the beauty, culture, and experiences waiting at Kg Bolok.",
      autoplayHint: "Auto-playing — hover to pause",
    },

    contact: {
      sectionBadge: "Get In Touch",
      heading: "Contact Us",
      subheading:
        "Have questions? We'd love to hear from you. Reach out and our team will get back to you as soon as possible.",
      addressTitle: "Address",
      address: "Kg Bolok, Pahang, Malaysia",
      phoneTitle: "Phone",
      emailTitle: "Email",
      email: "info@kgboloktourism.my",
      socialTitle: "Follow Us",
      formName: "Your Name",
      formEmail: "Your Email",
      formMessage: "Your Message",
      formNamePlaceholder: "Enter your name",
      formEmailPlaceholder: "Enter your email",
      formMessagePlaceholder: "Write your message here...",
      formBtn: "Send Message",
      formSuccess: "Message sent! We'll reply within 24 hours.",
      mapSoon: "Map coming soon",
    },

    footer: {
      tagline: "Where Nature Meets Culture",
      description:
        "Experience the authentic charm of Pahang's most treasured village destination.",
      quickLinks: "Quick Links",
      contactInfo: "Contact Info",
      followUs: "Follow Us",
      visitHours: "Visit Hours",
      copyright: "© 2026 Kg Bolok Tourism. All rights reserved.",
      madeWith: "Made with love for Pahang",
    },

    common: {
      loading: "Loading...",
      back: "Back",
      next: "Next",
      close: "Close",
      notFound: "Not found",
      notFoundDesc: "We couldn't find what you were looking for.",
      goHome: "Go Home",
    },
  },

  bm: {
    nav: {
      brand: "Pelancongan Kg Bolok",
      home: "Utama",
      about: "Tentang",
      attractions: "Tarikan",
      homestays: "Homestay",
      builder: "Bina Pakej",
      gallery: "Galeri",
      contact: "Hubungi",
      currency: "Mata Wang",
    },

    hero: {
      badge: "Permata Tersembunyi Pahang",
      pahangLabel: "Pahang, Malaysia",
      heading: "Temui Keajaiban",
      headingHighlight: "Kg Bolok",
      tagline:
        "Di mana alam bersuara, budaya bernyanyi, dan setiap saat menjadi kenangan indah. Jelajahi jantung Pahang yang tulen.",
      ctaBuild: "Bina Pakej Anda",
      ctaExplore: "Lihat Tarikan",
      stat1: "Tarikan Unik",
      stat2: "Pelawat Gembira",
      stat3: "Tahun Warisan",
      ratingLabel: "Dinilai oleh pelawat",
    },

    about: {
      sectionBadge: "Mengapa Lawati Kami",
      heading: "Temui Permata Tersembunyi Kampung Bolok",
      intro:
        "Hanya kira-kira 100 km dari Kuala Lumpur, Kampung Bolok menawarkan ketenangan desa yang dikelilingi hutan, sungai dan warisan Melayu yang masih hidup — hampir dengan bandar, namun jauh dari kesibukan.",
      why1Title: "Hanya ~100 km dari Kuala Lumpur",
      why1Desc:
        "Hampir dengan bandar, namun menawarkan pengalaman desa yang tenang dikelilingi hutan, sungai dan kehijauan.",
      why2Title: "15 Minit dari Pusat Gajah Kuala Gandah",
      why2Desc:
        "Bersebelahan pusat pemuliharaan gajah yang terkenal — persinggahan ideal untuk pencinta pelancongan hidupan liar.",
      why3Title: "Persembahan Budaya yang Masih Hidup",
      why3Desc:
        "Saksikan Tarian Piring, Silat dan Sewang yang masih diamalkan secara aktif — sebuah kampung kaya dengan warisan hidup.",
      why4Title: "Makanan Tradisional yang Dihargai",
      why4Desc:
        "Penduduk mengekalkan resipi seperti halwa, lempeng dan dodol — malah menghidangkan masakan kampung berasaskan rusa yang unik.",
      why5Title: "Dikelilingi Tarikan Semula Jadi",
      why5Desc:
        "Air Terjun Nerin & Lengit, Deerland, perkampungan Orang Asli dan pusat gajah semuanya berdekatan.",
    },

    attractions: {
      sectionBadge: "Apa Yang Boleh Dilihat",
      heading: "Jelajahi Tarikan Kami",
      subheading:
        "Dari hidupan liar hingga persembahan budaya, Kg Bolok ada sesuatu istimewa untuk setiap pengembara.",
      viewDetails: "Lihat Butiran",
      perPerson: "setiap orang",
      duration: "Tempoh",
      highlights: "Tarikan Utama",
      packages: "Pakej & Harga",
      addToPackage: "Tambah ke Pakej",
      addedToPackage: "Telah Ditambah",
      backToList: "Kembali ke Tarikan",
      yourPackage: "Pakej Anda",
      itemsSelected: "item dipilih",
      notesTitle: "Nota penting",
    },

    homestays: {
      sectionBadge: "Penginapan",
      heading: "Homestay Kampung Autentik",
      subheading:
        "Mahu bermalam? Pilih homestay tempatan kami — sepenuhnya pilihan, tambah hanya jika anda mahu menginap.",
      perNight: "semalam",
      from: "Dari",
      capacity: "Sehingga {n} tetamu",
      viewDetails: "Lihat Homestay",
      backToList: "Kembali ke Homestay",
      roomTypes: "Jenis Bilik",
      facilities: "Kemudahan",
      selectRoom: "Pilih bilik ini",
      selectedRoom: "Dipilih",
      addToPackage: "Tambah ke Pakej",
      addedToPackage: "Telah Ditambah",
      nights: "Malam",
      guests: "Tetamu",
      skipHomestay: "Tiada homestay diperlukan",
      skipHomestayHint: "Anda boleh bina pakej lawatan sehari tanpa homestay.",
    },

    builder: {
      sectionBadge: "Pakej Tersuai",
      heading: "Bina Pengembaraan Anda Sendiri",
      subheading:
        "Pilih sekurang-kurangnya satu tarikan, tambah homestay jika mahu, tetapkan saiz kumpulan — harga dikira semula serta-merta dengan diskaun automatik.",
      visitors: "Bilangan Pelawat",
      days: "Bilangan Hari",
      nights: "Malam",
      step1: "1. Pilih tarikan anda (wajib)",
      step2: "2. Pilih homestay",
      step3: "3. Tetapkan saiz kumpulan & tarikh",
      step4: "4. Semak & teruskan",
      noAttractions: "Layari halaman Tarikan untuk menambah pengalaman.",
      noHomestays: "Tiada homestay ditambah. Homestay adalah pilihan — sesuai untuk lawatan sehari.",
      browseAttractions: "Layari Tarikan",
      browseHomestays: "Layari Homestay",
      remove: "Buang",
      empty: "Pakej anda kosong",
      emptyHint: "Tambah sekurang-kurangnya satu tarikan untuk melihat harga.",
      summaryTitle: "Ringkasan Pakej",
      attractionsSubtotal: "Subjumlah tarikan",
      homestaysSubtotal: "Subjumlah homestay",
      subtotal: "Subjumlah",
      discount: "Diskaun pakej",
      total: "Jumlah",
      tierProgressTitle: "Diskaun Pakej",
      tierProgress1: "Tambah {n} tarikan lagi untuk diskaun {pct}%",
      tierProgressMax: "Anda telah mencapai diskaun maksimum!",
      proceed: "Teruskan ke Pembayaran",
      clear: "Kosongkan Pakej",
      hint: "Petua: 3 tarikan = 15%, 5 = 20%, 7 = 25%.",
      includesTitle: "Apa yang termasuk",
      includesInfo:
        "Semua pakej termasuk bantuan pemandu pelancong dan pengaturan pengangkutan. Pengalaman pendidikan boleh disertakan berdasarkan tarikan dipilih.",
      includesGuide: "Pemandu pelancong disertakan untuk pakej terpilih",
      includesTransport: "Pengangkutan disediakan",
      includesEducation: "Pengalaman pendidikan merentas tarikan",
      includesAudience: "Sesuai untuk pelajar, keluarga, dan pelancong",
      noHomestayOption: "Teruskan tanpa homestay (lawatan sehari)",
      noHomestaySelected: "Tiada homestay dipilih — pakej lawatan sehari",
    },

    featuredPackages: {
      sectionBadge: "Nilai Terbaik",
      heading: "Pakej Pilihan",
      subheading:
        "Pakej siap pada harga istimewa. Tempah dengan satu ketik, atau sesuaikan mengikut citarasa anda.",
      only: "HANYA",
      save: "Jimat",
      book: "Tempah Pakej Ini",
      customize: "Sesuaikan Sebaliknya",
    },

    smartTourism: {
      sectionBadge: "Pelancongan Pintar Kampung Bolok",
      heading: "Alami Kampung Bolok, Lebih Pintar",
      subheading:
        "Saksikan kampung kami hidup di skrin, kemudian biar teman AI kami membantu anda merancang lawatan yang sempurna.",
      videoTitle: "Kenali Kampung Bolok",
      playLabel: "Tunjuk video",
      closeLabel: "Tutup video",
      muteLabel: "Senyapkan",
      unmuteLabel: "Nyahsenyap",
      prevLabel: "Video sebelumnya",
      nextLabel: "Video seterusnya",
      videoComingSoon: "Video ini akan datang tidak lama lagi — sila semak semula nanti!",
      aiPromoTag: "Teman Perjalanan AI",
      aiPromoHeading: "Perlukan bantuan merancang lawatan anda?",
      aiPromoText:
        "Sembang dengan Sahabat Bolok AI — pemandu dwibahasa mesra anda untuk tarikan, harga, homestay dan pakej siap.",
      aiPromoCta: "Sembang dengan Sahabat Bolok AI",
    },

    ai: {
      // Pembantu AI
      assistantTitle: "Sahabat Bolok AI",
      assistantTagline: "Pemandu mesra Kampung Bolok anda",
      openLabel: "Sembang dengan Sahabat Bolok AI",
      greeting: "Hai! Saya Sahabat Bolok AI, teman perjalanan mesra Kampung Bolok anda. Tanya saya tentang tarikan, harga, homestay, atau biar saya cadangkan pakej untuk anda.",
      placeholder: "Tanya apa-apa tentang perjalanan anda...",
      send: "Hantar",
      clear: "Kosongkan sembang",
      thinking: "Sedang berfikir...",
      error: "Maaf, pembantu tidak tersedia buat masa ini. Sila cuba sebentar lagi.",
      poweredBy: "AI mungkin tersilap — sila sahkan butiran penting.",
    },

    payment: {
      heading: "Pembayaran Selamat",
      subheading: "Anda akan dialihkan ke halaman pembayaran HitPay yang selamat.",
      contactTitle: "Maklumat Hubungan",
      labelName: "Nama Penuh",
      labelEmail: "Alamat E-mel",
      labelPhone: "Nombor Telefon",
      labelDate: "Tarikh Mula Pilihan",
      labelRequest: "Permintaan Khas (Pilihan)",
      placeholderName: "Masukkan nama penuh",
      placeholderEmail: "anda@email.com",
      placeholderPhone: "cth. 012-3456789",
      placeholderRequest: "Keperluan diet, aksesibiliti, nota ketibaan...",
      orderTitle: "Ringkasan Pesanan",
      payBtn: "Bayar dengan HitPay",
      processing: "Membuat pembayaran selamat...",
      poweredBy: "Dikuasakan oleh HitPay — mod ujian",
      errorTitle: "Pembayaran gagal dibuat",
      tryAgain: "Cuba lagi",
      successTitle: "Pembayaran Berjaya!",
      successMessage:
        "Terima kasih atas tempahan! Pakej tersuai anda telah disahkan. Pasukan kami akan emel jadual perjalanan dalam 24 jam.",
      successBackHome: "Kembali ke Laman Utama",
      cancelTitle: "Pembayaran Dibatalkan",
      cancelMessage:
        "Pembayaran anda dibatalkan dan tiada caj dikenakan. Pakej anda masih disimpan — cuba lagi bila-bila.",
      cancelRetry: "Kembali ke Pembayaran",
      failedTitle: "Pembayaran Gagal",
      failedMessage:
        "Kami tidak dapat melengkapkan pembayaran anda. Tiada caj dikenakan. Pakej anda masih disimpan — sila cuba lagi.",
      failedRetry: "Cuba Lagi",
    },

    gallery: {
      sectionBadge: "Galeri Foto",
      heading: "Kenangan untuk Diingati",
      subheading:
        "Sekilas pandang keindahan, budaya, dan pengalaman yang menanti di Kg Bolok.",
      autoplayHint: "Auto-main — hover untuk jeda",
    },

    contact: {
      sectionBadge: "Hubungi Kami",
      heading: "Hubungi Kami",
      subheading:
        "Ada soalan? Hubungi kami dan pasukan kami akan membalas secepat mungkin.",
      addressTitle: "Alamat",
      address: "Kg Bolok, Pahang, Malaysia",
      phoneTitle: "Telefon",
      emailTitle: "E-mel",
      email: "info@kgboloktourism.my",
      socialTitle: "Ikuti Kami",
      formName: "Nama",
      formEmail: "E-mel",
      formMessage: "Mesej",
      formNamePlaceholder: "Masukkan nama anda",
      formEmailPlaceholder: "Masukkan e-mel anda",
      formMessagePlaceholder: "Tulis mesej anda...",
      formBtn: "Hantar Mesej",
      formSuccess: "Mesej dihantar! Kami akan balas dalam 24 jam.",
      mapSoon: "Peta akan datang",
    },

    footer: {
      tagline: "Di Mana Alam Bertemu Budaya",
      description:
        "Rasai pesona autentik destinasi kampung paling berharga di Pahang.",
      quickLinks: "Pautan Pantas",
      contactInfo: "Maklumat Hubungi",
      followUs: "Ikuti Kami",
      visitHours: "Waktu Lawatan",
      copyright: "© 2026 Pelancongan Kg Bolok. Hak cipta terpelihara.",
      madeWith: "Dibuat dengan cinta untuk Pahang",
    },

    common: {
      loading: "Memuat...",
      back: "Kembali",
      next: "Seterusnya",
      close: "Tutup",
      notFound: "Tidak dijumpai",
      notFoundDesc: "Kami tidak dapat mencari apa yang anda cari.",
      goHome: "Ke Laman Utama",
    },
  },
};

export default translations;
