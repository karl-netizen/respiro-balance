
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';

// Define subscription data type
interface SubscriptionData {
  meditation_minutes_used: number;
  meditation_minutes_limit: number;
  subscription_period_end?: string;
  sessions_used_weekly?: number;
  sessions_limit_weekly?: number;
}

interface SubscriptionContextType {
  isPremium: boolean;
  isSubscribed: boolean;
  tier: 'free' | 'premium' | 'premium-plus' | 'premium-pro';
  tierName: string;
  expiresAt: string | null;
  minutesUsed: number;
  minutesLimit: number;
  sessionsUsedWeekly: number;
  sessionsLimitWeekly: number;
  hasExceededUsageLimit: boolean;
  hasExceededSessionLimit: boolean;
  updateUsage: (minutes: number) => void;
  updateSessionUsage: (sessions: number) => void;
  subscriptionData?: SubscriptionData;
  startPremiumCheckout?: () => Promise<void>;
  manageSubscription?: () => Promise<void>;
  isLoading: boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [minutesUsed, setMinutesUsed] = useState(0);
  const [sessionsUsedWeekly, setSessionsUsedWeekly] = useState(2); // Mock current usage
  const [isLoading, setIsLoading] = useState(false);
  const [tier, setTier] = useState<'free' | 'premium' | 'premium-plus' | 'premium-pro'>('free');
  
  // Free tier limits
  const minutesLimit = 60; // Free tier limit
  const sessionsLimitWeekly = 3; // Free tier weekly session limit
  
  // Check subscription status when user changes
  useEffect(() => {
    if (user) {
      // In a real app, you would fetch subscription data here
      setIsLoading(false);
    }
  }, [user]);
  
  const updateUsage = (minutes: number) => {
    setMinutesUsed(prev => prev + minutes);
  };
  
  const updateSessionUsage = (sessions: number) => {
    setSessionsUsedWeekly(prev => prev + sessions);
  };
  
  const startPremiumCheckout = async () => {
    console.log('Upgrading to premium subscription');
    // This would be implemented with actual payment processing
  };
  
  const manageSubscription = async () => {
    console.log('Managing existing subscription');
    // This would be implemented with actual subscription management
  };
  
  const isPremium = tier !== 'free';
  const isSubscribed = isPremium;
  
  const value: SubscriptionContextType = {
    isPremium,
    isSubscribed,
    tier,
    tierName: tier.charAt(0).toUpperCase() + tier.slice(1),
    expiresAt: null,
    minutesUsed,
    minutesLimit,
    sessionsUsedWeekly,
    sessionsLimitWeekly,
    hasExceededUsageLimit: minutesUsed >= minutesLimit,
    hasExceededSessionLimit: sessionsUsedWeekly >= sessionsLimitWeekly,
    updateUsage,
    updateSessionUsage,
    subscriptionData: {
      meditation_minutes_used: minutesUsed,
      meditation_minutes_limit: minutesLimit,
      sessions_used_weekly: sessionsUsedWeekly,
      sessions_limit_weekly: sessionsLimitWeekly
    },
    startPremiumCheckout,
    manageSubscription,
    isLoading
  };
  
  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscriptionContext = (): SubscriptionContextType => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscriptionContext must be used within a SubscriptionProvider');
  }
  return context;
};

export default SubscriptionContext;
