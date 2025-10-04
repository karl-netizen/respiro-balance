import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type SubscriptionTier = 'free' | 'standard' | 'premium';
export type BillingCycle = 'monthly' | 'annual';
export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'trialing';

interface SubscriptionState {
  // Subscription details
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  billingCycle: BillingCycle;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  
  // Session usage tracking
  monthStart: string;
  sessionsUsed: number;
  sessionsLimit: number;
  lastReset: string;
  
  // Actions
  getPricing: (tier: SubscriptionTier, cycle: BillingCycle) => number;
  canStartSession: () => boolean;
  incrementSessionCount: () => void;
  getSessionsRemaining: () => number;
  resetMonthlyUsage: () => void;
  upgradeTier: (tier: SubscriptionTier, cycle: BillingCycle) => void;
  downgradeTier: (tier: SubscriptionTier) => void;
  cancelSubscription: () => void;
  reactivateSubscription: () => void;
  checkAndResetIfNewMonth: () => void;
}

const PRICING = {
  standard: {
    monthly: 6.99,
    annual: 59.99
  },
  premium: {
    monthly: 12.99,
    annual: 119.99
  }
};

const SESSION_LIMITS = {
  free: 5,
  standard: 40,
  premium: -1 // unlimited
};

const getFirstOfMonth = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
};

const getEndOfMonth = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString();
};

export const useSubscriptionStore = create<SubscriptionState>()(
  persist(
    (set, get) => ({
      // Initial state
      tier: 'free',
      status: 'active',
      billingCycle: 'monthly',
      currentPeriodEnd: null,
      cancelAtPeriodEnd: false,
      monthStart: getFirstOfMonth(),
      sessionsUsed: 0,
      sessionsLimit: SESSION_LIMITS.free,
      lastReset: new Date().toISOString(),

      getPricing: (tier: SubscriptionTier, cycle: BillingCycle) => {
        if (tier === 'free') return 0;
        return PRICING[tier][cycle];
      },

      canStartSession: () => {
        const state = get();
        
        // Check if we need to reset for new month
        state.checkAndResetIfNewMonth();
        
        // Premium has unlimited sessions
        if (state.tier === 'premium') return true;
        
        // Check if user has sessions remaining
        return state.sessionsUsed < state.sessionsLimit;
      },

      incrementSessionCount: () => {
        set((state) => {
          // Don't increment for premium users
          if (state.tier === 'premium') return state;
          
          return {
            sessionsUsed: state.sessionsUsed + 1
          };
        });
      },

      getSessionsRemaining: () => {
        const state = get();
        
        // Premium has unlimited
        if (state.tier === 'premium') return -1;
        
        return Math.max(0, state.sessionsLimit - state.sessionsUsed);
      },

      resetMonthlyUsage: () => {
        set({
          sessionsUsed: 0,
          monthStart: getFirstOfMonth(),
          lastReset: new Date().toISOString()
        });
      },

      checkAndResetIfNewMonth: () => {
        const state = get();
        const now = new Date();
        const monthStart = new Date(state.monthStart);
        
        // Check if we're in a new month
        if (now.getMonth() !== monthStart.getMonth() || 
            now.getFullYear() !== monthStart.getFullYear()) {
          state.resetMonthlyUsage();
        }
      },

      upgradeTier: (tier: SubscriptionTier, cycle: BillingCycle) => {
        const nextPeriodEnd = new Date();
        nextPeriodEnd.setMonth(nextPeriodEnd.getMonth() + (cycle === 'annual' ? 12 : 1));
        
        set({
          tier,
          status: 'active',
          billingCycle: cycle,
          currentPeriodEnd: nextPeriodEnd.toISOString(),
          cancelAtPeriodEnd: false,
          sessionsLimit: SESSION_LIMITS[tier]
        });
      },

      downgradeTier: (tier: SubscriptionTier) => {
        set((state) => ({
          tier,
          sessionsLimit: SESSION_LIMITS[tier],
          // Keep current period end, downgrade will apply at period end
          cancelAtPeriodEnd: false
        }));
      },

      cancelSubscription: () => {
        set({
          cancelAtPeriodEnd: true,
          status: 'canceled'
        });
      },

      reactivateSubscription: () => {
        set({
          cancelAtPeriodEnd: false,
          status: 'active'
        });
      }
    }),
    {
      name: 'respiro-subscription'
    }
  )
);
