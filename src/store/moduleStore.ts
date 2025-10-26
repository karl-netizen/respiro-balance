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
      subscriptionTier: 'free' as SubscriptionTier,
      activeModules: [] as string[],
      lastModuleSwap: null as Date | null,
      devMode: process.env.NODE_ENV === 'development' ? false : false,

      setSubscriptionTier: (tier) => {
        set({ subscriptionTier: tier });
        
        const { activeModules } = get();
        
        // Auto-activate modules based on tier
        if (tier === 'standard') {
          // Auto-activate biofeedback for standard
          if (!activeModules.includes('biofeedback')) {
            set({ activeModules: [...get().activeModules, 'biofeedback'] });
          }
        } else if (tier === 'premium') {
          // Auto-activate all modules for premium
          const allModules = ['biofeedback', 'focus', 'morning_rituals', 'social', 'work_life_balance', 'ai_personalization'];
          const newActiveModules = [...new Set([...activeModules, ...allModules])];
          set({ activeModules: newActiveModules });
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
        return daysSinceSwap >= 30;
      },

      getDaysUntilNextSwap: () => {
        const { lastModuleSwap, devMode } = get();
        
        // Dev mode always allows swaps
        if (devMode) return 0;
        
        if (!lastModuleSwap) return 0;
        
        const daysSinceSwap = Math.floor((Date.now() - new Date(lastModuleSwap).getTime()) / (1000 * 60 * 60 * 24));
        return Math.max(0, 30 - daysSinceSwap);
      },

      getActiveModules: () => {
        return get().activeModules;
      },

      toggleDevMode: () => {
        // Only allow toggling in development mode
        if (process.env.NODE_ENV === 'development') {
          set(state => ({ devMode: !state.devMode }));
        }
      },

      setDevMode: (enabled) => {
        // Only allow setting in development mode
        if (process.env.NODE_ENV === 'development') {
          set({ devMode: enabled });
        }
      }
    }),
    {
      name: 'respiro-modules'
    }
  )
);
