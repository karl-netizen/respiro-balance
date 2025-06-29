
export interface DeviceInfo {
  id: string;
  name: string;
  type: 'heart_rate' | 'stress' | 'eeg' | 'breath';
  connected: boolean;
  batteryLevel?: number;
  signalStrength?: number;
}

export interface BiometricReadings {
  heartRate: number;
  hrv: number;
  stress: number;
  restingHeartRate: number;
  timestamp: string;
}

export interface BiofeedbackHookReturn {
  devices: DeviceInfo[];
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
