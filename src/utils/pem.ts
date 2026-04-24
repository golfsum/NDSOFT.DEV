/**
 * Normalize a user-pasted .p8 private key string into a canonical PEM
 * that jsrsasign's KEYUTIL.getKey can parse.
 *
 * Users paste keys in many shapes:
 *   - Complete PEM with BEGIN/END lines and correct 64-char wrapping
 *   - PEM with BEGIN/END but odd whitespace or extra blank lines
 *   - Raw base64 body only (no headers)
 *   - Mixed CRLF/LF line endings
 *
 * This normalizer accepts all of the above and produces a standards-
 * compliant PEM string.
 */

const BEGIN = '-----BEGIN PRIVATE KEY-----';
const END = '-----END PRIVATE KEY-----';

export function normalizeP8(input: string): string {
  if (!input) return '';

  // Strip BOM and unify line endings.
  let s = input.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n').trim();

  // iOS smart-dashes substitution converts ---- into em/en dashes.
  // Undo that so the BEGIN/END markers are findable again.
  s = s.replace(/[\u2010-\u2015\u2212]/g, '-');

  // If headers exist, extract the body between them.
  const beginIdx = s.indexOf(BEGIN);
  const endIdx = s.indexOf(END);
  let body: string;
  if (beginIdx !== -1 && endIdx !== -1 && endIdx > beginIdx) {
    body = s.slice(beginIdx + BEGIN.length, endIdx);
  } else {
    body = s;
  }

  // Keep only base64-safe characters.
  body = body.replace(/[^A-Za-z0-9+/=]/g, '');

  if (body.length === 0) return '';

  // Re-wrap at 64 chars per line for canonical PEM.
  const lines: string[] = [];
  for (let i = 0; i < body.length; i += 64) {
    lines.push(body.slice(i, i + 64));
  }

  return [BEGIN, ...lines, END].join('\n');
}

export function looksLikeP8(input: string): boolean {
  const normalized = normalizeP8(input);
  return normalized.includes(BEGIN) && normalized.includes(END) && normalized.length > 200;
}

/**
 * App Store Connect exports .p8 files named `AuthKey_<KEY_ID>.p8` —
 * e.g. `AuthKey_ABC123DEFG.p8`. If the filename follows that pattern,
 * return the Key ID; otherwise null.
 */
export function extractKeyIdFromFilename(filename: string | undefined | null): string | null {
  if (!filename) return null;
  const match = filename.match(/AuthKey_([A-Z0-9]{6,20})\.p8$/i);
  return match?.[1] ?? null;
}
