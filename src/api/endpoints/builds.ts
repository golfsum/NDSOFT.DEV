import { ascClient } from '../asc-client';
import type { AscCredentials } from '../asc-jwt';
import type {
  AscListResponse,
  AscRawBetaAppReviewSubmission,
  AscRawBuild,
  AscRawPreReleaseVersion,
  BuildSummary,
  ProcessingState,
} from '../types';

const BUILD_FIELDS =
  'version,uploadedDate,expirationDate,processingState,expired,usesNonExemptEncryption';

type IncludedResource = AscRawPreReleaseVersion | AscRawBetaAppReviewSubmission;

function toBuildSummary(
  raw: AscRawBuild,
  preReleases: Map<string, AscRawPreReleaseVersion>,
  reviewSubmissions: Map<string, AscRawBetaAppReviewSubmission>,
): BuildSummary | null {
  const { uploadedDate, processingState, version, expirationDate, expired } = raw.attributes;
  if (!uploadedDate || !processingState || !version) return null;

  const preId = raw.relationships?.preReleaseVersion?.data?.id;
  const marketing = preId ? preReleases.get(preId)?.attributes.version : undefined;

  const reviewId = raw.relationships?.betaAppReviewSubmission?.data?.id;
  const reviewState = reviewId
    ? reviewSubmissions.get(reviewId)?.attributes.betaReviewState
    : undefined;

  const appId = raw.relationships?.app?.data?.id;

  return {
    id: raw.id,
    appId,
    version: marketing ?? '—',
    buildNumber: version, // "version" on a build is the build number
    uploadedAt: new Date(uploadedDate),
    expiresAt: expirationDate ? new Date(expirationDate) : null,
    processingState: processingState as ProcessingState,
    expired: Boolean(expired),
    betaReviewState: reviewState,
  };
}

export async function listBuildsForApp(
  creds: AscCredentials,
  appId: string,
  limit: number = 20,
  signal?: AbortSignal,
): Promise<BuildSummary[]> {
  const path =
    `/v1/builds` +
    `?filter[app]=${encodeURIComponent(appId)}` +
    `&sort=-uploadedDate` +
    `&limit=${limit}` +
    `&include=preReleaseVersion,betaAppReviewSubmission` +
    `&fields[builds]=${BUILD_FIELDS}` +
    `&fields[preReleaseVersions]=version,platform` +
    `&fields[betaAppReviewSubmissions]=betaReviewState`;

  const response = await ascClient.get<AscListResponse<AscRawBuild, IncludedResource>>(
    creds,
    path,
    { signal },
  );

  const preReleases = new Map<string, AscRawPreReleaseVersion>();
  const reviewSubmissions = new Map<string, AscRawBetaAppReviewSubmission>();
  for (const inc of response.included ?? []) {
    if ((inc as AscRawPreReleaseVersion).type === 'preReleaseVersions') {
      preReleases.set(inc.id, inc as AscRawPreReleaseVersion);
    } else if ((inc as AscRawBetaAppReviewSubmission).type === 'betaAppReviewSubmissions') {
      reviewSubmissions.set(inc.id, inc as AscRawBetaAppReviewSubmission);
    }
  }

  const builds: BuildSummary[] = [];
  for (const raw of response.data) {
    const view = toBuildSummary(raw, preReleases, reviewSubmissions);
    if (view) {
      // When fetching per-app, the appId relationship is sometimes absent;
      // fall back to the query param so callers always have it.
      builds.push({ ...view, appId: view.appId ?? appId });
    }
  }
  return builds;
}

export async function getLatestBuildForApp(
  creds: AscCredentials,
  appId: string,
  signal?: AbortSignal,
): Promise<BuildSummary | undefined> {
  const builds = await listBuildsForApp(creds, appId, 1, signal);
  return builds[0];
}
