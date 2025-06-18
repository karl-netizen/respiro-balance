
import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff, Download } from 'lucide-react';
import { useOfflineStorage } from './OfflineStorageProvider';

interface OfflineIndicatorProps {
  sessionId?: string;
  showDownloadCount?: boolean;
  className?: string;
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({
  sessionId,
  showDownloadCount = false,
  className = ''
}) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSessionDownloaded, setIsSessionDownloaded] = useState(false);
  const [offlineCount, setOfflineCount] = useState(0);
  const { isSessionDownloaded: checkDownloaded, getAllOfflineSessions } = useOfflineStorage();

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (sessionId) {
      checkSessionStatus();
    }
    if (showDownloadCount) {
      loadOfflineCount();
    }
  }, [sessionId, showDownloadCount]);

  const checkSessionStatus = async () => {
    if (sessionId) {
      const downloaded = await checkDownloaded(sessionId);
      setIsSessionDownloaded(downloaded);
    }
  };

  const loadOfflineCount = async () => {
    const sessions = await getAllOfflineSessions();
    setOfflineCount(sessions.length);
  };

  if (sessionId) {
    // Session-specific indicator
    if (isSessionDownloaded) {
      return (
        <Badge variant="secondary" className={`text-xs ${className}`}>
          <Download className="h-3 w-3 mr-1" />
          Available Offline
        </Badge>
      );
    }
    return null;
  }

  // General connection indicator
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Badge 
        variant={isOnline ? "secondary" : "destructive"} 
        className="text-xs"
      >
        {isOnline ? (
          <>
            <Wifi className="h-3 w-3 mr-1" />
            Online
          </>
        ) : (
          <>
            <WifiOff className="h-3 w-3 mr-1" />
            Offline
          </>
        )}
      </Badge>
      
      {showDownloadCount && offlineCount > 0 && (
        <Badge variant="outline" className="text-xs">
          <Download className="h-3 w-3 mr-1" />
          {offlineCount} downloaded
        </Badge>
      )}
    </div>
  );
};
