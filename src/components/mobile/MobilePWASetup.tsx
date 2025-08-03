
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Download, Smartphone, Wifi, WifiOff } from 'lucide-react';
import { useDeviceDetection } from '@/hooks/core/useDeviceDetection';

interface PWAInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const MobilePWASetup: React.FC = () => {
  const { isMobile } = useDeviceDetection();
  const [deferredPrompt, setDeferredPrompt] = useState<PWAInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isPWAInstalled, setIsPWAInstalled] = useState(false);

  useEffect(() => {
    // Listen for PWA install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as PWAInstallPromptEvent);
      setShowInstallPrompt(true);
    };

    // Check if app is already installed
    const checkPWAInstalled = () => {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsPWAInstalled(true);
      }
    };

    // Online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    checkPWAInstalled();

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleInstallPWA = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setShowInstallPrompt(false);
      setIsPWAInstalled(true);
    }
    
    setDeferredPrompt(null);
  };

  const dismissInstallPrompt = () => {
    setShowInstallPrompt(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  // Don't show if already installed or dismissed
  if (isPWAInstalled || localStorage.getItem('pwa-install-dismissed')) {
    return null;
  }

  return (
    <>
      {/* Offline Indicator */}
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 bg-orange-500 text-white text-center py-2 z-50">
          <div className="flex items-center justify-center gap-2">
            <WifiOff className="w-4 h-4" />
            <span className="text-sm">You're offline. Some features may be limited.</span>
          </div>
        </div>
      )}

      {/* PWA Install Prompt */}
      {showInstallPrompt && isMobile && (
        <div className="fixed bottom-4 left-4 right-4 z-50">
          <Card className="shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                    <Smartphone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Install Respiro Balance</h3>
                    <p className="text-sm text-muted-foreground">
                      Get the full app experience with offline access
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={dismissInstallPrompt}
                  className="p-1"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="flex gap-2">
                <Button onClick={handleInstallPWA} className="flex-1">
                  <Download className="w-4 h-4 mr-2" />
                  Install App
                </Button>
                <Button variant="outline" onClick={dismissInstallPrompt}>
                  Not Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};
