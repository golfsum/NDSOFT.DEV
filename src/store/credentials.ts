import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';
import { invalidateASCToken, type AscCredentials } from '../api/asc-jwt';

const KEY = 'asc_creds_v1';

export type Credentials = AscCredentials;

interface CredentialsState {
  creds: Credentials | null;
  loaded: boolean;
  hydrate: () => Promise<void>;
  save: (c: Credentials) => Promise<void>;
  clear: () => Promise<void>;
}

async function readCreds(): Promise<Credentials | null> {
  const raw = await SecureStore.getItemAsync(KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<Credentials>;
    if (parsed.issuerId && parsed.keyId && parsed.privateKeyPem) {
      return {
        issuerId: parsed.issuerId,
        keyId: parsed.keyId,
        privateKeyPem: parsed.privateKeyPem,
      };
    }
    return null;
  } catch {
    return null;
  }
}

async function writeCreds(c: Credentials): Promise<void> {
  await SecureStore.setItemAsync(KEY, JSON.stringify(c), {
    keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  });
}

export const useCredentialsStore = create<CredentialsState>((set) => ({
  creds: null,
  loaded: false,

  hydrate: async () => {
    const c = await readCreds();
    set({ creds: c, loaded: true });
  },

  save: async (c) => {
    await writeCreds(c);
    invalidateASCToken();
    set({ creds: c });
  },

  clear: async () => {
    await SecureStore.deleteItemAsync(KEY);
    invalidateASCToken();
    set({ creds: null });
  },
}));
