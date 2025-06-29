
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Battery, Signal, Bluetooth } from 'lucide-react';
import { BluetoothDevice } from '@/types/bluetooth';

interface ConnectedDevicesListProps {
  devices: BluetoothDevice[];
  onScanForDevices: (deviceType?: string, options?: any) => Promise<void>;
  onConnectDevice: (deviceId: string, callback?: () => void) => Promise<void>;
  onDisconnectDevice: (deviceId: string, callback?: () => void) => Promise<void>;
  disabled?: boolean;
}

const ConnectedDevicesList: React.FC<ConnectedDevicesListProps> = ({
  devices,
  onScanForDevices,
  onConnectDevice,
  onDisconnectDevice,
  disabled = false
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-700">Connected Devices</h4>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onScanForDevices()}
          disabled={disabled}
          className="text-xs"
        >
          <Bluetooth className="h-3 w-3 mr-1" />
          Scan More
        </Button>
      </div>
      
      {devices.map((device) => (
        <div key={device.id} className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-3">
            <Heart className="h-4 w-4 text-green-600" />
            <div>
              <div className="font-medium text-sm">{device.name}</div>
              <div className="text-xs text-muted-foreground capitalize">
                {device.type.replace('_', ' ')} Monitor
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs bg-green-100 text-green-700">
              <Signal className="h-3 w-3 mr-1" />
              Connected
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDisconnectDevice(device.id)}
              disabled={disabled}
              className="text-xs h-7 px-2"
            >
              Disconnect
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ConnectedDevicesList;
