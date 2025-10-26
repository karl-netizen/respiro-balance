import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from './useAuth';

export function useSubscription() {
  const { user } = useAuth();
  const [isPremium, setIsPremium] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [subscriptionData, setSubscriptionData] = useState<{
    tier: string;
    status: string;
    subscription_period_end?: string | null;
  } | null>(null);

  useEffect(() => {
    if (user) {
      checkSubscriptionStatus();
    } else {
      setIsPremium(false);
      setIsLoading(false);
      setSubscriptionData(null);
    }
  }, [user]);

  const checkSubscriptionStatus = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('subscription_tier, subscription_status, subscription_period_end')
        .eq('id', user.id)
        .single();
      
      if (error) {
        console.error('Error fetching subscription data:', error);
        setIsPremium(false);
      } else if (data) {
        const isPremiumTier = 
          data.subscription_tier !== 'free' && 
          ['active', 'trialing'].includes(data.subscription_status || '');
        
        setIsPremium(isPremiumTier);
        setSubscriptionData({
          tier: data.subscription_tier || 'free',
          status: data.subscription_status || 'inactive',
          subscription_period_end: data.subscription_period_end
        });
      }
    } catch (error) {
      console.error('Error in subscription check:', error);
      setIsPremium(false);
    } finally {
      setIsLoading(false);
    }
  };

  const startPremiumCheckout = async (): Promise<string> => {
    if (!user) {
      toast.error('You must be logged in to upgrade');
      throw new Error('User not authenticated');
    }
    
    try {
      // Call the Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: { userId: user.id, tier: 'premium' }
      });
      
      if (error || !data?.url) {
        console.error('Error creating checkout session:', error || 'No URL returned');
        throw new Error('Failed to create checkout session');
      }
      
      return data.url as string;
    } catch (error) {
      console.error('Checkout error:', error);
      throw error;
    }
  };

  const manageSubscription = async (): Promise<string> => {
    if (!user) {
      toast.error('You must be logged in to manage your subscription');
      throw new Error('User not authenticated');
    }
    
    if (!isPremium) {
      toast.error('You need an active subscription to access the management portal');
      throw new Error('No active subscription');
    }
    
    try {
      // Call the Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('create-portal-session', {
        body: { userId: user.id }
      });
      
      if (error || !data?.url) {
        console.error('Error creating portal session:', error || 'No URL returned');
        throw new Error('Failed to create portal session');
      }
      
      return data.url as string;
    } catch (error) {
      console.error('Portal error:', error);
      throw error;
    }
  };

  return {
    isPremium,
    isLoading,
    subscriptionData,
    checkSubscriptionStatus,
    startPremiumCheckout,
    manageSubscription,
  };
}
