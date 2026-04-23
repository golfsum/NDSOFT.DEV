import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../theme';
import type { BetaReviewState } from '../api/types';

const LABELS: Record<BetaReviewState, string> = {
  WAITING_FOR_REVIEW: 'Waiting for Review',
  IN_REVIEW: 'In Beta Review',
  APPROVED: 'Beta Approved',
  REJECTED: 'Beta Rejected',
};

const COLORS: Record<BetaReviewState, { fg: string; bg: string }> = {
  WAITING_FOR_REVIEW: { fg: theme.color.warn, bg: 'rgba(255, 159, 10, 0.16)' },
  IN_REVIEW: { fg: theme.color.brand, bg: 'rgba(10, 132, 255, 0.16)' },
  APPROVED: { fg: theme.color.accent, bg: 'rgba(48, 209, 88, 0.14)' },
  REJECTED: { fg: theme.color.danger, bg: 'rgba(255, 69, 58, 0.18)' },
};

interface Props {
  state: BetaReviewState;
}

export function ReviewStatusBadge({ state }: Props) {
  const c = COLORS[state];
  return (
    <View style={[styles.pill, { backgroundColor: c.bg }]}>
      <Text style={[styles.text, { color: c.fg }]}>{LABELS[state]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: theme.space.sm,
    paddingVertical: 3,
    borderRadius: theme.radius.sm,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
});
