
import { useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { useUserPreferences } from '@/context';
import { useBiometricData } from '@/hooks/useBiometricData';
import { contextAnalysisEngine } from '@/services/ContextAnalysisEngine';
import { toast } from 'sonner';

export interface RealTimeSyncConfig {
  enableBiometricSync?: boolean;
  enableSessionSync?: boolean;
  enableProgressSync?: boolean;
  enableSocialSync?: boolean;
  syncInterval?: number; // milliseconds
}

export const useRealTimeSync = (config: RealTimeSyncConfig = {}) => {
  const { user } = useAuth();
  const { preferences, updatePreferences } = useUserPreferences();
  const { biometricData, refreshBiometricData } = useBiometricData();
  const syncIntervalRef = useRef<NodeJS.Timeout>();
  const channelRef = useRef<any>();
  
  const defaultConfig: RealTimeSyncConfig = {
    enableBiometricSync: true,
    enableSessionSync: true,
    enableProgressSync: true,
    enableSocialSync: true,
    syncInterval: 30000, // 30 seconds
    ...config
  };
  
  // Real-time data synchronization
  const syncData = useCallback(async () => {
    if (!user) return;
    
    try {
      const promises = [];
      
      // Sync biometric data
      if (defaultConfig.enableBiometricSync) {
        promises.push(refreshBiometricData());
      }
      
      // Sync session data (meditation, focus, etc.)
      if (defaultConfig.enableSessionSync) {
        promises.push(syncSessionData());
      }
      
      // Sync progress and achievements
      if (defaultConfig.enableProgressSync) {
        promises.push(syncProgressData());
      }
      
      // Sync social data
      if (defaultConfig.enableSocialSync) {
        promises.push(syncSocialData());
      }
      
      await Promise.allSettled(promises);
      
      // Update context analysis with fresh data
      updateContextAnalysis();
      
    } catch (error) {
      console.error('Real-time sync error:', error);
    }
  }, [user, defaultConfig]);
  
  const syncSessionData = async () => {
    if (!user) return;
    
    try {
      const { data: sessions, error } = await supabase
        .from('meditation_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('started_at', { ascending: false })
        .limit(20);
      
      if (error) throw error;
      
      // Store in session storage for cross-module access
      sessionStorage.setItem('recentSessions', JSON.stringify(sessions || []));
      
    } catch (error) {
      console.error('Session sync error:', error);
    }
  };
  
  const syncProgressData = async () => {
    if (!user) return;
    
    try {
      const { data: achievements, error } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      sessionStorage.setItem('userAchievements', JSON.stringify(achievements || []));
      
    } catch (error) {
      console.error('Progress sync error:', error);
    }
  };
  
  const syncSocialData = async () => {
    if (!user) return;
    
    try {
      const { data: socialProfile, error } = await supabase
        .from('user_social_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      
      sessionStorage.setItem('socialProfile', JSON.stringify(socialProfile || {}));
      
    } catch (error) {
      console.error('Social sync error:', error);
    }
  };
  
  const updateContextAnalysis = () => {
    const sessions = JSON.parse(sessionStorage.getItem('recentSessions') || '[]');
    contextAnalysisEngine.updateContext(preferences, biometricData, sessions);
  };
  
  // Set up real-time subscriptions
  const setupRealTimeSubscriptions = useCallback(() => {
    if (!user) return;
    
    const channel = supabase.channel('user-data-changes')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'biometric_data',
        filter: `user_id=eq.${user.id}`
      }, (payload) => {
        console.log('New biometric data:', payload);
        refreshBiometricData();
        updateContextAnalysis();
        
        // Show real-time feedback
        const data = payload.new as any;
        if (data.stress_score > 70) {
          toast.warning('High stress detected', {
            description: 'Consider taking a breathing break',
            action: {
              label: 'Start Breathing',
              onClick: () => window.location.href = '/breathing?type=stress-relief'
            }
          });
        }
      })
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'meditation_sessions',
        filter: `user_id=eq.${user.id}`
      }, (payload) => {
        console.log('New session started:', payload);
        syncSessionData();
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'meditation_sessions',
        filter: `user_id=eq.${user.id}`
      }, (payload) => {
        console.log('Session updated:', payload);
        syncSessionData();
        updateContextAnalysis();
        
        const session = payload.new as any;
        if (session.completed) {
          toast.success('Session completed!', {
            description: 'Your progress has been updated',
            action: {
              label: 'View Progress',
              onClick: () => window.location.href = '/progress'
            }
          });
        }
      })
      .subscribe();
      
    channelRef.current = channel;
  }, [user, refreshBiometricData]);
  
  // Initialize sync
  useEffect(() => {
    if (!user) return;
    
    // Initial sync
    syncData();
    
    // Set up periodic sync
    if (defaultConfig.syncInterval) {
      syncIntervalRef.current = setInterval(syncData, defaultConfig.syncInterval);
    }
    
    // Set up real-time subscriptions
    setupRealTimeSubscriptions();
    
    return () => {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
      }
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [user, syncData, setupRealTimeSubscriptions]);
  
  return {
    syncData,
    isOnline: navigator.onLine,
    lastSyncTime: new Date() // You could track this more precisely
  };
};
