import { ascClient } from '../asc-client';
import type { AscCredentials } from '../asc-jwt';
import type {
  AscListResponse,
  AscRawReview,
  AscRawReviewResponse,
  AscSingleResponse,
  ReviewResponseSummary,
  ReviewSummary,
} from '../types';

type IncludedResource = AscRawReviewResponse;

const REVIEW_FIELDS =
  'rating,title,body,reviewerNickname,createdDate,territory';
const RESPONSE_FIELDS = 'responseBody,lastModifiedDate,state';

function toResponseSummary(raw: AscRawReviewResponse): ReviewResponseSummary {
  const lastModified = raw.attributes.lastModifiedDate;
  return {
    id: raw.id,
    body: raw.attributes.responseBody ?? '',
    lastModifiedAt: lastModified ? new Date(lastModified) : null,
    state: raw.attributes.state ?? 'PUBLISHED',
  };
}

function toReviewSummary(
  raw: AscRawReview,
  responses: Map<string, AscRawReviewResponse>,
): ReviewSummary | null {
  const { rating, title, body, reviewerNickname, createdDate, territory } = raw.attributes;
  if (!createdDate) return null;

  const responseId = raw.relationships?.response?.data?.id;
  const responseRaw = responseId ? responses.get(responseId) : undefined;

  return {
    id: raw.id,
    rating: typeof rating === 'number' ? rating : 0,
    title: title ?? '',
    body: body ?? '',
    nickname: reviewerNickname ?? 'Anonymous',
    territory: territory ?? '',
    createdAt: new Date(createdDate),
    response: responseRaw ? toResponseSummary(responseRaw) : undefined,
  };
}

/**
 * Short tail used on the app detail screen. Always pulls the response
 * relationship too so "needs-reply" can be computed without a second
 * round-trip.
 */
export async function listRecentReviews(
  creds: AscCredentials,
  appId: string,
  limit: number = 5,
  signal?: AbortSignal,
): Promise<ReviewSummary[]> {
  const path =
    `/v1/apps/${encodeURIComponent(appId)}/customerReviews` +
    `?limit=${limit}&sort=-createdDate` +
    `&include=response` +
    `&fields[customerReviews]=${REVIEW_FIELDS}` +
    `&fields[customerReviewResponses]=${RESPONSE_FIELDS}`;

  const res = await ascClient.get<AscListResponse<AscRawReview, IncludedResource>>(
    creds,
    path,
    { signal },
  );

  const responses = new Map<string, AscRawReviewResponse>();
  for (const inc of res.included ?? []) {
    if ((inc as AscRawReviewResponse).type === 'customerReviewResponses') {
      responses.set(inc.id, inc as AscRawReviewResponse);
    }
  }

  const out: ReviewSummary[] = [];
  for (const raw of res.data) {
    const view = toReviewSummary(raw, responses);
    if (view) out.push(view);
  }
  return out;
}

/**
 * Full-history variant used by the Reviews screen. Follows `links.next`
 * until exhausted or `maxItems` is hit. Apple caps page size at 200.
 */
export async function listAllReviews(
  creds: AscCredentials,
  appId: string,
  maxItems: number = 400,
  signal?: AbortSignal,
): Promise<ReviewSummary[]> {
  const path =
    `/v1/apps/${encodeURIComponent(appId)}/customerReviews` +
    `?limit=200&sort=-createdDate` +
    `&include=response` +
    `&fields[customerReviews]=${REVIEW_FIELDS}` +
    `&fields[customerReviewResponses]=${RESPONSE_FIELDS}`;

  const res = await ascClient.getAll<AscRawReview, IncludedResource>(
    creds,
    path,
    maxItems,
    signal,
  );

  const responses = new Map<string, AscRawReviewResponse>();
  for (const inc of res.included ?? []) {
    if ((inc as AscRawReviewResponse).type === 'customerReviewResponses') {
      responses.set(inc.id, inc as AscRawReviewResponse);
    }
  }

  const out: ReviewSummary[] = [];
  for (const raw of res.data) {
    const view = toReviewSummary(raw, responses);
    if (view) out.push(view);
  }
  return out;
}

/**
 * Create a developer response to a review. Requires the API key's role
 * to be App Manager or higher — a Developer-role key will 403.
 */
export async function createReviewResponse(
  creds: AscCredentials,
  reviewId: string,
  body: string,
  signal?: AbortSignal,
): Promise<ReviewResponseSummary> {
  const res = await ascClient.post<AscSingleResponse<AscRawReviewResponse>>(
    creds,
    '/v1/customerReviewResponses',
    {
      data: {
        type: 'customerReviewResponses',
        attributes: { responseBody: body },
        relationships: {
          review: { data: { id: reviewId, type: 'customerReviews' } },
        },
      },
    },
    { signal },
  );
  return toResponseSummary(res.data);
}

/**
 * Replace the body of an existing response. Apple treats this as a new
 * submission that may briefly re-enter PENDING_PUBLISH while it propagates.
 */
export async function updateReviewResponse(
  creds: AscCredentials,
  responseId: string,
  body: string,
  signal?: AbortSignal,
): Promise<ReviewResponseSummary> {
  const res = await ascClient.patch<AscSingleResponse<AscRawReviewResponse>>(
    creds,
    `/v1/customerReviewResponses/${encodeURIComponent(responseId)}`,
    {
      data: {
        id: responseId,
        type: 'customerReviewResponses',
        attributes: { responseBody: body },
      },
    },
    { signal },
  );
  return toResponseSummary(res.data);
}

export async function deleteReviewResponse(
  creds: AscCredentials,
  responseId: string,
  signal?: AbortSignal,
): Promise<void> {
  await ascClient.delete(
    creds,
    `/v1/customerReviewResponses/${encodeURIComponent(responseId)}`,
    { signal },
  );
}
