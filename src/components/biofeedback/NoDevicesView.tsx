
import React from 'react';
import { Button } from '@/components/ui/button';
import { Bluetooth, Heart, Activity } from 'lucide-react';

interface NoDevicesViewProps {
  onScanForDevices: (deviceType?: string, options?: any) => Promise<void>;
  disabled?: boolean;
}

const NoDevicesView: React.FC<NoDevicesViewProps> = ({ onScanForDevices, disabled = false }) => {
  return (
    <div className="text-center py-6">
      <div className="mb-6">
        <div className="flex justify-center gap-4 mb-4">
          <div className="p-3 bg-blue-50 rounded-full">
            <Heart className="h-6 w-6 text-blue-600" />
          </div>
          <div className="p-3 bg-green-50 rounded-full">
            <Activity className="h-6 w-6 text-green-600" />
          </div>
          <div className="p-3 bg-purple-50 rounded-full">
            <Bluetooth className="h-6 w-6 text-purple-600" />
          </div>
        </div>
        <h3 className="text-lg font-medium mb-2">Connect Your Wearable</h3>
        <p className="text-muted-foreground text-sm max-w-md mx-auto mb-4">
          Connect compatible devices like Apple Watch, Fitbit, Polar, or other heart rate monitors to get real-time biometric feedback during meditation.
        </p>
      </div>
      
      <div className="space-y-3 mb-6">
        <div className="text-xs text-muted-foreground">Supported devices:</div>
        <div className="flex flex-wrap justify-center gap-2">
          <span className="px-2 py-1 bg-gray-100 rounded text-xs">Apple Watch</span>
          <span className="px-2 py-1 bg-gray-100 rounded text-xs">Fitbit</span>
          <span className="px-2 py-1 bg-gray-100 rounded text-xs">Polar H10</span>
          <span className="px-2 py-1 bg-gray-100 rounded text-xs">Garmin</span>
        </div>
      </div>
      
      <Button 
        onClick={() => onScanForDevices()}
        disabled={disabled}
        className="w-full sm:w-auto"
      >
        <Bluetooth className="h-4 w-4 mr-2" />
        Scan for Devices
      </Button>
    </div>
  );
};

export default NoDevicesView;
