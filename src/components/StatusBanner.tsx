import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '../theme';

export type BannerKind = 'warning' | 'danger' | 'info';

interface Props {
  kind: BannerKind;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

const COLORS: Record<BannerKind, { bg: string; fg: string; icon: keyof typeof Ionicons.glyphMap }> = {
  warning: { bg: 'rgba(255,159,10,0.16)', fg: theme.color.warn, icon: 'warning-outline' },
  danger: { bg: 'rgba(255,69,58,0.16)', fg: theme.color.danger, icon: 'alert-circle-outline' },
  info: { bg: 'rgba(10,132,255,0.16)', fg: theme.color.brand, icon: 'information-circle-outline' },
};

export function StatusBanner({ kind, message, actionLabel, onAction }: Props) {
  const c = COLORS[kind];
  return (
    <View style={[styles.container, { backgroundColor: c.bg }]}>
      <Ionicons name={c.icon} size={16} color={c.fg} />
      <Text style={[styles.message, { color: c.fg }]} numberOfLines={2}>
        {message}
      </Text>
      {actionLabel && onAction ? (
        <Pressable onPress={onAction} accessibilityRole="button">
          <Text style={[styles.action, { color: c.fg }]}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.sm,
    paddingHorizontal: theme.space.lg,
    paddingVertical: theme.space.sm,
    marginBottom: theme.space.md,
    borderRadius: theme.radius.md,
  },
  message: {
    flex: 1,
    fontSize: theme.font.sm,
    fontWeight: '500',
  },
  action: {
    fontSize: theme.font.sm,
    fontWeight: '700',
  },
});
