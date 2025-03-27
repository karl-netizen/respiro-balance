
import React from "react";
import { Check } from "lucide-react";

interface NoDevicesViewProps {
  isTeamOrEnterprise: boolean;
}

const NoDevicesView: React.FC<NoDevicesViewProps> = ({ isTeamOrEnterprise }) => {
  return (
    <div className="text-center py-4">
      <div className="flex flex-col items-center space-y-2 mb-4">
        <div className="h-10 w-10 bg-secondary/50 flex items-center justify-center rounded-full">
          <Check className="h-5 w-5 text-primary" />
        </div>
        <h3 className="font-medium">No devices connected</h3>
      </div>
      
      <p className="text-sm text-muted-foreground mb-4">
        {isTeamOrEnterprise 
          ? "Connect wearable devices to track biofeedback data for your team"
          : "Connect a wearable device to track your heart rate and other biofeedback data"}
      </p>
      
      {isTeamOrEnterprise && (
        <div className="text-xs text-primary bg-primary/10 p-2 rounded-md">
          Team & Enterprise feature: Connect and monitor multiple devices
        </div>
      )}
    </div>
  );
};

export default NoDevicesView;
