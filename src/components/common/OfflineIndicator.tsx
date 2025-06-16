
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { WifiOff, Wifi, RotateCcw, Cloud } from 'lucide-react';
import { useOfflineSync } from '@/hooks/useOfflineSync';

const OfflineIndicator: React.FC = () => {
  const { isOnline, pendingSyncCount, isSyncing, syncOfflineData } = useOfflineSync();

  if (isOnline && pendingSyncCount === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white border rounded-lg shadow-lg p-3 max-w-sm">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {isOnline ? (
              <Wifi className="h-4 w-4 text-green-500" />
            ) : (
              <WifiOff className="h-4 w-4 text-red-500" />
            )}
            <span className="text-sm font-medium">
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>

          {pendingSyncCount > 0 && (
            <>
              <Badge variant="outline">
                {pendingSyncCount} pending
              </Badge>
              
              {isOnline && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={syncOfflineData}
                  disabled={isSyncing}
                  className="h-8"
                >
                  {isSyncing ? (
                    <RotateCcw className="h-3 w-3 animate-spin" />
                  ) : (
                    <Cloud className="h-3 w-3" />
                  )}
                  {isSyncing ? 'Syncing...' : 'Sync'}
                </Button>
              )}
            </>
          )}
        </div>

        {!isOnline && (
          <p className="text-xs text-muted-foreground mt-2">
            Your data will sync automatically when you're back online.
          </p>
        )}
      </div>
    </div>
  );
};

export default OfflineIndicator;
