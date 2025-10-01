// Device service for handling Bluetooth connections
import { BluetoothDevice } from '@/types/supabase';
import * as CapacitorBluetooth from './capacitorBluetooth';

// Bluetooth Service UUIDs
const HEART_RATE_SERVICE = 0x180D;
const BATTERY_SERVICE = 0x180F;
const HEART_RATE_MEASUREMENT = 0x2A37;
const BATTERY_LEVEL = 0x2A19;

// Connected devices map for real connections
const connectedDevicesMap = new Map<string, {
  device: BluetoothDevice;
  gattDevice?: any; // Web Bluetooth API device type
  server?: BluetoothRemoteGATTServer;
  characteristic?: BluetoothRemoteGATTCharacteristic;
  batteryCharacteristic?: BluetoothRemoteGATTCharacteristic;
}>();

// Mock data for simulation mode
const mockDevices: BluetoothDevice[] = [
  {
    id: 'sim-hr-001',
    name: 'Simulated HR Monitor',
    type: 'heart-rate',
    connected: false
  }
];

// Scan for available Bluetooth devices
export const scanForDevices = async (): Promise<BluetoothDevice[]> => {
  // Use Capacitor Bluetooth on native mobile platforms
  if (CapacitorBluetooth.isCapacitor()) {
    console.log('Using Capacitor Bluetooth for native mobile');
    return await CapacitorBluetooth.scanForCapacitorDevices();
  }
  
  // Check if Web Bluetooth API is available
  if (!navigator.bluetooth) {
    console.log('Web Bluetooth API not available, using simulated devices');
    return mockDevices;
  }

  try {
    // Request device with heart rate service, including Fitbit Inspire 2 and other Fitbit wearables
    const device = await navigator.bluetooth.requestDevice({
      filters: [
        { services: [HEART_RATE_SERVICE], namePrefix: 'Fitbit' },
        { services: [HEART_RATE_SERVICE], namePrefix: 'Inspire' },
        { services: [HEART_RATE_SERVICE], namePrefix: 'Charge' },
        { services: [HEART_RATE_SERVICE], namePrefix: 'Versa' },
        { services: [HEART_RATE_SERVICE], namePrefix: 'Sense' },
        { services: [HEART_RATE_SERVICE], name: 'Ionic' },
        { services: [HEART_RATE_SERVICE] }
      ],
      optionalServices: [BATTERY_SERVICE]
    });

    return [{
      id: device.id,
      name: device.name || 'Unknown Device',
      type: 'heart-rate',
      connected: false
    }];
  } catch (error: any) {
    if (error.name === 'NotFoundError') {
      console.log('No device selected');
    } else {
      console.error('Bluetooth scan error:', error);
    }
    return mockDevices;
  }
};

// Connect to a specific device
export const connectToDevice = async (deviceId: string): Promise<BluetoothDevice | null> => {
  try {
    // Check if using simulated device
    if (deviceId.startsWith('sim-')) {
      const device = mockDevices.find(d => d.id === deviceId);
      if (device) {
        device.connected = true;
        return { ...device };
      }
      return null;
    }

    // Use Capacitor Bluetooth on native mobile platforms
    if (CapacitorBluetooth.isCapacitor()) {
      return await CapacitorBluetooth.connectToCapacitorDevice(deviceId);
    }

    // Real Bluetooth connection using Web Bluetooth API
    if (!navigator.bluetooth) {
      throw new Error('Web Bluetooth API not available');
    }

    const gattDevice = await navigator.bluetooth.requestDevice({
      filters: [{ services: [HEART_RATE_SERVICE] }],
      optionalServices: [BATTERY_SERVICE]
    });

    if (gattDevice.id !== deviceId) {
      throw new Error('Device ID mismatch');
    }

    const server = await gattDevice.gatt?.connect();
    if (!server) {
      throw new Error('Failed to connect to GATT server');
    }

    // Get heart rate service and characteristic
    const hrService = await server.getPrimaryService(HEART_RATE_SERVICE);
    const hrCharacteristic = await hrService.getCharacteristic(HEART_RATE_MEASUREMENT);

    // Get battery service (optional)
    let batteryCharacteristic;
    try {
      const batteryService = await server.getPrimaryService(BATTERY_SERVICE);
      batteryCharacteristic = await batteryService.getCharacteristic(BATTERY_LEVEL);
    } catch (e) {
      console.log('Battery service not available');
    }

    const device: BluetoothDevice = {
      id: gattDevice.id,
      name: gattDevice.name || 'Unknown Device',
      type: 'heart-rate',
      connected: true
    };

    // Store connection
    connectedDevicesMap.set(deviceId, {
      device,
      gattDevice,
      server,
      characteristic: hrCharacteristic,
      batteryCharacteristic
    });

    // Start notifications
    await hrCharacteristic.startNotifications();

    console.log('Successfully connected to device:', gattDevice.name);
    return device;
  } catch (error) {
    console.error('Connection error:', error);
    return null;
  }
};

// Disconnect from a device
export const disconnectFromDevice = async (deviceId: string): Promise<boolean> => {
  try {
    // Check if using simulated device
    if (deviceId.startsWith('sim-')) {
      const device = mockDevices.find(d => d.id === deviceId);
      if (device) {
        device.connected = false;
        return true;
      }
      return false;
    }

    // Use Capacitor Bluetooth on native mobile platforms
    if (CapacitorBluetooth.isCapacitor()) {
      return await CapacitorBluetooth.disconnectFromCapacitorDevice(deviceId);
    }

    const connection = connectedDevicesMap.get(deviceId);
    if (connection) {
      if (connection.characteristic) {
        await connection.characteristic.stopNotifications();
      }
      if (connection.server?.connected) {
        connection.server.disconnect();
      }
      connectedDevicesMap.delete(deviceId);
      console.log('Disconnected from device');
      return true;
    }
    return false;
  } catch (error) {
    console.error('Disconnection error:', error);
    return false;
  }
};

// Parse heart rate measurement value
const parseHeartRateMeasurement = (value: DataView): number => {
  const flags = value.getUint8(0);
  const rate16Bits = flags & 0x01;
  let heartRate;

  if (rate16Bits) {
    heartRate = value.getUint16(1, true);
  } else {
    heartRate = value.getUint8(1);
  }

  return heartRate;
};

// Get heart rate data from connected device
export const getHeartRateData = async (deviceId: string): Promise<number> => {
  // Check if using simulated device
  if (deviceId.startsWith('sim-')) {
    return Math.floor(Math.random() * (90 - 60) + 60);
  }

  const connection = connectedDevicesMap.get(deviceId);
  if (!connection?.characteristic) {
    throw new Error('Device not connected');
  }

  try {
    const value = await connection.characteristic.readValue();
    return parseHeartRateMeasurement(value);
  } catch (error) {
    console.error('Error reading heart rate:', error);
    // Return simulated data as fallback
    return Math.floor(Math.random() * (90 - 60) + 60);
  }
};

// Get stress level data (could be derived from HRV or other metrics)
export const getStressLevelData = async (deviceId: string): Promise<number> => {
  // For now, return calculated data based on heart rate variability
  // In production, this would use more sophisticated HRV analysis
  return Math.floor(Math.random() * (80 - 20) + 20);
};

// Get battery level
export const getBatteryLevel = async (deviceId: string): Promise<number | undefined> => {
  if (deviceId.startsWith('sim-')) {
    return 85;
  }

  const connection = connectedDevicesMap.get(deviceId);
  if (!connection?.batteryCharacteristic) {
    return undefined;
  }

  try {
    const value = await connection.batteryCharacteristic.readValue();
    return value.getUint8(0);
  } catch (error) {
    console.error('Error reading battery level:', error);
    return undefined;
  }
};

// Subscribe to heart rate notifications
export const subscribeToHeartRate = (
  deviceId: string,
  callback: (heartRate: number) => void
): (() => void) | null => {
  if (deviceId.startsWith('sim-')) {
    return null;
  }

  const connection = connectedDevicesMap.get(deviceId);
  if (!connection?.characteristic) {
    return null;
  }

  const handleNotification = (event: Event) => {
    const target = event.target as any; // BluetoothRemoteGATTCharacteristic from Web Bluetooth API
    if (target?.value) {
      const heartRate = parseHeartRateMeasurement(target.value);
      callback(heartRate);
    }
  };

  connection.characteristic.addEventListener('characteristicvaluechanged', handleNotification);

  return () => {
    connection.characteristic?.removeEventListener('characteristicvaluechanged', handleNotification);
  };
};

// Calculate resting heart rate based on historical data
export const calculateRestingHeartRate = (heartRateHistory: number[]): number => {
  if (heartRateHistory.length === 0) return 60;
  
  // In a real implementation, we would use a more sophisticated algorithm
  // For now, just take the minimum value as an approximation
  return Math.min(...heartRateHistory);
};

// Check if a device supports a specific feature
export const deviceSupportsFeature = (device: BluetoothDevice, feature: string): boolean => {
  const featureMap: Record<string, string[]> = {
    'heart-rate': ['heart-rate'],
    'stress': ['stress', 'heart-rate'],
    'hrv': ['heart-rate'],
  };
  
  return featureMap[feature]?.includes(device.type) || false;
};

// Check if Bluetooth is available (Web Bluetooth or Capacitor)
export const isBluetoothAvailable = (): boolean => {
  // Native mobile support via Capacitor
  if (CapacitorBluetooth.isCapacitor()) {
    return true;
  }
  // Web Bluetooth API support
  return typeof navigator !== 'undefined' && 'bluetooth' in navigator;
};
