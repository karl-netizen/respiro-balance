
export interface BluetoothDevice {
  id: string;
  name: string;
  type: string;
  connected: boolean;
}

export interface BluetoothDeviceInfo {
  id: string;
  name: string;
  type: string;
  connected: boolean;
  batteryLevel?: number;
  rssi?: number;
  services?: string[];
}
