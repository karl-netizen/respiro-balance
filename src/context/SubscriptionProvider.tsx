
import React, { createContext, useContext, useState, ReactNode } from 'react';

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
  tier: 'free' | 'premium' | 'premium-plus';
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
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [minutesUsed, setMinutesUsed] = useState(0);
  const [sessionsUsedWeekly, setSessionsUsedWeekly] = useState(2); // Mock current usage
  
  // Free tier limits
  const minutesLimit = 60; // Free tier limit
  const sessionsLimitWeekly = 3; // Free tier weekly session limit
  
  const updateUsage = (minutes: number) => {
    setMinutesUsed(prev => prev + minutes);
  };
  
  const updateSessionUsage = (sessions: number) => {
    setSessionsUsedWeekly(prev => prev + sessions);
  };
  
  const value: SubscriptionContextType = {
    isPremium: false,
    isSubscribed: false,
    tier: 'free',
    tierName: 'Free',
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
    startPremiumCheckout: async () => {
      console.log('Upgrading to premium subscription');
      // This would be implemented with actual payment processing
    },
    manageSubscription: async () => {
      console.log('Managing existing subscription');
      // This would be implemented with actual subscription management
    }
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
