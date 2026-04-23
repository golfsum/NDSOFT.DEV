import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createReviewResponse,
  deleteReviewResponse,
  listAllReviews,
  updateReviewResponse,
} from '../api/endpoints/reviews';
import { useCredentialsStore } from '../store/credentials';
import type { ReviewSummary } from '../api/types';

const ALL_STALE = 2 * 60_000;

export function useAllReviews(appId: string | undefined) {
  const creds = useCredentialsStore((s) => s.creds);
  return useQuery<ReviewSummary[]>({
    queryKey: ['allReviews', appId, creds?.keyId ?? null],
    enabled: !!creds && !!appId,
    staleTime: ALL_STALE,
    refetchOnWindowFocus: true,
    queryFn: async ({ signal }) => {
      if (!creds || !appId) return [];
      return listAllReviews(creds, appId, 400, signal);
    },
  });
}

interface SubmitArgs {
  reviewId: string;
  /** If the review already has a response, pass its id and we'll PATCH. */
  existingResponseId?: string;
  body: string;
  appId: string;
}

export function useSubmitReviewResponse() {
  const creds = useCredentialsStore((s) => s.creds);
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ reviewId, existingResponseId, body }: SubmitArgs) => {
      if (!creds) throw new Error('No credentials');
      if (existingResponseId) {
        return updateReviewResponse(creds, existingResponseId, body);
      }
      return createReviewResponse(creds, reviewId, body);
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ['allReviews', vars.appId] });
      qc.invalidateQueries({ queryKey: ['reviews', vars.appId] });
    },
  });
}

interface DeleteArgs {
  responseId: string;
  appId: string;
}

export function useDeleteReviewResponse() {
  const creds = useCredentialsStore((s) => s.creds);
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ responseId }: DeleteArgs) => {
      if (!creds) throw new Error('No credentials');
      await deleteReviewResponse(creds, responseId);
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ['allReviews', vars.appId] });
      qc.invalidateQueries({ queryKey: ['reviews', vars.appId] });
    },
  });
}
