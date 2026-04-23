import { ascClient } from '../asc-client';
import type { AscCredentials } from '../asc-jwt';
import type {
  AscListResponse,
  AscRawBetaAppReviewSubmission,
  BetaReviewState,
} from '../types';

/**
 * Get the external Beta App Review submission state for a build, if any.
 * Returns undefined when no submission has been created (internal-only
 * builds and fresh uploads that haven't been submitted yet).
 */
export async function getBetaReviewStateForBuild(
  creds: AscCredentials,
  buildId: string,
  signal?: AbortSignal,
): Promise<BetaReviewState | undefined> {
  const path =
    `/v1/betaAppReviewSubmissions` +
    `?filter[build]=${encodeURIComponent(buildId)}` +
    `&limit=1` +
    `&fields[betaAppReviewSubmissions]=betaReviewState`;

  try {
    const res = await ascClient.get<AscListResponse<AscRawBetaAppReviewSubmission>>(
      creds,
      path,
      { signal },
    );
    return res.data[0]?.attributes.betaReviewState;
  } catch {
    return undefined;
  }
}
