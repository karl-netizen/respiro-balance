
import React from 'react';
import { Button } from '@/components/ui/button';
import { Bluetooth, Heart, Activity, Chrome, AlertCircle, Smartphone } from 'lucide-react';
import * as DeviceService from '@/hooks/biofeedback/deviceService';
import { Capacitor } from '@capacitor/core';

interface NoDevicesViewProps {
  onScanForDevices: (deviceType?: string, options?: any) => Promise<void>;
  disabled?: boolean;
}

const NoDevicesView: React.FC<NoDevicesViewProps> = ({ onScanForDevices, disabled = false }) => {
  const isBluetoothAvailable = DeviceService.isBluetoothAvailable();
  const isNativeMobile = Capacitor.isNativePlatform();
  
  return (
    <div className="text-center py-6">
      <div className="mb-6">
        <div className="flex justify-center gap-4 mb-4">
          <div className="p-3 bg-primary/10 rounded-full">
            <Heart className="h-6 w-6 text-primary" />
          </div>
          <div className="p-3 bg-success/10 rounded-full">
            <Activity className="h-6 w-6 text-success" />
          </div>
          <div className="p-3 bg-accent/20 rounded-full">
            <Bluetooth className="h-6 w-6 text-accent-foreground" />
          </div>
        </div>
        <h3 className="text-lg font-medium mb-2">Connect Your Wearable</h3>
        <p className="text-muted-foreground text-sm max-w-md mx-auto mb-4">
          Connect compatible Bluetooth heart rate monitors to get real-time biometric feedback during meditation sessions.
        </p>
      </div>
      
      {!isBluetoothAvailable && !isNativeMobile && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg max-w-md mx-auto">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="text-left">
              <div className="font-medium text-amber-900 text-sm mb-1">Browser Not Supported</div>
              <div className="text-xs text-amber-700 mb-2">
                Web Bluetooth API is not available in your browser. Please use Chrome or Edge to connect real devices.
              </div>
              <div className="flex items-center gap-1 text-xs text-amber-600">
                <Chrome className="h-3 w-3" />
                <span>Chrome or Edge required for Bluetooth</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {isNativeMobile && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg max-w-md mx-auto">
          <div className="flex items-start gap-3">
            <Smartphone className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-left">
              <div className="font-medium text-blue-900 text-sm mb-1">Native Mobile App</div>
              <div className="text-xs text-blue-700">
                You're using the native app! Bluetooth devices will connect using native capabilities for best performance.
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="space-y-3 mb-6">
        <div className="text-xs text-muted-foreground">Supported devices:</div>
        <div className="flex flex-wrap justify-center gap-2">
          <span className="px-2 py-1 bg-secondary rounded text-xs">Fitbit Inspire 2</span>
          <span className="px-2 py-1 bg-secondary rounded text-xs">Polar H10</span>
          <span className="px-2 py-1 bg-secondary rounded text-xs">Garmin HRM</span>
          <span className="px-2 py-1 bg-secondary rounded text-xs">Wahoo TICKR</span>
          <span className="px-2 py-1 bg-secondary rounded text-xs">Any BLE Heart Rate</span>
        </div>
      </div>
      
      <Button 
        onClick={() => onScanForDevices()}
        disabled={disabled}
        className="w-full sm:w-auto"
      >
        <Bluetooth className="h-4 w-4 mr-2" />
        {isBluetoothAvailable ? 'Scan for Devices' : 'Show Demo Devices'}
      </Button>
      
      {isBluetoothAvailable && (
        <p className="text-xs text-muted-foreground mt-3">
          {isNativeMobile 
            ? 'Make sure Bluetooth is enabled and your device is in pairing mode'
            : 'Make sure your device is turned on and in pairing mode'}
        </p>
      )}
    </div>
  );
};

export default NoDevicesView;
