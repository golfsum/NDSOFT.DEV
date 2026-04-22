import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '../theme';
import type { AppSummary } from '../api/types';
import { ExpiryBadge } from './ExpiryBadge';
import { ProcessingPill } from './ProcessingPill';

interface Props {
  app: AppSummary;
  locked: boolean;
  onPress: () => void;
}

function initials(name: string): string {
  const letters = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join('');
  return letters || '·';
}

export function AppCard({ app, locked, onPress }: Props) {
  const { latestBuild } = app;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={
        locked
          ? `${app.name}. Locked. Tap to unlock.`
          : `${app.name}. Latest build ${latestBuild?.version ?? 'unknown'}.`
      }
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.row}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials(app.name)}</Text>
        </View>

        <View style={styles.meta}>
          <Text style={styles.name} numberOfLines={1}>
            {app.name}
          </Text>
          <Text style={styles.bundle} numberOfLines={1}>
            {app.bundleId || app.sku}
          </Text>
        </View>

        {!locked && latestBuild ? (
          <ProcessingPill state={latestBuild.processingState} />
        ) : null}
      </View>

      {latestBuild ? (
        <View style={styles.buildRow}>
          <Text style={styles.version} numberOfLines={1}>
            v{latestBuild.version}{' '}
            <Text style={styles.buildNumber}>({latestBuild.buildNumber})</Text>
          </Text>
          <ExpiryBadge
            expiresAt={latestBuild.expiresAt}
            expired={latestBuild.expired}
          />
        </View>
      ) : (
        <Text style={styles.noBuild}>No builds uploaded yet</Text>
      )}

      {locked ? (
        <View style={styles.lockOverlay} pointerEvents="none">
          <View style={styles.lockBadge}>
            <Ionicons name="lock-closed" size={14} color={theme.color.text} />
            <Text style={styles.lockText}>Tap to unlock</Text>
          </View>
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.color.card,
    borderRadius: theme.radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.color.border,
    padding: theme.space.lg,
    marginBottom: theme.space.md,
    overflow: 'hidden',
  },
  pressed: {
    opacity: 0.8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.md,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: theme.radius.md,
    backgroundColor: '#2A2A36',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: theme.color.text,
    fontSize: theme.font.lg,
    fontWeight: '700',
  },
  meta: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    color: theme.color.text,
    fontSize: theme.font.lg,
    fontWeight: '600',
  },
  bundle: {
    color: theme.color.textDim,
    fontSize: theme.font.sm,
    marginTop: 2,
  },
  buildRow: {
    marginTop: theme.space.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.space.md,
  },
  version: {
    color: theme.color.text,
    fontSize: theme.font.md,
    fontWeight: '500',
    flexShrink: 1,
  },
  buildNumber: {
    color: theme.color.textDim,
    fontWeight: '400',
  },
  noBuild: {
    marginTop: theme.space.md,
    color: theme.color.textDim,
    fontSize: theme.font.sm,
    fontStyle: 'italic',
  },
  lockOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(11,11,15,0.72)',
  },
  lockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.sm,
    backgroundColor: 'rgba(35,35,48,0.95)',
    paddingHorizontal: theme.space.md,
    paddingVertical: theme.space.sm,
    borderRadius: theme.radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.color.border,
  },
  lockText: {
    color: theme.color.text,
    fontSize: theme.font.sm,
    fontWeight: '600',
  },
});
