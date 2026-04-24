import { ascClient } from '../asc-client';
import type { AscCredentials } from '../asc-jwt';
import type {
  AscListResponse,
  AscPageMeta,
  AscRawBetaFeedbackCrash,
  AscRawBetaFeedbackScreenshot,
  BetaFeedbackCounts,
} from '../types';

type FeedbackKind = 'crash' | 'screenshot';

const ENDPOINT: Record<FeedbackKind, string> = {
  crash: 'betaFeedbackCrashSubmissions',
  screenshot: 'betaFeedbackScreenshotSubmissions',
};

/**
 * Count beta-feedback items without fetching every row. We ask for
 * limit=1 and read `meta.paging.total` — Apple returns this reliably
 * on feedback list endpoints.
 *
 * Returns 0 on any error, and logs the reason in dev so permissions
 * issues (403) don't look like "no feedback."
 */
async function countAt(
  creds: AscCredentials,
  path: string,
  label: string,
  signal?: AbortSignal,
): Promise<number> {
  try {
    const res = await ascClient.get<AscListResponse<unknown> & { meta?: AscPageMeta }>(
      creds,
      path,
      { signal },
    );
    const total = res.meta?.paging?.total;
    if (typeof total === 'number') return total;
    // Without a total, limit=1 can only ever show 0 or 1 — better than
    // nothing but may under-count. Flag it in dev so we can tell.
    if (__DEV__) {
      console.warn(`[beta-feedback] ${label} missing meta.paging.total; returning data length (${res.data.length})`);
    }
    return res.data.length;
  } catch (e) {
    if (__DEV__) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const code = (e as any)?.code;
      console.warn(`[beta-feedback] ${label} failed (${code ?? 'unknown'}):`, e);
    }
    return 0;
  }
}

// -- Per-build counts -----------------------------------------------------

function buildPath(buildId: string, kind: FeedbackKind): string {
  return (
    `/v1/${ENDPOINT[kind]}` +
    `?filter[build]=${encodeURIComponent(buildId)}` +
    `&limit=1` +
    `&fields[${ENDPOINT[kind]}]=createdDate`
  );
}

export async function countCrashFeedback(
  creds: AscCredentials,
  buildId: string,
  signal?: AbortSignal,
): Promise<number> {
  return countAt(creds, buildPath(buildId, 'crash'), `build:${buildId} crash`, signal);
}

export async function countScreenshotFeedback(
  creds: AscCredentials,
  buildId: string,
  signal?: AbortSignal,
): Promise<number> {
  return countAt(creds, buildPath(buildId, 'screenshot'), `build:${buildId} screenshot`, signal);
}

export async function getBetaFeedbackCounts(
  creds: AscCredentials,
  buildId: string,
  signal?: AbortSignal,
): Promise<BetaFeedbackCounts> {
  const [crashes, screenshots] = await Promise.all([
    countCrashFeedback(creds, buildId, signal),
    countScreenshotFeedback(creds, buildId, signal),
  ]);
  return { crashes, screenshots };
}

// -- App-level totals -----------------------------------------------------

function appPath(appId: string, kind: FeedbackKind): string {
  return (
    `/v1/${ENDPOINT[kind]}` +
    `?filter[app]=${encodeURIComponent(appId)}` +
    `&limit=1` +
    `&fields[${ENDPOINT[kind]}]=createdDate`
  );
}

/**
 * Aggregate feedback totals for an app across every build. Uses
 * `filter[app]` so we don't fan out one request per build.
 */
export async function getAppFeedbackCounts(
  creds: AscCredentials,
  appId: string,
  signal?: AbortSignal,
): Promise<BetaFeedbackCounts> {
  const [crashes, screenshots] = await Promise.all([
    countAt(creds, appPath(appId, 'crash'), `app:${appId} crash`, signal),
    countAt(creds, appPath(appId, 'screenshot'), `app:${appId} screenshot`, signal),
  ]);
  return { crashes, screenshots };
}

/** Quick sniff used by the endpoint; keep types happy. */
export type _Raw = AscRawBetaFeedbackCrash | AscRawBetaFeedbackScreenshot;
