
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SubscriptionContextType {
  isPremium: boolean;
  tier: 'free' | 'basic' | 'premium';
  expiresAt: string | null;
  minutesUsed: number;
  minutesLimit: number;
  hasExceededUsageLimit: boolean;
  updateUsage: (minutes: number) => void;
  tierName?: string; // Added to fix error in AccountSection.tsx
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [minutesUsed, setMinutesUsed] = useState(0);
  const minutesLimit = 60; // Free tier limit
  
  const updateUsage = (minutes: number) => {
    setMinutesUsed(prev => prev + minutes);
  };
  
  const value = {
    isPremium: false,
    tier: 'free' as const,
    expiresAt: null,
    minutesUsed,
    minutesLimit,
    hasExceededUsageLimit: minutesUsed >= minutesLimit,
    updateUsage,
    tierName: 'Free' // Added to fix error in AccountSection.tsx
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
