import { AscCredentials, getASCToken, invalidateASCToken } from './asc-jwt';
import type { AscListResponse } from './types';

const BASE_URL = 'https://api.appstoreconnect.apple.com';

export class AscApiError extends Error {
  readonly status: number;
  readonly retryAfterSec?: number;
  readonly code: 'UNAUTHORIZED' | 'FORBIDDEN' | 'RATE_LIMITED' | 'NETWORK' | 'HTTP' | 'PARSE';

  constructor(message: string, status: number, code: AscApiError['code'], retryAfterSec?: number) {
    super(message);
    this.name = 'AscApiError';
    this.status = status;
    this.code = code;
    this.retryAfterSec = retryAfterSec;
  }
}

interface FetchOptions {
  signal?: AbortSignal;
  /** When true, the caller is the retry step — don't retry recursively. */
  isRetry?: boolean;
}

/**
 * Low-level ASC fetch. Handles:
 *  - JWT injection (cached, auto-regenerated)
 *  - 401 → invalidate token, retry once, then throw
 *  - 403 → throw with FORBIDDEN code (UI shows "API key lacks permission")
 *  - 429 → parse Retry-After, throw with RATE_LIMITED
 *  - network errors → throw with NETWORK
 */
async function ascFetch<T>(
  creds: AscCredentials,
  pathOrUrl: string,
  opts: FetchOptions = {},
): Promise<T> {
  const url = pathOrUrl.startsWith('http') ? pathOrUrl : `${BASE_URL}${pathOrUrl}`;
  const token = getASCToken(creds);

  let res: Response;
  try {
    res = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
      signal: opts.signal,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Network request failed';
    throw new AscApiError(msg, 0, 'NETWORK');
  }

  if (res.status === 401) {
    invalidateASCToken();
    if (!opts.isRetry) {
      return ascFetch<T>(creds, pathOrUrl, { ...opts, isRetry: true });
    }
    throw new AscApiError('Your API key was rejected by Apple.', 401, 'UNAUTHORIZED');
  }

  if (res.status === 403) {
    throw new AscApiError('Your API key lacks permission for this request.', 403, 'FORBIDDEN');
  }

  if (res.status === 429) {
    const retryAfter = Number(res.headers.get('Retry-After') ?? '5');
    throw new AscApiError(
      `Apple rate-limited the request. Retry in ${retryAfter}s.`,
      429,
      'RATE_LIMITED',
      Number.isFinite(retryAfter) ? retryAfter : 5,
    );
  }

  if (!res.ok) {
    let detail = '';
    try {
      const body = await res.text();
      detail = body.slice(0, 200);
    } catch {
      /* noop */
    }
    throw new AscApiError(`ASC request failed (${res.status}) ${detail}`, res.status, 'HTTP');
  }

  try {
    return (await res.json()) as T;
  } catch {
    throw new AscApiError('Could not parse ASC response.', 0, 'PARSE');
  }
}

/**
 * Paginate a list endpoint by following `links.next` until exhausted.
 * Caller can pass a max to cap results (e.g. for tester counts we don't
 * actually need items, only the meta total).
 */
export async function ascFetchAll<D, I = unknown>(
  creds: AscCredentials,
  initialPath: string,
  maxItems: number = 1000,
  signal?: AbortSignal,
): Promise<AscListResponse<D, I>> {
  const first = await ascFetch<AscListResponse<D, I>>(creds, initialPath, { signal });
  let combined: AscListResponse<D, I> = {
    ...first,
    data: [...first.data],
    included: first.included ? [...first.included] : undefined,
  };

  let next = first.links?.next;
  while (next && combined.data.length < maxItems) {
    const page = await ascFetch<AscListResponse<D, I>>(creds, next, { signal });
    combined.data.push(...page.data);
    if (page.included) {
      combined.included = (combined.included ?? []).concat(page.included);
    }
    combined.links = page.links;
    combined.meta = page.meta;
    next = page.links?.next;
  }

  return combined;
}

export const ascClient = {
  get: ascFetch,
  getAll: ascFetchAll,
  BASE_URL,
};
