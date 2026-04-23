import { useQuery } from '@tanstack/react-query';
import { listApps } from '../api/endpoints/apps';
import { listBuildsForApp } from '../api/endpoints/builds';
import { useCredentialsStore } from '../store/credentials';
import type { AppSummary, BuildSummary } from '../api/types';

const STALE_TIME = 60_000;
const REFETCH_INTERVAL = 120_000;
const BUILDS_PER_APP = 10;

export interface DashboardBuild {
  build: BuildSummary;
  app: AppSummary;
}

/**
 * Flatten recent builds across every app, sorted by expiresAt ascending
 * so the soonest-to-expire ones surface first. Expired builds sink to
 * the bottom; builds without expiry (very rare) sort after active ones.
 */
function sortByExpiryAsc(items: DashboardBuild[]): DashboardBuild[] {
  const now = Date.now();
  return [...items].sort((a, b) => {
    const aExp = a.build.expiresAt?.getTime();
    const bExp = b.build.expiresAt?.getTime();
    const aExpired = a.build.expired || (aExp !== undefined && aExp <= now);
    const bExpired = b.build.expired || (bExp !== undefined && bExp <= now);

    // Active builds before expired; within each bucket, sort by soonest.
    if (aExpired !== bExpired) return aExpired ? 1 : -1;

    if (aExp && bExp) return aExp - bExp;
    if (aExp) return -1;
    if (bExp) return 1;
    return b.build.uploadedAt.getTime() - a.build.uploadedAt.getTime();
  });
}

export function useDashboard() {
  const creds = useCredentialsStore((s) => s.creds);

  return useQuery<{ apps: AppSummary[]; items: DashboardBuild[] }>({
    queryKey: ['dashboard', creds?.keyId ?? null],
    enabled: !!creds,
    staleTime: STALE_TIME,
    refetchInterval: REFETCH_INTERVAL,
    refetchOnWindowFocus: true,
    queryFn: async ({ signal }) => {
      if (!creds) return { apps: [], items: [] };

      const apps = await listApps(creds, signal);

      const perApp = await Promise.all(
        apps.map(async (app) => {
          try {
            const builds = await listBuildsForApp(creds, app.id, BUILDS_PER_APP, signal);
            return { app, builds };
          } catch {
            return { app, builds: [] as BuildSummary[] };
          }
        }),
      );

      const flat: DashboardBuild[] = [];
      for (const { app, builds } of perApp) {
        for (const build of builds) {
          flat.push({ app, build });
        }
      }

      return { apps, items: sortByExpiryAsc(flat) };
    },
  });
}
