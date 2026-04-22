import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '../theme';
import type { BuildSummary } from '../api/types';
import { uploadedText } from '../utils/format';
import { ExpiryBadge } from './ExpiryBadge';
import { ProcessingPill } from './ProcessingPill';

interface Props {
  build: BuildSummary;
  onPress?: () => void;
}

export function BuildRow({ build, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={`Build ${build.version} (${build.buildNumber})`}
      style={({ pressed }) => [styles.row, pressed && onPress ? styles.pressed : null]}
    >
      <View style={styles.header}>
        <Text style={styles.version}>
          v{build.version}{' '}
          <Text style={styles.buildNumber}>({build.buildNumber})</Text>
        </Text>
        <ProcessingPill state={build.processingState} />
      </View>
      <View style={styles.footer}>
        <Text style={styles.uploaded}>{uploadedText(build.uploadedAt)}</Text>
        <ExpiryBadge
          expiresAt={build.expiresAt}
          expired={build.expired}
          compact
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingVertical: theme.space.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.color.border,
  },
  pressed: {
    opacity: 0.6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: theme.space.md,
  },
  version: {
    color: theme.color.text,
    fontSize: theme.font.md,
    fontWeight: '600',
    flexShrink: 1,
  },
  buildNumber: {
    color: theme.color.textDim,
    fontWeight: '400',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.space.sm,
    gap: theme.space.md,
  },
  uploaded: {
    color: theme.color.textDim,
    fontSize: theme.font.sm,
    flexShrink: 1,
  },
});
