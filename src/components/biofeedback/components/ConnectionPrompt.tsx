
import React from 'react';
import { AlertCircle, Bluetooth } from 'lucide-react';

interface ConnectionPromptProps {
  isMonitoring: boolean;
}

export const ConnectionPrompt: React.FC<ConnectionPromptProps> = ({ isMonitoring }) => {
  return (
    <div className="text-center py-8 px-4">
      <div className="mb-4">
        <Bluetooth className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
        <h3 className="text-lg font-medium mb-2">No Device Connected</h3>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">
          Connect a compatible heart rate monitor or wearable device to view real-time biometric data during your meditation sessions.
        </p>
      </div>
      
      {isMonitoring && (
        <div className="flex items-center justify-center gap-2 text-orange-600 text-sm">
          <AlertCircle className="h-4 w-4" />
          <span>Monitoring started but no device detected</span>
        </div>
      )}
    </div>
  );
};
