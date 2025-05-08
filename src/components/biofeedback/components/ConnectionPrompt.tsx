
import React from 'react';
import { 
  BluetoothSearching, 
  BluetoothOff, 
  Bluetooth 
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ConnectedDevicesList } from '../';

interface ConnectionPromptProps {
  isConnecting: boolean;
  connectedDevices: Array<{
    id: string;
    name: string;
    type: string;
    connected: boolean;
  }>;
  onConnectDevice: () => Promise<void>;
  onDisconnectDevice: (deviceId: string) => Promise<void>;
  onToggleSimulation: () => void;
  isSimulating: boolean;
}

const ConnectionPrompt: React.FC<ConnectionPromptProps> = ({
  isConnecting,
  connectedDevices,
  onConnectDevice,
  onDisconnectDevice,
  onToggleSimulation,
  isSimulating
}) => {
  if (isConnecting) {
    return (
      <div className="text-center">
        <BluetoothSearching className="h-12 w-12 text-primary animate-pulse mx-auto mb-4" />
        <p className="text-lg font-medium mb-2">Searching for devices</p>
        <p className="text-muted-foreground text-sm">
          Make sure your device is nearby and in pairing mode
        </p>
      </div>
    );
  }

  if (connectedDevices.length > 0) {
    return (
      <div className="w-full">
        <div className="mb-6 flex items-center justify-center">
          <Bluetooth className="h-10 w-10 text-green-500 mr-2" />
          <div>
            <h3 className="text-lg font-medium">Devices Connected</h3>
            <p className="text-sm text-muted-foreground">{connectedDevices.length} device(s) ready</p>
          </div>
        </div>
        <ConnectedDevicesList 
          devices={connectedDevices}
          isTeamOrEnterprise={false}
          onDisconnect={onDisconnectDevice}
        />
      </div>
    );
  }

  return (
    <div className="text-center">
      <BluetoothOff className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
      <p className="text-lg font-medium mb-2">No Device Connected</p>
      <p className="text-muted-foreground text-sm mb-6">
        Connect a compatible biofeedback device to see your metrics
      </p>
      <div className="flex flex-col gap-2 w-full max-w-xs mx-auto">
        <Button onClick={onConnectDevice} className="w-full">
          Connect Device
        </Button>
        <Button 
          onClick={onToggleSimulation} 
          variant="outline"
          className="w-full"
        >
          {isSimulating ? "Stop Simulation" : "Simulate Data"}
        </Button>
      </div>
    </div>
  );
};

export default ConnectionPrompt;
