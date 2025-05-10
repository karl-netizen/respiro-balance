
import { BluetoothDevice } from '@/types/supabase';

export interface BiofeedbackHookReturn {
  devices: BluetoothDevice[];
  isScanning: boolean;
  isConnecting: boolean;
  heartRate: number;
  stress: number;
  restingHeartRate: number;
  connectDevice: (deviceId: string, options?: any) => Promise<boolean>;
  disconnectDevice: (deviceId: string, options?: any) => Promise<boolean>;
  scanForDevices: (deviceType?: string, options?: any) => Promise<boolean>;
  stopScan?: (deviceType?: string, callback?: () => void) => Promise<void>;
  isSimulating: boolean;
}

export interface BiometricReadings {
  heartRate: number;
  stress: number;
  restingHeartRate: number;
  heartRateHistory: number[];
}
