# Casino Review CMS (beta)

WordPress-style CMS for casino, bookmaker, and bonus reviews. Built with Next.js, Prisma, and Auth.js.

## Quick start

```bash
npm install
cp .env.example .env
npm run db:setup
npm run dev
```

- Public site: http://localhost:3000
- Admin: http://localhost:3000/admin  
  Default login from `.env`: `admin@example.com` / `admin123`

## Features

- Content: Pages, Casino reviews, Bookmaker reviews, Bonus reviews, Authors, Media
- Homepage options + comparison table
- Menu management (header/footer)
- SEO fields with live SERP preview + character counts
- Sitemap, robots.txt, Review/FAQ/Organization JSON-LD
- Affiliate CTAs (`rel=sponsored`) + responsible gambling blocks
- Theme layer in `themes/default` (swap later for other domains/layouts)

## Environment

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | SQLite locally (`file:./dev.db`). Use Postgres on Vercel. |
| `AUTH_SECRET` | Session secret (`openssl rand -base64 32`) |
| `AUTH_URL` | Site URL (production domain) |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Seeded admin user |
| `BLOB_READ_WRITE_TOKEN` | Optional Vercel Blob; else uploads go to `public/uploads` |

## Vercel

1. Connect the GitHub repo (already linked if using this project’s remote).
2. Add env vars in the Vercel project settings.
3. For production DB, create Vercel Postgres (or Neon), set `DATABASE_URL`, then either:
   - Change Prisma `provider` to `postgresql` and run `prisma db push` against production, **or**
   - Keep SQLite only for local and migrate schema to Postgres before go-live.
4. Optionally add Blob store and set `BLOB_READ_WRITE_TOKEN`.
5. Deploy from `main`. After first deploy, run seed against production if needed.

## Scripts

- `npm run db:setup` — push schema + seed
- `npm run db:seed` — re-seed admin/sample content
- `npm run build` — generate Prisma client + Next build
