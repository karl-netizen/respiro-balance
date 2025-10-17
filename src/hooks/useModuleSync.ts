import { useEffect } from 'react';
import { useModuleStore } from '@/store/moduleStore';
import { useSubscription } from '@/features/subscription';

/**
 * Hook to sync module store with subscription tier
 * Auto-activates modules when subscription changes
 */
export function useModuleSync() {
  const { subscription } = useSubscription();
  const { setSubscriptionTier, subscriptionTier } = useModuleStore();

  useEffect(() => {
    // Map subscription tier to module store tier
    const tier = subscription.subscribed 
      ? (subscription.tier as 'free' | 'standard' | 'premium')
      : 'free';

    // Only update if tier changed
    if (tier !== subscriptionTier) {
      setSubscriptionTier(tier);
    }
  }, [subscription, setSubscriptionTier, subscriptionTier]);
}
