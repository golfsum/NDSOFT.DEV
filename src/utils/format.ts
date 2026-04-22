import { differenceInCalendarDays, differenceInHours, format, formatDistanceToNowStrict } from 'date-fns';

export type ExpiryTier = 'healthy' | 'dimHealthy' | 'warn' | 'danger' | 'expired';

/**
 * Classify build expiry for badge colors.
 * Per spec section 12:
 *   - More than 60 days:  healthy (green)
 *   - 14 to 60 days:      dimHealthy (dim green)
 *   - 3 to 14 days:       warn (yellow)
 *   - Under 3 days:       danger (red)
 *   - Expired:            expired (red, strikethrough)
 */
export function classifyExpiry(expiresAt: Date | null, expired: boolean, now: Date = new Date()): ExpiryTier {
  if (expired) return 'expired';
  if (!expiresAt) return 'healthy';
  if (expiresAt.getTime() <= now.getTime()) return 'expired';

  const days = differenceInCalendarDays(expiresAt, now);
  if (days > 60) return 'healthy';
  if (days >= 14) return 'dimHealthy';
  if (days >= 3) return 'warn';
  return 'danger';
}

/**
 * Human-readable countdown string. Examples:
 *   "Expires in 4d"
 *   "Expires in 22h"
 *   "Expired 2d ago"
 */
export function expiryText(expiresAt: Date | null, expired: boolean, now: Date = new Date()): string {
  if (!expiresAt) return 'No expiry';
  const diffMs = expiresAt.getTime() - now.getTime();

  if (expired || diffMs <= 0) {
    return `Expired ${formatDistanceToNowStrict(expiresAt, { addSuffix: false })} ago`;
  }

  const days = differenceInCalendarDays(expiresAt, now);
  if (days >= 1) return `Expires in ${days}d`;

  const hours = Math.max(1, differenceInHours(expiresAt, now));
  return `Expires in ${hours}h`;
}

export function uploadedText(uploadedAt: Date, now: Date = new Date()): string {
  const hours = differenceInHours(now, uploadedAt);
  if (hours < 1) return 'Uploaded just now';
  if (hours < 24) return `Uploaded ${hours}h ago`;
  const days = differenceInCalendarDays(now, uploadedAt);
  if (days < 14) return `Uploaded ${days}d ago`;
  return `Uploaded ${format(uploadedAt, 'MMM d')}`;
}

export function absoluteDate(d: Date): string {
  return format(d, "MMM d, yyyy 'at' h:mm a");
}
