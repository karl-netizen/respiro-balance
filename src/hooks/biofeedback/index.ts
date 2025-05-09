
export { useBiofeedback } from './useBiofeedback';

// Define the return type of useBiofeedback hook
export interface BiofeedbackHookReturn {
  devices: any[];
  isScanning: boolean;
  isConnecting: boolean;
  heartRate: number;
  stress: number;
  restingHeartRate: number;
  connectDevice: (deviceId: string) => Promise<boolean>;
  disconnectDevice: (deviceId: string) => Promise<boolean>;
  scanForDevices: () => Promise<boolean>;
  isSimulating: boolean;
}
