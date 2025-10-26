// Capacitor Bluetooth LE integration for native mobile support
import { Capacitor } from '@capacitor/core';
import { BleClient } from '@capacitor-community/bluetooth-le';
import { BluetoothDevice } from '@/types/supabase';

const HEART_RATE_SERVICE = '0000180d-0000-1000-8000-00805f9b34fb';
const HEART_RATE_MEASUREMENT = '00002a37-0000-1000-8000-00805f9b34fb';
const BATTERY_SERVICE = '0000180f-0000-1000-8000-00805f9b34fb';
const BATTERY_LEVEL = '00002a19-0000-1000-8000-00805f9b34fb';

// Check if running in Capacitor (native mobile app)
export const isCapacitor = (): boolean => {
  return Capacitor.isNativePlatform();
};

// Initialize Capacitor Bluetooth
export const initializeCapacitorBluetooth = async (): Promise<void> => {
  if (!isCapacitor()) return;
  
  try {
    await BleClient.initialize();
    console.log('Capacitor Bluetooth initialized');
  } catch (error) {
    console.error('Failed to initialize Capacitor Bluetooth:', error);
  }
};

// Scan for devices using Capacitor
export const scanForCapacitorDevices = async (): Promise<BluetoothDevice[]> => {
  const devices: BluetoothDevice[] = [];
  
  try {
    await BleClient.initialize();
    
    // Request permissions
    const hasPermission = await BleClient.requestDevice({
      services: [HEART_RATE_SERVICE],
      optionalServices: [BATTERY_SERVICE],
      namePrefix: 'Fitbit'
    });

    if (hasPermission) {
      // Start scanning
      await BleClient.requestLEScan(
        {
          services: [HEART_RATE_SERVICE],
          allowDuplicates: false
        },
        (result) => {
          const device: BluetoothDevice = {
            id: result.device.deviceId,
            name: result.device.name || 'Unknown Device',
            type: 'heart-rate',
            connected: false
          };
          
          // Add device if not already in list
          if (!devices.find(d => d.id === device.id)) {
            devices.push(device);
          }
        }
      );

      // Stop scanning after 5 seconds
      setTimeout(async () => {
        await BleClient.stopLEScan();
      }, 5000);
    }
  } catch (error) {
    console.error('Capacitor scan error:', error);
  }
  
  return devices;
};

// Connect to device using Capacitor
export const connectToCapacitorDevice = async (deviceId: string): Promise<BluetoothDevice | null> => {
  try {
    await BleClient.connect(deviceId, (disconnectedDeviceId) => {
      console.log(`Device ${disconnectedDeviceId} disconnected`);
    });

    // Read device name
    const services = await BleClient.getServices(deviceId);
    const hrService = services.find(s => s.uuid === HEART_RATE_SERVICE);
    
    if (hrService) {
      // Start notifications for heart rate
      await BleClient.startNotifications(
        deviceId,
        HEART_RATE_SERVICE,
        HEART_RATE_MEASUREMENT,
        (value) => {
          const heartRate = parseHeartRateMeasurement(value);
          console.log('Heart rate:', heartRate);
        }
      );
    }

    return {
      id: deviceId,
      name: 'Connected Device',
      type: 'heart-rate',
      connected: true
    };
  } catch (error) {
    console.error('Capacitor connection error:', error);
    return null;
  }
};

// Disconnect from device using Capacitor
export const disconnectFromCapacitorDevice = async (deviceId: string): Promise<boolean> => {
  try {
    await BleClient.disconnect(deviceId);
    return true;
  } catch (error) {
    console.error('Capacitor disconnection error:', error);
    return false;
  }
};

// Parse heart rate measurement
const parseHeartRateMeasurement = (value: DataView): number => {
  const flags = value.getUint8(0);
  const rate16Bits = flags & 0x01;
  
  if (rate16Bits) {
    return value.getUint16(1, true);
  } else {
    return value.getUint8(1);
  }
};

// Get heart rate using Capacitor
export const getCapacitorHeartRate = async (deviceId: string): Promise<number> => {
  try {
    const value = await BleClient.read(
      deviceId,
      HEART_RATE_SERVICE,
      HEART_RATE_MEASUREMENT
    );
    return parseHeartRateMeasurement(value);
  } catch (error) {
    console.error('Error reading heart rate:', error);
    return 0;
  }
};

// Get battery level using Capacitor
export const getCapacitorBatteryLevel = async (deviceId: string): Promise<number | undefined> => {
  try {
    const value = await BleClient.read(
      deviceId,
      BATTERY_SERVICE,
      BATTERY_LEVEL
    );
    return value.getUint8(0);
  } catch (error) {
    console.error('Error reading battery level:', error);
    return undefined;
  }
};

// Subscribe to heart rate notifications using Capacitor
export const subscribeToCapacitorHeartRate = (
  deviceId: string,
  callback: (heartRate: number) => void
): (() => void) => {
  BleClient.startNotifications(
    deviceId,
    HEART_RATE_SERVICE,
    HEART_RATE_MEASUREMENT,
    (value) => {
      const heartRate = parseHeartRateMeasurement(value);
      callback(heartRate);
    }
  );

  return () => {
    BleClient.stopNotifications(deviceId, HEART_RATE_SERVICE, HEART_RATE_MEASUREMENT);
  };
};
