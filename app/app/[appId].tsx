import { Ionicons } from '@expo/vector-icons';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BuildRow } from '@/components/BuildRow';
import { CopyLinkButton } from '@/components/CopyLinkButton';
import { EmptyState } from '@/components/EmptyState';
import { ExpiryBadge } from '@/components/ExpiryBadge';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { ProcessingPill } from '@/components/ProcessingPill';
import { ReviewStatusBadge } from '@/components/ReviewStatusBadge';
import { useApps } from '@/hooks/useApps';
import {
  useAppFeedbackCounts,
  useBetaGroups,
  useCrashFreeRate,
} from '@/hooks/useBetaData';
import { useBuilds, useReviews, useTesterCount } from '@/hooks/useBuilds';
import { useAutoPromote } from '@/hooks/useAutoPromote';
import { useAutoPromoteStore } from '@/store/autoPromote';
import { theme } from '@/theme';
import { absoluteDate, buildLabel } from '@/utils/format';

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
  const groupsQuery = useBetaGroups(appId);
  const feedbackQuery = useAppFeedbackCounts(appId);
  const crashFreeQuery = useCrashFreeRate(latest?.id);

  // Run auto-promote logic in the background for this app.
  useAutoPromote(appId, buildsQuery.data, groupsQuery.data);

  useTick(60_000);

  const refetchAll = () => {
    buildsQuery.refetch();
    reviewsQuery.refetch();
    testerCountQuery.refetch();
    groupsQuery.refetch();
    feedbackQuery.refetch();
    crashFreeQuery.refetch();
  };

  const refreshing =
    buildsQuery.isRefetching ||
    reviewsQuery.isRefetching ||
    testerCountQuery.isRefetching;

  const publicLinkGroup = groupsQuery.data?.find(
    (g) => !g.isInternal && g.publicLinkEnabled && g.publicLink,
  );

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <Stack.Screen options={{ title: app?.name ?? 'App' }} />
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refetchAll}
            tintColor={theme.color.textDim}
          />
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
                {buildLabel(latest.version, latest.buildNumber).prefix}
                <Text style={styles.latestBuildNumber}>
                  {' '}
                  {buildLabel(latest.version, latest.buildNumber).suffix}
                </Text>
              </Text>
              <ProcessingPill state={latest.processingState} />
            </View>
            <Text style={styles.uploadedAbs}>
              Uploaded {absoluteDate(latest.uploadedAt)}
            </Text>
            <View style={{ height: theme.space.md }} />
            <ExpiryBadge expiresAt={latest.expiresAt} expired={latest.expired} />

            {latest.betaReviewState ? (
              <View style={{ marginTop: theme.space.sm }}>
                <ReviewStatusBadge state={latest.betaReviewState} />
              </View>
            ) : null}

            {latest.processingState === 'VALID' && publicLinkGroup?.publicLink ? (
              <View style={{ marginTop: theme.space.md }}>
                <CopyLinkButton url={publicLinkGroup.publicLink} />
              </View>
            ) : null}

            <View style={styles.divider} />
            <View style={styles.statsRow}>
              <StatCell
                icon="people-outline"
                label="Testers"
                value={
                  testerCountQuery.isLoading ? '—' : String(testerCountQuery.data ?? 0)
                }
              />
              <StatCell
                icon="pulse-outline"
                label="Crash-free"
                value={formatCrashFree(crashFreeQuery.data, crashFreeQuery.isLoading)}
              />
            </View>
            <View style={{ height: theme.space.md }} />
            <View style={styles.statsRow}>
              <StatCell
                icon="warning-outline"
                label="Crashes"
                value={
                  feedbackQuery.isLoading ? '—' : String(feedbackQuery.data?.crashes ?? 0)
                }
              />
              <StatCell
                icon="chatbubble-outline"
                label="Feedback"
                value={
                  feedbackQuery.isLoading
                    ? '—'
                    : String(feedbackQuery.data?.screenshots ?? 0)
                }
              />
            </View>
          </View>
        ) : (
          <EmptyState
            icon="cube-outline"
            title="No builds"
            message="Upload a build to TestFlight to see it here."
          />
        )}

        <AutoPromoteCard appId={appId} />

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
            <Pressable
              onPress={() =>
                appId
                  ? router.push({
                      pathname: '/reviews/[appId]',
                      params: { appId },
                    })
                  : null
              }
              accessibilityRole="button"
              accessibilityLabel="See all reviews"
              style={({ pressed }) => [
                styles.sectionRow,
                pressed && { opacity: 0.7 },
              ]}
            >
              <Text style={styles.section}>
                Recent Reviews
                {(() => {
                  const needs = reviewsQuery.data?.filter((r) => !r.response).length ?? 0;
                  return needs > 0 ? (
                    <Text style={styles.sectionAccent}> · {needs} need reply</Text>
                  ) : null;
                })()}
              </Text>
              <Text style={styles.sectionLink}>See all →</Text>
            </Pressable>
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

function AutoPromoteCard({ appId }: { appId: string }) {
  const enabled = useAutoPromoteStore((s) => Boolean(s.byAppId[appId]));
  const setEnabled = useAutoPromoteStore((s) => s.setEnabled);
  const groups = useBetaGroups(appId);

  const internalGroup = groups.data?.find((g) => g.isInternal);
  const disabled = !internalGroup;

  return (
    <View style={styles.toggleCard}>
      <View style={{ flex: 1 }}>
        <Text style={styles.toggleTitle}>Auto-promote to Internal</Text>
        <Text style={styles.toggleSubtitle}>
          {disabled
            ? 'No internal tester group found for this app.'
            : `When a build finishes processing, add it to “${internalGroup?.name ?? 'Internal'}”.`}
        </Text>
      </View>
      <Switch
        value={enabled && !disabled}
        onValueChange={(v) => setEnabled(appId, v)}
        disabled={disabled}
        trackColor={{ true: theme.color.accent, false: '#3A3A46' }}
      />
    </View>
  );
}

function formatCrashFree(value: number | null | undefined, loading: boolean): string {
  if (loading) return '—';
  if (value == null) return '—';
  return `${value.toFixed(1)}%`;
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
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.space.sm,
  },
  sectionAccent: {
    color: theme.color.warn,
    textTransform: 'none',
    letterSpacing: 0,
    fontWeight: '600',
  },
  sectionLink: {
    color: theme.color.brand,
    fontSize: theme.font.sm,
    fontWeight: '600',
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
  toggleCard: {
    backgroundColor: theme.color.card,
    borderRadius: theme.radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.color.border,
    padding: theme.space.lg,
    marginTop: theme.space.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.md,
  },
  toggleTitle: {
    color: theme.color.text,
    fontSize: theme.font.md,
    fontWeight: '600',
  },
  toggleSubtitle: {
    color: theme.color.textDim,
    fontSize: theme.font.sm,
    marginTop: 4,
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
