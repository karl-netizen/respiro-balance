import { useEffect } from 'react';
import { useSubscriptionStore } from '@/features/subscription';
import { useModuleStore } from '@/store/moduleStore';

/**
 * Hook to sync subscription tier between subscriptionStore and moduleStore
 * This ensures that when a user upgrades/downgrades, the modules are updated accordingly
 */
export const useSubscriptionSync = () => {
  const subscriptionTier = useSubscriptionStore((state) => state.tier);
  const setModuleTier = useModuleStore((state) => state.setSubscriptionTier);

  useEffect(() => {
    // Sync module store whenever subscription tier changes
    setModuleTier(subscriptionTier);
  }, [subscriptionTier, setModuleTier]);
};
