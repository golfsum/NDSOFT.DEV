# ND SOFT

The public ND SOFT studio index for AppsResolve, Tranqly, PawProof, and TeeLesson.

## Local development

```powershell
npm install
npm run dev
```

The local site runs through vinext. Production validation is available with:

```powershell
npm test
npm run lint
```

## Content and hosting

- The landing page lives in `app/page.tsx`.
- Global visual styles live in `app/globals.css`.
- Metadata, sitemap, robots policy, manifest, and social preview are included.
- `.openai/hosting.json` contains the Sites project binding after a site is created.

The canonical public origin is `https://ndsoft.dev/`. Deployment and domain changes are separate production actions.
