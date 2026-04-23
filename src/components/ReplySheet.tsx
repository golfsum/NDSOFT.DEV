import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { theme } from '../theme';
import type { ReviewSummary } from '../api/types';
import {
  useDeleteReviewResponse,
  useSubmitReviewResponse,
} from '../hooks/useReviewResponses';
import { AscApiError } from '../api/asc-client';

/** Apple caps developer responses at 5,970 characters. */
const MAX_BODY = 5970;

interface Props {
  appId: string;
  review: ReviewSummary | null;
  onClose: () => void;
}

export function ReplySheet({ appId, review, onClose }: Props) {
  const visible = review !== null;
  const [body, setBody] = useState('');
  const submit = useSubmitReviewResponse();
  const remove = useDeleteReviewResponse();

  useEffect(() => {
    // Seed the textarea whenever a different review opens.
    if (review) {
      setBody(review.response?.body ?? '');
    }
  }, [review?.id, review?.response?.body, review]);

  if (!review) {
    return <Modal visible={false} transparent />;
  }

  const existing = review.response;
  const busy = submit.isPending || remove.isPending;
  const trimmed = body.trim();
  const unchanged = existing ? trimmed === existing.body.trim() : trimmed.length === 0;

  const onSubmit = async () => {
    if (!trimmed || unchanged) return;
    try {
      await submit.mutateAsync({
        reviewId: review.id,
        existingResponseId: existing?.id,
        body: trimmed,
        appId,
      });
      onClose();
    } catch (e) {
      Alert.alert('Could not post reply', describeError(e));
    }
  };

  const onDelete = async () => {
    if (!existing) return;
    Alert.alert(
      'Delete response?',
      'Your reply will be removed from the App Store.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await remove.mutateAsync({ responseId: existing.id, appId });
              onClose();
            } catch (e) {
              Alert.alert('Could not delete', describeError(e));
            }
          },
        },
      ],
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.root}
      >
        <View style={styles.header}>
          <Pressable onPress={onClose} hitSlop={12} accessibilityLabel="Close">
            <Text style={styles.headerCancel}>Cancel</Text>
          </Pressable>
          <Text style={styles.headerTitle}>
            {existing ? 'Edit reply' : 'Reply'}
          </Text>
          <Pressable
            onPress={onSubmit}
            disabled={busy || !trimmed || unchanged}
            hitSlop={12}
            accessibilityLabel="Post reply"
          >
            {busy ? (
              <ActivityIndicator color={theme.color.brand} />
            ) : (
              <Text
                style={[
                  styles.headerAction,
                  (!trimmed || unchanged) && styles.headerActionDisabled,
                ]}
              >
                {existing ? 'Save' : 'Post'}
              </Text>
            )}
          </Pressable>
        </View>

        <View style={styles.body}>
          <View style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <Stars count={review.rating} />
              <Text style={styles.reviewNickname}>
                {review.nickname}
                {review.territory ? ` · ${review.territory}` : ''}
              </Text>
            </View>
            {review.title ? (
              <Text style={styles.reviewTitle}>{review.title}</Text>
            ) : null}
            <Text style={styles.reviewBody}>{review.body}</Text>
          </View>

          {existing?.state === 'PENDING_PUBLISH' ? (
            <View style={styles.pendingPill}>
              <Ionicons name="time-outline" size={14} color={theme.color.warn} />
              <Text style={styles.pendingText}>Your reply is being published…</Text>
            </View>
          ) : null}

          <TextInput
            style={styles.input}
            multiline
            autoFocus={!existing}
            placeholder="Write a response to this review…"
            placeholderTextColor={theme.color.textDim}
            value={body}
            maxLength={MAX_BODY}
            onChangeText={setBody}
            editable={!busy}
            textAlignVertical="top"
          />
          <View style={styles.footerRow}>
            <Text style={styles.counter}>
              {trimmed.length} / {MAX_BODY}
            </Text>
            {existing ? (
              <Pressable onPress={onDelete} disabled={busy} hitSlop={8}>
                <Text style={styles.deleteText}>Delete reply</Text>
              </Pressable>
            ) : null}
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function describeError(e: unknown): string {
  if (e instanceof AscApiError) {
    if (e.code === 'FORBIDDEN') {
      return 'Your API key lacks permission to respond to reviews. The key needs the App Manager role or higher.';
    }
    if (e.code === 'RATE_LIMITED') {
      return `Apple rate-limited the request. Retry in ${e.retryAfterSec ?? 5}s.`;
    }
    return e.message;
  }
  return e instanceof Error ? e.message : 'Something went wrong.';
}

function Stars({ count }: { count: number }) {
  const n = Math.max(0, Math.min(5, Math.round(count)));
  return (
    <View style={{ flexDirection: 'row', gap: 2 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Ionicons
          key={i}
          name={i <= n ? 'star' : 'star-outline'}
          size={14}
          color={theme.color.warn}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.color.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.space.lg,
    paddingVertical: theme.space.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.color.border,
  },
  headerTitle: {
    color: theme.color.text,
    fontSize: theme.font.md,
    fontWeight: '700',
  },
  headerCancel: {
    color: theme.color.textDim,
    fontSize: theme.font.md,
  },
  headerAction: {
    color: theme.color.brand,
    fontSize: theme.font.md,
    fontWeight: '600',
  },
  headerActionDisabled: {
    opacity: 0.4,
  },
  body: {
    flex: 1,
    padding: theme.space.lg,
    gap: theme.space.md,
  },
  reviewCard: {
    backgroundColor: theme.color.card,
    borderRadius: theme.radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.color.border,
    padding: theme.space.md,
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
    marginTop: theme.space.xs,
  },
  reviewBody: {
    color: theme.color.textDim,
    fontSize: theme.font.sm,
    marginTop: theme.space.xs,
    lineHeight: 20,
  },
  pendingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.xs,
    paddingHorizontal: theme.space.md,
    paddingVertical: theme.space.sm,
    borderRadius: theme.radius.md,
    backgroundColor: 'rgba(255, 159, 10, 0.14)',
    alignSelf: 'flex-start',
  },
  pendingText: {
    color: theme.color.warn,
    fontSize: theme.font.sm,
    fontWeight: '600',
  },
  input: {
    flex: 1,
    backgroundColor: theme.color.card,
    borderRadius: theme.radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.color.border,
    padding: theme.space.md,
    color: theme.color.text,
    fontSize: theme.font.md,
    lineHeight: 22,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  counter: {
    color: theme.color.textDim,
    fontSize: theme.font.sm,
  },
  deleteText: {
    color: theme.color.danger,
    fontSize: theme.font.sm,
    fontWeight: '600',
  },
});
