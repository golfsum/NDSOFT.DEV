import { useEffect, useRef } from 'react';
import { addBuildToBetaGroups } from '../api/endpoints/beta-groups';
import { useAutoPromoteStore } from '../store/autoPromote';
import { useCredentialsStore } from '../store/credentials';
import type { BetaGroupSummary, BuildSummary } from '../api/types';

/**
 * Side effect: when auto-promote is enabled for this app, and a build
 * has just finished processing (`VALID`), attach it to the app's
 * internal beta group. We guard with `promotedBuilds` in the store so
 * we don't POST repeatedly across re-renders or refetches.
 *
 * Runs quietly — any error is swallowed so a flaky ASC call doesn't
 * interrupt the detail screen. The user sees the outcome on the next
 * refetch when the build shows up in the internal group.
 */
export function useAutoPromote(
  appId: string | undefined,
  builds: BuildSummary[] | undefined,
  groups: BetaGroupSummary[] | undefined,
) {
  const creds = useCredentialsStore((s) => s.creds);
  const enabled = useAutoPromoteStore((s) =>
    appId ? Boolean(s.byAppId[appId]) : false,
  );
  const promotedBuilds = useAutoPromoteStore((s) => s.promotedBuilds);
  const markPromoted = useAutoPromoteStore((s) => s.markPromoted);

  const inFlight = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!creds || !enabled || !builds || !groups || !appId) return;

    const internalGroup = groups.find((g) => g.isInternal);
    if (!internalGroup) return;

    for (const build of builds) {
      if (build.processingState !== 'VALID') continue;
      if (promotedBuilds[build.id]) continue;
      if (inFlight.current.has(build.id)) continue;

      inFlight.current.add(build.id);
      (async () => {
        try {
          await addBuildToBetaGroups(creds, build.id, [internalGroup.id]);
          await markPromoted(build.id);
        } catch {
          /* silent — will be retried on next refetch */
        } finally {
          inFlight.current.delete(build.id);
        }
      })();
    }
  }, [creds, enabled, builds, groups, appId, promotedBuilds, markPromoted]);
}
