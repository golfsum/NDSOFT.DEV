/**
 * BuildPad's IAP layer, powered by RevenueCat.
 *
 * RevenueCat is the source of truth for the "Pro" entitlement. The
 * local Zustand entitlement store is kept in sync from
 * `customerInfoUpdateListener` so UI renders synchronously, but any
 * authoritative question ("is this user actually unlocked?") is
 * answered by RC.
 *
 * File name is kept as `storekit.ts` so existing imports don't break.
 */
import Constants from 'expo-constants';
import { useEntitlementStore } from '../store/entitlement';

// Lazy-require RevenueCat so that a JS bundle running against a dev
// binary without the native module doesn't crash the whole app. When
// absent, every call gracefully no-ops.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let Purchases: any = null;
let PurchasesErrorModule: unknown = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const mod = require('react-native-purchases');
  Purchases = mod.default ?? mod;
  PurchasesErrorModule = mod;
} catch (e) {
  const msg = e instanceof Error ? e.message : String(e);
  console.warn(
    '[storekit] react-native-purchases unavailable — rebuild the app (`npx expo run:ios`) to enable purchases. Detail:',
    msg,
  );
}

// -- Public types (stable across the expo-iap → RevenueCat swap) -----------

export type PlanTier = 'monthly' | 'yearly' | 'lifetime';

export interface ProductInfo {
  id: string;
  tier: PlanTier;
  priceLabel: string;
  title: string;
  description: string;
  isSubscription: boolean;
}

/** Entitlement identifier — must match what you configure in RC dashboard. */
export const PRO_ENTITLEMENT = 'Pro';

// -- Internals -------------------------------------------------------------

let configured = false;
let configuring: Promise<void> | null = null;

function apiKey(): string | null {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const extra = (Constants.expoConfig?.extra ?? {}) as Record<string, any>;
  const key = extra.revenueCatIosKey;
  return typeof key === 'string' && key.length > 0 ? key : null;
}

export function isIapAvailable(): boolean {
  return Purchases != null && apiKey() != null;
}

async function configurePurchases(): Promise<void> {
  if (configured) return;
  if (configuring) return configuring;
  if (!Purchases) return;
  const key = apiKey();
  if (!key) {
    console.warn('[storekit] no RevenueCat iOS API key found in app.json extra.revenueCatIosKey');
    return;
  }

  configuring = (async () => {
    try {
      if (typeof Purchases.setLogLevel === 'function' && Purchases.LOG_LEVEL) {
        Purchases.setLogLevel(
          __DEV__ ? Purchases.LOG_LEVEL.DEBUG : Purchases.LOG_LEVEL.WARN,
        );
      }
      await Purchases.configure({ apiKey: key });
      configured = true;
    } catch (e) {
      console.warn('[storekit] Purchases.configure failed:', e);
    } finally {
      configuring = null;
    }
  })();

  return configuring;
}

function tierForPackage(pkg: {
  identifier?: string;
  product?: { identifier?: string };
}): PlanTier | null {
  // Prefer RevenueCat's standard package identifiers when present.
  const id = pkg.identifier ?? '';
  if (id === '$rc_monthly') return 'monthly';
  if (id === '$rc_annual') return 'yearly';
  if (id === '$rc_lifetime') return 'lifetime';

  // Fall back to sniffing the product identifier string.
  const prod = (pkg.product?.identifier ?? '').toLowerCase();
  if (prod.includes('lifetime')) return 'lifetime';
  if (prod.includes('annual') || prod.includes('yearly')) return 'yearly';
  if (prod.includes('monthly')) return 'monthly';
  return null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function pkgToProductInfo(pkg: any): ProductInfo | null {
  const tier = tierForPackage(pkg);
  if (!tier) return null;
  const product = pkg.product ?? {};
  return {
    id: product.identifier ?? pkg.identifier ?? '',
    tier,
    priceLabel: product.priceString ?? '',
    title: product.title ?? defaultTitle(tier),
    description: product.description ?? '',
    isSubscription: tier !== 'lifetime',
  };
}

function defaultTitle(tier: PlanTier): string {
  if (tier === 'monthly') return 'Pro · Monthly';
  if (tier === 'yearly') return 'Pro · Yearly';
  return 'Pro · Lifetime';
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setUnlockedFromCustomerInfo(info: any): void {
  const active = info?.entitlements?.active ?? {};
  const unlocked = Boolean(active[PRO_ENTITLEMENT]);
  useEntitlementStore.getState().setUnlocked(unlocked);
}

// -- Public API ------------------------------------------------------------

/** Called once at app launch. Safe to re-call. */
export async function bootstrapIap(): Promise<void> {
  await useEntitlementStore.getState().hydrate();
  if (!Purchases) return;
  await configurePurchases();
  if (!configured) return;

  // Sync local entitlement state from RC once, then keep it in sync.
  try {
    const info = await Purchases.getCustomerInfo();
    setUnlockedFromCustomerInfo(info);
  } catch (e) {
    console.warn('[storekit] getCustomerInfo failed at bootstrap:', e);
  }

  if (typeof Purchases.addCustomerInfoUpdateListener === 'function') {
    // Idempotent: RC dedupes listeners by reference, and this module is
    // evaluated once so we attach at most one listener.
    Purchases.addCustomerInfoUpdateListener(setUnlockedFromCustomerInfo);
  }
}

export async function fetchAllProducts(): Promise<Record<PlanTier, ProductInfo | null>> {
  const empty: Record<PlanTier, ProductInfo | null> = {
    monthly: null,
    yearly: null,
    lifetime: null,
  };
  if (!Purchases) return empty;
  if (!configured) await configurePurchases();
  if (!configured) return empty;

  try {
    const offerings = await Purchases.getOfferings();
    const current = offerings?.current;
    if (!current) return empty;
    const out = { ...empty };
    for (const pkg of current.availablePackages ?? []) {
      const info = pkgToProductInfo(pkg);
      if (info) out[info.tier] = info;
    }
    return out;
  } catch (e) {
    console.warn('[storekit] getOfferings failed:', e);
    return empty;
  }
}

export class PurchaseError extends Error {
  readonly userCancelled: boolean;
  constructor(message: string, userCancelled = false) {
    super(message);
    this.name = 'PurchaseError';
    this.userCancelled = userCancelled;
  }
}

export async function purchasePlan(tier: PlanTier): Promise<boolean> {
  if (!Purchases) {
    throw new PurchaseError(
      'In-app purchases are unavailable. Rebuild the app (`npx expo run:ios`) to enable.',
    );
  }
  if (!configured) await configurePurchases();
  if (!configured) {
    throw new PurchaseError('RevenueCat is not configured. Check your API key.');
  }

  const offerings = await Purchases.getOfferings();
  const current = offerings?.current;
  if (!current) throw new PurchaseError('No offering is currently available.');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pkg = (current.availablePackages ?? []).find((p: any) => tierForPackage(p) === tier);
  if (!pkg) {
    throw new PurchaseError(`The ${tier} plan is not available right now.`);
  }

  try {
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    setUnlockedFromCustomerInfo(customerInfo);
    return Boolean(customerInfo?.entitlements?.active?.[PRO_ENTITLEMENT]);
  } catch (e) {
    // RC surfaces cancellation as a property on the thrown error.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const err = e as any;
    if (err?.userCancelled === true) {
      throw new PurchaseError('Purchase cancelled.', true);
    }
    const msg = err?.message ?? 'Purchase failed.';
    throw new PurchaseError(msg, false);
  }
}

export async function restorePurchases(): Promise<boolean> {
  if (!Purchases) return false;
  if (!configured) await configurePurchases();
  if (!configured) return false;
  try {
    const info = await Purchases.restorePurchases();
    setUnlockedFromCustomerInfo(info);
    return Boolean(info?.entitlements?.active?.[PRO_ENTITLEMENT]);
  } catch (e) {
    console.warn('[storekit] restorePurchases failed:', e);
    return false;
  }
}

// Re-export for callers that may want to introspect error types directly.
export { PurchasesErrorModule as _RawPurchasesModule };
