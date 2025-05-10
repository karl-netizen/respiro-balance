
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface DeviceSearchingProps {
  onStopScan?: (deviceType?: string, callback?: () => void) => Promise<void>;
}

export const DeviceSearching: React.FC<DeviceSearchingProps> = ({ onStopScan }) => {
  return (
    <div className="py-8 text-center">
      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
      <p className="text-lg font-medium mb-3">Scanning for devices...</p>
      <p className="text-sm text-muted-foreground mb-6">
        Make sure your device is in pairing mode and nearby
      </p>
      {onStopScan && (
        <Button variant="outline" onClick={() => onStopScan()}>
          Cancel Scan
        </Button>
      )}
    </div>
  );
};

export default DeviceSearching;
