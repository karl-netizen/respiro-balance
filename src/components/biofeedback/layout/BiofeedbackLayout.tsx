
import React from "react";
import { BluetoothDevice } from "@/types/supabase";
import DeviceSection from "../sections/DeviceSection";
import BiometricMonitorSection from "../sections/BiometricMonitorSection";

interface BiofeedbackLayoutProps {
  devices: BluetoothDevice[];
  isScanning: boolean;
  isConnecting: boolean;
  heartRate: number;
  stress: number;
  restingHeartRate: number;
  onScanForDevices: () => Promise<void>;
  onConnectDevice: (deviceId: string) => Promise<void>;
  onDisconnectDevice: (deviceId: string) => Promise<void>;
  isSimulating: boolean;
}

const BiofeedbackLayout: React.FC<BiofeedbackLayoutProps> = ({
  devices,
  isScanning,
  isConnecting,
  heartRate,
  stress,
  restingHeartRate,
  onScanForDevices,
  onConnectDevice,
  onDisconnectDevice,
  isSimulating
}) => {
  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Biofeedback</h1>
      <p className="text-muted-foreground mb-8">
        Monitor your heart rate and stress levels in real-time
      </p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Device Connection Panel */}
        <div className="lg:col-span-1">
          <DeviceSection
            devices={devices}
            isScanning={isScanning}
            isConnecting={isConnecting}
            onScanForDevices={onScanForDevices}
            onConnectDevice={onConnectDevice}
            onDisconnectDevice={onDisconnectDevice}
            isSimulating={isSimulating}
          />
        </div>
        
        {/* Biofeedback Data Display */}
        <div className="lg:col-span-2">
          <BiometricMonitorSection
            heartRate={heartRate}
            restingHeartRate={restingHeartRate}
            stress={stress}
            isSimulating={isSimulating}
          />
        </div>
      </div>
    </div>
  );
};

export default BiofeedbackLayout;
