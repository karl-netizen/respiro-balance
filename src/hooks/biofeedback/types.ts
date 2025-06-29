
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

export interface BiometricData {
  id: string;
  user_id: string;
  session_id?: string;
  timestamp: string;
  recorded_at?: string;
  heart_rate?: number;
  heartRate?: number;  // For backward compatibility
  hrv?: number;
  respiratory_rate?: number;
  breath_rate?: number;
  breathRate?: number;  // For backward compatibility
  stress_score?: number;
  stress_level?: number;
  stress?: number;
  focus_score?: number;
  calm_score?: number;
  coherence?: number;
  device_source?: string;
  brainwaves?: {
    alpha: number;
    beta: number;
    delta: number;
    gamma: number;
    theta: number;
  };
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
