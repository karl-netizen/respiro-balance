import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type SubscriptionTier = 'free' | 'standard' | 'premium';
export type BillingCycle = 'monthly' | 'annual';
export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'trialing';

interface Subscription {
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  billingCycle?: BillingCycle;
  currentPeriodEnd?: Date;
  cancelAtPeriodEnd: boolean;
  trialEnd?: Date;
}

interface SessionUsage {
  monthStart: Date;
  sessionsUsed: number;
  sessionsLimit: number;
  lastReset: Date;
}

interface SubscriptionState {
  subscription: Subscription;
  sessionUsage: SessionUsage;
  
  // Computed getters (for backwards compatibility)
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  billingCycle?: BillingCycle;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  sessionsUsed: number;
  sessionsLimit: number;
  
  // Pricing
  getPricing: (tier: Exclude<SubscriptionTier, 'free'>, cycle: BillingCycle) => number;
  
  // Session Management
  canStartSession: () => boolean;
  incrementSessionCount: () => void;
  getSessionsRemaining: () => number;
  resetMonthlyUsage: () => void;
  checkAndResetIfNewMonth: () => void;
  
  // Subscription Actions
  upgradeTier: (tier: Exclude<SubscriptionTier, 'free'>, cycle: BillingCycle) => Promise<void>;
  downgradeTier: (tier: SubscriptionTier) => void;
  cancelSubscription: () => void;
  reactivateSubscription: () => void;
  
  // Helpers
  isTrialing: () => boolean;
  isPaid: () => boolean;
  needsUpgrade: () => boolean;
}

const PRICING = {
  standard: {
    monthly: 6.99,
    annual: 58.99
  },
  premium: {
    monthly: 12.99,
    annual: 116.99
  }
};

const SESSION_LIMITS = {
  free: 5,
  standard: 40,
  premium: -1 // unlimited
};

const getFirstOfMonth = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
};

export const useSubscriptionStore = create<SubscriptionState>()(
  persist(
    (set, get) => ({
      subscription: {
        tier: 'free',
        status: 'active',
        cancelAtPeriodEnd: false
      },
      sessionUsage: {
        monthStart: getFirstOfMonth(),
        sessionsUsed: 0,
        sessionsLimit: SESSION_LIMITS.free,
        lastReset: new Date()
      },
      
      // Computed properties for backwards compatibility
      get tier() {
        return get().subscription.tier;
      },
      get status() {
        return get().subscription.status;
      },
      get billingCycle() {
        return get().subscription.billingCycle;
      },
      get currentPeriodEnd() {
        return get().subscription.currentPeriodEnd?.toISOString() || null;
      },
      get cancelAtPeriodEnd() {
        return get().subscription.cancelAtPeriodEnd;
      },
      get sessionsUsed() {
        return get().sessionUsage.sessionsUsed;
      },
      get sessionsLimit() {
        return get().sessionUsage.sessionsLimit;
      },

      getPricing: (tier, cycle) => {
        return PRICING[tier][cycle];
      },

      canStartSession: () => {
        const { subscription, sessionUsage } = get();
        
        // Check if we need to reset for new month
        get().checkAndResetIfNewMonth();
        
        // Premium has unlimited sessions
        if (subscription.tier === 'premium') return true;
        
        // Check if user has sessions remaining
        return sessionUsage.sessionsUsed < sessionUsage.sessionsLimit;
      },

      incrementSessionCount: () => {
        set((state) => {
          // Don't increment for premium users
          if (state.subscription.tier === 'premium') return state;
          
          return {
            sessionUsage: {
              ...state.sessionUsage,
              sessionsUsed: state.sessionUsage.sessionsUsed + 1
            }
          };
        });
      },

      getSessionsRemaining: () => {
        const { subscription, sessionUsage } = get();
        
        // Premium has unlimited
        if (subscription.tier === 'premium') return -1;
        
        return Math.max(0, sessionUsage.sessionsLimit - sessionUsage.sessionsUsed);
      },

      resetMonthlyUsage: () => {
        const { subscription } = get();
        const now = new Date();
        const monthStart = getFirstOfMonth();
        
        set({
          sessionUsage: {
            monthStart,
            sessionsUsed: 0,
            sessionsLimit: SESSION_LIMITS[subscription.tier],
            lastReset: now
          }
        });
      },

      checkAndResetIfNewMonth: () => {
        const { sessionUsage } = get();
        const now = new Date();
        const monthStart = new Date(sessionUsage.monthStart);
        
        // Check if we're in a new month
        if (now.getMonth() !== monthStart.getMonth() || 
            now.getFullYear() !== monthStart.getFullYear()) {
          get().resetMonthlyUsage();
        }
      },

      upgradeTier: async (tier, cycle) => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const now = new Date();
        const periodEnd = new Date();
        if (cycle === 'monthly') {
          periodEnd.setMonth(periodEnd.getMonth() + 1);
        } else {
          periodEnd.setFullYear(periodEnd.getFullYear() + 1);
        }
        
        set({
          subscription: {
            tier,
            status: 'active',
            billingCycle: cycle,
            currentPeriodEnd: periodEnd,
            cancelAtPeriodEnd: false
          }
        });
        
        // Update session limit
        set(state => ({
          sessionUsage: {
            ...state.sessionUsage,
            sessionsLimit: SESSION_LIMITS[tier]
          }
        }));
        
        // Update module store
        const { useModuleStore } = await import('./moduleStore');
        useModuleStore.getState().setSubscriptionTier(tier);
      },

      downgradeTier: (tier) => {
        set(state => ({
          subscription: {
            ...state.subscription,
            tier,
            cancelAtPeriodEnd: false
          },
          sessionUsage: {
            ...state.sessionUsage,
            sessionsLimit: SESSION_LIMITS[tier]
          }
        }));
      },

      cancelSubscription: () => {
        set(state => ({
          subscription: {
            ...state.subscription,
            status: 'canceled',
            cancelAtPeriodEnd: true
          }
        }));
      },

      reactivateSubscription: () => {
        set(state => ({
          subscription: {
            ...state.subscription,
            status: 'active',
            cancelAtPeriodEnd: false
          }
        }));
      },

      isTrialing: () => {
        const { subscription } = get();
        if (!subscription.trialEnd) return false;
        return new Date() < new Date(subscription.trialEnd);
      },

      isPaid: () => {
        const { subscription } = get();
        return subscription.tier !== 'free';
      },

      needsUpgrade: () => {
        const { subscription } = get();
        return subscription.tier === 'free';
      }
    }),
    {
      name: 'respiro-subscription'
    }
  )
);
