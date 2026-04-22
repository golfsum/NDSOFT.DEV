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

export interface AppSummary {
  id: string;
  name: string;
  bundleId: string;
  sku: string;
  latestBuild?: BuildSummary;
}

export interface BuildSummary {
  id: string;
  version: string; // marketing version, e.g. "1.0.3"
  buildNumber: string; // CFBundleVersion, e.g. "42"
  uploadedAt: Date;
  expiresAt: Date | null;
  processingState: ProcessingState;
  expired: boolean;
  testerCount?: number; // lazy-loaded
}

export interface ReviewSummary {
  id: string;
  rating: number;
  title: string;
  body: string;
  nickname: string;
  territory: string;
  createdAt: Date;
}
