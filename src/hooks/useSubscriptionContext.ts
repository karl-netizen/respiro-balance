
import { createContext, useContext, useState, ReactNode } from 'react';

interface SubscriptionContextType {
  isPremium: boolean;
  tier: 'free' | 'basic' | 'premium';
  expiresAt: string | null;
  minutesUsed: number;
  minutesLimit: number;
  hasExceededUsageLimit: boolean;
  updateUsage: (minutes: number) => void;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
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
    updateUsage
  };
  
  return { Provider: SubscriptionContext.Provider, value, children };
};

export const useSubscriptionContext = (): SubscriptionContextType => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscriptionContext must be used within a SubscriptionProvider');
  }
  return context;
};

export default SubscriptionContext;
