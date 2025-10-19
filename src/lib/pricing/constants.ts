/**
 * PRICING CONSTANTS - Single Source of Truth
 *
 * ⚠️ IMPORTANT: These are the ONLY correct prices for Respiro Balance
 * All components MUST reference this file for pricing information
 *
 * Last Updated: 2025-10-19
 * Pricing Model: 3-Tier (Free, Standard, Premium)
 */

export const PRICING = {
  // Free Tier
  FREE: {
    monthly: 0,
    annual: 0,
    displayName: 'Free',
    sessions: 5,
    features: [
      '5 meditation sessions per month',
      'Basic guided meditations',
      'Progress tracking',
      'Mobile app access'
    ]
  },

  // Standard Tier ($6.99/mo or $58.99/year)
  STANDARD: {
    monthly: 6.99,
    annual: 58.99,
    displayName: 'Standard',
    sessions: 50,
    savings: {
      monthly: 0,
      annual: 25.89, // Save $25.89/year (12 * 6.99 - 58.99)
      percentage: 30 // Save 30% with annual
    },
    features: [
      '50 meditation sessions per month',
      'All guided meditations',
      'Advanced progress tracking',
      'Breathing exercises',
      'Focus timer',
      'Offline access'
    ]
  },

  // Premium Tier ($12.99/mo or $116.99/year)
  PREMIUM: {
    monthly: 12.99,
    annual: 116.99,
    displayName: 'Premium',
    sessions: Infinity, // Unlimited
    savings: {
      monthly: 0,
      annual: 38.89, // Save $38.89/year (12 * 12.99 - 116.99)
      percentage: 25 // Save 25% with annual
    },
    features: [
      'Unlimited meditation sessions',
      'Everything in Standard',
      'AI-powered personalization',
      'Advanced biofeedback integration',
      'Expert-led masterclasses',
      'Priority support',
      'Group challenges',
      'Enhanced sleep stories'
    ]
  }
} as const;

/**
 * Helper to get formatted price string
 */
export function formatPrice(price: number, billingCycle: 'monthly' | 'annual' = 'monthly'): string {
  if (price === 0) return 'Free';

  const formattedPrice = price.toFixed(2);
  const period = billingCycle === 'monthly' ? '/month' : '/year';

  return `$${formattedPrice}${period}`;
}

/**
 * Helper to calculate savings
 */
export function calculateSavings(tier: 'STANDARD' | 'PREMIUM'): {
  amount: number;
  percentage: number;
  formatted: string;
} {
  const tierPricing = PRICING[tier];
  const monthlyCost = tierPricing.monthly * 12;
  const annualCost = tierPricing.annual;
  const savings = monthlyCost - annualCost;
  const percentage = Math.round((savings / monthlyCost) * 100);

  return {
    amount: savings,
    percentage,
    formatted: `$${savings.toFixed(2)}`
  };
}

/**
 * Get tier pricing by name
 */
export function getTierPricing(tier: 'free' | 'standard' | 'premium') {
  const tierMap = {
    free: PRICING.FREE,
    standard: PRICING.STANDARD,
    premium: PRICING.PREMIUM
  };

  return tierMap[tier] || PRICING.FREE;
}

/**
 * Stripe Price IDs (Update these with your actual Stripe price IDs)
 * These should match your Stripe dashboard configuration
 */
export const STRIPE_PRICE_IDS = {
  STANDARD_MONTHLY: 'price_standard_monthly', // Replace with actual Stripe price ID
  STANDARD_ANNUAL: 'price_standard_annual',   // Replace with actual Stripe price ID
  PREMIUM_MONTHLY: 'price_premium_monthly',   // Replace with actual Stripe price ID
  PREMIUM_ANNUAL: 'price_premium_annual'      // Replace with actual Stripe price ID
} as const;

/**
 * Deprecated tiers (for backward compatibility only)
 * These tiers no longer exist in the current pricing model
 */
export const DEPRECATED_TIERS = {
  PREMIUM_PRO: {
    notice: '⚠️ Premium Pro has been merged into Premium tier',
    redirectTo: 'premium'
  },
  PREMIUM_PLUS: {
    notice: '⚠️ Premium Plus has been merged into Premium tier',
    redirectTo: 'premium'
  }
} as const;
