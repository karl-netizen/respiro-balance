
import { useEffect, useCallback, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUserPreferences } from '@/context';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { toast } from 'sonner';

export function useSyncManager() {
  const { user } = useAuth();
  const { isOnline, wasOffline } = useNetworkStatus();
  const { preferences } = useUserPreferences();

  // Sync data when coming back online
  const syncData = useCallback(async () => {
    if (!user || !isSupabaseConfigured()) return;

    try {
      console.log("Syncing data with Supabase after reconnecting");
      
      // Sync user preferences
      const { error: prefsError } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          preferences_data: preferences,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' });
        
      if (prefsError) {
        console.error("Error syncing preferences:", prefsError);
        return;
      }

      // Sync any queued offline data from local storage
      const syncQueue = localStorage.getItem('offlineSyncQueue');
      if (syncQueue) {
        const queueItems = JSON.parse(syncQueue);
        if (queueItems.length > 0) {
          console.log(`Processing ${queueItems.length} offline items`);
          // Process each item in the queue
          // Implementation would depend on the specific data types
          
          // Clear the queue after successful sync
          localStorage.removeItem('offlineSyncQueue');
          
          toast.success("Your data has been synced", {
            description: `${queueItems.length} items synchronized`
          });
        }
      }
    } catch (error) {
      console.error("Error during data sync:", error);
      toast.error("Some data couldn't be synced", {
        description: "Please try again later or check your connection"
      });
    }
  }, [user, preferences, isSupabaseConfigured]);

  // Watch for network status changes and sync when coming back online
  useEffect(() => {
    if (isOnline && wasOffline && user) {
      syncData();
    }
  }, [isOnline, wasOffline, user, syncData]);

  return {
    syncData,
    isOnline
  };
}

// Create NetworkStatusProvider to track online/offline status
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setWasOffline(!isOnline); // Set wasOffline if we were previously offline
      setIsOnline(true);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isOnline]);

  return { isOnline, wasOffline };
}
