
// This file is deprecated - using components/subscription/SubscriptionProvider.tsx instead
// Keeping minimal export to prevent breaking changes

import React from 'react';

// Mock context type for backward compatibility
interface LegacySubscriptionContextType {
  isPremium: boolean;
  isSubscribed: boolean;
  tier: 'free' | 'premium' | 'premium-plus';
  tierName: string;
  subscriptionData?: any;
}

const mockSubscriptionData: LegacySubscriptionContextType = {
  isPremium: false,
  isSubscribed: false,
  tier: 'free',
  tierName: 'Free',
  subscriptionData: {
    meditation_minutes_used: 0,
    meditation_minutes_limit: 60
  }
};

export const SubscriptionProvider = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export const useSubscriptionContext = (): LegacySubscriptionContextType => {
  console.warn('useSubscriptionContext is deprecated. Use useSubscription from components/subscription/SubscriptionProvider instead');
  return mockSubscriptionData;
};

export default { SubscriptionProvider, useSubscriptionContext };
