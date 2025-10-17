import { useEffect } from 'react';
import { useSubscriptionStore } from '@/features/subscription';

/**
 * Component that monitors subscription state and handles automatic resets
 * This should be mounted at the app level
 */
export const SubscriptionMonitor: React.FC = () => {
  const checkAndResetIfNewMonth = useSubscriptionStore((state) => state.checkAndResetIfNewMonth);

  useEffect(() => {
    // Check on mount
    checkAndResetIfNewMonth();

    // Check every hour
    const interval = setInterval(() => {
      checkAndResetIfNewMonth();
    }, 1000 * 60 * 60); // 1 hour

    return () => clearInterval(interval);
  }, [checkAndResetIfNewMonth]);

  return null; // This component doesn't render anything
};
