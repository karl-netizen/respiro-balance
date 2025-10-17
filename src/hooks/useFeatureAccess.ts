
import { useAuth } from './useAuth';
import { useSubscription } from './useSubscription';
import { useSubscriptionStore } from '@/features/subscription';

export type FeatureTier = 'free' | 'standard' | 'premium';

export interface FeatureAccess {
  hasAccess: boolean;
  tier: FeatureTier;
  limit?: number;
  used?: number;
  remaining?: number;
}

export const useFeatureAccess = () => {
  const { user } = useAuth();
  const { isPremium, subscriptionData } = useSubscription();

  const { tier: storeTier } = useSubscriptionStore();

  const getCurrentTier = (): FeatureTier => {
    if (!user) return 'free';
    return storeTier as FeatureTier;
  };

  const checkFeatureAccess = (requiredTier: FeatureTier): FeatureAccess => {
    const currentTier = getCurrentTier();
    const tierHierarchy: Record<FeatureTier, number> = {
      free: 0,
      standard: 1,
      premium: 2
    };

    const hasAccess = tierHierarchy[currentTier] >= tierHierarchy[requiredTier];

    return {
      hasAccess,
      tier: currentTier
    };
  };

  const getSessionLimits = () => {
    const tier = getCurrentTier();
    
    switch (tier) {
      case 'free':
        return { weekly: Infinity, monthly: 5 };
      case 'standard':
        return { weekly: Infinity, monthly: 40 };
      case 'premium':
        return { weekly: Infinity, monthly: Infinity };
      default:
        return { weekly: Infinity, monthly: 5 };
    }
  };

  const getMeditationLibraryAccess = () => {
    const tier = getCurrentTier();
    
    switch (tier) {
      case 'free':
        return { sessions: 3, breathingTechniques: 3 };
      case 'standard':
        return { sessions: Infinity, breathingTechniques: Infinity };
      case 'premium':
        return { sessions: Infinity, breathingTechniques: Infinity };
      default:
        return { sessions: 3, breathingTechniques: 3 };
    }
  };

  const getFeatureFlags = () => {
    const tier = getCurrentTier();
    
    return {
      adFree: tier !== 'free',
      offlineMode: tier !== 'free',
      advancedAnalytics: tier !== 'free',
      communityAccess: tier !== 'free',
      sleepStories: tier !== 'free',
      moodTracking: tier !== 'free',
      focusMode: tier === 'premium',
      habitTracking: tier === 'premium',
      biofeedbackIntegration: tier !== 'free',
      groupChallenges: tier === 'premium',
      emailSupport: tier !== 'free',
      customBreathingPatterns: tier === 'premium',
      expertSessions: tier === 'premium',
      aiPersonalization: tier === 'premium',
      familySharing: tier === 'premium',
      prioritySupport: tier === 'premium'
    };
  };

  return {
    currentTier: getCurrentTier(),
    checkFeatureAccess,
    getSessionLimits,
    getMeditationLibraryAccess,
    getFeatureFlags,
    isPremium: getCurrentTier() !== 'free',
    hasFullAccess: getCurrentTier() === 'premium'
  };
};
