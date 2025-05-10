
import { useState, useEffect } from 'react';
import { BluetoothDevice } from '@/types/supabase';
import * as DeviceService from './deviceService';

export function useDeviceManagement() {
  const [devices, setDevices] = useState<BluetoothDevice[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  
  // Scan for available Bluetooth devices
  const scanForDevices = async (deviceType?: string, options?: any): Promise<boolean> => {
    try {
      setIsScanning(true);
      
      // If in simulation mode, return mock devices
      if (options?.isSimulationMode) {
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate scan delay
        const mockDevices = await DeviceService.scanForDevices();
        setDevices(mockDevices);
        
        // Auto-connect if requested
        if (options?.autoConnect && mockDevices.length > 0) {
          await connectDevice(mockDevices[0].id, options);
        }
        
        return true;
      }
      
      // Real scan implementation
      const foundDevices = await DeviceService.scanForDevices();
      setDevices(foundDevices);
      
      // Auto-connect if requested
      if (options?.autoConnect && foundDevices.length > 0) {
        await connectDevice(foundDevices[0].id, options);
      }
      
      return true;
    } catch (error) {
      console.error('Failed to scan for biofeedback devices:', error);
      return false;
    } finally {
      setIsScanning(false);
      
      // Run callback if provided
      if (options?.callback && typeof options.callback === 'function') {
        options.callback(devices);
      }
    }
  };

  // Stop ongoing scan
  const stopScan = async (deviceType?: string, callback?: () => void): Promise<void> => {
    setIsScanning(false);
    
    if (callback && typeof callback === 'function') {
      callback();
    }
  };

  // Connect to a specific device
  const connectDevice = async (deviceId: string, options?: any): Promise<boolean> => {
    try {
      setIsConnecting(true);
      
      const device = await DeviceService.connectToDevice(deviceId);
      
      if (device) {
        // Update the devices list with the connected device
        setDevices(prev => 
          prev.map(d => d.id === deviceId ? { ...d, connected: true } : d)
        );
        
        // Run callback if provided
        if (options?.callback && typeof options.callback === 'function') {
          options.callback(device);
        }
        
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
  const disconnectDevice = async (deviceId: string, options?: any): Promise<boolean> => {
    try {
      const success = await DeviceService.disconnectFromDevice(deviceId);
      
      if (success) {
        // Update the devices list
        setDevices(prev => 
          prev.map(d => d.id === deviceId ? { ...d, connected: false } : d)
        );
        
        // Run callback if provided
        if (options?.callback && typeof options.callback === 'function') {
          options.callback();
        }
        
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
    stopScan,
    connectDevice,
    disconnectDevice
  };
}
