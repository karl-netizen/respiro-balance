
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
  onScanForDevices: () => Promise<void>;
  onConnectDevice: (deviceId: string) => Promise<void>;
  onDisconnectDevice: (deviceId: string) => Promise<void>;
  isSimulating: boolean;
}

const DeviceSection: React.FC<DeviceSectionProps> = ({
  devices,
  isScanning,
  isConnecting,
  onScanForDevices,
  onConnectDevice,
  onDisconnectDevice,
  isSimulating
}) => {
  return (
    <div className="space-y-6">
      <BiofeedbackCard
        title="Devices"
        description="Connect your biofeedback devices"
        icon={<Settings className="h-5 w-5" />}
      >
        {isScanning ? (
          <DeviceSearching />
        ) : devices.length === 0 ? (
          <NoDevicesView
            onScanForDevices={onScanForDevices}
            disabled={isScanning || isConnecting}
          />
        ) : (
          <ConnectedDevicesList
            devices={devices}
            onScanForDevices={onScanForDevices}
            onConnectDevice={onConnectDevice}
            onDisconnectDevice={onDisconnectDevice}
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
