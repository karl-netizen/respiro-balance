/**
 * Tier-based access control utilities
 */

import { PRICING } from '@/lib/pricing/constants';

export type UserTier = 'free' | 'standard' | 'premium';
export type SessionTier = 'free' | 'standard' | 'premium';

export const TIER_HIERARCHY: Record<UserTier, number> = {
  free: 1,
  standard: 2,
  premium: 3
};

export const TIER_LABELS: Record<UserTier, string> = {
  free: '🆓 Free',
  standard: '💎 Standard',
  premium: '👑 Premium'
};

export const TIER_PRICES: Record<'standard' | 'premium', { monthly: number; label: string }> = {
  standard: { monthly: PRICING.STANDARD.monthly, label: 'Standard Plan' },
  premium: { monthly: PRICING.PREMIUM.monthly, label: 'Premium Plan' }
};

export const FREE_TIER_WEEKLY_LIMIT = 3;

/**
 * Check if user can access a session based on their tier
 */
export function canAccessSession(userTier: UserTier, sessionTier: SessionTier): boolean {
  return TIER_HIERARCHY[userTier] >= TIER_HIERARCHY[sessionTier as UserTier];
}

/**
 * Get sessions user can access based on their tier
 */
export function getAccessibleSessions<T extends { tier: SessionTier; is_available?: boolean }>(
  userTier: UserTier,
  sessions: T[]
): T[] {
  return sessions.filter(session => 
    canAccessSession(userTier, session.tier)
  );
}

/**
 * Get locked sessions that require upgrade
 */
export function getLockedSessions<T extends { tier: SessionTier }>(
  userTier: UserTier,
  sessions: T[]
): T[] {
  return sessions.filter(session => 
    !canAccessSession(userTier, session.tier)
  );
}

/**
 * Get the required tier to access a session
 */
export function getRequiredTier(sessionTier: SessionTier): UserTier {
  return sessionTier as UserTier;
}

/**
 * Get upgrade message for locked content
 */
export function getUpgradeMessage(sessionTier: SessionTier): string {
  const tier = sessionTier.charAt(0).toUpperCase() + sessionTier.slice(1);
  return `Upgrade to ${tier} to access this session`;
}
