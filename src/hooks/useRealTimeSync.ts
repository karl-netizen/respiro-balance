
import { useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUserPreferences } from '@/context';
import { useBiometricData } from '@/hooks/useBiometricData';
import { contextAnalysisEngine } from '@/services/context-analysis/ContextAnalysisEngine';
import { useSyncOperations } from './sync/useSyncOperations';
import { useRealtimeSubscriptions } from './sync/useRealtimeSubscriptions';
import { RealTimeSyncConfig } from './sync/types';

export const useRealTimeSync = (config: RealTimeSyncConfig = {}) => {
  const { user } = useAuth();
  const { preferences } = useUserPreferences();
  const { biometricData, refreshBiometricData } = useBiometricData();
  const { syncSessionData, syncProgressData, syncSocialData } = useSyncOperations();
  const { setupSubscriptions, cleanup } = useRealtimeSubscriptions();
  const syncIntervalRef = useRef<NodeJS.Timeout>();
  
  const defaultConfig: RealTimeSyncConfig = {
    enableBiometricSync: true,
    enableSessionSync: true,
    enableProgressSync: true,
    enableSocialSync: true,
    syncInterval: 30000,
    ...config
  };
  
  const updateContextAnalysis = useCallback(() => {
    if (!preferences || !biometricData) return;
    
    try {
      const sessions = JSON.parse(sessionStorage.getItem('recentSessions') || '[]');
      contextAnalysisEngine.updateContext(preferences, biometricData, sessions);
    } catch (error) {
      console.error('Context analysis update failed:', error);
    }
  }, [preferences, biometricData]);
  
  const syncData = useCallback(async () => {
    if (!user) return;
    
    try {
      const promises = [];
      
      if (defaultConfig.enableBiometricSync && refreshBiometricData) {
        promises.push(refreshBiometricData());
      }
      
      if (defaultConfig.enableSessionSync) {
        promises.push(syncSessionData());
      }
      
      if (defaultConfig.enableProgressSync) {
        promises.push(syncProgressData());
      }
      
      if (defaultConfig.enableSocialSync) {
        promises.push(syncSocialData());
      }
      
      await Promise.allSettled(promises);
      updateContextAnalysis();
      
    } catch (error) {
      console.error('Real-time sync error:', error);
    }
  }, [user, defaultConfig, refreshBiometricData, syncSessionData, syncProgressData, syncSocialData, updateContextAnalysis]);
  
  useEffect(() => {
    if (!user) return;
    
    // Initial sync
    syncData();
    
    // Setup interval sync
    if (defaultConfig.syncInterval) {
      syncIntervalRef.current = setInterval(syncData, defaultConfig.syncInterval);
    }
    
    // Setup realtime subscriptions
    if (setupSubscriptions) {
      setupSubscriptions();
    }
    
    return () => {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
      }
      if (cleanup) {
        cleanup();
      }
    };
  }, [user, syncData, setupSubscriptions, cleanup, defaultConfig.syncInterval]);
  
  return {
    syncData,
    isOnline: navigator.onLine,
    lastSyncTime: new Date()
  };
};
