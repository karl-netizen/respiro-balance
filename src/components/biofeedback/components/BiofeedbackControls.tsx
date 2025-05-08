
import React from 'react';
import { Button } from "@/components/ui/button";

interface BiofeedbackControlsProps {
  connectedDevicesCount: number;
  onDisconnectAll: () => Promise<void>;
  onToggleSimulation: () => void;
  isSimulating: boolean;
  onConnectDevice: () => Promise<void>;
}

const BiofeedbackControls: React.FC<BiofeedbackControlsProps> = ({
  connectedDevicesCount,
  onDisconnectAll,
  onToggleSimulation,
  isSimulating,
  onConnectDevice
}) => {
  if (connectedDevicesCount > 0) {
    return (
      <div className="flex gap-2">
        <Button 
          onClick={onDisconnectAll} 
          variant="outline" 
          className="flex-1"
        >
          Disconnect
        </Button>
        <Button 
          onClick={onToggleSimulation} 
          variant={isSimulating ? "destructive" : "secondary"}
          className="flex-1"
        >
          {isSimulating ? "Stop Simulation" : "Simulate Data"}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <Button onClick={onConnectDevice} className="flex-1">
        Connect Device
      </Button>
      <Button 
        onClick={onToggleSimulation} 
        variant="outline"
        className="flex-1"
      >
        Simulate Data
      </Button>
    </div>
  );
};

export default BiofeedbackControls;
