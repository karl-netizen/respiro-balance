
import { BiometricData, ConnectionState } from '@/components/meditation/types/BiometricTypes';

// Interface for device information
export interface DeviceInfo {
  id: string;
  name: string;
  type: string;
  connected: boolean;
}

export interface BiofeedbackHookReturn {
  heartRate: number | null;
  hrv: number | null;
  respiratoryRate: number | null;
  stressLevel: number | null;
  isMonitoring: boolean;
  isConnected: boolean;
  isConnecting: boolean;
  availableDevices: string[];
  connectedDevices: DeviceInfo[];
  currentBiometrics: Partial<BiometricData> | null;
  isSimulating: boolean;
  error: string | null;
  scanForDevices: () => Promise<string[]>;
  connectDevice: (deviceId?: string) => Promise<boolean>;
  disconnectDevice: (deviceId?: string) => Promise<boolean>;
  startMonitoring: () => Promise<boolean>;
  stopMonitoring: () => Promise<boolean>;
  startSimulation: () => (() => void);
  stopSimulation: () => void;
}
