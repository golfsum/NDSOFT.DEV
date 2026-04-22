import { ascClient } from '../asc-client';
import type { AscCredentials } from '../asc-jwt';
import type {
  AscListResponse,
  AscRawBuild,
  AscRawPreReleaseVersion,
  BuildSummary,
  ProcessingState,
} from '../types';

const BUILD_FIELDS =
  'version,uploadedDate,expirationDate,processingState,expired,usesNonExemptEncryption';

function toBuildSummary(
  raw: AscRawBuild,
  preReleases: Map<string, AscRawPreReleaseVersion>,
): BuildSummary | null {
  const { uploadedDate, processingState, version, expirationDate, expired } = raw.attributes;
  if (!uploadedDate || !processingState || !version) return null;

  const preId = raw.relationships?.preReleaseVersion?.data?.id;
  const marketing = preId ? preReleases.get(preId)?.attributes.version : undefined;

  return {
    id: raw.id,
    version: marketing ?? '—',
    buildNumber: version, // "version" on a build is the build number
    uploadedAt: new Date(uploadedDate),
    expiresAt: expirationDate ? new Date(expirationDate) : null,
    processingState: processingState as ProcessingState,
    expired: Boolean(expired),
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
    `&include=preReleaseVersion` +
    `&fields[builds]=${BUILD_FIELDS}` +
    `&fields[preReleaseVersions]=version,platform`;

  const response = await ascClient.get<
    AscListResponse<AscRawBuild, AscRawPreReleaseVersion>
  >(creds, path, { signal });

  const preReleases = new Map<string, AscRawPreReleaseVersion>();
  for (const inc of response.included ?? []) {
    if ((inc as AscRawPreReleaseVersion).type === 'preReleaseVersions') {
      preReleases.set(inc.id, inc as AscRawPreReleaseVersion);
    }
  }

  const builds: BuildSummary[] = [];
  for (const raw of response.data) {
    const view = toBuildSummary(raw, preReleases);
    if (view) builds.push(view);
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
