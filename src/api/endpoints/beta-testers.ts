import { ascClient } from '../asc-client';
import type { AscCredentials } from '../asc-jwt';
import type { AscListResponse, AscPageMeta } from '../types';

/**
 * Get the total count of individual beta testers on a build without
 * fetching the actual tester rows. We request limit=0 and read
 * meta.paging.total. The spec in section 6.4 documents this pattern.
 *
 * Apple sometimes rejects limit=0; we fall back to limit=1 if so.
 */
export async function countIndividualTesters(
  creds: AscCredentials,
  buildId: string,
  signal?: AbortSignal,
): Promise<number> {
  const path = `/v1/builds/${encodeURIComponent(buildId)}/individualTesters?limit=1`;
  try {
    const res = await ascClient.get<AscListResponse<unknown> & { meta?: AscPageMeta }>(
      creds,
      path,
      { signal },
    );
    const total = res.meta?.paging?.total;
    if (typeof total === 'number') return total;
    // If meta is missing, fall back to data length.
    return res.data.length;
  } catch {
    return 0;
  }
}
