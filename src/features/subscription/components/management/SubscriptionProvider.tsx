
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface SubscriptionData {
  subscribed: boolean;
  tier: 'free' | 'premium' | 'team';
  status: string;
  periodEnd?: string;
  customerId?: string;
}

interface SubscriptionContextType {
  subscription: SubscriptionData;
  isLoading: boolean;
  isPremium: boolean;
  checkSubscription: () => Promise<void>;
  startCheckout: () => Promise<string>;
  manageSubscription: () => Promise<string>;
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
  const [subscription, setSubscription] = useState<SubscriptionData>({
    subscribed: false,
    tier: 'free',
    status: 'inactive'
  });
  const [isLoading, setIsLoading] = useState(true);

  const checkSubscription = async () => {
    if (!user) {
      setSubscription({ subscribed: false, tier: 'free', status: 'inactive' });
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('check-subscription');
      
      if (error) {
        console.error('Error checking subscription:', error);
        setSubscription({ subscribed: false, tier: 'free', status: 'inactive' });
      } else {
        setSubscription({
          subscribed: data.subscribed || false,
          tier: data.subscription_tier || 'free',
          status: data.status || 'inactive',
          periodEnd: data.subscription_end,
          customerId: data.customer_id
        });
      }
    } catch (error) {
      console.error('Error in checkSubscription:', error);
      setSubscription({ subscribed: false, tier: 'free', status: 'inactive' });
    } finally {
      setIsLoading(false);
    }
  };

  const startCheckout = async (): Promise<string> => {
    if (!user) {
      throw new Error('Must be logged in to start checkout');
    }

    const { data, error } = await supabase.functions.invoke('create-checkout', {
      body: { tier: 'premium' }
    });

    if (error) {
      throw new Error(`Checkout error: ${error.message}`);
    }

    return data.url;
  };

  const manageSubscription = async (): Promise<string> => {
    if (!user) {
      throw new Error('Must be logged in to manage subscription');
    }

    const { data, error } = await supabase.functions.invoke('customer-portal');

    if (error) {
      throw new Error(`Portal error: ${error.message}`);
    }

    return data.url;
  };

  useEffect(() => {
    checkSubscription();
  }, [user]);

  const isPremium = subscription.subscribed && subscription.tier !== 'free';

  const value: SubscriptionContextType = {
    subscription,
    isLoading,
    isPremium,
    checkSubscription,
    startCheckout,
    manageSubscription
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};
