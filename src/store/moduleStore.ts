import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getModuleById } from '@/lib/modules/moduleRegistry';

export type SubscriptionTier = 'free' | 'standard' | 'premium';

interface ModuleState {
  subscriptionTier: SubscriptionTier;
  activeModules: string[];
  lastModuleSwap: Date | null;
  devMode: boolean; // Testing mode to bypass subscription requirements
  
  setSubscriptionTier: (tier: SubscriptionTier) => void;
  activateModule: (moduleId: string) => void;
  deactivateModule: (moduleId: string) => void;
  swapModule: (oldModuleId: string, newModuleId: string) => void;
  canActivateModule: (moduleId: string) => boolean;
  canSwapModule: () => boolean;
  getActiveModules: () => string[];
  getDaysUntilNextSwap: () => number;
  toggleDevMode: () => void;
  setDevMode: (enabled: boolean) => void;
}

export const useModuleStore = create<ModuleState>()(
  persist(
    (set, get) => ({
      subscriptionTier: 'free',
      activeModules: [],
      lastModuleSwap: null,
      devMode: false,

      setSubscriptionTier: (tier) => {
        set({ subscriptionTier: tier });
        
        // Auto-activate biofeedback for paid tiers
        if (tier === 'standard' || tier === 'premium') {
          const { activeModules } = get();
          if (!activeModules.includes('biofeedback')) {
            set({ activeModules: [...activeModules, 'biofeedback'] });
          }
        }
      },

      activateModule: (moduleId) => {
        const { activeModules } = get();
        if (!activeModules.includes(moduleId)) {
          set({ activeModules: [...activeModules, moduleId] });
        }
      },

      deactivateModule: (moduleId) => {
        const { activeModules } = get();
        const module = getModuleById(moduleId);
        
        // Can't deactivate always-active modules unless in dev mode
        if (module?.alwaysActive && !get().devMode) {
          return;
        }

        set({ 
          activeModules: activeModules.filter(id => id !== moduleId) 
        });
      },

      swapModule: (oldModuleId, newModuleId) => {
        const { activeModules } = get();

        const newActiveModules = activeModules.map(id => 
          id === oldModuleId ? newModuleId : id
        );

        set({ 
          activeModules: newActiveModules,
          lastModuleSwap: new Date()
        });
      },

      canActivateModule: (moduleId) => {
        const { subscriptionTier, activeModules, devMode } = get();
        
        // Dev mode bypasses all restrictions
        if (devMode) return !activeModules.includes(moduleId);
        
        const module = getModuleById(moduleId);
        
        if (!module) return false;
        if (activeModules.includes(moduleId)) return false;
        if (module.alwaysActive) return false;
        
        // Free tier can't activate any modules
        if (subscriptionTier === 'free') return false;
        
        // Standard tier: max 2 modules (excluding always-active)
        if (subscriptionTier === 'standard') {
          const nonAlwaysActive = activeModules.filter(id => {
            const m = getModuleById(id);
            return m && !m.alwaysActive;
          });
          return nonAlwaysActive.length < 2;
        }
        
        // Premium tier: unlimited
        return true;
      },

      canSwapModule: () => {
        const { subscriptionTier, lastModuleSwap, devMode } = get();
        
        // Dev mode allows unlimited swaps
        if (devMode) return true;
        
        if (subscriptionTier !== 'standard') return false;
        if (!lastModuleSwap) return true;
        
        const daysSinceSwap = Math.floor((Date.now() - new Date(lastModuleSwap).getTime()) / (1000 * 60 * 60 * 24));
        return daysSinceSwap >= 7;
      },

      getDaysUntilNextSwap: () => {
        const { lastModuleSwap, devMode } = get();
        
        // Dev mode always allows swaps
        if (devMode) return 0;
        
        if (!lastModuleSwap) return 0;
        
        const daysSinceSwap = Math.floor((Date.now() - new Date(lastModuleSwap).getTime()) / (1000 * 60 * 60 * 24));
        return Math.max(0, 7 - daysSinceSwap);
      },

      getActiveModules: () => {
        return get().activeModules;
      },

      toggleDevMode: () => {
        set(state => ({ devMode: !state.devMode }));
      },

      setDevMode: (enabled) => {
        set({ devMode: enabled });
      }
    }),
    {
      name: 'respiro-modules'
    }
  )
);
