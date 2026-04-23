import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';

const KEY = 'auto_promote_v1';

interface AutoPromoteState {
  /** Map of appId → whether auto-promote is enabled for that app. */
  byAppId: Record<string, boolean>;
  /** Map of buildId → true once we've successfully promoted it, so we
   *  don't retry on every refetch even if the build briefly drops its
   *  group membership. */
  promotedBuilds: Record<string, true>;
  loaded: boolean;
  hydrate: () => Promise<void>;
  setEnabled: (appId: string, enabled: boolean) => Promise<void>;
  markPromoted: (buildId: string) => Promise<void>;
  isEnabled: (appId: string) => boolean;
}

interface Persisted {
  byAppId?: Record<string, boolean>;
  promotedBuilds?: Record<string, true>;
}

async function read(): Promise<Persisted> {
  try {
    const raw = await SecureStore.getItemAsync(KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Persisted;
  } catch {
    return {};
  }
}

async function write(state: Persisted): Promise<void> {
  await SecureStore.setItemAsync(KEY, JSON.stringify(state));
}

export const useAutoPromoteStore = create<AutoPromoteState>((set, get) => ({
  byAppId: {},
  promotedBuilds: {},
  loaded: false,

  hydrate: async () => {
    const persisted = await read();
    set({
      byAppId: persisted.byAppId ?? {},
      promotedBuilds: persisted.promotedBuilds ?? {},
      loaded: true,
    });
  },

  setEnabled: async (appId, enabled) => {
    const byAppId = { ...get().byAppId, [appId]: enabled };
    set({ byAppId });
    await write({ byAppId, promotedBuilds: get().promotedBuilds });
  },

  markPromoted: async (buildId) => {
    const promotedBuilds = { ...get().promotedBuilds, [buildId]: true as const };
    set({ promotedBuilds });
    await write({ byAppId: get().byAppId, promotedBuilds });
  },

  isEnabled: (appId) => Boolean(get().byAppId[appId]),
}));
