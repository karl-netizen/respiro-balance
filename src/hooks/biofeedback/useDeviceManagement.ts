
import { useState, useEffect } from 'react';
import { BluetoothDevice } from '@/types/supabase';
import * as DeviceService from './deviceService';

export function useDeviceManagement() {
  const [devices, setDevices] = useState<BluetoothDevice[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  
  // Scan for available Bluetooth devices
  const scanForDevices = async (isSimulationMode: boolean): Promise<boolean> => {
    try {
      setIsScanning(true);
      
      // If in simulation mode, return mock devices
      if (isSimulationMode) {
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate scan delay
        const mockDevices = await DeviceService.scanForDevices();
        setDevices(mockDevices);
        return true;
      }
      
      // Real scan implementation
      const foundDevices = await DeviceService.scanForDevices();
      setDevices(foundDevices);
      return true;
    } catch (error) {
      console.error('Failed to scan for biofeedback devices:', error);
      return false;
    } finally {
      setIsScanning(false);
    }
  };

  // Connect to a specific device
  const connectDevice = async (deviceId: string): Promise<boolean> => {
    try {
      setIsConnecting(true);
      
      const device = await DeviceService.connectToDevice(deviceId);
      
      if (device) {
        // Update the devices list with the connected device
        setDevices(prev => 
          prev.map(d => d.id === deviceId ? { ...d, connected: true } : d)
        );
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Failed to connect device:', error);
      return false;
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect from a device
  const disconnectDevice = async (deviceId: string): Promise<boolean> => {
    try {
      const success = await DeviceService.disconnectFromDevice(deviceId);
      
      if (success) {
        // Update the devices list
        setDevices(prev => 
          prev.map(d => d.id === deviceId ? { ...d, connected: false } : d)
        );
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Failed to disconnect device:', error);
      return false;
    }
  };

  // Clean up device connections on unmount
  useEffect(() => {
    return () => {
      devices.forEach(device => {
        if (device.connected) {
          disconnectDevice(device.id);
        }
      });
    };
  }, [devices]);

  return {
    devices,
    isScanning,
    isConnecting,
    scanForDevices,
    connectDevice,
    disconnectDevice
  };
}
