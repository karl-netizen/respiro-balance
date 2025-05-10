
import React from "react";
import { Settings, Activity } from "lucide-react";
import { BluetoothDevice } from "@/types/supabase";
import BiofeedbackCard from "../cards/BiofeedbackCard";
import DeviceSearching from "../DeviceSearching";
import NoDevicesView from "../NoDevicesView";
import ConnectedDevicesList from "../ConnectedDevicesList";
import TeamFeatures from "../TeamFeatures";

interface DeviceSectionProps {
  devices: BluetoothDevice[];
  isScanning: boolean;
  isConnecting: boolean;
  onScanForDevices: (deviceType?: string, options?: any) => Promise<void>;
  onConnectDevice: (deviceId: string, callback?: () => void) => Promise<void>;
  onDisconnectDevice: (deviceId: string, callback?: () => void) => Promise<void>;
  isSimulating: boolean;
  onStopScan?: (deviceType?: string, callback?: () => void) => Promise<void>;
}

const DeviceSection: React.FC<DeviceSectionProps> = ({
  devices,
  isScanning,
  isConnecting,
  onScanForDevices,
  onConnectDevice,
  onDisconnectDevice,
  isSimulating,
  onStopScan
}) => {
  // Handle connect device with proper Promise<void> return type
  const handleConnectDevice = async (deviceId: string | BluetoothDevice, callback?: () => void): Promise<void> => {
    // Ensure deviceId is valid
    const id = typeof deviceId === "string" ? deviceId : deviceId.id;
    return onConnectDevice(id, callback);
  };

  // Handle disconnect device with proper Promise<void> return type
  const handleDisconnectDevice = async (deviceId: string | BluetoothDevice, callback?: () => void): Promise<void> => {
    // Ensure deviceId is valid
    const id = typeof deviceId === "string" ? deviceId : deviceId.id;
    return onDisconnectDevice(id, callback);
  };

  return (
    <div className="space-y-6">
      <BiofeedbackCard
        title="Devices"
        description="Connect your biofeedback devices"
        icon={<Settings className="h-5 w-5" />}
      >
        {isScanning ? (
          <DeviceSearching onStopScan={onStopScan} />
        ) : devices.length === 0 ? (
          <NoDevicesView
            onScanForDevices={() => onScanForDevices("heart_rate_monitor")}
            disabled={isScanning || isConnecting}
          />
        ) : (
          <ConnectedDevicesList
            devices={devices}
            onScanForDevices={() => onScanForDevices("heart_rate_monitor")}
            onConnectDevice={handleConnectDevice}
            onDisconnectDevice={handleDisconnectDevice}
            disabled={isScanning || isConnecting}
          />
        )}
      </BiofeedbackCard>
      
      <BiofeedbackCard
        title="Team Features"
        description="Share data with your wellness team"
        icon={<Activity className="h-5 w-5" />}
      >
        <TeamFeatures />
      </BiofeedbackCard>
    </div>
  );
};

export default DeviceSection;
