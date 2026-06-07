// ────────────────────────────────────────────────────────────────────────────
// pricing.js
// ────────────────────────────────────────────────────────────────────────────
// Discount engine for the Package Builder.
//
// 👇 EDIT THIS TABLE to change discount thresholds.
// Discount is based on the NUMBER OF ATTRACTIONS in the package.
// Homestays are intentionally NOT counted — homestay is optional.
//
// Tier rule:  count >= tier.min   → tier rate applies.
// The HIGHEST matching tier wins.
// ────────────────────────────────────────────────────────────────────────────

export const DISCOUNT_TIERS = [
  { min: 1, rate: 0.00, en: "Standard rate",       bm: "Kadar standard"        },
  { min: 3, rate: 0.15, en: "Bundle saver 15%",    bm: "Pakej jimat 15%"       },
  { min: 5, rate: 0.20, en: "Group bundle 20%",    bm: "Pakej kumpulan 20%"    },
  { min: 7, rate: 0.25, en: "Mega bundle 25%",     bm: "Pakej mega 25%"        },
];

// Returns the discount tier that applies for the given attraction count.
export function getDiscountTier(attractionCount) {
  let active = DISCOUNT_TIERS[0];
  for (const tier of DISCOUNT_TIERS) {
    if (attractionCount >= tier.min) active = tier;
  }
  return active;
}

// Calculate full price breakdown for the package builder.
//   attractions : array of attraction objects (each has .price per person)
//   homestays   : array of { homestay, room, nights }   (OPTIONAL)
//   visitors    : integer
//
// Discount ONLY applies to attractions. Homestay is optional and never counted.
//
// Returns: { attractionsSubtotal, homestaysSubtotal, subtotal,
//            discountTier, discountAmount, total, attractionCount, visitors }
export function calculateTotal({ attractions = [], homestays = [], visitors = 1 }) {
  const v = Math.max(1, Number(visitors) || 1);

  const attractionsSubtotal = attractions.reduce(
    (sum, a) => sum + (a.price || 0) * v,
    0
  );

  // Homestays are optional — if none selected, this is just 0.
  const homestaysSubtotal = homestays.reduce(
    (sum, h) => sum + (h.room?.price || 0) * (h.nights || 1),
    0
  );

  const subtotal = attractionsSubtotal + homestaysSubtotal;
  const discountTier = getDiscountTier(attractions.length);
  // Discount applies ONLY to the attractions portion.
  const discountAmount = Math.round(attractionsSubtotal * discountTier.rate);
  const total = subtotal - discountAmount;

  return {
    attractionsSubtotal,
    homestaysSubtotal,
    subtotal,
    discountTier,
    discountAmount,
    total,
    attractionCount: attractions.length,
    visitors: v,
  };
}

// Base MYR formatter (used as fallback when no currency context is available).
export const formatRM = (n) =>
  "RM " + Number(n || 0).toLocaleString("en-MY", { maximumFractionDigits: 0 });
