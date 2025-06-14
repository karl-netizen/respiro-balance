
export type DeviceType = 'heart_rate_monitor' | 'fitness_tracker' | 'smart_watch' | 'stress_monitor';

export interface BluetoothDeviceInfo {
  id: string;
  name: string;
  type: DeviceType;
  rssi?: number;
  services?: string[];
  connected?: boolean;
}

export interface BluetoothDevice {
  id: string;
  name: string;
  type: DeviceType;
  connected: boolean;
}
