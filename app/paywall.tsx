import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  fetchAllProducts,
  PurchaseError,
  purchasePlan,
  restorePurchases,
  type PlanTier,
  type ProductInfo,
} from '@/iap/storekit';
import { theme } from '@/theme';

type ProductsMap = Record<PlanTier, ProductInfo | null>;

const FALLBACK_PRICES: Record<PlanTier, string> = {
  monthly: '$2.99',
  yearly: '$19.99',
  lifetime: '$49.99',
};

const PLAN_ORDER: PlanTier[] = ['monthly', 'yearly', 'lifetime'];

export default function PaywallScreen() {
  const [products, setProducts] = useState<ProductsMap | null>(null);
  const [selected, setSelected] = useState<PlanTier>('yearly');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchAllProducts().then((p) => {
      if (!cancelled) setProducts(p);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleBuy = async () => {
    setBusy(true);
    try {
      const ok = await purchasePlan(selected);
      if (ok) router.back();
    } catch (e) {
      // User cancellation is not an error — treat silently.
      if (e instanceof PurchaseError && e.userCancelled) return;
      const msg = e instanceof Error ? e.message : 'Purchase failed.';
      Alert.alert('Purchase', msg);
    } finally {
      setBusy(false);
    }
  };

  const handleRestore = async () => {
    setBusy(true);
    try {
      const ok = await restorePurchases();
      if (ok) {
        router.back();
      } else {
        Alert.alert(
          'Restore Purchases',
          'No active BuildPad Pro subscription or purchase was found on this Apple ID.',
        );
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <Pressable
        style={styles.closeButton}
        onPress={() => router.back()}
        accessibilityLabel="Close"
        accessibilityRole="button"
        hitSlop={12}
      >
        <Ionicons name="close" size={22} color={theme.color.text} />
      </Pressable>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Ionicons name="rocket" size={44} color={theme.color.brand} />
        </View>
        <Text style={styles.title}>BuildPad Pro</Text>
        <Text style={styles.subtitle}>
          Track every TestFlight build across every app. Pick the plan that
          fits.
        </Text>

        <View style={styles.bullets}>
          <Bullet text="Unlimited apps in Global Dashboard" />
          <Bullet text="Live build status, expiry, and review badges" />
          <Bullet text="Public-link quick-share & auto-promote" />
          <Bullet text="Reply to App Store reviews in one tap" />
        </View>

        <View style={styles.plans}>
          {PLAN_ORDER.map((tier) => (
            <PlanCard
              key={tier}
              tier={tier}
              product={products?.[tier] ?? null}
              selected={selected === tier}
              onSelect={() => setSelected(tier)}
            />
          ))}
        </View>

        <Pressable
          onPress={handleBuy}
          disabled={busy}
          accessibilityRole="button"
          accessibilityLabel={`Continue with ${labelFor(selected)}`}
          style={({ pressed }) => [
            styles.buyButton,
            (pressed || busy) && { opacity: 0.7 },
          ]}
        >
          <Text style={styles.buyButtonText}>
            {busy ? 'Please wait…' : `Continue · ${priceFor(selected, products)}`}
          </Text>
        </Pressable>

        <Text style={styles.legal}>
          {legalFor(selected, products)}
        </Text>

        <Pressable
          onPress={handleRestore}
          disabled={busy}
          accessibilityRole="button"
          style={({ pressed }) => [styles.restoreButton, pressed && { opacity: 0.7 }]}
        >
          <Text style={styles.restoreText}>Restore Purchases</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function PlanCard({
  tier,
  product,
  selected,
  onSelect,
}: {
  tier: PlanTier;
  product: ProductInfo | null;
  selected: boolean;
  onSelect: () => void;
}) {
  const price = product?.priceLabel ?? FALLBACK_PRICES[tier];
  const label = labelFor(tier);
  const period = periodFor(tier);
  const badge = badgeFor(tier);

  return (
    <Pressable
      onPress={onSelect}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={`${label}, ${price} ${period ?? ''}`}
      style={[styles.planCard, selected && styles.planCardSelected]}
    >
      {badge ? (
        <View style={styles.planBadge}>
          <Text style={styles.planBadgeText}>{badge}</Text>
        </View>
      ) : null}
      <View style={styles.planHeader}>
        <View
          style={[styles.radio, selected && styles.radioSelected]}
        >
          {selected ? (
            <Ionicons name="checkmark" size={14} color="#fff" />
          ) : null}
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.planLabel}>{label}</Text>
          {period ? <Text style={styles.planPeriod}>{period}</Text> : null}
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={styles.planPrice}>{price}</Text>
          {tier === 'yearly' ? (
            <Text style={styles.planSaving}>Save 44%</Text>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}

function Bullet({ text }: { text: string }) {
  return (
    <View style={styles.bulletRow}>
      <Ionicons name="checkmark-circle" size={18} color={theme.color.accent} />
      <Text style={styles.bulletText}>{text}</Text>
    </View>
  );
}

function labelFor(tier: PlanTier): string {
  if (tier === 'monthly') return 'Monthly';
  if (tier === 'yearly') return 'Yearly';
  return 'Lifetime';
}

function periodFor(tier: PlanTier): string | null {
  if (tier === 'monthly') return 'Billed every month · Cancel anytime';
  if (tier === 'yearly') return 'Billed once a year';
  return 'One-time · Yours forever';
}

function badgeFor(tier: PlanTier): string | null {
  if (tier === 'yearly') return 'Best value';
  if (tier === 'lifetime') return 'No subscription';
  return null;
}

function priceFor(tier: PlanTier, products: ProductsMap | null): string {
  return products?.[tier]?.priceLabel ?? FALLBACK_PRICES[tier];
}

function legalFor(tier: PlanTier, products: ProductsMap | null): string {
  const price = priceFor(tier, products);
  if (tier === 'lifetime') {
    return `One-time ${price} via your Apple ID. Restores on every device signed in with this ID.`;
  }
  if (tier === 'monthly') {
    return `${price} / month. Auto-renews unless cancelled at least 24 hours before the end of the period. Manage in Settings.`;
  }
  return `${price} / year. Auto-renews unless cancelled at least 24 hours before the end of the period. Manage in Settings.`;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.color.bg },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 8,
    zIndex: 1,
  },
  content: {
    paddingHorizontal: theme.space.xl,
    paddingTop: 60,
    paddingBottom: theme.space.xl * 2,
  },
  hero: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(10,132,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: theme.space.lg,
  },
  title: {
    color: theme.color.text,
    fontSize: theme.font.xxl,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    color: theme.color.textDim,
    fontSize: theme.font.md,
    textAlign: 'center',
    marginTop: theme.space.sm,
    lineHeight: 22,
    paddingHorizontal: theme.space.md,
  },
  bullets: {
    marginTop: theme.space.lg,
    gap: theme.space.sm,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.md,
  },
  bulletText: {
    color: theme.color.text,
    fontSize: theme.font.md,
    flex: 1,
  },
  plans: {
    marginTop: theme.space.xl,
    gap: theme.space.sm,
  },
  planCard: {
    padding: theme.space.lg,
    backgroundColor: theme.color.card,
    borderRadius: theme.radius.lg,
    borderWidth: 1.5,
    borderColor: theme.color.border,
    position: 'relative',
  },
  planCardSelected: {
    borderColor: theme.color.brand,
    backgroundColor: 'rgba(10,132,255,0.08)',
  },
  planBadge: {
    position: 'absolute',
    top: -9,
    right: 14,
    backgroundColor: theme.color.brand,
    paddingHorizontal: theme.space.sm,
    paddingVertical: 2,
    borderRadius: 10,
  },
  planBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.md,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: theme.color.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    backgroundColor: theme.color.brand,
    borderColor: theme.color.brand,
  },
  planLabel: {
    color: theme.color.text,
    fontSize: theme.font.md,
    fontWeight: '700',
  },
  planPeriod: {
    color: theme.color.textDim,
    fontSize: 12,
    marginTop: 2,
  },
  planPrice: {
    color: theme.color.text,
    fontSize: theme.font.lg,
    fontWeight: '700',
  },
  planSaving: {
    color: theme.color.accent,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  buyButton: {
    marginTop: theme.space.xl,
    backgroundColor: theme.color.brand,
    paddingVertical: 16,
    borderRadius: theme.radius.md,
    alignItems: 'center',
  },
  buyButtonText: {
    color: theme.color.text,
    fontSize: theme.font.lg,
    fontWeight: '700',
  },
  legal: {
    color: theme.color.textDim,
    fontSize: 11,
    textAlign: 'center',
    marginTop: theme.space.md,
    lineHeight: 16,
    paddingHorizontal: theme.space.sm,
  },
  restoreButton: {
    marginTop: theme.space.sm,
    alignItems: 'center',
    padding: theme.space.sm,
  },
  restoreText: {
    color: theme.color.brand,
    fontSize: theme.font.md,
    fontWeight: '600',
  },
});
