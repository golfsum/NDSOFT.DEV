import { ascClient } from '../asc-client';
import type { AscCredentials } from '../asc-jwt';
import type { AscListResponse, AscRawReview, ReviewSummary } from '../types';

export async function listRecentReviews(
  creds: AscCredentials,
  appId: string,
  limit: number = 5,
  signal?: AbortSignal,
): Promise<ReviewSummary[]> {
  const path = `/v1/apps/${encodeURIComponent(appId)}/customerReviews?limit=${limit}&sort=-createdDate`;
  const response = await ascClient.get<AscListResponse<AscRawReview>>(creds, path, { signal });

  const out: ReviewSummary[] = [];
  for (const raw of response.data) {
    const { rating, title, body, reviewerNickname, createdDate, territory } = raw.attributes;
    if (!createdDate) continue;
    out.push({
      id: raw.id,
      rating: typeof rating === 'number' ? rating : 0,
      title: title ?? '',
      body: body ?? '',
      nickname: reviewerNickname ?? 'Anonymous',
      territory: territory ?? '',
      createdAt: new Date(createdDate),
    });
  }
  return out;
}
