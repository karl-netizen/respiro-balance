
import { supabase } from './supabase';
import { toast } from 'sonner';

/**
 * Initiates a Stripe checkout flow for subscription
 */
export const redirectToStripePayment = async (tier: 'premium' | 'team' = 'premium'): Promise<void> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error("Authentication required", {
        description: "Please sign in to upgrade your subscription"
      });
      return;
    }
    
    // Call the create-checkout-session edge function
    const { data, error } = await supabase.functions.invoke('create-checkout-session', {
      body: {
        userId: user.id,
        tier
      }
    });
    
    if (error) {
      console.error('Error creating checkout session:', error);
      toast.error('Payment initiation failed', {
        description: 'Could not start checkout process. Please try again.'
      });
      return;
    }
    
    if (data?.url) {
      // Redirect to Stripe checkout
      window.location.href = data.url;
    }
  } catch (error) {
    console.error('Error redirecting to Stripe:', error);
    toast.error('Payment initiation failed', {
      description: 'Could not start checkout process. Please try again.'
    });
  }
};

/**
 * Opens Stripe checkout in a new tab
 */
export const openStripePaymentInNewTab = async (tier: 'premium' | 'team' = 'premium'): Promise<void> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error("Authentication required", {
        description: "Please sign in to upgrade your subscription"
      });
      return;
    }
    
    // Call the create-checkout-session edge function
    const { data, error } = await supabase.functions.invoke('create-checkout-session', {
      body: {
        userId: user.id,
        tier
      }
    });
    
    if (error) {
      console.error('Error creating checkout session:', error);
      toast.error('Payment initiation failed', {
        description: 'Could not start checkout process. Please try again.'
      });
      return;
    }
    
    if (data?.url) {
      // Open Stripe checkout in a new tab
      window.open(data.url, '_blank');
    }
  } catch (error) {
    console.error('Error opening Stripe in new tab:', error);
    toast.error('Payment initiation failed', {
      description: 'Could not start checkout process. Please try again.'
    });
  }
};

/**
 * Opens Stripe Customer Portal for subscription management
 */
export const openStripeManagementPortal = async (): Promise<void> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error("Authentication required", {
        description: "Please sign in to manage your subscription"
      });
      return;
    }
    
    // Call the create-portal-session edge function
    const { data, error } = await supabase.functions.invoke('create-portal-session', {
      body: {
        userId: user.id
      }
    });
    
    if (error) {
      console.error('Error creating portal session:', error);
      toast.error('Could not open subscription management', {
        description: 'An error occurred. Please try again later.'
      });
      return;
    }
    
    if (data?.url) {
      // Redirect to Stripe customer portal
      window.location.href = data.url;
    }
  } catch (error) {
    console.error('Error opening management portal:', error);
    toast.error('Could not open subscription management', {
      description: 'An error occurred. Please try again later.'
    });
  }
};

/**
 * Checks the current subscription status
 */
export const checkSubscriptionStatus = async (): Promise<{
  subscribed: boolean;
  tier?: string;
  status?: string;
  period_end?: string | null;
} | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return null;
    }
    
    // Call the check-subscription edge function
    const { data, error } = await supabase.functions.invoke('check-subscription', {
      body: {
        userId: user.id
      }
    });
    
    if (error) {
      console.error('Error checking subscription:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error checking subscription status:', error);
    return null;
  }
};
