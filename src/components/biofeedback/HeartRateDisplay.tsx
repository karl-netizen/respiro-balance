import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Bluetooth, Power } from 'lucide-react';
import { useHeartRateMonitor } from '@/hooks/useHeartRateMonitor';
import { Badge } from '@/components/ui/badge';

// PRODUCTION MODE: Real devices only - no demo/simulation
console.log('🎯 HeartRateDisplay: PRODUCTION MODE - Live connections only');

export const HeartRateDisplay: React.FC = () => {
  const {
    isConnected,
    isConnecting,
    heartRate,
    deviceInfo,
    lastUpdate,
    connect,
    disconnect,
    isSupported
  } = useHeartRateMonitor();

  const formatLastUpdate = (date: Date | null) => {
    if (!date) return 'Never';
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 5) return 'Just now';
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ago`;
  };

  if (!isSupported) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-destructive" />
            Bluetooth Not Supported
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-4">
              Your browser doesn't support Web Bluetooth API.
            </p>
            <p className="text-sm text-muted-foreground">
              Please use Chrome, Edge, or Opera browser, or install the native mobile app for iOS/Android.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className={`h-5 w-5 ${isConnected ? 'text-success' : 'text-muted-foreground'}`} />
            Heart Rate Monitor
          </div>
          {isConnected && (
            <Badge variant="secondary" className="gap-1 bg-success/20 text-success border-success/30">
              <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
              Live
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Connection Status */}
        <div className="space-y-2">
          {deviceInfo && (
            <div className="flex items-center justify-between p-3 bg-success/10 border border-success/20 rounded-lg">
              <div className="flex items-center gap-3">
                <Bluetooth className="h-4 w-4 text-success" />
                <div>
                  <div className="font-medium text-sm">{deviceInfo.name}</div>
                  <div className="text-xs text-muted-foreground">
                    Last update: {formatLastUpdate(lastUpdate)}
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={disconnect}
                className="h-8"
              >
                <Power className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Heart Rate Display */}
        <div className="text-center py-6">
          {isConnected ? (
            <>
              <div className="text-6xl font-bold text-primary mb-2">
                {heartRate}
              </div>
              <div className="text-sm text-muted-foreground">BPM</div>
            </>
          ) : (
            <>
              <div className="text-6xl font-bold text-muted-foreground mb-2">
                --
              </div>
              <div className="text-sm text-muted-foreground">
                No device connected
              </div>
            </>
          )}
        </div>

        {/* Connect Button */}
        {!isConnected && (
          <div className="space-y-3">
            <Button
              onClick={connect}
              disabled={isConnecting}
              className="w-full"
            >
              <Bluetooth className="h-4 w-4 mr-2" />
              {isConnecting ? 'Connecting...' : 'Connect Device'}
            </Button>
            
            <div className="text-xs text-center text-muted-foreground space-y-1">
              <p><strong>🎯 PRODUCTION MODE:</strong> Real devices only</p>
              <p>Make sure your device is:</p>
              <ul className="list-disc list-inside">
                <li>Turned on and charged</li>
                <li>In pairing mode (not connected to other devices)</li>
                <li>Within 10 meters range</li>
                <li>For Fitbit: Start an Exercise session first</li>
              </ul>
              <p className="text-xs pt-2 opacity-75">
                Supported: Fitbit Inspire 2, Polar, Garmin, and most BLE HR monitors
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HeartRateDisplay;
