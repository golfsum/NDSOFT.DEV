import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import React from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppCard } from '@/components/AppCard';
import { EmptyState } from '@/components/EmptyState';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { StatusBanner } from '@/components/StatusBanner';
import { useApps } from '@/hooks/useApps';
import { isAppLocked, useEntitlement } from '@/hooks/useEntitlement';
import { useCredentialsStore } from '@/store/credentials';
import { theme } from '@/theme';
import type { AscApiError } from '@/api/asc-client';
import type { AppSummary } from '@/api/types';

export default function DashboardScreen() {
  const creds = useCredentialsStore((s) => s.creds);
  const credsLoaded = useCredentialsStore((s) => s.loaded);
  const { unlocked } = useEntitlement();
  const { data, isLoading, isRefetching, refetch, error } = useApps();

  const hasCreds = !!creds;
  const err = error as AscApiError | null;

  const renderItem = ({ item, index }: { item: AppSummary; index: number }) => {
    const locked = isAppLocked(index, unlocked);
    return (
      <AppCard
        app={item}
        locked={locked}
        onPress={() => {
          if (locked) {
            router.push('/paywall');
          } else {
            router.push({ pathname: '/app/[appId]', params: { appId: item.id } });
          }
        }}
      />
    );
  };

  if (!credsLoaded) {
    return (
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        <Stack.Screen
          options={{
            headerRight: () => <GearButton />,
          }}
        />
        <View style={styles.content}>
          <LoadingSkeleton />
        </View>
      </SafeAreaView>
    );
  }

  if (!hasCreds) {
    return (
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        <Stack.Screen options={{ headerRight: () => <GearButton /> }} />
        <EmptyState
          icon="key-outline"
          title="Connect your account"
          message="Add your App Store Connect API key to see every app and every TestFlight build in one place."
          actionLabel="Add API Key"
          onAction={() => router.push('/settings')}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <Stack.Screen options={{ headerRight: () => <GearButton /> }} />
      <View style={styles.content}>
        {err ? <ErrorBanner error={err} /> : null}

        {isLoading && !data ? (
          <LoadingSkeleton />
        ) : data && data.length === 0 ? (
          <EmptyState
            icon="cube-outline"
            title="No apps found"
            message="Your App Store Connect account doesn't have any apps yet. When you add one, it will show up here."
          />
        ) : (
          <FlatList
            data={data ?? []}
            keyExtractor={(a) => a.id}
            renderItem={renderItem}
            refreshControl={
              <RefreshControl
                refreshing={isRefetching}
                onRefresh={refetch}
                tintColor={theme.color.textDim}
              />
            }
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

function GearButton() {
  return (
    <Pressable
      onPress={() => router.push('/settings')}
      accessibilityLabel="Open settings"
      accessibilityRole="button"
      hitSlop={12}
      style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1, paddingHorizontal: 8 })}
    >
      <Ionicons name="settings-outline" size={22} color={theme.color.text} />
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
  safe: {
    flex: 1,
    backgroundColor: theme.color.bg,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.space.lg,
    paddingTop: theme.space.md,
  },
  listContent: {
    paddingBottom: theme.space.xl,
  },
});
