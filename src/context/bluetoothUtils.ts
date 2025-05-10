
import { UserPreferences, BluetoothDevice, DeviceType } from './types';

// Function to simulate connecting a Bluetooth device
export const connectBluetoothDevice = async (): Promise<{
  success: boolean;
  device?: BluetoothDevice;
}> => {
  // This is a mock implementation since Web Bluetooth API may not be available
  try {
    // Simulate device connection with a timeout
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Create a mock device
    const mockDevice: BluetoothDevice = {
      id: Math.random().toString(36).substring(2, 10),
      name: "Respiro HR Monitor",
      type: "heart_rate_monitor",
      connected: true
    };
    
    return {
      success: true,
      device: mockDevice
    };
  } catch (error) {
    console.error("Failed to connect Bluetooth device:", error);
    return {
      success: false
    };
  }
};

// Function to handle disconnecting a device
export const disconnectDevice = (
  deviceId: string, 
  preferences: UserPreferences
): DeviceType[] => {
  // Since we're dealing with string types in connectedDevices,
  // we need to handle them differently than BluetoothDevice objects
  const deviceIndex = preferences.connectedDevices.findIndex(
    (device) => typeof device === 'string' ? false : device === deviceId
  );
  
  if (deviceIndex === -1) {
    return preferences.connectedDevices;
  }
  
  const updatedDevices = [...preferences.connectedDevices];
  updatedDevices.splice(deviceIndex, 1);
  
  return updatedDevices;
};
