
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PaymentSystemHook {
  createCheckoutSession: (tier: string, billingPeriod: 'monthly' | 'yearly') => Promise<string | null>;
  createBillingPortalSession: () => Promise<string | null>;
  checkSubscriptionStatus: () => Promise<any>;
  isLoading: boolean;
  error: string | null;
}

export const usePaymentSystem = (): PaymentSystemHook => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCheckoutSession = async (tier: string, billingPeriod: 'monthly' | 'yearly'): Promise<string | null> => {
    if (!user) {
      setError('User must be authenticated');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: functionError } = await supabase.functions.invoke('create-checkout-session', {
        body: {
          priceId: '', // We'll create the price dynamically in the edge function
          userId: user.id,
          email: user.email || '',
          tier,
          billingPeriod,
          successUrl: `${window.location.origin}/subscription/success`,
          cancelUrl: `${window.location.origin}/subscription`,
        },
      });

      if (functionError) {
        throw new Error(functionError.message);
      }

      return data.url;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create checkout session';
      setError(errorMessage);
      toast.error('Payment Error', {
        description: errorMessage
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const checkSubscriptionStatus = async () => {
    if (!user) {
      setError('User must be authenticated');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: functionError } = await supabase.functions.invoke('check-subscription');

      if (functionError) {
        throw new Error(functionError.message);
      }

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to check subscription status';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const createBillingPortalSession = async (): Promise<string | null> => {
    if (!user) {
      setError('User must be authenticated');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: functionError } = await supabase.functions.invoke('create-billing-portal', {
        body: {
          userId: user.id,
          returnUrl: `${window.location.origin}/subscription`,
        },
      });

      if (functionError) {
        throw new Error(functionError.message);
      }

      return data.url;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create billing portal session';
      setError(errorMessage);
      toast.error('Billing Portal Error', {
        description: errorMessage
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createCheckoutSession,
    createBillingPortalSession,
    checkSubscriptionStatus,
    isLoading,
    error,
  };
};
