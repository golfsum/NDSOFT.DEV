import { useEntitlementStore } from '../store/entitlement';

export type PlanTier = 'monthly' | 'yearly' | 'lifetime';

export const PRODUCT_IDS: Record<PlanTier, string> = {
  monthly: 'com.ndsoft.testflighttracker.pro.monthly',
  yearly: 'com.ndsoft.testflighttracker.pro.yearly',
  lifetime: 'com.ndsoft.testflighttracker.pro.lifetime',
};

/** Legacy one-time unlock — still honored on restore for early users. */
const LEGACY_UNLIMITED_ID = 'com.ndsoft.testflighttracker.unlimited';

const ALL_PRODUCT_IDS: string[] = [
  PRODUCT_IDS.monthly,
  PRODUCT_IDS.yearly,
  PRODUCT_IDS.lifetime,
  LEGACY_UNLIMITED_ID,
];

const SUBSCRIPTION_IDS = new Set<string>([
  PRODUCT_IDS.monthly,
  PRODUCT_IDS.yearly,
]);

export interface ProductInfo {
  id: string;
  tier: PlanTier;
  priceLabel: string; // e.g. "$2.99" — from StoreKit
  title: string;
  description: string;
  /** True for auto-renewing subscriptions; false for the one-time lifetime. */
  isSubscription: boolean;
}

/**
 * Load expo-iap lazily. The module throws at import time when its
 * native counterpart is missing (e.g. running a JS bundle against a
 * dev client that wasn't rebuilt after adding the package). Swallowing
 * the error here lets the rest of the app render — paywall actions
 * will simply report that purchases are unavailable.
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

export function isIapAvailable(): boolean {
  return iap != null;
}

async function ensureConnection(): Promise<void> {
  if (!iap) return;
  if (typeof iap.initConnection === 'function') {
    try {
      await iap.initConnection();
    } catch {
      /* swallow */
    }
  }
}

function tierForId(id: string): PlanTier | null {
  if (id === PRODUCT_IDS.monthly) return 'monthly';
  if (id === PRODUCT_IDS.yearly) return 'yearly';
  if (id === PRODUCT_IDS.lifetime) return 'lifetime';
  if (id === LEGACY_UNLIMITED_ID) return 'lifetime';
  return null;
}

async function fetchSkus(skus: string[], type: 'inapp' | 'subs'): Promise<unknown[]> {
  const fetcher = iap.fetchProducts ?? iap.getProducts ?? iap.requestProducts;
  if (typeof fetcher !== 'function') return [];
  try {
    const products = await fetcher({ skus, type }).catch(() => fetcher(skus));
    if (Array.isArray(products)) return products;
    if (Array.isArray((products as { products?: unknown[] })?.products)) {
      return (products as { products: unknown[] }).products;
    }
    return [];
  } catch {
    return [];
  }
}

/**
 * Fetch metadata for all three plans. Subscription products and
 * non-consumable products live under different ASC types, so we query
 * each type and merge the results.
 */
export async function fetchAllProducts(): Promise<Record<PlanTier, ProductInfo | null>> {
  const empty: Record<PlanTier, ProductInfo | null> = {
    monthly: null,
    yearly: null,
    lifetime: null,
  };
  if (!iap) return empty;
  await ensureConnection();

  const [subs, inapp] = await Promise.all([
    fetchSkus([PRODUCT_IDS.monthly, PRODUCT_IDS.yearly], 'subs'),
    fetchSkus([PRODUCT_IDS.lifetime], 'inapp'),
  ]);

  const merged: Record<PlanTier, ProductInfo | null> = { ...empty };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  for (const raw of [...subs, ...inapp] as any[]) {
    const id: string | undefined = raw?.productId ?? raw?.id;
    if (!id) continue;
    const tier = tierForId(id);
    if (!tier) continue;
    merged[tier] = {
      id,
      tier,
      priceLabel: raw.displayPrice ?? raw.localizedPrice ?? raw.price ?? '',
      title: raw.title ?? defaultTitle(tier),
      description: raw.description ?? '',
      isSubscription: SUBSCRIPTION_IDS.has(id),
    };
  }
  return merged;
}

function defaultTitle(tier: PlanTier): string {
  if (tier === 'monthly') return 'Pro · Monthly';
  if (tier === 'yearly') return 'Pro · Yearly';
  return 'Pro · Lifetime';
}

export async function purchasePlan(tier: PlanTier): Promise<boolean> {
  if (!iap) {
    throw new Error(
      'In-app purchases are unavailable. Rebuild the app to enable purchases.',
    );
  }
  await ensureConnection();

  const purchaser =
    iap.requestPurchase ?? iap.purchaseProduct ?? iap.buyProduct;
  if (typeof purchaser !== 'function') {
    throw new Error('In-app purchases are unavailable on this device.');
  }

  const sku = PRODUCT_IDS[tier];
  const type: 'inapp' | 'subs' = SUBSCRIPTION_IDS.has(sku) ? 'subs' : 'inapp';

  const modernArgs = {
    request: {
      ios: { sku },
      android: { skus: [sku] },
    },
    type,
  };
  const legacyArgs = { sku, skus: [sku] };

  let result: unknown;
  try {
    result = await purchaser(modernArgs);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (/request|ios|android|shape|invalid/i.test(msg)) {
      result = await purchaser(legacyArgs);
    } else {
      throw e;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const entries: any[] = Array.isArray(result) ? result : [result];
  const success = entries.some(
    (r) => r && (r.productId === sku || r.id === sku),
  );

  if (success) {
    await useEntitlementStore.getState().setUnlocked(true);
    await finalizePendingTransactions();
  }
  return success;
}

/**
 * Check any current entitlement. A user is considered "unlocked" if
 * they hold any active subscription or the lifetime non-consumable,
 * or still have the legacy one-time unlock.
 */
export async function restorePurchases(): Promise<boolean> {
  if (!iap) return false;
  await ensureConnection();
  const getter = iap.getAvailablePurchases ?? iap.getPurchaseHistory;
  if (typeof getter !== 'function') return false;

  try {
    const purchases = await getter();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const list: any[] = Array.isArray(purchases)
      ? purchases
      : purchases?.purchases ?? [];

    const hasEntitlement = list.some((p) => {
      const id: string | undefined = p?.productId ?? p?.id;
      if (!id || !ALL_PRODUCT_IDS.includes(id)) return false;
      // For subscriptions, trust expo-iap's reporting — expired ones
      // don't typically come back from getAvailablePurchases on iOS.
      // A belt-and-suspenders check for an expiresAt in the future:
      const expires = p?.expirationDate ?? p?.expiresDate ?? null;
      if (typeof expires === 'number' && expires < Date.now()) return false;
      return true;
    });

    if (hasEntitlement) {
      await useEntitlementStore.getState().setUnlocked(true);
    }
    await finalizePendingTransactions();
    return hasEntitlement;
  } catch {
    return false;
  }
}

async function finalizePendingTransactions(): Promise<void> {
  if (!iap) return;
  try {
    if (typeof iap.finishTransaction === 'function') {
      const pending =
        typeof iap.getPendingPurchases === 'function'
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
 * then asks StoreKit whether the user still holds any entitlement.
 */
export async function bootstrapIap(): Promise<void> {
  await useEntitlementStore.getState().hydrate();
  try {
    await restorePurchases();
  } catch {
    /* ignore */
  }
}
