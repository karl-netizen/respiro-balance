import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MODULE_REGISTRY } from '@/lib/modules/moduleRegistry';

export type SubscriptionTier = 'free' | 'standard' | 'premium';

interface ModuleState {
  subscriptionTier: SubscriptionTier;
  activeModules: string[];
  lastModuleSwap: Date | null;
  
  // Actions
  setSubscriptionTier: (tier: SubscriptionTier) => void;
  activateModule: (moduleId: string) => boolean;
  deactivateModule: (moduleId: string) => void;
  swapModule: (oldModuleId: string, newModuleId: string) => boolean;
  canActivateModule: (moduleId: string) => boolean;
  canSwapModule: () => boolean;
  getActiveModules: () => string[];
  getDaysUntilNextSwap: () => number;
}

export const useModuleStore = create<ModuleState>()(
  persist(
    (set, get) => ({
      subscriptionTier: 'free',
      activeModules: [],
      lastModuleSwap: null,

      setSubscriptionTier: (tier) => {
        set({ subscriptionTier: tier });
        
        // Auto-activate biofeedback for Standard & Premium
        if (tier === 'standard' || tier === 'premium') {
          const { activeModules } = get();
          if (!activeModules.includes('biofeedback')) {
            set({ activeModules: [...activeModules, 'biofeedback'] });
          }
        }
        
        // Auto-activate all modules for Premium
        if (tier === 'premium') {
          const allModuleIds = Object.keys(MODULE_REGISTRY);
          set({ activeModules: allModuleIds });
        }
        
        // Clear modules if downgrading to Free
        if (tier === 'free') {
          set({ activeModules: [] });
        }
      },

      activateModule: (moduleId) => {
        const { canActivateModule, activeModules } = get();
        
        if (!canActivateModule(moduleId)) {
          return false;
        }

        set({ activeModules: [...activeModules, moduleId] });
        return true;
      },

      deactivateModule: (moduleId) => {
        const { activeModules } = get();
        const module = MODULE_REGISTRY[moduleId];
        
        // Can't deactivate always-active modules
        if (module?.alwaysActive) {
          return;
        }

        set({ 
          activeModules: activeModules.filter(id => id !== moduleId) 
        });
      },

      swapModule: (oldModuleId, newModuleId) => {
        const { canSwapModule, activeModules } = get();
        
        if (!canSwapModule()) {
          return false;
        }

        const newActiveModules = activeModules.map(id => 
          id === oldModuleId ? newModuleId : id
        );

        set({ 
          activeModules: newActiveModules,
          lastModuleSwap: new Date()
        });
        
        return true;
      },

      canActivateModule: (moduleId) => {
        const { subscriptionTier, activeModules } = get();
        const module = MODULE_REGISTRY[moduleId];
        
        if (!module) return false;
        if (activeModules.includes(moduleId)) return false;

        // Free users can't activate modules
        if (subscriptionTier === 'free') return false;

        // Premium users can activate anything
        if (subscriptionTier === 'premium') return true;

        // Standard users: biofeedback is auto-activated, can choose 1 more
        const nonBiofeedbackModules = activeModules.filter(
          id => id !== 'biofeedback'
        );
        
        return nonBiofeedbackModules.length < 1;
      },

      canSwapModule: () => {
        const { subscriptionTier, lastModuleSwap } = get();
        
        // Premium users can't swap (all active)
        if (subscriptionTier === 'premium') return false;
        
        // Free users can't swap (no modules)
        if (subscriptionTier === 'free') return false;

        // Standard users can swap once per month
        if (!lastModuleSwap) return true;

        const daysSinceLastSwap = Math.floor(
          (Date.now() - new Date(lastModuleSwap).getTime()) / (1000 * 60 * 60 * 24)
        );
        
        return daysSinceLastSwap >= 30;
      },

      getDaysUntilNextSwap: () => {
        const { lastModuleSwap } = get();
        
        if (!lastModuleSwap) return 0;

        const daysSinceLastSwap = Math.floor(
          (Date.now() - new Date(lastModuleSwap).getTime()) / (1000 * 60 * 60 * 24)
        );
        
        const daysRemaining = 30 - daysSinceLastSwap;
        return Math.max(0, daysRemaining);
      },

      getActiveModules: () => {
        return get().activeModules;
      }
    }),
    {
      name: 'respiro-modules'
    }
  )
);
