
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Bluetooth } from 'lucide-react';

interface DeviceSearchingProps {
  onStopScan: () => Promise<void>;
}

const DeviceSearching: React.FC<DeviceSearchingProps> = ({ onStopScan }) => {
  return (
    <div className="text-center py-6">
      <div className="mb-4">
        <Loader2 className="h-8 w-8 mx-auto animate-spin text-primary mb-2" />
        <h3 className="text-lg font-medium mb-2">Searching for Devices</h3>
        <p className="text-muted-foreground text-sm max-w-md mx-auto mb-4">
          Make sure your wearable device is in pairing mode and nearby.
        </p>
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Bluetooth className="h-4 w-4 animate-pulse" />
          <span>Scanning for heart rate monitors...</span>
        </div>
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Bluetooth className="h-4 w-4 animate-pulse" />
          <span>Looking for stress sensors...</span>
        </div>
      </div>
      
      <Button variant="outline" onClick={onStopScan}>
        Stop Scanning
      </Button>
    </div>
  );
};

export default DeviceSearching;
