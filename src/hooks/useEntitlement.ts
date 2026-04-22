import { useEntitlementStore } from '../store/entitlement';

export function useEntitlement(): { unlocked: boolean; loaded: boolean } {
  const unlocked = useEntitlementStore((s) => s.unlocked);
  const loaded = useEntitlementStore((s) => s.loaded);
  return { unlocked, loaded };
}

/**
 * Given the position of an app in the dashboard list, should it be
 * shown as locked? The first app (index 0) is always free.
 */
export function isAppLocked(indexInList: number, unlocked: boolean): boolean {
  if (unlocked) return false;
  return indexInList > 0;
}
