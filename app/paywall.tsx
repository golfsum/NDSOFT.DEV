import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fetchUnlimitedProduct, purchaseUnlimited, restorePurchases, type ProductInfo } from '@/iap/storekit';
import { theme } from '@/theme';

export default function PaywallScreen() {
  const [product, setProduct] = useState<ProductInfo | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchUnlimitedProduct().then((p) => {
      if (!cancelled) setProduct(p);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleBuy = async () => {
    setBusy(true);
    try {
      const ok = await purchaseUnlimited();
      if (ok) {
        router.back();
      }
    } catch (e) {
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
        Alert.alert('Restore Purchases', 'No prior purchase was found on this Apple ID.');
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

      <View style={styles.content}>
        <View style={styles.hero}>
          <Ionicons name="rocket" size={44} color={theme.color.brand} />
        </View>
        <Text style={styles.title}>Track all your apps</Text>
        <Text style={styles.subtitle}>
          See every TestFlight build across your whole portfolio.
        </Text>

        <View style={styles.bullets}>
          <Bullet text="Live build status and expiry countdowns" />
          <Bullet text="Tester counts across every app" />
          <Bullet text="Processing state the moment a build uploads" />
        </View>

        <View style={styles.priceBox}>
          <Text style={styles.priceLabel}>Unlimited Apps</Text>
          <Text style={styles.priceValue}>
            {product?.priceLabel ?? '$2.99'}
          </Text>
          <Text style={styles.priceHint}>One-time purchase · No subscription</Text>
        </View>

        <Pressable
          onPress={handleBuy}
          disabled={busy}
          accessibilityRole="button"
          accessibilityLabel="Buy unlimited apps"
          style={({ pressed }) => [
            styles.buyButton,
            (pressed || busy) && { opacity: 0.7 },
          ]}
        >
          <Text style={styles.buyButtonText}>
            {busy ? 'Please wait…' : `Unlock${product ? ` for ${product.priceLabel}` : ''}`}
          </Text>
        </Pressable>

        <Pressable
          onPress={handleRestore}
          disabled={busy}
          accessibilityRole="button"
          style={({ pressed }) => [styles.restoreButton, pressed && { opacity: 0.7 }]}
        >
          <Text style={styles.restoreText}>Restore Purchases</Text>
        </Pressable>
      </View>
    </SafeAreaView>
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
    flex: 1,
    paddingHorizontal: theme.space.xl,
    paddingTop: 60,
    paddingBottom: theme.space.xl,
  },
  hero: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(10,132,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: theme.space.xl,
  },
  title: {
    color: theme.color.text,
    fontSize: theme.font.xxl,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    color: theme.color.textDim,
    fontSize: theme.font.lg,
    textAlign: 'center',
    marginTop: theme.space.sm,
    lineHeight: 24,
  },
  bullets: {
    marginTop: theme.space.xl,
    gap: theme.space.md,
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
  priceBox: {
    marginTop: theme.space.xl,
    padding: theme.space.lg,
    backgroundColor: theme.color.card,
    borderRadius: theme.radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.color.border,
    alignItems: 'center',
  },
  priceLabel: {
    color: theme.color.textDim,
    fontSize: theme.font.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  priceValue: {
    color: theme.color.text,
    fontSize: 36,
    fontWeight: '800',
    marginTop: 4,
  },
  priceHint: {
    color: theme.color.textDim,
    fontSize: theme.font.sm,
    marginTop: 4,
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
  restoreButton: {
    marginTop: theme.space.md,
    alignItems: 'center',
    padding: theme.space.sm,
  },
  restoreText: {
    color: theme.color.brand,
    fontSize: theme.font.md,
    fontWeight: '600',
  },
});
