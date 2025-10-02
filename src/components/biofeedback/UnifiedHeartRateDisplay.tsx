import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, Bluetooth, Activity } from 'lucide-react';
import { UnifiedHeartRateManager } from '@/services/biofeedback/UnifiedHeartRateManager';
import { toast } from 'sonner';
import FitbitConnectionCard from './FitbitConnectionCard';

/**
 * Unified Heart Rate Display
 * Supports both Bluetooth and Fitbit API connections
 */
export const UnifiedHeartRateDisplay: React.FC = () => {
  const [manager] = useState(() => new UnifiedHeartRateManager());
  const [heartRate, setHeartRate] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [deviceName, setDeviceName] = useState<string>('');
  const [connectionSource, setConnectionSource] = useState<'bluetooth' | 'fitbit' | null>(null);
  const [isRealTime, setIsRealTime] = useState(false);

  useEffect(() => {
    // Setup data listener
    manager.onData((data) => {
      if (data.type === 'heartrate') {
        setHeartRate(data.heartRate || 0);
        setIsRealTime(data.isRealTime || false);
        setConnectionSource(data.source as 'bluetooth' | 'fitbit');
      } else if (data.type === 'disconnected') {
        setIsConnected(false);
        setConnectionSource(null);
        setHeartRate(0);
        toast.info('Device disconnected');
      }
    });

    // Check for Fitbit OAuth callback
    const urlParams = new URLSearchParams(window.location.search);
    const autoConnect = urlParams.get('autoConnectFitbit');
    
    if (autoConnect === 'true' && manager.isFitbitAuthenticated()) {
      handleConnectFitbit();
    }
  }, [manager]);

  const handleConnectBluetooth = async () => {
    setIsConnecting(true);
    
    try {
      const result = await manager.connectBluetooth();
      
      if (result.success) {
        setIsConnected(true);
        setDeviceName(result.deviceName || 'Bluetooth Device');
        setConnectionSource('bluetooth');
        toast.success('Connected', {
          description: result.message
        });
      } else {
        toast.error('Connection failed', {
          description: result.message
        });
      }
    } catch (error: any) {
      toast.error('Connection failed', {
        description: error.message
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleConnectFitbit = () => {
    const result = manager.connectFitbit();
    
    if (result.success) {
      setIsConnected(true);
      setDeviceName(result.deviceName || 'Fitbit Device');
      setConnectionSource('fitbit');
    }
  };

  const handleDisconnect = async () => {
    await manager.disconnect();
    setIsConnected(false);
    setConnectionSource(null);
    setHeartRate(0);
    setDeviceName('');
  };

  if (!navigator.bluetooth && !manager.isFitbitAuthenticated()) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-destructive" />
            Connection Not Available
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-4">
              Your browser doesn't support Bluetooth.
            </p>
            <p className="text-sm text-muted-foreground">
              Consider using Fitbit API integration instead.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Heart Rate Display */}
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
                {isRealTime ? 'Real-time' : 'Synced'}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current Heart Rate */}
          <div className="text-center py-6">
            {isConnected ? (
              <>
                <div className="text-6xl font-bold text-primary mb-2">
                  {heartRate}
                </div>
                <div className="text-sm text-muted-foreground">BPM</div>
                {deviceName && (
                  <div className="text-xs text-muted-foreground mt-2">
                    {deviceName} {connectionSource === 'fitbit' && '(15s updates)'}
                  </div>
                )}
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

          {/* Connection Controls */}
          {isConnected && (
            <Button
              onClick={handleDisconnect}
              variant="outline"
              className="w-full"
            >
              Disconnect
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Connection Options */}
      {!isConnected && (
        <Tabs defaultValue="bluetooth" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="bluetooth">
              <Bluetooth className="h-4 w-4 mr-2" />
              Bluetooth
            </TabsTrigger>
            <TabsTrigger value="fitbit">
              <Activity className="h-4 w-4 mr-2" />
              Fitbit API
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="bluetooth" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Bluetooth Connection</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  <p className="mb-2">Connect any BLE heart rate monitor:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Real-time updates</li>
                    <li>Works with Fitbit, Polar, Garmin</li>
                    <li>Requires device pairing mode</li>
                  </ul>
                </div>
                
                <Button
                  onClick={handleConnectBluetooth}
                  disabled={isConnecting}
                  className="w-full"
                >
                  <Bluetooth className="h-4 w-4 mr-2" />
                  {isConnecting ? 'Scanning...' : 'Connect Bluetooth Device'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="fitbit">
            <FitbitConnectionCard 
              manager={manager}
              onConnectionChange={(connected) => {
                setIsConnected(connected);
                if (connected) {
                  setConnectionSource('fitbit');
                }
              }}
            />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default UnifiedHeartRateDisplay;
