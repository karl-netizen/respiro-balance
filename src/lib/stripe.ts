import { loadStripe } from '@stripe/stripe-js';
import type { SubscriptionTier } from '@/types/supabase';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

export { stripePromise };

export const createCheckoutSession = async (priceId: string, tier: SubscriptionTier) => {
  // Stripe checkout implementation
  console.log('Creating checkout session for:', { priceId, tier });
  // Implementation would go here
};
