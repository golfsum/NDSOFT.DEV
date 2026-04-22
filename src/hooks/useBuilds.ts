import { useQuery } from '@tanstack/react-query';
import { listBuildsForApp } from '../api/endpoints/builds';
import { listRecentReviews } from '../api/endpoints/reviews';
import { countIndividualTesters } from '../api/endpoints/beta-testers';
import { useCredentialsStore } from '../store/credentials';
import type { BuildSummary, ReviewSummary } from '../api/types';

const DETAIL_STALE_TIME = 30_000;
const DETAIL_REFETCH_INTERVAL = 60_000;

export function useBuilds(appId: string | undefined) {
  const creds = useCredentialsStore((s) => s.creds);
  return useQuery<BuildSummary[]>({
    queryKey: ['builds', appId, creds?.keyId ?? null],
    enabled: !!creds && !!appId,
    staleTime: DETAIL_STALE_TIME,
    refetchInterval: DETAIL_REFETCH_INTERVAL,
    refetchOnWindowFocus: true,
    queryFn: async ({ signal }) => {
      if (!creds || !appId) return [];
      return listBuildsForApp(creds, appId, 20, signal);
    },
  });
}

export function useReviews(appId: string | undefined) {
  const creds = useCredentialsStore((s) => s.creds);
  return useQuery<ReviewSummary[]>({
    queryKey: ['reviews', appId, creds?.keyId ?? null],
    enabled: !!creds && !!appId,
    staleTime: 5 * 60_000,
    refetchInterval: 10 * 60_000,
    queryFn: async ({ signal }) => {
      if (!creds || !appId) return [];
      try {
        return await listRecentReviews(creds, appId, 5, signal);
      } catch {
        return [];
      }
    },
  });
}

export function useTesterCount(buildId: string | undefined) {
  const creds = useCredentialsStore((s) => s.creds);
  return useQuery<number>({
    queryKey: ['testerCount', buildId, creds?.keyId ?? null],
    enabled: !!creds && !!buildId,
    staleTime: 5 * 60_000,
    queryFn: async ({ signal }) => {
      if (!creds || !buildId) return 0;
      return countIndividualTesters(creds, buildId, signal);
    },
  });
}
