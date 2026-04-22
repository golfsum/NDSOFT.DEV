import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BuildRow } from '@/components/BuildRow';
import { EmptyState } from '@/components/EmptyState';
import { ExpiryBadge } from '@/components/ExpiryBadge';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { ProcessingPill } from '@/components/ProcessingPill';
import { useApps } from '@/hooks/useApps';
import { useBuilds, useReviews, useTesterCount } from '@/hooks/useBuilds';
import { theme } from '@/theme';
import { absoluteDate } from '@/utils/format';

function useTick(intervalMs: number) {
  const [, setN] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setN((x) => x + 1), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
}

export default function AppDetailScreen() {
  const { appId } = useLocalSearchParams<{ appId: string }>();
  const appsQuery = useApps();
  const app = appsQuery.data?.find((a) => a.id === appId);

  const buildsQuery = useBuilds(appId);
  const reviewsQuery = useReviews(appId);
  const latest = buildsQuery.data?.[0];
  const testerCountQuery = useTesterCount(latest?.id);

  // Re-render once a minute so the expiry countdown stays fresh.
  useTick(60_000);

  const refetchAll = () => {
    buildsQuery.refetch();
    reviewsQuery.refetch();
    testerCountQuery.refetch();
  };

  const refreshing =
    buildsQuery.isRefetching || reviewsQuery.isRefetching || testerCountQuery.isRefetching;

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <Stack.Screen options={{ title: app?.name ?? 'App' }} />
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refetchAll} tintColor={theme.color.textDim} />
        }
      >
        {app ? (
          <View style={styles.meta}>
            <Text style={styles.bundleLabel}>Bundle ID</Text>
            <Text style={styles.bundle} numberOfLines={1}>
              {app.bundleId}
            </Text>
          </View>
        ) : null}

        <Text style={styles.section}>Latest Build</Text>

        {buildsQuery.isLoading && !latest ? (
          <LoadingSkeleton />
        ) : latest ? (
          <View style={styles.latestCard}>
            <View style={styles.latestHeader}>
              <Text style={styles.latestVersion}>
                v{latest.version}
                <Text style={styles.latestBuildNumber}> ({latest.buildNumber})</Text>
              </Text>
              <ProcessingPill state={latest.processingState} />
            </View>
            <Text style={styles.uploadedAbs}>
              Uploaded {absoluteDate(latest.uploadedAt)}
            </Text>
            <View style={{ height: theme.space.md }} />
            <ExpiryBadge expiresAt={latest.expiresAt} expired={latest.expired} />
            <View style={styles.divider} />
            <View style={styles.statsRow}>
              <StatCell
                icon="people-outline"
                label="Testers"
                value={
                  testerCountQuery.isLoading
                    ? '—'
                    : String(testerCountQuery.data ?? 0)
                }
              />
              <StatCell
                icon="time-outline"
                label="Status"
                value={
                  latest.processingState === 'VALID'
                    ? 'Ready'
                    : latest.processingState.charAt(0) + latest.processingState.slice(1).toLowerCase()
                }
              />
            </View>
          </View>
        ) : (
          <EmptyState icon="cube-outline" title="No builds" message="Upload a build to TestFlight to see it here." />
        )}

        {buildsQuery.data && buildsQuery.data.length > 1 ? (
          <>
            <Text style={styles.section}>Recent Builds</Text>
            <View style={styles.listCard}>
              {buildsQuery.data.slice(1, 11).map((b) => (
                <BuildRow key={b.id} build={b} />
              ))}
            </View>
          </>
        ) : null}

        {reviewsQuery.data && reviewsQuery.data.length > 0 ? (
          <>
            <Text style={styles.section}>Recent Reviews</Text>
            <View style={styles.listCard}>
              {reviewsQuery.data.map((r) => (
                <View key={r.id} style={styles.reviewRow}>
                  <View style={styles.reviewHeader}>
                    <Stars count={r.rating} />
                    <Text style={styles.reviewNickname}>{r.nickname}</Text>
                  </View>
                  {r.title ? <Text style={styles.reviewTitle}>{r.title}</Text> : null}
                  <Text style={styles.reviewBody} numberOfLines={2}>
                    {r.body.slice(0, 80)}
                    {r.body.length > 80 ? '…' : ''}
                  </Text>
                </View>
              ))}
            </View>
          </>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

function StatCell({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.statCell}>
      <Ionicons name={icon} size={16} color={theme.color.textDim} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function Stars({ count }: { count: number }) {
  const n = Math.max(0, Math.min(5, Math.round(count)));
  return (
    <View style={{ flexDirection: 'row', gap: 2 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Ionicons
          key={i}
          name={i <= n ? 'star' : 'star-outline'}
          size={12}
          color={theme.color.warn}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.color.bg },
  content: {
    padding: theme.space.lg,
    paddingBottom: theme.space.xl * 2,
  },
  meta: {
    marginBottom: theme.space.lg,
  },
  bundleLabel: {
    color: theme.color.textDim,
    fontSize: theme.font.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  bundle: {
    color: theme.color.text,
    fontSize: theme.font.md,
    marginTop: 2,
    fontFamily: 'monospace',
  },
  section: {
    color: theme.color.textDim,
    fontSize: theme.font.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: theme.space.lg,
    marginBottom: theme.space.sm,
  },
  latestCard: {
    backgroundColor: theme.color.card,
    borderRadius: theme.radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.color.border,
    padding: theme.space.lg,
  },
  latestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.space.sm,
    gap: theme.space.md,
  },
  latestVersion: {
    color: theme.color.text,
    fontSize: theme.font.xl,
    fontWeight: '700',
    flexShrink: 1,
  },
  latestBuildNumber: {
    color: theme.color.textDim,
    fontSize: theme.font.md,
    fontWeight: '400',
  },
  uploadedAbs: {
    color: theme.color.textDim,
    fontSize: theme.font.sm,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: theme.color.border,
    marginVertical: theme.space.lg,
  },
  statsRow: {
    flexDirection: 'row',
    gap: theme.space.xl,
  },
  statCell: {
    flex: 1,
  },
  statValue: {
    color: theme.color.text,
    fontSize: theme.font.xl,
    fontWeight: '700',
    marginTop: 4,
  },
  statLabel: {
    color: theme.color.textDim,
    fontSize: theme.font.sm,
    marginTop: 2,
  },
  listCard: {
    backgroundColor: theme.color.card,
    borderRadius: theme.radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.color.border,
    paddingHorizontal: theme.space.lg,
  },
  reviewRow: {
    paddingVertical: theme.space.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.color.border,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.sm,
  },
  reviewNickname: {
    color: theme.color.textDim,
    fontSize: theme.font.sm,
  },
  reviewTitle: {
    color: theme.color.text,
    fontSize: theme.font.md,
    fontWeight: '600',
    marginTop: 4,
  },
  reviewBody: {
    color: theme.color.textDim,
    fontSize: theme.font.sm,
    marginTop: 2,
  },
});
