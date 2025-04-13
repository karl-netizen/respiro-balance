
import { useContext } from 'react';
import { SubscriptionContext } from '@/context/SubscriptionProvider';

export const useSubscriptionContext = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscriptionContext must be used within a SubscriptionProvider');
  }
  return context;
};
