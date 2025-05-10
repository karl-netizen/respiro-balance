
import React from 'react';
import { Button } from '@/components/ui/button';
import { BluetoothDevice } from '@/types/supabase';

export interface ConnectedDevicesListProps {
  devices: BluetoothDevice[];
  onScanForDevices: (deviceType?: string, options?: any) => Promise<void>;
  onConnectDevice: (deviceId: string, callback?: () => void) => Promise<void>;
  onDisconnectDevice: (deviceId: string, callback?: () => void) => Promise<void>;
  disabled: boolean;
}

export const ConnectedDevicesList: React.FC<ConnectedDevicesListProps> = ({
  devices,
  onScanForDevices,
  onConnectDevice,
  onDisconnectDevice,
  disabled
}) => {
  if (devices.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-4">No devices found</p>
        <Button 
          onClick={() => onScanForDevices()}
          disabled={disabled}
        >
          Scan Again
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-4 mb-6">
        {devices.map(device => {
          // Ensure we have a valid device ID
          const deviceId = typeof device === "string" ? device : device.id;
          const deviceName = typeof device === "string" ? device : (device.name || 'Unknown Device');
          const deviceType = typeof device === "string" ? device : (device.type || 'Generic Device');
          const isConnected = typeof device === "string" ? false : (device.connected || false);

          return (
            <div 
              key={deviceId}
              className="flex items-center justify-between p-4 bg-card rounded-lg shadow-sm"
            >
              <div>
                <h4 className="font-medium">{deviceName}</h4>
                <p className="text-sm text-muted-foreground">
                  {deviceType} • 
                  {isConnected ? 
                    <span className="text-green-500"> Connected</span> : 
                    <span className="text-muted-foreground"> Disconnected</span>
                  }
                </p>
              </div>
              <Button
                variant={isConnected ? "destructive" : "default"}
                size="sm"
                onClick={() => isConnected ? 
                  onDisconnectDevice(deviceId, () => console.log('Device disconnected:', deviceId)) : 
                  onConnectDevice(deviceId, () => console.log('Device connected:', deviceId))
                }
                disabled={disabled}
              >
                {isConnected ? 'Disconnect' : 'Connect'}
              </Button>
            </div>
          );
        })}
      </div>
      <div className="text-center">
        <Button 
          variant="outline" 
          onClick={() => onScanForDevices("heart_rate_monitor", { autoConnect: true })}
          disabled={disabled}
        >
          {disabled ? 'Scanning...' : 'Scan for More Devices'}
        </Button>
      </div>
    </div>
  );
};

export default ConnectedDevicesList;
