
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';

interface OfflineData {
  id: string;
  type: 'meditation_session' | 'biometric_data' | 'user_preferences';
  data: any;
  timestamp: string;
}

export const useOfflineSync = () => {
  const { user } = useAuth();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingSyncCount, setPendingSyncCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      syncOfflineData();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check for pending sync data on mount
    checkPendingSync();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const storeOfflineData = async (type: OfflineData['type'], data: any) => {
    const offlineItem: OfflineData = {
      id: `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      data,
      timestamp: new Date().toISOString()
    };

    try {
      const existingData = JSON.parse(localStorage.getItem('offline_sync_data') || '[]');
      existingData.push(offlineItem);
      localStorage.setItem('offline_sync_data', JSON.stringify(existingData));
      setPendingSyncCount(existingData.length);
    } catch (error) {
      console.error('Failed to store offline data:', error);
    }
  };

  const syncOfflineData = async () => {
    if (!user || !supabase || !isOnline) return;

    setIsSyncing(true);
    
    try {
      const offlineDataStr = localStorage.getItem('offline_sync_data');
      if (!offlineDataStr) {
        setIsSyncing(false);
        return;
      }

      const offlineData: OfflineData[] = JSON.parse(offlineDataStr);
      const syncPromises = offlineData.map(async (item) => {
        try {
          switch (item.type) {
            case 'meditation_session':
              await supabase.from('meditation_sessions').insert({
                ...item.data,
                user_id: user.id
              });
              break;
            case 'biometric_data':
              await supabase.from('biometric_data').insert({
                ...item.data,
                user_id: user.id
              });
              break;
            case 'user_preferences':
              await supabase.from('user_preferences').upsert({
                ...item.data,
                user_id: user.id
              });
              break;
          }
          return { success: true, id: item.id };
        } catch (error) {
          console.error(`Failed to sync ${item.type}:`, error);
          return { success: false, id: item.id, error };
        }
      });

      const results = await Promise.allSettled(syncPromises);
      const successfulSyncs = results
        .filter((result): result is PromiseFulfilledResult<any> => result.status === 'fulfilled')
        .map(result => result.value)
        .filter(value => value.success);

      // Remove successfully synced items
      const remainingData = offlineData.filter(
        item => !successfulSyncs.some(sync => sync.id === item.id)
      );

      localStorage.setItem('offline_sync_data', JSON.stringify(remainingData));
      setPendingSyncCount(remainingData.length);

      if (successfulSyncs.length > 0) {
        console.log(`Successfully synced ${successfulSyncs.length} offline items`);
      }
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  const checkPendingSync = () => {
    try {
      const offlineData = JSON.parse(localStorage.getItem('offline_sync_data') || '[]');
      setPendingSyncCount(offlineData.length);
    } catch (error) {
      console.error('Failed to check pending sync:', error);
      setPendingSyncCount(0);
    }
  };

  const clearOfflineData = () => {
    localStorage.removeItem('offline_sync_data');
    setPendingSyncCount(0);
  };

  return {
    isOnline,
    pendingSyncCount,
    isSyncing,
    storeOfflineData,
    syncOfflineData,
    clearOfflineData
  };
};
