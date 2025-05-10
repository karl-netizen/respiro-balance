
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useDeviceManagement } from './useDeviceManagement';
import { useSimulation } from './useSimulation';
import { useBiometricData } from './useBiometricData';
import { BiofeedbackHookReturn } from './types';

export const useBiofeedback = (): BiofeedbackHookReturn => {
  const { user } = useAuth();
  const { 
    devices, 
    isScanning, 
    isConnecting, 
    scanForDevices: scanDevices, 
    stopScan: stopDeviceScan,
    connectDevice: connectDeviceToSystem,
    disconnectDevice: disconnectDeviceFromSystem
  } = useDeviceManagement();
  
  const {
    isSimulating,
    startSimulation,
    stopSimulation,
    simulatedData
  } = useSimulation();
  
  const {
    heartRate: deviceHeartRate,
    stress: deviceStress,
    restingHeartRate: deviceRestingHeartRate,
    startDataReading
  } = useBiometricData();

  // Initialize simulation mode if no real devices are available
  useEffect(() => {
    const initializeDeviceState = async () => {
      const hasWebBluetooth = 'bluetooth' in navigator;
      
      if (!hasWebBluetooth) {
        console.log('Web Bluetooth API not available, enabling simulation mode');
        startSimulation();
      }
    };
    
    initializeDeviceState();
    
    return () => {
      // Clean up simulation
      stopSimulation();
    };
  }, []);

  // Scan for available Bluetooth devices (wrapper)
  const scanForDevices = async (deviceType?: string, options?: any): Promise<boolean> => {
    return scanDevices(deviceType, { ...options, isSimulationMode: isSimulating });
  };

  // Stop ongoing scan
  const stopScan = async (deviceType?: string, callback?: () => void): Promise<void> => {
    return stopDeviceScan(deviceType, callback);
  };

  // Connect to a specific device (wrapper)
  const connectDevice = async (deviceId: string, options?: any): Promise<boolean> => {
    const success = await connectDeviceToSystem(deviceId, options);
    if (success) {
      // If this is the first connected device, start reading data
      startDataReading(deviceId);
    }
    return success;
  };

  // Disconnect from a device (wrapper)
  const disconnectDevice = async (deviceId: string, options?: any): Promise<boolean> => {
    return disconnectDeviceFromSystem(deviceId, options);
  };

  // Get the appropriate heart rate value (from device or simulation)
  const getCurrentHeartRate = () => {
    return isSimulating ? simulatedData.heartRate : deviceHeartRate;
  };
  
  // Get the appropriate stress value (from device or simulation)
  const getCurrentStress = () => {
    return isSimulating ? simulatedData.stress : deviceStress;
  };
  
  // Get the appropriate resting heart rate value (from device or simulation)
  const getCurrentRestingHeartRate = () => {
    return isSimulating ? simulatedData.restingHeartRate : deviceRestingHeartRate;
  };

  return {
    devices,
    isScanning,
    isConnecting,
    heartRate: getCurrentHeartRate(),
    stress: getCurrentStress(),
    restingHeartRate: getCurrentRestingHeartRate(),
    connectDevice,
    disconnectDevice,
    scanForDevices,
    stopScan,
    isSimulating
  };
};

// Export the BiofeedbackHookReturn type for re-export in other files
export type { BiofeedbackHookReturn };
