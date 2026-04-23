import { ascClient } from '../asc-client';
import type { AscCredentials } from '../asc-jwt';
import type {
  AscListResponse,
  AscPageMeta,
  AscRawBetaFeedbackCrash,
  AscRawBetaFeedbackScreenshot,
  BetaFeedbackCounts,
} from '../types';

/**
 * Count beta-feedback items for a build without fetching all rows. We
 * ask for limit=1 and read meta.paging.total (same pattern as
 * countIndividualTesters). Returns 0 on error so the UI stays quiet
 * for users whose API key lacks feedback permissions.
 */
async function countForBuild(
  creds: AscCredentials,
  path: string,
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
    return res.data.length;
  } catch {
    return 0;
  }
}

export async function countCrashFeedback(
  creds: AscCredentials,
  buildId: string,
  signal?: AbortSignal,
): Promise<number> {
  const path =
    `/v1/betaFeedbackCrashSubmissions` +
    `?filter[build]=${encodeURIComponent(buildId)}` +
    `&limit=1&fields[betaFeedbackCrashSubmissions]=createdDate`;
  return countForBuild(creds, path, signal);
}

export async function countScreenshotFeedback(
  creds: AscCredentials,
  buildId: string,
  signal?: AbortSignal,
): Promise<number> {
  const path =
    `/v1/betaFeedbackScreenshotSubmissions` +
    `?filter[build]=${encodeURIComponent(buildId)}` +
    `&limit=1&fields[betaFeedbackScreenshotSubmissions]=createdDate`;
  return countForBuild(creds, path, signal);
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

/** Quick sniff used by the endpoint; keep types happy. */
export type _Raw = AscRawBetaFeedbackCrash | AscRawBetaFeedbackScreenshot;
