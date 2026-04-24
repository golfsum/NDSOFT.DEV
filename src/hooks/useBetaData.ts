import { useQuery } from '@tanstack/react-query';
import {
  addBuildToBetaGroups,
  listBetaGroupsForApp,
  listBuildBetaGroups,
} from '../api/endpoints/beta-groups';
import {
  getAppFeedbackCounts,
  getBetaFeedbackCounts,
} from '../api/endpoints/beta-feedback';
import { getCrashFreeRate } from '../api/endpoints/metrics';
import { useCredentialsStore } from '../store/credentials';
import type { BetaFeedbackCounts, BetaGroupSummary } from '../api/types';
import type { AscCredentials } from '../api/asc-jwt';

const FIVE_MIN = 5 * 60_000;
const TEN_MIN = 10 * 60_000;

export function useBetaGroups(appId: string | undefined) {
  const creds = useCredentialsStore((s) => s.creds);
  return useQuery<BetaGroupSummary[]>({
    queryKey: ['betaGroups', appId, creds?.keyId ?? null],
    enabled: !!creds && !!appId,
    staleTime: FIVE_MIN,
    queryFn: async ({ signal }) => {
      if (!creds || !appId) return [];
      return listBetaGroupsForApp(creds, appId, signal);
    },
  });
}

export function useBuildBetaGroups(buildId: string | undefined) {
  const creds = useCredentialsStore((s) => s.creds);
  return useQuery<BetaGroupSummary[]>({
    queryKey: ['buildBetaGroups', buildId, creds?.keyId ?? null],
    enabled: !!creds && !!buildId,
    staleTime: FIVE_MIN,
    queryFn: async ({ signal }) => {
      if (!creds || !buildId) return [];
      return listBuildBetaGroups(creds, buildId, signal);
    },
  });
}

export function useBetaFeedbackCounts(buildId: string | undefined) {
  const creds = useCredentialsStore((s) => s.creds);
  return useQuery<BetaFeedbackCounts>({
    queryKey: ['betaFeedback', buildId, creds?.keyId ?? null],
    enabled: !!creds && !!buildId,
    staleTime: FIVE_MIN,
    queryFn: async ({ signal }) => {
      if (!creds || !buildId) return { crashes: 0, screenshots: 0 };
      return getBetaFeedbackCounts(creds, buildId, signal);
    },
  });
}

export function useAppFeedbackCounts(appId: string | undefined) {
  const creds = useCredentialsStore((s) => s.creds);
  return useQuery<BetaFeedbackCounts>({
    queryKey: ['appFeedback', appId, creds?.keyId ?? null],
    enabled: !!creds && !!appId,
    staleTime: FIVE_MIN,
    queryFn: async ({ signal }) => {
      if (!creds || !appId) return { crashes: 0, screenshots: 0 };
      return getAppFeedbackCounts(creds, appId, signal);
    },
  });
}

export function useCrashFreeRate(buildId: string | undefined) {
  const creds = useCredentialsStore((s) => s.creds);
  return useQuery<number | null>({
    queryKey: ['crashFree', buildId, creds?.keyId ?? null],
    enabled: !!creds && !!buildId,
    staleTime: TEN_MIN,
    retry: false,
    queryFn: async ({ signal }) => {
      if (!creds || !buildId) return null;
      return getCrashFreeRate(creds, buildId, signal);
    },
  });
}

/** Promote a build to the given internal group(s). No-op if already present. */
export async function promoteBuild(
  creds: AscCredentials,
  buildId: string,
  groupIds: string[],
  signal?: AbortSignal,
): Promise<void> {
  await addBuildToBetaGroups(creds, buildId, groupIds, signal);
}
