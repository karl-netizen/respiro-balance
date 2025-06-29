
import { useAuth } from './useAuth';
import { useSubscription } from './useSubscription';

export type FeatureTier = 'free' | 'premium' | 'premium_pro' | 'premium_plus';

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

  const getCurrentTier = (): FeatureTier => {
    if (!user || !isPremium) return 'free';
    return (subscriptionData?.tier as FeatureTier) || 'free';
  };

  const checkFeatureAccess = (requiredTier: FeatureTier): FeatureAccess => {
    const currentTier = getCurrentTier();
    const tierHierarchy: Record<FeatureTier, number> = {
      free: 0,
      premium: 1,
      premium_pro: 2,
      premium_plus: 3
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
        return { weekly: 2, monthly: 8 };
      case 'premium':
      case 'premium_pro':
      case 'premium_plus':
        return { weekly: Infinity, monthly: Infinity };
      default:
        return { weekly: 2, monthly: 8 };
    }
  };

  const getMeditationLibraryAccess = () => {
    const tier = getCurrentTier();
    
    switch (tier) {
      case 'free':
        return { sessions: 3, breathingTechniques: 3 };
      case 'premium':
        return { sessions: 14, breathingTechniques: Infinity };
      case 'premium_pro':
        return { sessions: 18, breathingTechniques: Infinity };
      case 'premium_plus':
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
      focusMode: tier !== 'free',
      habitTracking: ['premium_pro', 'premium_plus'].includes(tier),
      biofeedbackIntegration: ['premium_pro', 'premium_plus'].includes(tier),
      groupChallenges: ['premium_pro', 'premium_plus'].includes(tier),
      emailSupport: ['premium_pro', 'premium_plus'].includes(tier),
      customBreathingPatterns: ['premium_pro', 'premium_plus'].includes(tier),
      expertSessions: tier === 'premium_plus',
      aiPersonalization: tier === 'premium_plus',
      familySharing: tier === 'premium_plus',
      prioritySupport: tier === 'premium_plus',
      whiteLabel: tier === 'premium_plus'
    };
  };

  return {
    currentTier: getCurrentTier(),
    checkFeatureAccess,
    getSessionLimits,
    getMeditationLibraryAccess,
    getFeatureFlags,
    isPremium,
    hasFullAccess: getCurrentTier() === 'premium_plus'
  };
};
