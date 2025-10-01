
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Battery, Signal, Bluetooth, AlertCircle } from 'lucide-react';
import { BluetoothDevice } from '@/types/bluetooth';
import * as DeviceService from '@/hooks/biofeedback/deviceService';

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
  const [batteryLevels, setBatteryLevels] = useState<Record<string, number>>({});

  // Fetch battery levels for connected devices
  useEffect(() => {
    const fetchBatteryLevels = async () => {
      for (const device of devices) {
        if (device.connected) {
          try {
            const level = await DeviceService.getBatteryLevel(device.id);
            if (level !== undefined) {
              setBatteryLevels(prev => ({ ...prev, [device.id]: level }));
            }
          } catch (error) {
            console.error('Failed to get battery level:', error);
          }
        }
      }
    };

    fetchBatteryLevels();
    const interval = setInterval(fetchBatteryLevels, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [devices]);

  const getBatteryColor = (level: number) => {
    if (level > 50) return 'text-green-600';
    if (level > 20) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-foreground">Connected Devices</h4>
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
      
      {devices.map((device) => {
        const batteryLevel = batteryLevels[device.id];
        
        return (
          <div key={device.id} className="flex items-center justify-between p-3 bg-success/10 border border-success/20 rounded-lg">
            <div className="flex items-center gap-3 flex-1">
              <Heart className="h-4 w-4 text-success" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{device.name}</span>
                </div>
                <div className="text-xs text-muted-foreground capitalize">
                  {device.type.replace('_', ' ')} Monitor
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {batteryLevel !== undefined && (
                <Badge variant="outline" className="text-xs">
                  <Battery className={`h-3 w-3 mr-1 ${getBatteryColor(batteryLevel)}`} />
                  {batteryLevel}%
                </Badge>
              )}
              <Badge variant="outline" className="text-xs bg-success/10 text-success">
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
        );
      })}
      
      {!DeviceService.isBluetoothAvailable() && (
        <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs">
          <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <div className="font-medium text-amber-900">Bluetooth Not Available</div>
            <div className="text-amber-700 mt-0.5">
              Please use Chrome, Edge, or Opera browser to connect real devices, or install the native mobile app for iOS/Android.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectedDevicesList;
