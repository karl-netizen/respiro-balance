
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from './card';
import { TouchFriendlyButton } from '@/components/responsive/TouchFriendlyButton';
import { WifiOff, Wifi, RefreshCw } from 'lucide-react';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';

export const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOfflineMessage, setShowOfflineMessage] = useState(false);
  const { deviceType } = useDeviceDetection();

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineMessage(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineMessage(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRetry = () => {
    // Force a network check by trying to fetch a small resource
    fetch('/favicon.ico', { method: 'HEAD', cache: 'no-cache' })
      .then(() => {
        setIsOnline(true);
        setShowOfflineMessage(false);
      })
      .catch(() => {
        setIsOnline(false);
        setShowOfflineMessage(true);
      });
  };

  if (!showOfflineMessage && isOnline) {
    return null;
  }

  const isMobile = deviceType === 'mobile';

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 ${isMobile ? 'p-2' : 'p-4'}`}>
      <Card className={`border-orange-200 bg-orange-50 ${isMobile ? 'mx-2' : 'max-w-md mx-auto'}`}>
        <CardContent className={`${isMobile ? 'p-3' : 'p-4'}`}>
          <div className="flex items-center gap-3">
            <WifiOff className={`text-orange-600 ${isMobile ? 'h-5 w-5' : 'h-6 w-6'} flex-shrink-0`} />
            <div className="flex-1 min-w-0">
              <p className={`font-medium text-orange-800 ${isMobile ? 'text-sm' : 'text-base'}`}>
                No internet connection
              </p>
              <p className={`text-orange-600 ${isMobile ? 'text-xs' : 'text-sm'} mt-1`}>
                Some features may not work properly while offline.
              </p>
            </div>
            <TouchFriendlyButton
              variant="outline"
              size={isMobile ? 'sm' : 'default'}
              onClick={handleRetry}
              className={`flex items-center gap-2 ${isMobile ? 'h-10 px-3' : ''}`}
              hapticFeedback={true}
            >
              <RefreshCw className="h-4 w-4" />
              {!isMobile && 'Retry'}
            </TouchFriendlyButton>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export const OnlineStatusIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { deviceType } = useDeviceDetection();

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

  const isMobile = deviceType === 'mobile';

  return (
    <div className={`flex items-center gap-2 ${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground`}>
      {isOnline ? (
        <>
          <Wifi className="h-4 w-4 text-green-500" />
          <span>Online</span>
        </>
      ) : (
        <>
          <WifiOff className="h-4 w-4 text-red-500" />
          <span>Offline</span>
        </>
      )}
    </div>
  );
};

export default OfflineIndicator;
