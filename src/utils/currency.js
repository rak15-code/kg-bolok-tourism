// ────────────────────────────────────────────────────────────────────────────
// currency.js
// ────────────────────────────────────────────────────────────────────────────
// Multi-currency display utility.
//
// Base prices throughout the site are stored in MYR. We convert to the user's
// chosen display currency at render time using the EXCHANGE_RATES table below.
//
// 👇 EDIT EXCHANGE_RATES whenever you want to refresh rates (or wire up a
//    real exchange-rate API). All rates are "how much of CURRENCY equals 1 MYR".
// ────────────────────────────────────────────────────────────────────────────

export const SUPPORTED_CURRENCIES = ["MYR", "USD", "SGD", "INR", "EUR"];

// 👇 MOCK EXCHANGE RATES — replace with live values whenever needed.
//    Format: 1 MYR  →  X of <currency>.
export const EXCHANGE_RATES = {
  MYR: 1,
  USD: 0.21,
  SGD: 0.28,
  INR: 17.8,
  EUR: 0.19,
};

// Currency symbol + locale used by Intl.NumberFormat
const META = {
  MYR: { symbol: "RM",  locale: "en-MY", decimals: 0 },
  USD: { symbol: "US$", locale: "en-US", decimals: 2 },
  SGD: { symbol: "S$",  locale: "en-SG", decimals: 2 },
  INR: { symbol: "₹",   locale: "en-IN", decimals: 0 },
  EUR: { symbol: "€",   locale: "en-IE", decimals: 2 },
};

export function convertFromMYR(amountMYR, currency = "MYR") {
  const rate = EXCHANGE_RATES[currency] ?? 1;
  return Number(amountMYR || 0) * rate;
}

export function formatPrice(amountMYR, currency = "MYR") {
  const m = META[currency] ?? META.MYR;
  const value = convertFromMYR(amountMYR, currency);
  const formatted = Number(value).toLocaleString(m.locale, {
    maximumFractionDigits: m.decimals,
    minimumFractionDigits: 0,
  });
  return `${m.symbol} ${formatted}`;
}

export function currencyMeta(currency = "MYR") {
  return META[currency] ?? META.MYR;
}
