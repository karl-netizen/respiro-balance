
import { supabase } from '@/integrations/supabase/client';
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
    
    toast.loading("Preparing checkout...");
    
    // Call the create-checkout-session edge function
    const { data, error } = await supabase.functions.invoke('create-checkout-session', {
      body: {
        userId: user.id,
        tier
      }
    });
    
    if (error) {
      console.error('Error creating checkout session:', error);
      toast.dismiss();
      toast.error('Payment initiation failed', {
        description: 'Could not start checkout process. Please try again.'
      });
      return;
    }
    
    toast.dismiss();
    
    if (data?.url) {
      // Redirect to Stripe checkout
      window.location.href = data.url;
    } else {
      toast.error('Payment initiation failed', {
        description: 'Invalid response from payment service. Please try again.'
      });
    }
  } catch (error) {
    console.error('Error redirecting to Stripe:', error);
    toast.dismiss();
    toast.error('Payment initiation failed', {
      description: 'Could not start checkout process. Please try again.'
    });
    
    // Fall back to demo mode
    toast.info("Demo Mode", {
      description: "Using demo checkout flow instead."
    });
    
    // After short delay, redirect to subscription page
    setTimeout(() => {
      window.location.href = '/subscription';
    }, 1500);
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
    
    toast.loading("Preparing checkout...");
    
    // Call the create-checkout-session edge function
    const { data, error } = await supabase.functions.invoke('create-checkout-session', {
      body: {
        userId: user.id,
        tier
      }
    });
    
    toast.dismiss();
    
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
    } else {
      toast.error('Payment initiation failed', {
        description: 'Invalid response from payment service. Please try again.'
      });
    }
  } catch (error) {
    console.error('Error opening Stripe in new tab:', error);
    toast.dismiss();
    toast.error('Payment initiation failed', {
      description: 'Could not start checkout process. Please try again.'
    });
    
    // Fall back to demo mode for better UX
    toast.info("Demo Mode", { 
      description: "Opening demo checkout in new tab."
    });
    
    // Open subscription page in a new tab as fallback
    window.open('/subscription', '_blank');
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
    
    toast.loading("Preparing subscription management...");
    
    // Call the create-portal-session edge function
    const { data, error } = await supabase.functions.invoke('create-portal-session', {
      body: {
        userId: user.id
      }
    });
    
    toast.dismiss();
    
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
    } else {
      toast.error('Could not open subscription management', {
        description: 'Invalid response from service. Please try again.'
      });
    }
  } catch (error) {
    console.error('Error opening management portal:', error);
    toast.dismiss();
    toast.error('Could not open subscription management', {
      description: 'An error occurred. Please try again later.'
    });
    
    // Fall back to account page as failover
    toast.info("Demo Mode", {
      description: "Redirecting to subscription management page."
    });
    
    setTimeout(() => {
      window.location.href = '/account?tab=subscription';
    }, 1500);
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
