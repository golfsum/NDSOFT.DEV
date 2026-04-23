import { ascClient } from '../asc-client';
import type { AscCredentials } from '../asc-jwt';
import type {
  AscListResponse,
  AscRawBetaGroup,
  BetaGroupSummary,
} from '../types';

const GROUP_FIELDS =
  'name,isInternalGroup,publicLinkEnabled,publicLink,publicLinkLimit,publicLinkLimitEnabled';

function toBetaGroupSummary(raw: AscRawBetaGroup): BetaGroupSummary {
  return {
    id: raw.id,
    name: raw.attributes.name ?? 'Unnamed group',
    isInternal: Boolean(raw.attributes.isInternalGroup),
    publicLinkEnabled: Boolean(raw.attributes.publicLinkEnabled),
    publicLink: raw.attributes.publicLink ?? null,
  };
}

/**
 * List beta groups for an app. Internal flag lets callers pick the right
 * group for auto-promote; public link groups expose the shareable URL.
 */
export async function listBetaGroupsForApp(
  creds: AscCredentials,
  appId: string,
  signal?: AbortSignal,
): Promise<BetaGroupSummary[]> {
  const path =
    `/v1/betaGroups` +
    `?filter[app]=${encodeURIComponent(appId)}` +
    `&limit=50` +
    `&fields[betaGroups]=${GROUP_FIELDS}`;

  try {
    const res = await ascClient.get<AscListResponse<AscRawBetaGroup>>(creds, path, {
      signal,
    });
    return res.data.map(toBetaGroupSummary);
  } catch {
    return [];
  }
}

/**
 * Get the groups a build is currently shipped to. Used to detect whether
 * auto-promote has already happened for a given build.
 */
export async function listBuildBetaGroups(
  creds: AscCredentials,
  buildId: string,
  signal?: AbortSignal,
): Promise<BetaGroupSummary[]> {
  const path =
    `/v1/builds/${encodeURIComponent(buildId)}/betaGroups` +
    `?limit=50&fields[betaGroups]=${GROUP_FIELDS}`;

  try {
    const res = await ascClient.get<AscListResponse<AscRawBetaGroup>>(creds, path, {
      signal,
    });
    return res.data.map(toBetaGroupSummary);
  } catch {
    return [];
  }
}

/**
 * Attach a build to one or more beta groups. ASC accepts a single POST
 * with a relationship array; each ref must be { id, type: 'betaGroups' }.
 */
export async function addBuildToBetaGroups(
  creds: AscCredentials,
  buildId: string,
  groupIds: string[],
  signal?: AbortSignal,
): Promise<void> {
  if (groupIds.length === 0) return;
  const path = `/v1/builds/${encodeURIComponent(buildId)}/relationships/betaGroups`;
  await ascClient.post<void>(
    creds,
    path,
    {
      data: groupIds.map((id) => ({ id, type: 'betaGroups' })),
    },
    { signal },
  );
}
