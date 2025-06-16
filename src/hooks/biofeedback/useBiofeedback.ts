
import { useState, useEffect } from 'react';
import { DeviceInfo, BiofeedbackHookReturn, BiometricReadings } from './types';
import { useSimulation } from './useSimulation';

export const useBiofeedback = (): BiofeedbackHookReturn => {
  const [devices, setDevices] = useState<DeviceInfo[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  
  const { isSimulating, simulatedData, startSimulation, stopSimulation } = useSimulation();

  // Extract current readings from simulated data
  const heartRate = simulatedData.heartRate;
  const stress = simulatedData.stress;
  const restingHeartRate = simulatedData.restingHeartRate;

  const connectDevice = async (deviceId: string, options?: any): Promise<boolean> => {
    setIsConnecting(true);
    try {
      // Simulate device connection
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setDevices(prev => prev.map(device => 
        device.id === deviceId 
          ? { ...device, connected: true }
          : device
      ));
      
      startSimulation();
      return true;
    } catch (error) {
      console.error('Failed to connect device:', error);
      return false;
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectDevice = async (deviceId: string, options?: any): Promise<boolean> => {
    try {
      setDevices(prev => prev.map(device => 
        device.id === deviceId 
          ? { ...device, connected: false }
          : device
      ));
      
      stopSimulation();
      return true;
    } catch (error) {
      console.error('Failed to disconnect device:', error);
      return false;
    }
  };

  const scanForDevices = async (deviceType?: string, options?: any): Promise<boolean> => {
    setIsScanning(true);
    try {
      // Simulate device scanning
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Add mock devices
      const mockDevices: DeviceInfo[] = [
        {
          id: 'device-1',
          name: 'Respiro HR Monitor',
          type: 'heart_rate',
          connected: false,
          batteryLevel: 85,
          signalStrength: -45
        },
        {
          id: 'device-2',
          name: 'Stress Monitor Pro',
          type: 'stress',
          connected: false,
          batteryLevel: 67,
          signalStrength: -52
        }
      ];
      
      setDevices(mockDevices);
      return true;
    } catch (error) {
      console.error('Failed to scan for devices:', error);
      return false;
    } finally {
      setIsScanning(false);
    }
  };

  const stopScan = async (deviceType?: string, callback?: () => void): Promise<void> => {
    setIsScanning(false);
    if (callback) callback();
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
    stopScan,
    isSimulating
  };
};
