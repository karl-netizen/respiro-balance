import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface SubscriptionData {
  subscribed: boolean;
  subscription_tier: string;
  subscription_status: string;
  subscription_end?: string;
  stripe_customer_id?: string;
}

export const useSubscriptionStatus = () => {
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData>({
    subscribed: false,
    subscription_tier: 'free',
    subscription_status: 'inactive'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Load subscription status when user changes
  useEffect(() => {
    if (user?.id) {
      loadSubscriptionStatus();
    } else {
      setSubscriptionData({
        subscribed: false,
        subscription_tier: 'free',
        subscription_status: 'inactive'
      });
    }
  }, [user?.id]);

  const loadSubscriptionStatus = async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      setError(null);

      // Check subscription status via edge function
      const { data, error: functionError } = await supabase.functions.invoke('check-subscription');

      if (functionError) {
        console.error('Error checking subscription:', functionError);
        // Fall back to checking local database
        await loadSubscriptionFromDatabase();
        return;
      }

      if (data) {
        setSubscriptionData({
          subscribed: data.subscribed || false,
          subscription_tier: data.subscription_tier || 'free',
          subscription_status: data.subscribed ? 'active' : 'inactive',
          subscription_end: data.subscription_end
        });

        // Update user profile with subscription data
        await updateUserProfile(data);
      }
    } catch (error) {
      console.error('Error loading subscription status:', error);
      setError(error instanceof Error ? error.message : 'Failed to load subscription status');
      // Fall back to local database
      await loadSubscriptionFromDatabase();
    } finally {
      setIsLoading(false);
    }
  };

  const loadSubscriptionFromDatabase = async () => {
    if (!user?.id) return;

    try {
      // Check subscribers table
      const { data: subscriber, error: subscriberError } = await supabase
        .from('subscribers')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (subscriberError && subscriberError.code !== 'PGRST116') {
        console.error('Error loading subscriber data:', subscriberError);
      }

      // Check user profile
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('subscription_tier, subscription_status')
        .eq('id', user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error loading profile data:', profileError);
      }

      setSubscriptionData({
        subscribed: subscriber?.subscribed || false,
        subscription_tier: subscriber?.subscription_tier || profile?.subscription_tier || 'free',
        subscription_status: subscriber?.subscription_status || profile?.subscription_status || 'inactive',
        subscription_end: subscriber?.subscription_end,
        stripe_customer_id: subscriber?.stripe_customer_id
      });
    } catch (error) {
      console.error('Error loading subscription from database:', error);
    }
  };

  const updateUserProfile = async (subscriptionData: any) => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          subscription_tier: subscriptionData.subscription_tier || 'free',
          subscription_status: subscriptionData.subscribed ? 'active' : 'inactive'
        })
        .eq('id', user.id);

      if (error) {
        console.error('Error updating user profile:', error);
      }
    } catch (error) {
      console.error('Error updating user profile:', error);
    }
  };

  const refreshSubscriptionStatus = async () => {
    await loadSubscriptionStatus();
  };

  const hasAccess = (feature: string): boolean => {
    const { subscription_tier, subscribed } = subscriptionData;

    // Define feature access based on subscription tier
    const featureAccess: Record<string, string[]> = {
      'premium_content': ['premium', 'coach', 'enterprise'],
      'advanced_analytics': ['premium', 'coach', 'enterprise'],
      'coaching_features': ['coach', 'enterprise'],
      'unlimited_sessions': ['premium', 'coach', 'enterprise'],
      'custom_programs': ['coach', 'enterprise'],
      'team_features': ['enterprise'],
      'priority_support': ['premium', 'coach', 'enterprise']
    };

    const requiredTiers = featureAccess[feature];
    
    if (!requiredTiers) {
      return true; // Feature is free for all users
    }

    return subscribed && requiredTiers.includes(subscription_tier);
  };

  const getFeatureLimit = (feature: string): number | null => {
    const { subscription_tier } = subscriptionData;

    const featureLimits: Record<string, Record<string, number>> = {
      'meditation_minutes': {
        'free': 60,
        'premium': -1, // unlimited
        'coach': -1,
        'enterprise': -1
      },
      'focus_sessions': {
        'free': 10,
        'premium': -1,
        'coach': -1,
        'enterprise': -1
      },
      'morning_rituals': {
        'free': 3,
        'premium': -1,
        'coach': -1,
        'enterprise': -1
      }
    };

    const limits = featureLimits[feature];
    if (!limits) return null;

    return limits[subscription_tier] || 0;
  };

  return {
    subscriptionData,
    isLoading,
    error,
    refreshSubscriptionStatus,
    hasAccess,
    getFeatureLimit,
    isPremium: subscriptionData.subscribed && ['premium', 'coach', 'enterprise'].includes(subscriptionData.subscription_tier),
    isCoach: subscriptionData.subscription_tier === 'coach',
    isEnterprise: subscriptionData.subscription_tier === 'enterprise'
  };
};