/**
 * Trimmed type definitions for the App Store Connect API responses
 * we consume. We only type the fields we actually read, not the
 * full JSON:API envelope.
 *
 * All view models in the rest of the app should be built from these
 * by the endpoint modules — components never see raw ASC JSON.
 */

// ===== Raw JSON:API shapes =====

export interface AscPageMeta {
  paging?: { total?: number; limit?: number };
}

export interface AscRelationshipRef {
  id: string;
  type: string;
}

export interface AscRawApp {
  id: string;
  type: 'apps';
  attributes: {
    name?: string;
    bundleId?: string;
    sku?: string;
  };
}

export interface AscRawBuild {
  id: string;
  type: 'builds';
  attributes: {
    version?: string; // build number
    uploadedDate?: string;
    expirationDate?: string | null;
    processingState?: 'PROCESSING' | 'FAILED' | 'INVALID' | 'VALID';
    expired?: boolean;
    usesNonExemptEncryption?: boolean | null;
  };
  relationships?: {
    preReleaseVersion?: { data?: AscRelationshipRef | null };
    app?: { data?: AscRelationshipRef | null };
    betaAppReviewSubmission?: { data?: AscRelationshipRef | null };
  };
}

export interface AscRawPreReleaseVersion {
  id: string;
  type: 'preReleaseVersions';
  attributes: {
    version?: string; // semantic version like "1.0.3"
    platform?: string;
  };
}

export interface AscRawReview {
  id: string;
  type: 'customerReviews';
  attributes: {
    rating?: number;
    title?: string;
    body?: string;
    reviewerNickname?: string;
    createdDate?: string;
    territory?: string;
  };
  relationships?: {
    response?: { data?: AscRelationshipRef | null };
  };
}

export type AscReviewResponseState = 'PUBLISHED' | 'PENDING_PUBLISH';

export interface AscRawReviewResponse {
  id: string;
  type: 'customerReviewResponses';
  attributes: {
    responseBody?: string;
    lastModifiedDate?: string;
    state?: AscReviewResponseState;
  };
  relationships?: {
    review?: { data?: AscRelationshipRef | null };
  };
}

/** Beta App Review submission lifecycle for external testing. */
export type AscBetaReviewState =
  | 'WAITING_FOR_REVIEW'
  | 'IN_REVIEW'
  | 'APPROVED'
  | 'REJECTED';

export interface AscRawBetaAppReviewSubmission {
  id: string;
  type: 'betaAppReviewSubmissions';
  attributes: {
    betaReviewState?: AscBetaReviewState;
  };
  relationships?: {
    build?: { data?: AscRelationshipRef | null };
  };
}

export interface AscRawBetaGroup {
  id: string;
  type: 'betaGroups';
  attributes: {
    name?: string;
    publicLinkEnabled?: boolean;
    publicLink?: string | null;
    publicLinkLimit?: number | null;
    publicLinkLimitEnabled?: boolean;
    isInternalGroup?: boolean;
  };
  relationships?: {
    app?: { data?: AscRelationshipRef | null };
  };
}

export interface AscRawBetaFeedbackCrash {
  id: string;
  type: 'betaFeedbackCrashSubmissions';
  attributes: {
    createdDate?: string;
  };
  relationships?: {
    build?: { data?: AscRelationshipRef | null };
  };
}

export interface AscRawBetaFeedbackScreenshot {
  id: string;
  type: 'betaFeedbackScreenshotSubmissions';
  attributes: {
    createdDate?: string;
    comment?: string;
  };
  relationships?: {
    build?: { data?: AscRelationshipRef | null };
  };
}

/** Raw shape of a single metric from the Power & Performance Metrics API. */
export interface AscRawPerfMetric {
  id: string;
  type: 'perfPowerMetrics';
  attributes: {
    metricCategory?: string;
    productData?: Array<{
      dataPoints?: Array<{
        percentile?: string;
        value?: number;
      }>;
      percentilesOfInterest?: string[];
    }>;
  };
}

export interface AscListResponse<T, I = unknown> {
  data: T[];
  included?: I[];
  links?: { next?: string; self?: string };
  meta?: AscPageMeta;
}

export interface AscSingleResponse<T, I = unknown> {
  data: T;
  included?: I[];
}

// ===== View models (used by components and hooks) =====

export type ProcessingState = 'PROCESSING' | 'FAILED' | 'INVALID' | 'VALID';

export type BetaReviewState = AscBetaReviewState;

export interface AppSummary {
  id: string;
  name: string;
  bundleId: string;
  sku: string;
  latestBuild?: BuildSummary;
}

export interface BuildSummary {
  id: string;
  appId?: string;
  version: string; // marketing version, e.g. "1.0.3"
  buildNumber: string; // CFBundleVersion, e.g. "42"
  uploadedAt: Date;
  expiresAt: Date | null;
  processingState: ProcessingState;
  expired: boolean;
  testerCount?: number; // lazy-loaded
  /** External beta review state, if a submission exists for this build. */
  betaReviewState?: BetaReviewState;
}

export interface ReviewSummary {
  id: string;
  rating: number;
  title: string;
  body: string;
  nickname: string;
  territory: string;
  createdAt: Date;
  /** Populated when the developer has already responded. */
  response?: ReviewResponseSummary;
}

export interface ReviewResponseSummary {
  id: string;
  body: string;
  lastModifiedAt: Date | null;
  state: AscReviewResponseState;
}

export interface BetaGroupSummary {
  id: string;
  name: string;
  isInternal: boolean;
  publicLinkEnabled: boolean;
  publicLink: string | null;
}

export interface BetaFeedbackCounts {
  crashes: number;
  screenshots: number;
}
