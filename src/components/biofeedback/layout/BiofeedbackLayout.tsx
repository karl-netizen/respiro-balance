
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
  onScanForDevices: (deviceType?: string, options?: any) => Promise<void>;
  onConnectDevice: (deviceId: string, callback?: () => void) => Promise<void>;
  onDisconnectDevice: (deviceId: string, callback?: () => void) => Promise<void>;
  isSimulating: boolean;
  onStopScan?: (deviceType?: string, callback?: () => void) => Promise<void>;
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
  isSimulating,
  onStopScan
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
            onStopScan={onStopScan}
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
