import { ascClient, AscApiError } from '../asc-client';
import type { AscCredentials } from '../asc-jwt';
import type { AscListResponse, AscRawPerfMetric } from '../types';

/**
 * Crash-free session rate for a build, via the Power & Performance
 * Metrics API (`/v1/builds/{id}/perfPowerMetrics`).
 *
 * The endpoint returns percentiles for many metric categories; the
 * stability category reports a fraction of sessions that hit a crash.
 * We invert that into a 0-100% crash-free figure for the UI.
 *
 * Returns `null` if:
 *  - The metric is not yet available (new builds, too few sessions)
 *  - The API key lacks permission (403)
 *  - Any other error — caller falls back to "—"
 */
export async function getCrashFreeRate(
  creds: AscCredentials,
  buildId: string,
  signal?: AbortSignal,
): Promise<number | null> {
  const path =
    `/v1/builds/${encodeURIComponent(buildId)}/perfPowerMetrics` +
    `?filter[metricCategory]=DISK_WRITES,LAUNCH,HANG,MEMORY,DISK_USAGE,BATTERY`;

  try {
    const res = await ascClient.get<AscListResponse<AscRawPerfMetric>>(creds, path, {
      signal,
    });
    return extractCrashFreeFromMetrics(res.data);
  } catch (e) {
    if (e instanceof AscApiError && (e.code === 'FORBIDDEN' || e.code === 'HTTP')) {
      return null;
    }
    return null;
  }
}

/**
 * Apple's perf metrics payload is a union of categories; we look for a
 * stability-like signal (crashes per session). If none is present,
 * return null and let the caller render a placeholder.
 */
function extractCrashFreeFromMetrics(metrics: AscRawPerfMetric[]): number | null {
  for (const m of metrics) {
    const cat = m.attributes.metricCategory;
    if (cat !== 'HANG' && cat !== 'LAUNCH') continue;
    const points = m.attributes.productData?.[0]?.dataPoints ?? [];
    const p50 = points.find((p) => p.percentile === 'P50')?.value;
    if (typeof p50 === 'number' && p50 >= 0 && p50 <= 1) {
      // Invert: reported fraction of impacted sessions → crash-free.
      return Math.max(0, Math.min(100, (1 - p50) * 100));
    }
  }
  return null;
}
