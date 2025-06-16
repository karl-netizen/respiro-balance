
export interface DeviceInfo {
  id: string;
  name: string;
  type: string;
  connected: boolean;
  batteryLevel?: number;
  signalStrength?: number;
}

export interface BiometricData {
  id: string;
  user_id: string;
  device_id: string;
  timestamp: string;
  heart_rate?: number;
  hrv?: number;
  respiratory_rate?: number;
  stress_score?: number;
  focus_score?: number;
  calm_score?: number;
  coherence?: number;
  device_source: string;
  raw_data?: any;
}

export interface SensorReading {
  value: number;
  timestamp: string;
  quality: 'excellent' | 'good' | 'fair' | 'poor';
}

export interface Device {
  id: string;
  name: string;
  type: 'heart_rate' | 'stress' | 'breathing' | 'eeg';
  connected: boolean;
  characteristics?: BluetoothRemoteGATTCharacteristic[];
}

export interface DeviceConnectionOptions {
  timeout?: number;
  autoReconnect?: boolean;
  callback?: (device: Device) => void;
}

export interface SimulationOptions {
  enabled: boolean;
  heartRateRange: [number, number];
  stressRange: [number, number];
  updateInterval: number;
}
