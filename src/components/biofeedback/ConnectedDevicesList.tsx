
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
        {devices.map(device => (
          <div 
            key={device.id}
            className="flex items-center justify-between p-4 bg-card rounded-lg shadow-sm"
          >
            <div>
              <h4 className="font-medium">{device.name || 'Unknown Device'}</h4>
              <p className="text-sm text-muted-foreground">
                {device.type || 'Generic Device'} • 
                {device.connected ? 
                  <span className="text-green-500"> Connected</span> : 
                  <span className="text-muted-foreground"> Disconnected</span>
                }
              </p>
            </div>
            <Button
              variant={device.connected ? "destructive" : "default"}
              size="sm"
              onClick={() => device.connected ? 
                onDisconnectDevice(device.id, () => console.log('Device disconnected:', device.id)) : 
                onConnectDevice(device.id, () => console.log('Device connected:', device.id))
              }
              disabled={disabled}
            >
              {device.connected ? 'Disconnect' : 'Connect'}
            </Button>
          </div>
        ))}
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
