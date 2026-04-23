import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EmptyState } from '@/components/EmptyState';
import { ExpiryBadge } from '@/components/ExpiryBadge';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { ProcessingPill } from '@/components/ProcessingPill';
import { ReviewStatusBadge } from '@/components/ReviewStatusBadge';
import { StatusBanner } from '@/components/StatusBanner';
import { CopyLinkButton } from '@/components/CopyLinkButton';
import { useDashboard, type DashboardBuild } from '@/hooks/useDashboard';
import { useBetaGroups } from '@/hooks/useBetaData';
import { isAppLocked, useEntitlement } from '@/hooks/useEntitlement';
import { useCredentialsStore } from '@/store/credentials';
import { theme } from '@/theme';
import { buildLabel, uploadedText } from '@/utils/format';
import type { AscApiError } from '@/api/asc-client';

export default function GlobalDashboardScreen() {
  const creds = useCredentialsStore((s) => s.creds);
  const { unlocked } = useEntitlement();
  const { data, isLoading, isRefetching, refetch, error } = useDashboard();

  const err = error as AscApiError | null;

  // Re-render each minute so relative times stay fresh.
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((x) => x + 1), 60_000);
    return () => clearInterval(id);
  }, []);

  const items = useMemo(() => {
    if (!data) return [];
    if (unlocked) return data.items;
    // Free tier: only show builds for the first app (index 0) so the
    // dashboard remains usable without pushing a purchase.
    const freeAppId = data.apps[0]?.id;
    if (!freeAppId) return [];
    return data.items.filter((item) => item.app.id === freeAppId);
  }, [data, unlocked]);

  if (!creds) {
    return (
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        <Stack.Screen options={{ title: 'Global Dashboard' }} />
        <EmptyState
          icon="key-outline"
          title="Connect your account"
          message="Add your App Store Connect API key to see every build from every app in one ordered list."
          actionLabel="Add API Key"
          onAction={() => router.push('/settings')}
        />
      </SafeAreaView>
    );
  }

  const lockedAppCount = !unlocked
    ? Math.max(0, (data?.apps.length ?? 0) - 1)
    : 0;

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <Stack.Screen
        options={{
          title: 'Global Dashboard',
          headerRight: () => (
            <Pressable
              onPress={() => router.back()}
              hitSlop={12}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
                paddingHorizontal: 8,
              })}
            >
              <Ionicons name="list-outline" size={22} color={theme.color.text} />
            </Pressable>
          ),
        }}
      />
      <View style={styles.content}>
        {err ? <ErrorBanner error={err} /> : null}

        {lockedAppCount > 0 ? (
          <Pressable onPress={() => router.push('/paywall')}>
            <View style={styles.unlockHint}>
              <Ionicons name="lock-closed" size={14} color={theme.color.brand} />
              <Text style={styles.unlockText}>
                {lockedAppCount === 1
                  ? 'Unlock to include 1 more app in this view'
                  : `Unlock to include ${lockedAppCount} more apps in this view`}
              </Text>
            </View>
          </Pressable>
        ) : null}

        {isLoading && !data ? (
          <LoadingSkeleton />
        ) : items.length === 0 ? (
          <EmptyState
            icon="cube-outline"
            title="No active builds"
            message="Once you upload a TestFlight build, it will appear here — sorted by which one expires soonest."
          />
        ) : (
          <FlatList
            data={items}
            keyExtractor={(i) => i.build.id}
            renderItem={({ item }) => <DashboardRow item={item} />}
            refreshControl={
              <RefreshControl
                refreshing={isRefetching}
                onRefresh={refetch}
                tintColor={theme.color.textDim}
              />
            }
            contentContainerStyle={styles.listContent}
            ItemSeparatorComponent={() => <View style={{ height: theme.space.sm }} />}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

function DashboardRow({ item }: { item: DashboardBuild }) {
  const { build, app } = item;
  const groups = useBetaGroups(app.id);
  const publicLink = groups.data?.find(
    (g) => !g.isInternal && g.publicLinkEnabled && g.publicLink,
  )?.publicLink;

  return (
    <Pressable
      onPress={() =>
        router.push({ pathname: '/app/[appId]', params: { appId: app.id } })
      }
      accessibilityRole="button"
      accessibilityLabel={`${app.name} v${build.version} build ${build.buildNumber}`}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.headerRow}>
        <Text style={styles.appName} numberOfLines={1}>
          {app.name}
        </Text>
        <ProcessingPill state={build.processingState} />
      </View>

      <View style={styles.versionRow}>
        <Text style={styles.version}>
          {buildLabel(build.version, build.buildNumber).prefix}{' '}
          <Text style={styles.buildNumber}>
            {buildLabel(build.version, build.buildNumber).suffix}
          </Text>
        </Text>
        <ExpiryBadge expiresAt={build.expiresAt} expired={build.expired} compact />
      </View>

      <Text style={styles.uploaded}>{uploadedText(build.uploadedAt)}</Text>

      <View style={styles.badgesRow}>
        {build.betaReviewState ? (
          <ReviewStatusBadge state={build.betaReviewState} />
        ) : null}
        {build.processingState === 'VALID' && publicLink ? (
          <CopyLinkButton url={publicLink} label="Copy Link" compact />
        ) : null}
      </View>
    </Pressable>
  );
}

function ErrorBanner({ error }: { error: AscApiError }) {
  if (error.code === 'UNAUTHORIZED') {
    return (
      <StatusBanner
        kind="danger"
        message="Your API key was rejected. Check Settings."
        actionLabel="Fix"
        onAction={() => router.push('/settings')}
      />
    );
  }
  if (error.code === 'FORBIDDEN') {
    return (
      <StatusBanner
        kind="danger"
        message="Your API key lacks permission for these requests."
        actionLabel="Settings"
        onAction={() => router.push('/settings')}
      />
    );
  }
  if (error.code === 'RATE_LIMITED') {
    return (
      <StatusBanner
        kind="warning"
        message={`Apple rate-limited the request. Retry in ${error.retryAfterSec ?? 5}s.`}
      />
    );
  }
  if (error.code === 'NETWORK') {
    return <StatusBanner kind="warning" message="Offline — showing cached data." />;
  }
  return <StatusBanner kind="danger" message={error.message || 'Something went wrong.'} />;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.color.bg },
  content: {
    flex: 1,
    paddingHorizontal: theme.space.lg,
    paddingTop: theme.space.md,
  },
  listContent: { paddingBottom: theme.space.xl },
  unlockHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.xs,
    paddingVertical: theme.space.sm,
  },
  unlockText: {
    color: theme.color.brand,
    fontSize: theme.font.sm,
    fontWeight: '600',
  },
  card: {
    backgroundColor: theme.color.card,
    borderRadius: theme.radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.color.border,
    padding: theme.space.lg,
  },
  pressed: { opacity: 0.75 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: theme.space.md,
    marginBottom: theme.space.sm,
  },
  appName: {
    color: theme.color.text,
    fontSize: theme.font.md,
    fontWeight: '700',
    flexShrink: 1,
  },
  versionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: theme.space.md,
  },
  version: {
    color: theme.color.text,
    fontSize: theme.font.md,
    fontWeight: '500',
    flexShrink: 1,
  },
  buildNumber: { color: theme.color.textDim, fontWeight: '400' },
  uploaded: {
    color: theme.color.textDim,
    fontSize: theme.font.sm,
    marginTop: 4,
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.space.sm,
    marginTop: theme.space.sm,
  },
});
