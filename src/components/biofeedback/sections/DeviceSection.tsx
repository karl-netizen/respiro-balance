
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
