
import { BluetoothDevice } from '@/types/supabase';

export interface BiofeedbackHookReturn {
  devices: BluetoothDevice[];
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

export interface BiometricReadings {
  heartRate: number;
  stress: number;
  restingHeartRate: number;
  heartRateHistory: number[];
}
