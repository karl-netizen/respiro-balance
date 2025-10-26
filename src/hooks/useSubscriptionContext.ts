import { useSubscription } from './useSubscription';

// Backward compatibility hook - wraps useSubscription with additional properties
export const useSubscriptionContext = () => {
  const { isPremium, isLoading, subscriptionData, startPremiumCheckout, manageSubscription } = useSubscription();
  
  return {
    isPremium,
    isSubscribed: isPremium,
    tier: subscriptionData?.tier || 'free' as const,
    tierName: subscriptionData?.tier === 'premium' ? 'Premium' : 'Free',
    subscriptionData: {
      meditation_minutes_used: 0,
      meditation_minutes_limit: isPremium ? -1 : 60,
      tier: subscriptionData?.tier || 'free',
      status: subscriptionData?.status || 'inactive'
    },
    startPremiumCheckout,
    manageSubscription,
    isLoading
  };
};

export default useSubscriptionContext;