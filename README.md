# ndsoftware.dev

Marketing site for ND Software LLC and its apps. Next.js 15 + Tailwind 4, deployed to Vercel.

## Local development

```bash
cd website
npm install
npm run dev
```

Open http://localhost:3000.

## Routes

- `/`: ND Software landing
- `/apps/uncrop-it`: Uncrop It app detail
- `/apps/uncrop-it/privacy`: Uncrop It Privacy Policy
- `/apps/uncrop-it/terms`: Uncrop It Terms of Service
- `/privacy`: Privacy hub (links to each app's policy)
- `/terms`: Terms hub (links to each app's terms)

## Deploying to Vercel

This site lives as a subfolder of the TestFlightTracker repo. Configure Vercel once:

1. Push the repo to GitHub if you haven't already.
2. In Vercel: **Add New → Project → Import** the TestFlightTracker repo.
3. **Root Directory:** set to `website`. (Vercel will otherwise try to build the React Native app at the repo root and fail.)
4. **Framework Preset:** Next.js (auto-detected).
5. **Build Command / Output:** leave as the Next.js defaults.
6. Deploy.

### Custom domain

1. In the Vercel project → **Settings → Domains → Add** `ndsoftware.dev`.
2. At your DNS registrar, create the records Vercel shows you:
   - `A` record for apex `ndsoftware.dev` → `76.76.21.21`
   - `CNAME` for `www.ndsoftware.dev` → `cname.vercel-dns.com`
3. Verify in Vercel. SSL is issued automatically.

## Updating the legal pages

- Both `/privacy` and `/terms` pages include an `EFFECTIVE_DATE` constant at the top of each `page.tsx`. Bump it whenever the content changes materially.
- These are solid templates but are not legal advice. Have an attorney review before linking from an App Store listing.

## Structure

```
website/
├── app/
│   ├── layout.tsx                      Root layout (header + footer + metadata)
│   ├── page.tsx                        Landing page
│   ├── globals.css                     Tailwind import + design tokens
│   ├── apps/uncrop-it/page.tsx         Uncrop It app page
│   ├── apps/uncrop-it/privacy/page.tsx Uncrop It Privacy Policy
│   ├── apps/uncrop-it/terms/page.tsx   Uncrop It Terms of Service
│   ├── privacy/page.tsx                Privacy hub (per-app links)
│   └── terms/page.tsx                  Terms hub (per-app links)
├── components/
│   ├── Header.tsx
│   └── Footer.tsx
├── lib/
│   └── apps.ts                         App registry (drives home + legal hubs)
├── next.config.ts
├── package.json
├── postcss.config.mjs
└── tsconfig.json
```

Adding a new app: add an entry to `lib/apps.ts` and create
`app/apps/<slug>/page.tsx`, `.../privacy/page.tsx`, and `.../terms/page.tsx`.
It will then appear on the home page and in both legal hubs automatically.

Design tokens (colors, fonts) live in `app/globals.css` under `@theme`.
