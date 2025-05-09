// Device service for handling Bluetooth connections
import { BluetoothDevice } from '@/types/supabase';

// Mock data for simulation mode
const mockDevices: BluetoothDevice[] = [
  {
    id: 'mock-hr-001',
    name: 'HR Monitor Pro',
    type: 'heart-rate',
    connected: false
  },
  {
    id: 'mock-stress-001',
    name: 'StressTrack X1',
    type: 'stress',
    connected: false
  }
];

// Scan for available Bluetooth devices
export const scanForDevices = async (): Promise<BluetoothDevice[]> => {
  try {
    // Check if Web Bluetooth API is available
    if (navigator.bluetooth) {
      console.log('Scanning for Bluetooth devices...');
      
      // Request device with specific services
      const device = await navigator.bluetooth.requestDevice({
        filters: [
          { services: ['heart_rate'] },
          { services: ['health_thermometer'] },
          { namePrefix: 'HR' },
          { namePrefix: 'Polar' },
          { namePrefix: 'Fitbit' }
        ],
        optionalServices: ['battery_service']
      });
      
      return [{
        id: device.id,
        name: device.name || 'Unknown Device',
        type: 'heart-rate',
        connected: false
      }];
    } else {
      console.log('Web Bluetooth API not available, using mock devices');
      return mockDevices;
    }
  } catch (error) {
    console.error('Error scanning for devices:', error);
    return [];
  }
};

// Connect to a specific device
export const connectToDevice = async (deviceId: string): Promise<BluetoothDevice | null> => {
  try {
    console.log(`Connecting to device ${deviceId}...`);
    
    // In a real implementation, we would use the Web Bluetooth API to connect
    // For now, we'll simulate a connection with a mock device
    
    // Find the device in our mock list
    const device = mockDevices.find(d => d.id === deviceId);
    
    if (!device) {
      throw new Error('Device not found');
    }
    
    // Simulate connection delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
      id: device.id,
      name: device.name,
      type: device.type,
      connected: true
    };
  } catch (error) {
    console.error("Error connecting to device:", error);
    return null;
  }
};

// Disconnect from a device
export const disconnectFromDevice = async (deviceId: string): Promise<boolean> => {
  try {
    console.log(`Disconnecting from device ${deviceId}...`);
    
    // Simulate disconnection delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return true;
  } catch (error) {
    console.error('Error disconnecting from device:', error);
    return false;
  }
};

// Get heart rate data from connected device
export const getHeartRateData = async (deviceId: string): Promise<number> => {
  // In a real implementation, we would read from the device
  // For now, return a random heart rate between 60-100
  return Math.floor(Math.random() * 40) + 60;
};

// Get stress level data (could be derived from HRV or other metrics)
export const getStressLevelData = async (deviceId: string): Promise<number> => {
  // In a real implementation, we would calculate this from device data
  // For now, return a random stress level between 0-100
  return Math.floor(Math.random() * 100);
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
  // Mock implementation - in reality would check device capabilities
  switch (feature) {
    case 'heart-rate':
      return device.type === 'heart-rate';
    case 'stress':
      return device.type === 'stress';
    default:
      return false;
  }
};
