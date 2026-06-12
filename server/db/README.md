# Database setup (Supabase)

Run these steps once, in order.

## 1. Create the tables, RLS policies, and storage buckets

1. Supabase dashboard → **SQL Editor** → **New query**.
2. Paste the entire contents of [`schema.sql`](./schema.sql) and click **Run**.

This creates: `profiles`, `bookings`, `attractions`, `homestays`,
`gallery_images`, `packages`, `settings`, `email_logs`; the `is_admin()`
role mechanism; all Row Level Security policies; and the four public Storage
buckets (`hero-images`, `gallery-images`, `attraction-images`,
`homestay-images`).

## 2. Seed the initial content

From the project's `server/` folder, with `SUPABASE_URL` and
`SUPABASE_SERVICE_ROLE_KEY` set in `server/.env`:

```bash
cd server
node db/seed.js
```

This loads the 13 attractions, 3 homestays, and 2 featured packages from the
front end's data files into the database.

## 3. Create the admin user

The dashboard is locked to users whose `profiles.role = 'admin'`.

1. Supabase dashboard → **Authentication** → **Users** → **Add user**
   → create one with your email + a password (tick "Auto Confirm").
2. Copy that user's **UID**.
3. SQL Editor → run (replace the UID):

```sql
update public.profiles set role = 'admin'
where id = '00000000-0000-0000-0000-000000000000';
```

Now sign in at `/admin` with that email + password.

## Keys — where each one goes

| Key | Where | Exposed to browser? |
|-----|-------|---------------------|
| `VITE_SUPABASE_URL` | project-root `.env` | yes (safe) |
| `VITE_SUPABASE_ANON_KEY` | project-root `.env` | yes — **public by design**, protected by RLS |
| `SUPABASE_URL` | `server/.env` | no |
| `SUPABASE_SERVICE_ROLE_KEY` | `server/.env` | **NO — secret. Bypasses RLS.** |

Never put the service-role key in any `VITE_` variable or in front-end code.
