import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../theme';
import type { ProcessingState } from '../api/types';

const LABELS: Record<ProcessingState, string> = {
  PROCESSING: 'Processing',
  FAILED: 'Failed',
  INVALID: 'Invalid',
  VALID: 'Ready',
};

const COLORS: Record<ProcessingState, { fg: string; bg: string }> = {
  PROCESSING: { fg: theme.color.brand, bg: 'rgba(10, 132, 255, 0.16)' },
  FAILED: { fg: theme.color.danger, bg: 'rgba(255, 69, 58, 0.18)' },
  INVALID: { fg: theme.color.danger, bg: 'rgba(255, 69, 58, 0.18)' },
  VALID: { fg: theme.color.accent, bg: 'rgba(48, 209, 88, 0.14)' },
};

interface Props {
  state: ProcessingState;
}

export function ProcessingPill({ state }: Props) {
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
