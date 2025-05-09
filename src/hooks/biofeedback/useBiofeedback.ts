
import { useState, useEffect } from 'react';
import { BiofeedbackHookReturn } from '.';
import * as DeviceService from './deviceService';
import { useAuth } from '@/hooks/useAuth';
import { BluetoothDevice } from '@/types/supabase';

export const useBiofeedback = (): BiofeedbackHookReturn => {
  const { user } = useAuth();
  const [devices, setDevices] = useState<BluetoothDevice[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [heartRate, setHeartRate] = useState(0);
  const [stress, setStress] = useState(0);
  const [restingHeartRate, setRestingHeartRate] = useState(0);
  const [heartRateHistory, setHeartRateHistory] = useState<number[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);

  // Initialize simulation mode if no real devices are available
  useEffect(() => {
    const initializeDeviceState = async () => {
      const hasWebBluetooth = 'bluetooth' in navigator;
      
      if (!hasWebBluetooth) {
        console.log('Web Bluetooth API not available, enabling simulation mode');
        setIsSimulating(true);
        startSimulation();
      }
    };
    
    initializeDeviceState();
    
    return () => {
      // Clean up any device connections on unmount
      devices.forEach(device => {
        if (device.connected) {
          disconnectDevice(device.id);
        }
      });
    };
  }, []);

  // Simulate biometric data if in simulation mode
  const startSimulation = () => {
    // Initial mock data
    setHeartRate(72);
    setStress(35);
    setRestingHeartRate(62);
    
    // Update heart rate every 3 seconds with small variations
    const heartRateInterval = setInterval(() => {
      const baseRate = 72;
      const randomVariation = Math.floor(Math.random() * 10) - 5; // -5 to +5 variation
      const newHeartRate = baseRate + randomVariation;
      
      setHeartRate(newHeartRate);
      setHeartRateHistory(prev => [...prev.slice(-19), newHeartRate]);
      
      // Calculate resting heart rate based on the lowest values
      if (heartRateHistory.length > 10) {
        const lowestRates = [...heartRateHistory].sort((a, b) => a - b).slice(0, 5);
        const newRestingHr = Math.floor(lowestRates.reduce((sum, val) => sum + val, 0) / lowestRates.length);
        setRestingHeartRate(newRestingHr);
      }
      
      // Simulate stress level changes
      const baseStress = 35;
      const stressVariation = Math.floor(Math.random() * 16) - 8; // -8 to +8 variation
      setStress(Math.max(0, Math.min(100, baseStress + stressVariation)));
    }, 3000);
    
    return () => clearInterval(heartRateInterval);
  };

  // Scan for available Bluetooth devices
  const scanForDevices = async (): Promise<boolean> => {
    try {
      setIsScanning(true);
      
      // If in simulation mode, return mock devices
      if (isSimulating) {
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate scan delay
        const mockDevices = await DeviceService.scanForDevices();
        setDevices(mockDevices);
        setIsScanning(false);
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
        
        // If this is the first connected device, start reading data
        startDataReading(deviceId);
        
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

  // Start reading data from connected device
  const startDataReading = (deviceId: string) => {
    // For heart rate
    const heartRateInterval = setInterval(async () => {
      try {
        const heartRateValue = await DeviceService.getHeartRateData(deviceId);
        setHeartRate(heartRateValue);
        setHeartRateHistory(prev => [...prev.slice(-19), heartRateValue]);
        
        // Update resting heart rate calculation
        if (heartRateHistory.length > 10) {
          const restingHr = DeviceService.calculateRestingHeartRate(heartRateHistory);
          setRestingHeartRate(restingHr);
        }
      } catch (error) {
        console.error('Error reading heart rate:', error);
      }
    }, 1000);
    
    // For stress level
    const stressInterval = setInterval(async () => {
      try {
        const stressValue = await DeviceService.getStressLevelData(deviceId);
        setStress(stressValue);
      } catch (error) {
        console.error('Error reading stress level:', error);
      }
    }, 5000);
    
    return () => {
      clearInterval(heartRateInterval);
      clearInterval(stressInterval);
    };
  };

  return {
    devices,
    isScanning,
    isConnecting,
    heartRate,
    stress,
    restingHeartRate,
    connectDevice,
    disconnectDevice,
    scanForDevices,
    isSimulating
  };
};

// Export the BiofeedbackHookReturn type for re-export in other files
export type { BiofeedbackHookReturn };
