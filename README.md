# Kg Bolok Tourism — Eco-Premium Booking Platform

A bilingual (EN / BM), blue-green eco-tourism platform for Kg Bolok village
in Pahang, Malaysia. Visitors can browse attractions and homestays, **build
their own custom package** with automatic bundle discounts, and check out
through **HitPay**.

---

## Stack

| Layer       | Tech                                                      |
|-------------|-----------------------------------------------------------|
| Frontend    | React 18 + Vite, Tailwind CSS, Framer Motion, React Router |
| Backend     | Node.js + Express                                         |
| Payments    | HitPay (sandbox-first, secrets stay server-side)          |
| i18n        | Custom LanguageContext + translations.js                  |

---

## Running locally

### 1. Frontend

```bash
# from project root
npm install
cp .env.example .env       # optional — only needed if your backend is on a non-default port
npm run dev
# → http://localhost:5173
```

### 2. Backend (HitPay proxy)

```bash
cd server
npm install
cp .env.example .env       # paste your HitPay sandbox keys
npm run dev                # auto-reload via node --watch
# → http://localhost:5000
```

Required env vars in `server/.env`:

```env
HITPAY_API_KEY=<your sandbox key>
HITPAY_SALT=<your sandbox salt>
HITPAY_API_BASE=https://api.sandbox.hit-pay.com/v1
HITPAY_REDIRECT_URL=http://localhost:5173/payment/success
HITPAY_CANCEL_URL=http://localhost:5173/payment/cancel
HITPAY_WEBHOOK_URL=                # leave blank in dev, or use an ngrok tunnel
ALLOWED_ORIGIN=http://localhost:5173
PORT=5000
```

> The frontend NEVER sees the HitPay API key — it talks to `/api/payments/create`
> on our own backend, which talks to HitPay.

---

## File layout

```
src/
├── components/         # Reusable visual pieces (Navbar, Hero, About, Footer, ui/*)
├── pages/              # One file per route
├── layouts/            # MainLayout (shell around every page)
├── routes/             # AppRoutes (route table)
├── context/            # LanguageContext, BuilderContext
├── services/           # paymentService.js — calls our backend
├── utils/              # pricing.js — discount logic
└── data/               # attractionsData.js, homestaysData.js, translations.js

public/
└── images/             # attractions/, homestays/, hero/, gallery/  (drop real photos here)

server/
├── server.js           # Express entrypoint
├── routes/             # /api/payments
├── controllers/        # request validation + delegation
├── services/           # hitpayService.js — all HitPay HTTP calls
└── middleware/         # errorHandler.js
```

---

## Adding new content

### Add a new attraction
Open `src/data/attractionsData.js`, copy any entry, give it a unique `id` +
URL-safe `slug`, fill in bilingual text and price. Drop a photo at
`/public/images/attractions/<slug>.jpg`. No code changes needed — the
Attractions page, the Attraction detail page, and the Package Builder all
read from this file.

### Add a new homestay
Same story for `src/data/homestaysData.js`. Each homestay supports multiple
room types with individual nightly prices.

### Change the discount table
Edit `src/utils/pricing.js → DISCOUNT_TIERS`. The Package Builder UI shows the
tier ladder dynamically, so adding/removing tiers Just Works.

### Add a new language string
Add it under **both** `en` and `bm` in `src/data/translations.js`. Read it via
`useLanguage().t.<section>.<key>`.

---

## Routes

| Path                       | Page                                |
|----------------------------|-------------------------------------|
| `/`                        | Home (Hero + About + teasers)       |
| `/attractions`             | Attractions grid                    |
| `/attractions/:slug`       | Attraction detail + Add to Package  |
| `/homestays`               | Homestays grid                      |
| `/homestays/:slug`         | Homestay detail + room picker       |
| `/builder`                 | Package Builder                     |
| `/checkout`                | Customer details + HitPay redirect  |
| `/payment/success`         | Returned to after successful pay    |
| `/payment/cancel`          | Returned to on cancel/failure       |
| `/gallery`                 | Photo gallery + lightbox            |
| `/contact`                 | Contact info + message form         |

---

## Bundle discount logic

Defined in `src/utils/pricing.js`:

| Attractions selected | Discount |
|----------------------|----------|
| 1                    | 0%       |
| 2                    | 5%       |
| 3                    | 10%      |
| 4+                   | 15%      |

The discount applies to the **attractions subtotal only**; homestay nights
are billed at face value.

---

## Image handling

Images live under `/public/images/<category>/`. The
`<ImageOrPlaceholder>` component gracefully falls back to a gradient + icon
mockup whenever an image file is missing, so the site looks finished even
before you've uploaded real photos. Drop a file at the path declared in the
data file and it'll appear automatically.
