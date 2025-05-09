
// Define types for biofeedback functionality
export interface DeviceInfo {
  id: string;
  name: string;
  connected: boolean;
  deviceType?: string;
  batteryLevel?: number;
}

export interface BiometricData {
  heartRate?: number;
  hrv?: number;
  stress?: number;
  coherence?: number;
  timestamp?: number;
}

export interface BiofeedbackHookReturn {
  isMonitoring: boolean;
  startMonitoring: () => Promise<boolean>;
  stopMonitoring: () => void;
  connectedDevice: DeviceInfo | null;
  scanForDevices: () => Promise<void>;
  connectToDevice: (deviceId: string) => Promise<void>;
  disconnectDevice: (deviceId: string) => Promise<void>;
  devices: DeviceInfo[];
  biometricData: BiometricData;
  isScanning: boolean;
  error: Error | null;
}

export interface SensorReading {
  type: string;
  value: number;
  timestamp: number;
}

export interface Device {
  id: string;
  name: string;
  connected: boolean;
  services: string[];
  characteristics: string[];
}

export interface DeviceConnectionOptions {
  filters: Array<{
    services?: string[];
    name?: string;
    namePrefix?: string;
  }>;
  optionalServices: string[];
}

export interface SimulationOptions {
  interval: number;
  heartRateMin: number;
  heartRateMax: number;
  hrvMin: number;
  hrvMax: number;
}
