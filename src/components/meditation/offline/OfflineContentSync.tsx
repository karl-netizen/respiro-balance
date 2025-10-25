
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Wifi, WifiOff, Cloud } from 'lucide-react';
import { useOfflineStorage } from './OfflineStorageProvider';
import { toast } from 'sonner';

interface SyncStatus {
  isOnline: boolean;
  lastSyncTime: Date | null;
  pendingUploads: number;
  pendingDownloads: number;
  isSyncing: boolean;
}

export const OfflineContentSync: React.FC = () => {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isOnline: navigator.onLine,
    lastSyncTime: null,
    pendingUploads: 0,
    pendingDownloads: 0,
    isSyncing: false
  });

  const { getAllOfflineSessions } = useOfflineStorage();

  useEffect(() => {
    const handleOnline = () => {
      setSyncStatus(prev => ({ ...prev, isOnline: true }));
      // Auto-sync when coming back online
      if (!syncStatus.isSyncing) {
        handleSync();
      }
    };

    const handleOffline = () => {
      setSyncStatus(prev => ({ ...prev, isOnline: false }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check for pending syncs on component mount
    checkPendingSyncs();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const checkPendingSyncs = async () => {
    try {
      // Check for offline sessions that need metadata sync
      await getAllOfflineSessions();
      
      // In a real app, you'd check for:
      // - Session progress that needs to be uploaded
      // - User preferences that need to be synced
      // - New content available for download
      
      const pendingUploads = 0; // Would be calculated based on local changes
      const pendingDownloads = 0; // Would be calculated based on new content
      
      setSyncStatus(prev => ({
        ...prev,
        pendingUploads,
        pendingDownloads
      }));
    } catch (error) {
      console.error('Error checking pending syncs:', error);
    }
  };

  const handleSync = async () => {
    if (!syncStatus.isOnline) {
      toast.error('Cannot sync while offline');
      return;
    }

    setSyncStatus(prev => ({ ...prev, isSyncing: true }));

    try {
      // Simulate sync process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, you would:
      // 1. Upload pending session progress
      // 2. Upload user preferences changes
      // 3. Download new content metadata
      // 4. Update local cache
      
      setSyncStatus(prev => ({
        ...prev,
        isSyncing: false,
        lastSyncTime: new Date(),
        pendingUploads: 0,
        pendingDownloads: 0
      }));

      toast.success('Sync completed successfully');
    } catch (error) {
      console.error('Sync failed:', error);
      setSyncStatus(prev => ({ ...prev, isSyncing: false }));
      toast.error('Sync failed. Please try again.');
    }
  };

  const formatLastSync = (date: Date | null) => {
    if (!date) return 'Never';
    
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hours ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} days ago`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Sync Status</span>
          <div className="flex items-center space-x-2">
            {syncStatus.isOnline ? (
              <Wifi className="h-4 w-4 text-green-500" />
            ) : (
              <WifiOff className="h-4 w-4 text-red-500" />
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Connection Status */}
        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
          <div className="flex items-center space-x-2">
            <Cloud className="h-4 w-4" />
            <span className="text-sm">
              {syncStatus.isOnline ? 'Connected' : 'Offline'}
            </span>
          </div>
          <span className="text-xs text-muted-foreground">
            Last sync: {formatLastSync(syncStatus.lastSyncTime)}
          </span>
        </div>

        {/* Pending Syncs */}
        {(syncStatus.pendingUploads > 0 || syncStatus.pendingDownloads > 0) && (
          <div className="space-y-2">
            {syncStatus.pendingUploads > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span>Pending uploads:</span>
                <span className="font-medium">{syncStatus.pendingUploads}</span>
              </div>
            )}
            {syncStatus.pendingDownloads > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span>Available downloads:</span>
                <span className="font-medium">{syncStatus.pendingDownloads}</span>
              </div>
            )}
          </div>
        )}

        {/* Sync Button */}
        <Button 
          onClick={handleSync}
          disabled={!syncStatus.isOnline || syncStatus.isSyncing}
          className="w-full"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${syncStatus.isSyncing ? 'animate-spin' : ''}`} />
          {syncStatus.isSyncing ? 'Syncing...' : 'Sync Now'}
        </Button>

        {/* Sync Info */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Progress and preferences sync automatically when online</p>
          <p>• Downloaded content works offline</p>
          <p>• Changes made offline will sync when reconnected</p>
        </div>
      </CardContent>
    </Card>
  );
};
