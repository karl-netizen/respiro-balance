
import { useState } from 'react';
import { UserPreferencesData } from '@/types/supabase';
import { supabase } from '@/lib/supabase';

export interface BluetoothDeviceInfo {
  id: string;
  name: string;
  connected?: boolean;
  type?: string;
}

export interface UseBluetoothDevicesProps {
  userId?: string;
  updatePreferences: (updates: Partial<UserPreferencesData>) => void;
}

export const useBluetoothDevices = ({ userId, updatePreferences }: UseBluetoothDevicesProps) => {
  const [connectedDevices, setConnectedDevices] = useState<BluetoothDeviceInfo[]>([]);
  const [hasWearableDevice, setHasWearableDevice] = useState<boolean>(false);

  const connectBluetoothDevice = async (deviceType?: string, options?: any): Promise<boolean> => {
    try {
      // Simulate device connection
      const newDevice: BluetoothDeviceInfo = {
        id: 'wearable-001',
        name: 'MyWearable',
        type: deviceType || 'heart_rate_monitor'
      };

      setConnectedDevices([...connectedDevices, newDevice]);
      setHasWearableDevice(true);
      
      // Create an update object matching the UserPreferencesData type
      const updatedPreferences: Partial<UserPreferencesData> = {
        // Use only properties that exist in UserPreferencesData
      };
      
      updatePreferences(updatedPreferences);
      
      if (options?.callback && typeof options.callback === 'function') {
        options.callback(newDevice);
      }
      
      return true;
    } catch (error) {
      console.error('Bluetooth connection failed:', error);
      return false;
    }
  };

  const disconnectBluetoothDevice = async (deviceId: string, callback?: () => void): Promise<boolean> => {
    try {
      // Simulate device disconnection
      setConnectedDevices(connectedDevices.filter(device => device.id !== deviceId));
      
      const hasRemaining = connectedDevices.length > 1;
      setHasWearableDevice(hasRemaining);
      
      // Create an update object matching the UserPreferencesData type
      const updatedPreferences: Partial<UserPreferencesData> = {
        // Properties would go here
      };
      
      updatePreferences(updatedPreferences);
      
      if (callback && typeof callback === 'function') {
        callback();
      }
      
      return true;
    } catch (error) {
      console.error('Bluetooth disconnection failed:', error);
      return false;
    }
  };

  return {
    connectedDevices,
    hasWearableDevice,
    connectBluetoothDevice,
    disconnectBluetoothDevice
  };
};
