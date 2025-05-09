
import React from 'react';
import { BluetoothOff } from 'lucide-react';

interface ConnectionPromptProps {
  isMonitoring: boolean;
}

export const ConnectionPrompt: React.FC<ConnectionPromptProps> = ({ 
  isMonitoring 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <BluetoothOff className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium mb-2">
        No Device Connected
      </h3>
      <p className="text-muted-foreground max-w-sm mx-auto">
        {isMonitoring 
          ? "Waiting for device data. Please ensure your device is connected and properly paired."
          : "Connect a compatible device and start monitoring to see your biometric data."}
      </p>
    </div>
  );
};

export default ConnectionPrompt;
