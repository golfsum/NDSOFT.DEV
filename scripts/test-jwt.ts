#!/usr/bin/env tsx
/**
 * One-shot test of the App Store Connect auth pipeline.
 *
 *   1. Signs an ES256 JWT using src/api/asc-jwt.ts
 *   2. Hits GET /v1/apps?limit=5
 *   3. Prints the app names
 *
 * Usage:
 *   $Env:ASC_ISSUER_ID="…"
 *   $Env:ASC_KEY_ID="…"
 *   $Env:ASC_PRIVATE_KEY_PATH="C:\path\to\AuthKey_ABC.p8"
 *   npm run test:jwt
 *
 * Run this BEFORE building any UI. If this script passes, the auth
 * pipeline is proven end-to-end and every endpoint module can trust it.
 */

import { readFileSync } from 'node:fs';
import { signASCToken } from '../src/api/asc-jwt';
import { normalizeP8 } from '../src/utils/pem';

async function main(): Promise<void> {
  const issuerId = process.env.ASC_ISSUER_ID;
  const keyId = process.env.ASC_KEY_ID;
  const pemPath = process.env.ASC_PRIVATE_KEY_PATH;

  if (!issuerId || !keyId || !pemPath) {
    console.error(
      'Missing env vars. Set ASC_ISSUER_ID, ASC_KEY_ID, ASC_PRIVATE_KEY_PATH.',
    );
    process.exit(1);
  }

  const privateKeyPem = normalizeP8(readFileSync(pemPath, 'utf8'));
  if (!privateKeyPem) {
    console.error(`Could not read or parse private key at ${pemPath}`);
    process.exit(1);
  }

  console.log('Signing JWT…');
  const token = signASCToken({ issuerId, keyId, privateKeyPem });
  console.log(`JWT OK (${token.length} chars)`);

  const url = 'https://api.appstoreconnect.apple.com/v1/apps?limit=5&fields[apps]=name,bundleId';
  console.log(`GET ${url}`);
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });

  console.log(`Status: ${res.status} ${res.statusText}`);
  if (!res.ok) {
    const text = await res.text();
    console.error(text.slice(0, 500));
    process.exit(1);
  }

  const json = (await res.json()) as {
    data: Array<{ id: string; attributes: { name?: string; bundleId?: string } }>;
  };

  console.log(`Found ${json.data.length} apps:`);
  for (const app of json.data) {
    console.log(`  - ${app.attributes.name ?? '?'} (${app.attributes.bundleId ?? '?'})`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
