
import React from 'react';
import { useSubscription, SubscriptionTier } from '@/hooks/useSubscription';
import { UserProfile } from '@/types/supabase';
import SubscriptionContext from '@/hooks/useSubscriptionContext';

interface SubscriptionProviderProps {
  children: React.ReactNode;
}

export const SubscriptionProvider: React.FC<SubscriptionProviderProps> = ({ children }) => {
  const {
    subscriptionData,
    isLoading,
    isPremium,
    hasExceededUsageLimit,
    startPremiumCheckout,
    manageSubscription,
    updateUsage,
  } = useSubscription();

  const getFeatureAccess = (featureKey: string): boolean => {
    const tier = subscriptionData?.subscription_tier || 'free';
    return SUBSCRIPTION_FEATURES[tier as SubscriptionTier].includes(featureKey);
  };

  const tierName = formatTierName(subscriptionData?.subscription_tier as SubscriptionTier);

  const value = {
    subscriptionData,
    isLoading,
    isPremium,
    hasExceededUsageLimit,
    tierName,
    startPremiumCheckout,
    manageSubscription,
    updateUsage,
    getFeatureAccess,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};

// Define feature access for different subscription tiers
const SUBSCRIPTION_FEATURES: Record<SubscriptionTier, string[]> = {
  free: [
    'basic_meditation',
    'limited_sessions',
    'morning_rituals_basic',
    'progress_tracking_basic',
  ],
  premium: [
    'basic_meditation',
    'unlimited_sessions',
    'advanced_meditation',
    'morning_rituals_full',
    'progress_tracking_advanced',
    'biometric_integration',
    'personalized_recommendations',
    'offline_access',
  ],
  team: [
    'basic_meditation',
    'unlimited_sessions',
    'advanced_meditation',
    'morning_rituals_full',
    'progress_tracking_advanced',
    'biometric_integration',
    'personalized_recommendations',
    'offline_access',
    'team_analytics',
    'team_challenges',
    'admin_dashboard',
  ],
  enterprise: [
    'basic_meditation',
    'unlimited_sessions',
    'advanced_meditation',
    'morning_rituals_full',
    'progress_tracking_advanced',
    'biometric_integration',
    'personalized_recommendations',
    'offline_access',
    'team_analytics',
    'team_challenges',
    'admin_dashboard',
    'custom_branding',
    'priority_support',
    'api_access',
  ],
};

// Format tier name for display
const formatTierName = (tier?: SubscriptionTier): string => {
  if (!tier) return 'Free';
  
  switch (tier) {
    case 'premium':
      return 'Premium';
    case 'team':
      return 'Team';
    case 'enterprise':
      return 'Enterprise';
    default:
      return 'Free';
  }
};

export default SubscriptionProvider;
