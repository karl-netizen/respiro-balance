import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { usePaymentSystem } from '@/hooks/usePaymentSystem';

interface SubscriptionContextType {
  subscriptionTier: string;
  subscriptionStatus: string;
  subscriptionEnd: string | null;
  isSubscribed: boolean;
  isPremium: boolean;
  isPremiumPro: boolean;
  isPremiumPlus: boolean;
  refreshSubscription: () => Promise<void>;
  isLoading: boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const useSubscriptionContext = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscriptionContext must be used within a SubscriptionProvider');
  }
  return context;
};

interface SubscriptionProviderProps {
  children: ReactNode;
}

export const SubscriptionProvider: React.FC<SubscriptionProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const { checkSubscriptionStatus, isLoading } = usePaymentSystem();
  const [subscriptionTier, setSubscriptionTier] = useState<string>('free');
  const [subscriptionStatus, setSubscriptionStatus] = useState<string>('inactive');
  const [subscriptionEnd, setSubscriptionEnd] = useState<string | null>(null);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);

  const refreshSubscription = async () => {
    if (!user) {
      setSubscriptionTier('free');
      setSubscriptionStatus('inactive');
      setSubscriptionEnd(null);
      setIsSubscribed(false);
      return;
    }

    try {
      const result = await checkSubscriptionStatus();
      if (result) {
        setSubscriptionTier(result.subscription_tier || 'free');
        setSubscriptionStatus(result.subscription_status || 'inactive');
        setSubscriptionEnd(result.subscription_end);
        setIsSubscribed(result.subscribed || false);
      }
    } catch (error) {
      console.error('Error refreshing subscription:', error);
    }
  };

  useEffect(() => {
    if (user) {
      refreshSubscription();
    } else {
      setSubscriptionTier('free');
      setSubscriptionStatus('inactive');
      setSubscriptionEnd(null);
      setIsSubscribed(false);
    }
  }, [user]);

  const isPremium = subscriptionTier === 'premium' && isSubscribed;
  const isStandard = subscriptionTier === 'standard' && isSubscribed;

  // Deprecated - for backward compatibility only
  // These will always be false as we've migrated to free/standard/premium tiers
  const isPremiumPro = false;
  const isPremiumPlus = false;

  const value = {
    subscriptionTier,
    subscriptionStatus,
    subscriptionEnd,
    isSubscribed,
    isPremium,
    isStandard,
    // Deprecated properties - kept for backward compatibility
    isPremiumPro,
    isPremiumPlus,
    refreshSubscription,
    isLoading,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};