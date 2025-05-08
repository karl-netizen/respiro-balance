
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SubscriptionContextType {
  isPremium: boolean;
  tier: 'free' | 'basic' | 'premium';
  expiresAt: string | null;
  minutesUsed: number;
  minutesLimit: number;
  hasExceededUsageLimit: boolean;
  updateUsage: (minutes: number) => void;
  tierName: string;
  subscriptionData?: {
    meditation_minutes_used: number;
    meditation_minutes_limit: number;
  };
  startPremiumCheckout?: () => Promise<void>;
  manageSubscription?: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [minutesUsed, setMinutesUsed] = useState(0);
  const minutesLimit = 60; // Free tier limit
  
  const updateUsage = (minutes: number) => {
    setMinutesUsed(prev => prev + minutes);
  };
  
  const value: SubscriptionContextType = {
    isPremium: false,
    tier: 'free' as const,
    expiresAt: null,
    minutesUsed,
    minutesLimit,
    hasExceededUsageLimit: minutesUsed >= minutesLimit,
    updateUsage,
    tierName: 'Free',
    subscriptionData: {
      meditation_minutes_used: minutesUsed,
      meditation_minutes_limit: minutesLimit
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

export const useSubscription = (): SubscriptionContextType => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

export default SubscriptionContext;
