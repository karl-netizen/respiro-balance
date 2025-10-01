
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bluetooth, Heart, Activity, Brain } from 'lucide-react';
import { DeviceInfo } from '@/hooks/biofeedback/types';
import BluetoothHelp from '../BluetoothHelp';

interface BiofeedbackLayoutProps {
  devices: DeviceInfo[];
  isScanning: boolean;
  isConnecting: boolean;
  heartRate: number;
  stress: number;
  restingHeartRate: number;
  onScanForDevices: (deviceType?: string, options?: any) => Promise<void>;
  onConnectDevice: (deviceId: string, callback?: () => void) => Promise<void>;
  onDisconnectDevice: (deviceId: string, callback?: () => void) => Promise<void>;
  isSimulating: boolean;
  onStopScan: (deviceType?: string, callback?: () => void) => Promise<void>;
}

const BiofeedbackLayout: React.FC<BiofeedbackLayoutProps> = ({
  devices,
  isScanning,
  isConnecting,
  heartRate,
  stress,
  restingHeartRate,
  onScanForDevices,
  onConnectDevice,
  onDisconnectDevice,
  isSimulating,
  onStopScan
}) => {
  const connectedDevices = devices.filter(device => device.connected);
  const availableDevices = devices.filter(device => !device.connected);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Biofeedback Integration</h1>
        <p className="text-muted-foreground">
          Connect your wearable devices to enhance your meditation experience with real-time biometric feedback
        </p>
      </div>

      {/* Device Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bluetooth className="h-5 w-5" />
            Device Connections
            {isSimulating && (
              <Badge variant="secondary" className="ml-2">
                Simulation Mode
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {connectedDevices.length > 0 ? (
              <div>
                <h4 className="font-medium mb-2">Connected Devices</h4>
                <div className="space-y-2">
                  {connectedDevices.map((device) => (
                    <div key={device.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Heart className="h-4 w-4 text-green-600" />
                        <div>
                          <div className="font-medium">{device.name}</div>
                          <div className="text-sm text-muted-foreground capitalize">{device.type.replace('_', ' ')}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {device.batteryLevel && (
                          <Badge variant="outline" className="text-xs">
                            {device.batteryLevel}%
                          </Badge>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onDisconnectDevice(device.id)}
                        >
                          Disconnect
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <Bluetooth className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground mb-4">No devices connected</p>
                <Button
                  onClick={() => onScanForDevices()}
                  disabled={isScanning || isConnecting}
                >
                  {isScanning ? 'Scanning...' : 'Scan for Devices'}
                </Button>
              </div>
            )}

            {availableDevices.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Available Devices</h4>
                <div className="space-y-2">
                  {availableDevices.map((device) => (
                    <div key={device.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Activity className="h-4 w-4 text-gray-600" />
                        <div>
                          <div className="font-medium">{device.name}</div>
                          <div className="text-sm text-muted-foreground capitalize">{device.type.replace('_', ' ')}</div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => onConnectDevice(device.id)}
                        disabled={isConnecting}
                      >
                        {isConnecting ? 'Connecting...' : 'Connect'}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Real-time Data */}
      {connectedDevices.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="h-4 w-4 text-red-500" />
                <span className="text-sm font-medium">Heart Rate</span>
              </div>
              <div className="text-2xl font-bold">{heartRate}</div>
              <div className="text-xs text-muted-foreground">BPM</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-medium">Stress Level</span>
              </div>
              <div className="text-2xl font-bold">{stress}%</div>
              <div className="text-xs text-muted-foreground">Current</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Resting HR</span>
              </div>
              <div className="text-2xl font-bold">{restingHeartRate}</div>
              <div className="text-xs text-muted-foreground">BPM</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Bluetooth Help Guide */}
      <BluetoothHelp />
    </div>
  );
};

export default BiofeedbackLayout;
