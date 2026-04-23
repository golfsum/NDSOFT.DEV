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

- `/` — ND Software landing
- `/apps/buildpad` — BuildPad app detail
- `/privacy` — Privacy Policy
- `/terms` — Terms of Service

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
│   ├── layout.tsx              Root layout (header + footer + metadata)
│   ├── page.tsx                Landing page
│   ├── globals.css             Tailwind import + design tokens
│   ├── apps/buildpad/page.tsx  BuildPad app page
│   ├── privacy/page.tsx        Privacy Policy
│   └── terms/page.tsx          Terms of Service
├── components/
│   ├── Header.tsx
│   └── Footer.tsx
├── next.config.ts
├── package.json
├── postcss.config.mjs
└── tsconfig.json
```

Design tokens (colors, fonts) live in `app/globals.css` under `@theme`. They mirror the BuildPad iOS app's palette for brand consistency.
