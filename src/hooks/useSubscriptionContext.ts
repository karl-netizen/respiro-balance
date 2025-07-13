// Backward compatibility hook - provides fallback subscription data
export const useSubscriptionContext = () => {
  // Return mock data for backward compatibility during testing phase
  return {
    isPremium: false,
    isSubscribed: false,
    tier: 'free' as const,
    tierName: 'Free',
    subscriptionData: {
      meditation_minutes_used: 0,
      meditation_minutes_limit: 60
    }
  };
};

export default useSubscriptionContext;