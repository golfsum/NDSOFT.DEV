import { useEntitlementStore } from '../store/entitlement';

export const UNLIMITED_PRODUCT_ID = 'com.ndsoft.testflighttracker.unlimited';

export interface ProductInfo {
  id: string;
  priceLabel: string; // e.g. "$2.99" — pulled from StoreKit, never hardcoded for display
  title: string;
  description: string;
}

/**
 * Load expo-iap lazily. The module throws at import time when its
 * native counterpart is missing (e.g. running a JS bundle against a
 * dev client that wasn't rebuilt after adding the package). Swallowing
 * the error here lets the rest of the app render — paywall actions
 * will simply report that purchases are unavailable.
 *
 * expo-iap's API surface has also shifted across minor versions, so we
 * cast to `any` and let the call sites do permissive shape-matching.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let iap: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  iap = require('expo-iap');
} catch (e) {
  const msg = e instanceof Error ? e.message : String(e);
  console.warn(
    '[storekit] expo-iap native module not available — in-app purchases disabled. ' +
      'Rebuild the native app (`npx expo run:ios`) to enable. Detail:',
    msg,
  );
}

/** True when the native module is present. False => purchases are a no-op. */
export function isIapAvailable(): boolean {
  return iap != null;
}

async function ensureConnection(): Promise<void> {
  if (!iap) return;
  // Most versions of expo-iap expose initConnection(). If already
  // connected, repeated calls are no-ops.
  if (typeof iap.initConnection === 'function') {
    try {
      await iap.initConnection();
    } catch {
      /* swallow — fetchProducts will throw if truly unusable */
    }
  }
}

export async function fetchUnlimitedProduct(): Promise<ProductInfo | null> {
  if (!iap) return null;
  await ensureConnection();

  // Try the modern name first, fall back to legacy.
  const fetcher =
    iap.fetchProducts ??
    iap.getProducts ??
    iap.requestProducts;
  if (typeof fetcher !== 'function') return null;

  try {
    const products = await fetcher({ skus: [UNLIMITED_PRODUCT_ID], type: 'inapp' }).catch(
      () => fetcher([UNLIMITED_PRODUCT_ID]),
    );
    const list: any[] = Array.isArray(products)
      ? products
      : Array.isArray(products?.products)
      ? products.products
      : [];
    const p = list.find((x) => x.productId === UNLIMITED_PRODUCT_ID || x.id === UNLIMITED_PRODUCT_ID);
    if (!p) return null;
    return {
      id: p.productId ?? p.id ?? UNLIMITED_PRODUCT_ID,
      priceLabel: p.displayPrice ?? p.localizedPrice ?? p.price ?? '',
      title: p.title ?? 'Unlimited Apps',
      description: p.description ?? 'Track every app on your account.',
    };
  } catch {
    return null;
  }
}

export async function purchaseUnlimited(): Promise<boolean> {
  if (!iap) {
    throw new Error(
      'In-app purchases are unavailable. Rebuild the app to enable purchases.',
    );
  }
  await ensureConnection();
  const purchaser =
    iap.requestPurchase ??
    iap.purchaseProduct ??
    iap.buyProduct;
  if (typeof purchaser !== 'function') {
    throw new Error('In-app purchases are unavailable on this device.');
  }

  // expo-iap v2.7+ requires a nested { request: { ios, android }, type }
  // shape. Older versions accept a flat { sku, skus }. Try modern first,
  // fall back to legacy if the modern shape throws.
  const modernArgs = {
    request: {
      ios: { sku: UNLIMITED_PRODUCT_ID },
      android: { skus: [UNLIMITED_PRODUCT_ID] },
    },
    type: 'inapp' as const,
  };
  const legacyArgs = { sku: UNLIMITED_PRODUCT_ID, skus: [UNLIMITED_PRODUCT_ID] };

  let result: unknown;
  try {
    result = await purchaser(modernArgs);
  } catch (e) {
    // If the modern shape isn't accepted, retry with legacy. Any other
    // error (e.g. user cancelled) is surfaced to the caller.
    const msg = e instanceof Error ? e.message : String(e);
    if (/request|ios|android|shape|invalid/i.test(msg)) {
      result = await purchaser(legacyArgs);
    } else {
      throw e;
    }
  }

  const entries: any[] = Array.isArray(result) ? result : [result];
  const success = entries.some(
    (r) => r && (r.productId === UNLIMITED_PRODUCT_ID || r.id === UNLIMITED_PRODUCT_ID),
  );

  if (success) {
    await useEntitlementStore.getState().setUnlocked(true);
    await finalizePendingTransactions();
  }
  return success;
}

export async function restorePurchases(): Promise<boolean> {
  if (!iap) return false;
  await ensureConnection();
  const getter =
    iap.getAvailablePurchases ??
    iap.getPurchaseHistory;
  if (typeof getter !== 'function') return false;

  try {
    const purchases = await getter();
    const list: any[] = Array.isArray(purchases) ? purchases : purchases?.purchases ?? [];
    const hasUnlimited = list.some(
      (p) => p?.productId === UNLIMITED_PRODUCT_ID || p?.id === UNLIMITED_PRODUCT_ID,
    );
    if (hasUnlimited) {
      await useEntitlementStore.getState().setUnlocked(true);
    }
    await finalizePendingTransactions();
    return hasUnlimited;
  } catch {
    return false;
  }
}

/**
 * Finish any pending StoreKit transactions so iOS stops showing
 * "Interrupted Purchase" banners. Safe to call repeatedly.
 */
async function finalizePendingTransactions(): Promise<void> {
  if (!iap) return;
  try {
    if (typeof iap.finishTransaction === 'function') {
      const pending = typeof iap.getPendingPurchases === 'function'
        ? await iap.getPendingPurchases().catch(() => [])
        : [];
      for (const p of pending) {
        try {
          await iap.finishTransaction({ purchase: p, isConsumable: false });
        } catch {
          /* ignore */
        }
      }
    }
  } catch {
    /* ignore */
  }
}

/**
 * Called once on app boot. Hydrates the entitlement from SecureStore,
 * then asks StoreKit whether the user has the entitlement (handles the
 * "installed on a new device after purchase" case).
 */
export async function bootstrapIap(): Promise<void> {
  await useEntitlementStore.getState().hydrate();
  // Best-effort restore — don't block launch on failure.
  try {
    await restorePurchases();
  } catch {
    /* ignore */
  }
}
