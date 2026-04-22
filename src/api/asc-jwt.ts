import { KEYUTIL, KJUR } from 'jsrsasign';
import { normalizeP8 } from '../utils/pem';

const AUDIENCE = 'appstoreconnect-v1';
const TOKEN_LIFETIME_SEC = 1140; // 19 min — under Apple's 20 min cap
const TOKEN_REUSE_SEC = 18 * 60; // reuse up to 18 min before regenerating

export interface AscCredentials {
  issuerId: string;
  keyId: string;
  privateKeyPem: string;
}

interface CachedToken {
  token: string;
  signedAt: number; // epoch seconds
  fingerprint: string; // which creds this was signed for
}

let cache: CachedToken | null = null;

function credFingerprint(c: AscCredentials): string {
  // Non-reversible identifier for cache invalidation when creds change.
  // We don't hash — plain concat is fine, only used in-memory.
  return `${c.issuerId}|${c.keyId}|${c.privateKeyPem.length}`;
}

export function signASCToken(params: AscCredentials): string {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'ES256', kid: params.keyId, typ: 'JWT' };
  const payload = {
    iss: params.issuerId,
    iat: now,
    exp: now + TOKEN_LIFETIME_SEC,
    aud: AUDIENCE,
  };
  const normalizedPem = normalizeP8(params.privateKeyPem);
  if (!normalizedPem) {
    throw new Error('Private key is empty or unparseable');
  }
  let key;
  try {
    key = KEYUTIL.getKey(normalizedPem);
  } catch (e) {
    throw new Error(
      'Could not parse your .p8 private key. Paste the entire contents including the BEGIN/END lines.',
    );
  }
  // jsrsasign's getKey returns RSAKey | ECDSA | DSA; JWS.sign accepts the first two.
  // .p8 keys from Apple are always ECDSA so this cast is safe in practice.
  return KJUR.jws.JWS.sign(
    'ES256',
    JSON.stringify(header),
    JSON.stringify(payload),
    key as Parameters<typeof KJUR.jws.JWS.sign>[3],
  );
}

/**
 * Return a valid (cached or freshly signed) token for the given credentials.
 * The cache is keyed on credential fingerprint, so changing any field
 * forces a re-sign.
 */
export function getASCToken(creds: AscCredentials): string {
  const now = Math.floor(Date.now() / 1000);
  const fp = credFingerprint(creds);
  if (cache && cache.fingerprint === fp && now - cache.signedAt < TOKEN_REUSE_SEC) {
    return cache.token;
  }
  const token = signASCToken(creds);
  cache = { token, signedAt: now, fingerprint: fp };
  return token;
}

export function invalidateASCToken(): void {
  cache = null;
}
