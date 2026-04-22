import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';

const KEY = 'entitlement_v1';

interface EntitlementState {
  unlocked: boolean;
  loaded: boolean;
  hydrate: () => Promise<void>;
  setUnlocked: (value: boolean) => Promise<void>;
}

export const useEntitlementStore = create<EntitlementState>((set) => ({
  unlocked: false,
  loaded: false,

  hydrate: async () => {
    const raw = await SecureStore.getItemAsync(KEY);
    set({ unlocked: raw === '1', loaded: true });
  },

  setUnlocked: async (value) => {
    await SecureStore.setItemAsync(KEY, value ? '1' : '0');
    set({ unlocked: value });
  },
}));
