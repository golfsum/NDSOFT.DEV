# ND SOFT landing page quality report

Review date: July 20, 2026

## Outcome

The ND SOFT portfolio is implemented as a server-rendered, one-page studio index. The AppsResolve transition is prominent, all four products have accurate positioning, and every available destination resolves successfully.

## Verification evidence

| Check | Result | Evidence |
| --- | --- | --- |
| Production build | Pass | `npm test` completed the vinext production build |
| Rendered page tests | Pass | 3 of 3 Node tests passed |
| TypeScript | Pass | `npx tsc --noEmit` completed with no errors |
| Lint | Pass | `npm run lint` completed with no errors |
| Production dependency audit | Pass | `npm audit --omit=dev` found 0 vulnerabilities |
| Product destinations | Pass | AppsResolve, Tranqly, and PawProof returned HTTP 200 |
| Starter cleanup | Pass | Starter preview, metadata marker, images, copy, auth helper, and unused database example were removed |
| Social card | Pass | Generated 1200 by 630 asset inspected for spelling, safe margins, and design consistency |
| Em dash audit | Pass | No em dash or en dash exists in user-facing app copy or project documentation |

## Local quality score

| Area | Score | Notes |
| --- | ---: | --- |
| Product value and positioning | 14/15 | Clear studio purpose and direct product handoff; search demand is intentionally limited to branded intent |
| Functional completeness | 18/20 | All required navigation works; no form or application flow is in scope |
| Interaction quality | 9/10 | Clear keyboard focus, direct links, and no dead TeeLesson action |
| Visual craft | 14/15 | Distinctive midnight, cream, and coral editorial system with a matching social card |
| Responsive quality | 8/10 | Desktop, tablet, and phone rules are implemented; final browser screenshots were not requested or captured |
| Accessibility | 9/10 | Semantic landmarks, one H1, labeled navigation, visible focus, contrast, and reduced-motion behavior are present |
| Reliability and performance | 9/10 | Static server-rendered content, no client JavaScript behavior, no third-party runtime assets |
| Trust, privacy, and security | 5/5 | Honest product state, no data collection, no secrets, first-party assets, clean production audit |
| Maintainability | 5/5 | Focused page data, shared styling, typed content, rendered tests, and no unused persistence layer |
| Total | 91/100 | A-range local implementation |

## Remaining limitations

This result is not labeled S+ because final browser screenshot coverage and production deployment verification were not performed. The live `ndsoft.dev` route, redirects, response headers, social unfurl, sitemap delivery, Search Console, and field performance remain production checks. No deployment or domain mutation was made without explicit authorization.
