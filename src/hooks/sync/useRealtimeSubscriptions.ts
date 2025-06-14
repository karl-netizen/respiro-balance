
import { useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { useBiometricData } from '@/hooks/useBiometricData';
import { useSyncHandlers } from './useSyncHandlers';
import { useSyncOperations } from './useSyncOperations';

export const useRealtimeSubscriptions = () => {
  const { user } = useAuth();
  const { refreshBiometricData } = useBiometricData();
  const { handleBiometricUpdate, handleSessionUpdate, handleSessionStart } = useSyncHandlers();
  const { syncSessionData } = useSyncOperations();
  const channelRef = useRef<any>();

  const setupSubscriptions = useCallback(() => {
    if (!user) return;
    
    const channel = supabase.channel('user-data-changes')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'biometric_data',
        filter: `user_id=eq.${user.id}`
      }, (payload) => {
        handleBiometricUpdate(payload);
        refreshBiometricData();
      })
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'meditation_sessions',
        filter: `user_id=eq.${user.id}`
      }, (payload) => {
        handleSessionStart(payload);
        syncSessionData();
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'meditation_sessions',
        filter: `user_id=eq.${user.id}`
      }, (payload) => {
        handleSessionUpdate(payload);
        syncSessionData();
      })
      .subscribe();
      
    channelRef.current = channel;
  }, [user, handleBiometricUpdate, handleSessionUpdate, handleSessionStart, refreshBiometricData, syncSessionData]);

  const cleanup = useCallback(() => {
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }
  }, []);

  return {
    setupSubscriptions,
    cleanup
  };
};
