import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../theme';
import { classifyExpiry, expiryText, type ExpiryTier } from '../utils/format';

interface Props {
  expiresAt: Date | null;
  expired: boolean;
  compact?: boolean;
}

const TIER_COLORS: Record<ExpiryTier, { fg: string; bg: string }> = {
  healthy: { fg: theme.color.accent, bg: 'rgba(48, 209, 88, 0.14)' },
  dimHealthy: { fg: '#28A745', bg: 'rgba(40, 167, 69, 0.14)' },
  warn: { fg: theme.color.warn, bg: 'rgba(255, 159, 10, 0.16)' },
  danger: { fg: theme.color.danger, bg: 'rgba(255, 69, 58, 0.18)' },
  expired: { fg: theme.color.danger, bg: 'rgba(255, 69, 58, 0.18)' },
};

export function ExpiryBadge({ expiresAt, expired, compact }: Props) {
  const tier = classifyExpiry(expiresAt, expired);
  const label = expiryText(expiresAt, expired);
  const colors = TIER_COLORS[tier];

  return (
    <View
      style={[
        styles.badge,
        compact && styles.compact,
        { backgroundColor: colors.bg },
      ]}
      accessibilityLabel={label}
    >
      <Text
        style={[
          styles.text,
          { color: colors.fg },
          tier === 'expired' && styles.strike,
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: theme.space.md,
    paddingVertical: 5,
    borderRadius: theme.radius.sm,
    alignSelf: 'flex-start',
  },
  compact: {
    paddingHorizontal: theme.space.sm,
    paddingVertical: 3,
  },
  text: {
    fontSize: theme.font.sm,
    fontWeight: '600',
  },
  strike: {
    textDecorationLine: 'line-through',
  },
});
