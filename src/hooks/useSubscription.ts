
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';
import { UserProfile } from '@/types/supabase';
import { toast } from 'sonner';

export type SubscriptionTier = 'free' | 'premium' | 'team' | 'enterprise';

export function useSubscription() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch subscription data
  const fetchSubscription = async (): Promise<Partial<UserProfile> | null> => {
    if (!user) return null;

    const { data, error } = await supabase
      .from('user_profiles')
      .select('subscription_tier, subscription_status, subscription_period_end, meditation_minutes_used, meditation_minutes_limit')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching subscription data:', error);
      return null;
    }

    return data;
  };

  // Check if user has an active premium subscription
  const isPremium = (data?: Partial<UserProfile> | null): boolean => {
    if (!data) return false;
    
    const { subscription_tier, subscription_status } = data;
    return (
      (subscription_tier === 'premium' || 
       subscription_tier === 'team' || 
       subscription_tier === 'enterprise') && 
      (subscription_status === 'active' || subscription_status === 'trialing')
    );
  };

  // Check if user has exceeded their meditation minutes limit
  const hasExceededUsageLimit = (data?: Partial<UserProfile> | null): boolean => {
    if (!data) return false;
    
    const { meditation_minutes_used, meditation_minutes_limit } = data;
    
    if (isPremium(data)) return false; // Premium users have unlimited minutes
    
    return (meditation_minutes_used ?? 0) >= (meditation_minutes_limit ?? 0);
  };

  // Update usage when a meditation session is completed
  const updateUsage = async (minutes: number): Promise<void> => {
    if (!user) return;

    const { error } = await supabase.rpc('increment_meditation_usage', {
      user_id_param: user.id,
      minutes_used: minutes
    });

    if (error) {
      console.error('Error updating meditation usage:', error);
      throw error;
    }
  };

  // Redirect to checkout for upgrading to premium
  const startPremiumCheckout = async (): Promise<string> => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: {
          userId: user.id,
          tier: 'premium'
        },
      });

      if (error) throw error;
      return data.url;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast.error('Could not start checkout process. Please try again.');
      throw error;
    }
  };

  // Manage subscription (customer portal)
  const manageSubscription = async (): Promise<string> => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { data, error } = await supabase.functions.invoke('create-portal-session', {
        body: {
          userId: user.id,
        },
      });

      if (error) throw error;
      return data.url;
    } catch (error) {
      console.error('Error creating portal session:', error);
      toast.error('Could not open subscription management. Please try again.');
      throw error;
    }
  };

  // React Query hooks
  const subscriptionQuery = useQuery({
    queryKey: ['subscription', user?.id],
    queryFn: fetchSubscription,
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const updateUsageMutation = useMutation({
    mutationFn: updateUsage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription', user?.id] });
    },
  });

  return {
    subscriptionData: subscriptionQuery.data,
    isLoading: subscriptionQuery.isLoading,
    isPremium: isPremium(subscriptionQuery.data),
    hasExceededUsageLimit: hasExceededUsageLimit(subscriptionQuery.data),
    startPremiumCheckout,
    manageSubscription,
    updateUsage: updateUsageMutation.mutate,
  };
}
