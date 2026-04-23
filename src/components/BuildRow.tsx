import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '../theme';
import type { BuildSummary } from '../api/types';
import { buildLabel, uploadedText } from '../utils/format';
import { ExpiryBadge } from './ExpiryBadge';
import { ProcessingPill } from './ProcessingPill';
import { ReviewStatusBadge } from './ReviewStatusBadge';
import { useBetaFeedbackCounts } from '../hooks/useBetaData';

interface Props {
  build: BuildSummary;
  onPress?: () => void;
  /** When true, skip the feedback-count fetch to avoid N+1 on long lists. */
  compact?: boolean;
}

export function BuildRow({ build, onPress, compact }: Props) {
  const feedback = useBetaFeedbackCounts(compact ? undefined : build.id);
  const totalFeedback =
    (feedback.data?.crashes ?? 0) + (feedback.data?.screenshots ?? 0);

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={`Build ${build.version} (${build.buildNumber})`}
      style={({ pressed }) => [styles.row, pressed && onPress ? styles.pressed : null]}
    >
      <View style={styles.header}>
        <Text style={styles.version}>
          {buildLabel(build.version, build.buildNumber).prefix}{' '}
          <Text style={styles.buildNumber}>
            {buildLabel(build.version, build.buildNumber).suffix}
          </Text>
        </Text>
        <ProcessingPill state={build.processingState} />
      </View>

      {build.betaReviewState ? (
        <View style={{ marginTop: theme.space.sm }}>
          <ReviewStatusBadge state={build.betaReviewState} />
        </View>
      ) : null}

      <View style={styles.footer}>
        <Text style={styles.uploaded}>{uploadedText(build.uploadedAt)}</Text>
        <View style={styles.footerRight}>
          {!compact && totalFeedback > 0 ? (
            <View style={styles.feedbackChip}>
              <Ionicons
                name="chatbubble-ellipses"
                size={12}
                color={theme.color.brand}
              />
              <Text style={styles.feedbackText}>{totalFeedback}</Text>
            </View>
          ) : null}
          <ExpiryBadge
            expiresAt={build.expiresAt}
            expired={build.expired}
            compact
          />
        </View>
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
  footerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.sm,
  },
  uploaded: {
    color: theme.color.textDim,
    fontSize: theme.font.sm,
    flexShrink: 1,
  },
  feedbackChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: theme.space.sm,
    paddingVertical: 2,
    borderRadius: theme.radius.sm,
    backgroundColor: 'rgba(10, 132, 255, 0.14)',
  },
  feedbackText: {
    color: theme.color.brand,
    fontSize: 12,
    fontWeight: '600',
  },
});
