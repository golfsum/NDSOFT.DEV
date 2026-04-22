import { useQuery } from '@tanstack/react-query';
import { listApps } from '../api/endpoints/apps';
import { getLatestBuildForApp } from '../api/endpoints/builds';
import { useCredentialsStore } from '../store/credentials';
import type { AppSummary } from '../api/types';

const STALE_TIME = 60_000;
const REFETCH_INTERVAL = 120_000;

/**
 * Fetches every app on the account, then in parallel fetches the latest
 * build for each. Apps with no builds are preserved so the user still
 * sees them in the dashboard.
 *
 * Sorted by most recent build uploadedAt (descending); apps with no
 * build sink to the bottom, alphabetized.
 */
export function useApps() {
  const creds = useCredentialsStore((s) => s.creds);

  return useQuery<AppSummary[]>({
    queryKey: ['apps', creds?.keyId ?? null],
    enabled: !!creds,
    staleTime: STALE_TIME,
    refetchInterval: REFETCH_INTERVAL,
    refetchOnWindowFocus: true,
    queryFn: async ({ signal }) => {
      if (!creds) return [];
      const apps = await listApps(creds, signal);

      const withBuilds = await Promise.all(
        apps.map(async (app) => {
          try {
            const latest = await getLatestBuildForApp(creds, app.id, signal);
            return { ...app, latestBuild: latest };
          } catch {
            return app;
          }
        }),
      );

      withBuilds.sort((a, b) => {
        const at = a.latestBuild?.uploadedAt?.getTime();
        const bt = b.latestBuild?.uploadedAt?.getTime();
        if (at && bt) return bt - at;
        if (at) return -1;
        if (bt) return 1;
        return a.name.localeCompare(b.name);
      });

      return withBuilds;
    },
  });
}
