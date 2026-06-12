# Deployment Checklist — Kg Bolok Tourism

Three pieces deploy independently:

| Piece | Host | Folder |
|-------|------|--------|
| Frontend (Vite/React) | **Vercel** | repo root |
| Backend (Express API) | **Render** | `server/` |
| Database + Storage + Auth | **Supabase** | — |

---

## 0. Supabase (do this first)

- [ ] Create a Supabase project.
- [ ] SQL Editor → run [`server/db/schema.sql`](server/db/schema.sql).
- [ ] Fill `server/.env` with `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`, then `cd server && npm run seed`.
- [ ] Create the admin user and set `role='admin'` (see [`server/db/README.md`](server/db/README.md)).
- [ ] Confirm the 4 Storage buckets exist: `hero-images`, `gallery-images`, `attraction-images`, `homestay-images`.

Keys recap: the **anon** key is public (frontend); the **service-role** key is secret (backend only).

---

## 1. Backend → Render

- [ ] New **Web Service** → connect repo → set **Root Directory** = `server`.
- [ ] Build command: `npm install` · Start command: `npm start`
- [ ] Health check path: `/health`
- [ ] Environment variables:
  - [ ] `NODE_ENV=production`
  - [ ] `ALLOWED_ORIGIN=https://your-frontend.vercel.app` (comma-separate multiple)
  - [ ] `PAYMENT_PROVIDER=mock` (or `hitpay`)
  - [ ] `PAYMENT_SUCCESS_URL=https://your-frontend.vercel.app/payment/success`
  - [ ] `PAYMENT_FAILED_URL=https://your-frontend.vercel.app/payment/failed`
  - [ ] `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
  - [ ] `EMAIL_PROVIDER=resend`, `RESEND_API_KEY`, `EMAIL_FROM`, `EMAIL_REPLY_TO`
  - [ ] AI: `AI_PROVIDER=gemini`, `GEMINI_API_KEY`, `GEMINI_MODEL=gemini-2.5-flash` (or `AI_PROVIDER=anthropic` + `ANTHROPIC_API_KEY`/`ANTHROPIC_MODEL`)
  - [ ] If HitPay: `HITPAY_API_KEY`, `HITPAY_SALT`, `HITPAY_API_BASE`, `HITPAY_REDIRECT_URL`, `HITPAY_WEBHOOK_URL=https://your-backend.onrender.com/api/payments/webhook`
- [ ] Deploy, then verify: `GET https://your-backend.onrender.com/health` → `{"status":"ok",...}`.

`config/env.js` will **hard-fail the boot** if `NODE_ENV=production` and Supabase or (for HitPay) the API key is missing — this is intentional.

---

## 2. Frontend → Vercel

- [ ] New project → import repo (root). Framework auto-detected as **Vite**.
- [ ] Build command `npm run build` · Output `dist` (also in [`vercel.json`](vercel.json)).
- [ ] Environment variables:
  - [ ] `VITE_API_BASE_URL=https://your-backend.onrender.com`
  - [ ] `VITE_SUPABASE_URL=https://xxxx.supabase.co`
  - [ ] `VITE_SUPABASE_ANON_KEY=eyJ...`  *(public — anon key only, never service-role)*
- [ ] Deploy. SPA routing + asset caching are handled by `vercel.json`.
- [ ] Update `index.html` canonical/OG URLs and `public/sitemap.xml` to your real domain.

---

## 3. Switch Mock → HitPay (when ready)

No frontend or database changes needed:

1. Set HitPay env vars on Render.
2. Set `PAYMENT_PROVIDER=hitpay` **or** change the one line in
   [`server/services/payments/paymentProvider.js`](server/services/payments/paymentProvider.js).
3. Redeploy the backend. Webhooks then update bookings + send paid emails automatically.

---

## 4. Smoke test (production)

- [ ] `GET /health` returns ok with the expected `paymentProvider` + `database`.
- [ ] Build a package on the site → checkout → pay → land on `/payment/success`.
- [ ] Booking row appears in Supabase `bookings` with `payment_status = paid`.
- [ ] `email_logs` shows `booking_created` + `payment_confirmed`.
- [ ] Sign in at `/admin`, see the booking, manage content + upload an image.
- [ ] `/admin` is `Disallow`ed in `public/robots.txt` ✓.

## `npm run build` — verified passing

Public bundle is code-split (admin loads on demand; React/motion/Supabase are
separate long-cached vendor chunks).
