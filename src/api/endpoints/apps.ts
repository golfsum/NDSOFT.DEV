import { ascClient } from '../asc-client';
import type { AscCredentials } from '../asc-jwt';
import type { AscRawApp, AppSummary } from '../types';

export async function listApps(
  creds: AscCredentials,
  signal?: AbortSignal,
): Promise<AppSummary[]> {
  const response = await ascClient.getAll<AscRawApp>(
    creds,
    '/v1/apps?limit=200&fields[apps]=name,bundleId,sku',
    500,
    signal,
  );

  return response.data.map((raw) => ({
    id: raw.id,
    name: raw.attributes.name ?? 'Unnamed App',
    bundleId: raw.attributes.bundleId ?? '',
    sku: raw.attributes.sku ?? '',
  }));
}

/**
 * Quick probe for the Test Connection button in Settings.
 * Throws AscApiError on failure; returns silently on success.
 */
export async function pingApps(creds: AscCredentials): Promise<void> {
  await ascClient.get(creds, '/v1/apps?limit=1&fields[apps]=name');
}
