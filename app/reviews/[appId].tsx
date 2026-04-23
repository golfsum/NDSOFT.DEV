import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useMemo, useState } from 'react';
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
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { ReplySheet } from '@/components/ReplySheet';
import { StatusBanner } from '@/components/StatusBanner';
import { useApps } from '@/hooks/useApps';
import { useAllReviews } from '@/hooks/useReviewResponses';
import { theme } from '@/theme';
import { formatDistanceToNowStrict } from 'date-fns';
import type { ReviewSummary } from '@/api/types';
import type { AscApiError } from '@/api/asc-client';

type Filter = 'all' | 'needsReply' | 'replied';

export default function ReviewsScreen() {
  const { appId } = useLocalSearchParams<{ appId: string }>();
  const appsQuery = useApps();
  const app = appsQuery.data?.find((a) => a.id === appId);

  const reviews = useAllReviews(appId);
  const err = reviews.error as AscApiError | null;

  const [filter, setFilter] = useState<Filter>('all');
  const [activeReview, setActiveReview] = useState<ReviewSummary | null>(null);

  const filtered = useMemo(() => {
    const data = reviews.data ?? [];
    if (filter === 'needsReply') return data.filter((r) => !r.response);
    if (filter === 'replied') return data.filter((r) => r.response);
    return data;
  }, [reviews.data, filter]);

  const needsReplyCount = reviews.data?.filter((r) => !r.response).length ?? 0;
  const repliedCount = (reviews.data?.length ?? 0) - needsReplyCount;

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <Stack.Screen options={{ title: app ? `${app.name} Reviews` : 'Reviews' }} />
      <View style={styles.content}>
        {err ? <ErrorBanner error={err} /> : null}

        <View style={styles.tabs}>
          <FilterTab
            label={`All${reviews.data ? ` (${reviews.data.length})` : ''}`}
            active={filter === 'all'}
            onPress={() => setFilter('all')}
          />
          <FilterTab
            label={`Needs reply${needsReplyCount ? ` (${needsReplyCount})` : ''}`}
            active={filter === 'needsReply'}
            onPress={() => setFilter('needsReply')}
            accent={needsReplyCount > 0}
          />
          <FilterTab
            label={`Replied${repliedCount ? ` (${repliedCount})` : ''}`}
            active={filter === 'replied'}
            onPress={() => setFilter('replied')}
          />
        </View>

        {reviews.isLoading && !reviews.data ? (
          <LoadingSkeleton />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon="chatbubble-outline"
            title={
              filter === 'needsReply'
                ? 'Inbox zero'
                : filter === 'replied'
                ? 'No replies yet'
                : 'No reviews yet'
            }
            message={
              filter === 'needsReply'
                ? "Every review has a reply. Nice work."
                : filter === 'replied'
                ? "You haven't responded to any reviews yet."
                : 'When users leave reviews, they\u2019ll appear here.'
            }
          />
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(r) => r.id}
            renderItem={({ item }) => (
              <ReviewCard review={item} onPress={() => setActiveReview(item)} />
            )}
            refreshControl={
              <RefreshControl
                refreshing={reviews.isRefetching}
                onRefresh={reviews.refetch}
                tintColor={theme.color.textDim}
              />
            }
            ItemSeparatorComponent={() => <View style={{ height: theme.space.sm }} />}
            contentContainerStyle={{ paddingBottom: theme.space.xl }}
          />
        )}
      </View>

      <ReplySheet
        appId={appId ?? ''}
        review={activeReview}
        onClose={() => setActiveReview(null)}
      />
    </SafeAreaView>
  );
}

function FilterTab({
  label,
  active,
  onPress,
  accent,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  accent?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.tab,
        active && styles.tabActive,
        pressed && { opacity: 0.7 },
      ]}
    >
      <Text
        style={[
          styles.tabText,
          active && styles.tabTextActive,
          accent && !active && { color: theme.color.warn },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function ReviewCard({
  review,
  onPress,
}: {
  review: ReviewSummary;
  onPress: () => void;
}) {
  const hasResponse = !!review.response;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${review.rating} stars by ${review.nickname}. ${
        hasResponse ? 'Replied.' : 'Needs reply.'
      }`}
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.75 }]}
    >
      <View style={styles.cardHeader}>
        <Stars count={review.rating} />
        <Text style={styles.nickname}>
          {review.nickname}
          {review.territory ? ` · ${review.territory}` : ''}
        </Text>
        <Text style={styles.time}>
          {formatDistanceToNowStrict(review.createdAt, { addSuffix: true })}
        </Text>
      </View>

      {review.title ? <Text style={styles.title}>{review.title}</Text> : null}
      <Text style={styles.body} numberOfLines={3}>
        {review.body}
      </Text>

      {hasResponse ? (
        <View style={styles.responseBlock}>
          <View style={styles.responseHeader}>
            <Ionicons name="arrow-undo" size={14} color={theme.color.accent} />
            <Text style={styles.responseLabel}>Your reply</Text>
            {review.response?.state === 'PENDING_PUBLISH' ? (
              <Text style={styles.pendingText}>· publishing</Text>
            ) : null}
          </View>
          <Text style={styles.responseBody} numberOfLines={3}>
            {review.response?.body}
          </Text>
        </View>
      ) : (
        <View style={styles.replyChip}>
          <Ionicons name="arrow-undo-outline" size={14} color={theme.color.brand} />
          <Text style={styles.replyChipText}>Reply</Text>
        </View>
      )}
    </Pressable>
  );
}

function ErrorBanner({ error }: { error: AscApiError }) {
  if (error.code === 'FORBIDDEN') {
    return (
      <StatusBanner
        kind="danger"
        message="Your API key can't read reviews. Needs App Manager role or higher."
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
  return <StatusBanner kind="danger" message={error.message || 'Something went wrong.'} />;
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
  safe: { flex: 1, backgroundColor: theme.color.bg },
  content: {
    flex: 1,
    paddingHorizontal: theme.space.lg,
    paddingTop: theme.space.md,
  },
  tabs: {
    flexDirection: 'row',
    gap: theme.space.sm,
    marginBottom: theme.space.md,
  },
  tab: {
    paddingHorizontal: theme.space.md,
    paddingVertical: theme.space.sm,
    borderRadius: theme.radius.md,
    backgroundColor: theme.color.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.color.border,
  },
  tabActive: {
    backgroundColor: 'rgba(10, 132, 255, 0.16)',
    borderColor: theme.color.brand,
  },
  tabText: {
    color: theme.color.textDim,
    fontSize: theme.font.sm,
    fontWeight: '600',
  },
  tabTextActive: {
    color: theme.color.brand,
  },
  card: {
    backgroundColor: theme.color.card,
    borderRadius: theme.radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.color.border,
    padding: theme.space.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.sm,
    marginBottom: theme.space.sm,
    flexWrap: 'wrap',
  },
  nickname: {
    color: theme.color.textDim,
    fontSize: theme.font.sm,
    flexShrink: 1,
  },
  time: {
    color: theme.color.textDim,
    fontSize: 12,
    marginLeft: 'auto',
  },
  title: {
    color: theme.color.text,
    fontSize: theme.font.md,
    fontWeight: '600',
    marginBottom: theme.space.xs,
  },
  body: {
    color: theme.color.textDim,
    fontSize: theme.font.sm,
    lineHeight: 20,
  },
  responseBlock: {
    marginTop: theme.space.md,
    paddingTop: theme.space.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.color.border,
  },
  responseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.xs,
    marginBottom: theme.space.xs,
  },
  responseLabel: {
    color: theme.color.accent,
    fontSize: theme.font.sm,
    fontWeight: '600',
  },
  pendingText: {
    color: theme.color.warn,
    fontSize: 12,
    fontWeight: '600',
  },
  responseBody: {
    color: theme.color.textDim,
    fontSize: theme.font.sm,
    lineHeight: 20,
  },
  replyChip: {
    marginTop: theme.space.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.xs,
    alignSelf: 'flex-start',
    paddingHorizontal: theme.space.sm,
    paddingVertical: 4,
    borderRadius: theme.radius.sm,
    backgroundColor: 'rgba(10, 132, 255, 0.14)',
  },
  replyChipText: {
    color: theme.color.brand,
    fontSize: theme.font.sm,
    fontWeight: '600',
  },
});
