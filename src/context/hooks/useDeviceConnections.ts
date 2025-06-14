
import { useState, useEffect } from 'react';
import { BluetoothDeviceInfo } from '../types';

export const useDeviceConnections = (userId?: string) => {
  const [connectedDevices, setConnectedDevices] = useState<BluetoothDeviceInfo[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);

  const connectDevice = async (device: BluetoothDeviceInfo): Promise<boolean> => {
    setIsConnecting(true);
    try {
      // Mock connection logic
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const connectedDevice: BluetoothDeviceInfo = {
        ...device,
        // Note: BluetoothDeviceInfo doesn't have connected property based on types
        // We'll handle connection state differently
      };
      
      setConnectedDevices(prev => [...prev, connectedDevice]);
      return true;
    } catch (error) {
      console.error('Failed to connect device:', error);
      return false;
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectDevice = async (deviceId: string): Promise<boolean> => {
    try {
      setConnectedDevices(prev => prev.filter(device => device.id !== deviceId));
      return true;
    } catch (error) {
      console.error('Failed to disconnect device:', error);
      return false;
    }
  };

  return {
    connectedDevices,
    isConnecting,
    connectDevice,
    disconnectDevice
  };
};
