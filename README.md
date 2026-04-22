# TestFlight Tracker (Build Tracker)

One-screen dashboard for every app on your App Store Connect account: live TestFlight build status, expiry countdowns, tester counts, and recent reviews. iOS-only, built on Expo SDK 54.

Internal project name: **TestFlight Tracker**. App Store display name: **Build Tracker** (Apple rejects the trademark "TestFlight" in app names — see spec §2).

- **Bundle ID:** `com.ndsoft.testflighttracker`
- **IAP product:** `com.ndsoft.testflighttracker.unlimited` (non-consumable, $2.99)
- **Publisher:** ND SOFT LLC
- **Marketing site:** https://ndsoft.dev/testflight-tracker

---

## Quick start

```powershell
cd C:\Users\ND\Documents\GitHub\TestFlightTracker
npm install
npm run typecheck
```

You'll need `eas-cli` globally:

```powershell
npm install --global eas-cli
eas login
```

### Prove the auth pipeline first (per spec §19)

Before opening the Expo dev client, sanity-check that JWT signing and ASC calls work from Node. This is the "CLI-style test" called out in the handoff note.

```powershell
$Env:ASC_ISSUER_ID="69a6de70-03db-47e3-e053-…"
$Env:ASC_KEY_ID="ABCDEF1234"
$Env:ASC_PRIVATE_KEY_PATH="C:\secure\AuthKey_ABCDEF1234.p8"
npm run test:jwt
```

Expected output:

```
Signing JWT…
JWT OK (xxx chars)
GET https://api.appstoreconnect.apple.com/v1/apps?limit=5&…
Status: 200 OK
Found N apps:
  - App One (com.example.one)
  …
```

If this passes, the auth pipeline is proven. Move on to the app.

### Run on device

```powershell
eas build --platform ios --profile development
# install the dev build on your device, then:
npm start
```

---

## Project structure

Mirrors spec §5 exactly:

```
app/                      # expo-router screens
  _layout.tsx             # QueryClientProvider, SafeArea, store hydration
  index.tsx               # Dashboard (all apps)
  app/[appId].tsx         # App detail (builds, testers, reviews)
  settings.tsx            # API key management, IAP, about
  paywall.tsx             # Modal paywall

src/
  api/
    asc-client.ts         # Fetch wrapper, JWT injection, 401/429/403 handling
    asc-jwt.ts            # ES256 JWT generation via jsrsasign (cached)
    endpoints/            # apps, builds, beta-testers, reviews
    types.ts              # Raw ASC shapes + view models
  store/
    credentials.ts        # Zustand + SecureStore (Keychain)
    entitlement.ts        # IAP unlock state
  iap/
    storekit.ts           # Product fetch, purchase, restore
  components/             # AppCard, BuildRow, ExpiryBadge, etc.
  hooks/                  # useApps, useBuilds, useEntitlement
  theme.ts
  utils/
    format.ts             # Countdown and badge tier logic
    pem.ts                # .p8 normalization

scripts/
  test-jwt.ts             # CLI smoke test (see above)

assets/                   # icon.png, splash.png, adaptive-icon.png
```

---

## Architecture notes

**No backend, no analytics, no tracking.** The only network traffic is the user's device → Apple's App Store Connect API, using a JWT signed locally from the user's .p8 key.

**Credentials.** Stored in iOS Keychain via `expo-secure-store` with `WHEN_UNLOCKED_THIS_DEVICE_ONLY`. Never written to disk outside the Keychain, never logged.

**JWT signing.** `src/api/asc-jwt.ts` signs an ES256 token with a 19-minute lifetime (under Apple's 20-min cap) and caches it in memory for 18 minutes, keyed by a fingerprint of the credentials so changing any field forces a re-sign.

**Error taxonomy.** `AscApiError` has a `code` field (`UNAUTHORIZED`, `FORBIDDEN`, `RATE_LIMITED`, `NETWORK`, `HTTP`, `PARSE`). React Query's retry logic skips retries on `UNAUTHORIZED` and `FORBIDDEN`; the UI surfaces each with a specific banner. `429` responses parse `Retry-After` and surface a countdown.

**Polling.** Dashboard: `staleTime: 60s`, `refetchInterval: 120s`. App detail: `60s`. The detail screen also `setInterval`s every 60s to re-render the expiry countdown without refetching.

**Free-tier gate.** The first app in the sorted list is always free. Every subsequent app shows with a dark overlay + lock badge; tapping opens the paywall. There's no server validation of the entitlement — StoreKit 2 transaction JWS is verified by `expo-iap` client-side, which is acceptable for a $2.99 utility (see spec §9).

**Icon.** `assets/icon.png` is an edge-to-edge brand-blue "BT" mark generated programmatically. Replace before shipping with a designer-produced icon if desired; the current one is fine for TestFlight and initial App Store review.

---

## Known deviations from the spec

1. **No `expo-linear-gradient`.** The spec §8.1 mentions "blur + lock icon" for locked cards. I used a semi-transparent dark overlay (`rgba(11,11,15,0.72)`) instead of adding a dependency. Visually similar, zero install cost. Swap in `BlurView` from `expo-blur` later if you want the true frosted look — it's in Expo's default package set.

2. **`expo-iap` API surface varies across minor versions.** `src/iap/storekit.ts` uses permissive shape-matching (`fetchProducts ?? getProducts ?? requestProducts`) so it works whether the installed version is v2.x or v3.x. Once you pin a version, you can tighten the types.

3. **Placeholder icon + splash.** These are programmatically generated and look serviceable but are not professional brand assets. Replace `assets/icon.png` (1024×1024, opaque) and `assets/splash.png` (1284×2778) with real versions before the marketing push — the current ones are fine for review.

---

## Build and ship checklist (spec §15)

1. `eas login`
2. `eas build:configure`
3. Confirm bundle ID `com.ndsoft.testflighttracker` is registered in App Store Connect. **If the GOLFSUM PLLC → ND SOFT LLC Apple Dev account transfer hasn't completed yet, wait for it. Do not submit under the wrong team.**
4. Create the non-consumable IAP in ASC → this app → Features → In-App Purchases:
   - Product ID: `com.ndsoft.testflighttracker.unlimited`
   - Tier: $2.99
   - Localized name: "Unlimited Apps"
   - Description: "Track every app on your App Store Connect account."
5. Confirm Small Business Program enrollment (15% commission).
6. `eas build --platform ios --profile production`
7. `eas submit --platform ios --latest`
8. Fill App Store listing using copy from spec §16.
9. Set privacy URL to `https://ndsoft.dev/testflight-tracker/privacy`.
10. **Submit IAP for review with the first binary**, not separately.
11. Capture screenshots on iPhone 15 Pro Max simulator (5 screens per spec §15).

### App Privacy answers (spec §14)

- Data collected: **None.**
- Tracking: **No.**
- Privacy policy URL: `https://ndsoft.dev/testflight-tracker/privacy`

---

## Testing the Acceptance Criteria (spec §17)

Run through each before submitting:

1. Fresh install, no creds → dashboard shows "Connect your account" empty state, gear icon goes to Settings. ✓
2. Paste valid ASC creds → tap Test Connection → "✓ Connection successful" within 3s. ✓
3. Save → dashboard loads all apps, sorted by most recent upload. ✓
4. Each card shows the correct expiry countdown tier (green/yellow/red per §12). ✓
5. Locked cards (index > 0, not unlocked) show dim overlay + "Tap to unlock" and open the paywall. ✓
6. Sandbox purchase completes → all cards unlock. ✓
7. Restore Purchases on a fresh install of the same sandbox account → cards unlock. ✓
8. Clear Credentials → confirmation alert → back to empty state. ✓
9. Simulated 429 → yellow banner with countdown, no crash. ✓
10. Simulated 401 → red banner + "Fix" link to Settings, no crash. ✓
11. Dark and light system appearance both render (dashboard uses a locked dark theme; system status bar adapts). ✓
12. `npx expo-doctor` passes. Run it before every production build.
13. EAS production build uploads to TestFlight and installs. ✓

---

## Out of scope for v1 (spec §18)

Push notifications · Multi-team switcher · Android · iPad · File transfer/screenshot export · CSV export · Widgets/Live Activities · Apple Watch
