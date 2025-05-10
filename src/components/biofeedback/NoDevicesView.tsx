
import React from 'react';
import { Button } from '@/components/ui/button';

export interface NoDevicesViewProps {
  onScanForDevices: (deviceType?: string, options?: any) => Promise<void>;
  disabled: boolean;
}

export const NoDevicesView: React.FC<NoDevicesViewProps> = ({ 
  onScanForDevices, 
  disabled 
}) => {
  return (
    <div className="text-center py-12">
      <div className="mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 mx-auto text-muted-foreground"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-medium mb-2">No devices connected</h3>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        Connect a compatible biofeedback device to monitor your physiological responses during meditation.
      </p>
      <Button 
        onClick={() => onScanForDevices("heart_rate_monitor", { autoConnect: true })}
        disabled={disabled}
      >
        {disabled ? 'Scanning...' : 'Scan for Devices'}
      </Button>
    </div>
  );
};

export default NoDevicesView;
