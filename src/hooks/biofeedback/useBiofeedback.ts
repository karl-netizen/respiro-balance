
import { useState, useEffect } from 'react';
import { useAuth } from '../useAuth';
import { BiofeedbackService } from '@/services/BiofeedbackService';
import { BiometricData, ConnectionState } from '@/components/meditation/types/BiometricTypes';
import { DeviceInfo, BiofeedbackHookReturn } from './biofeedbackTypes';
import { simulationService } from './simulationService';
import { BiofeedbackDeviceService } from './deviceService';

// Create singleton instances
const biofeedbackService = new BiofeedbackService();
const deviceService = new BiofeedbackDeviceService(biofeedbackService);

export const useBiofeedback = (): BiofeedbackHookReturn => {
  const { user } = useAuth();
  const [heartRate, setHeartRate] = useState<number | null>(null);
  const [hrv, setHrv] = useState<number | null>(null);
  const [respiratoryRate, setRespiratoryRate] = useState<number | null>(null);
  const [stressLevel, setStressLevel] = useState<number | null>(null);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [availableDevices, setAvailableDevices] = useState<string[]>([]);
  const [connectedDevices, setConnectedDevices] = useState<DeviceInfo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentBiometrics, setCurrentBiometrics] = useState<Partial<BiometricData> | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  
  // Function to scan for available devices
  const scanForDevices = async () => {
    try {
      setError(null);
      const devices = await deviceService.scanForDevices();
      setAvailableDevices(devices);
      return devices;
    } catch (err: any) {
      setError(err.message);
      return [];
    }
  };

  // Function to connect to a device
  const connectDevice = async (deviceId?: string) => {
    try {
      setIsConnecting(true);
      setError(null);
      
      const deviceInfo = await deviceService.connectDevice(deviceId);
      setIsConnected(true);
      setConnectedDevices([deviceInfo]);
      setIsConnecting(false);
      return true;
    } catch (err: any) {
      setError(err.message);
      setIsConnecting(false);
      return false;
    }
  };

  // Function to disconnect from a device
  const disconnectDevice = async (deviceId?: string) => {
    try {
      const success = await deviceService.disconnectDevice(deviceId);
      if (success) {
        setIsConnected(false);
        setIsMonitoring(false);
        setConnectedDevices([]);
      }
      return success;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  // Function to start monitoring biometrics
  const startMonitoring = async () => {
    if (!isConnected) {
      setError("No device connected");
      return false;
    }

    try {
      const success = await deviceService.startMonitoring();
      if (success) {
        setIsMonitoring(true);
        
        // Set up interval to get current data
        const interval = setInterval(() => {
          updateBiometricData();
        }, 1000);
        
        return true;
      }
      return false;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };
  
  // Helper function to update biometric data
  const updateBiometricData = () => {
    const data = biofeedbackService.getCurrentData();
    if (data) {
      setCurrentBiometrics(data);
      if (data.heart_rate) setHeartRate(data.heart_rate);
      if (data.hrv) setHrv(data.hrv);
      if (data.breath_rate || data.respiratory_rate) {
        setRespiratoryRate(data.breath_rate || data.respiratory_rate);
      }
      if (data.stress_level || data.stress_score) {
        setStressLevel(data.stress_level || data.stress_score);
      }
    }
  };

  // Function to stop monitoring biometrics
  const stopMonitoring = async () => {
    try {
      const success = await deviceService.stopMonitoring();
      if (success) {
        setIsMonitoring(false);
      }
      return success;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  // Function to start simulation
  const startSimulation = () => {
    setIsSimulating(true);
    
    // Start simulation and get cleanup function
    return simulationService.startSimulation((mockData) => {
      setCurrentBiometrics(mockData);
      setHeartRate(mockData.heart_rate || null);
      setHrv(mockData.hrv || null);
      setRespiratoryRate(mockData.breath_rate || null);
      setStressLevel(mockData.stress_level || null);
    });
  };

  // Function to stop simulation
  const stopSimulation = () => {
    setIsSimulating(false);
    simulationService.stopSimulation();
    setCurrentBiometrics(null);
    setHeartRate(null);
    setHrv(null);
    setRespiratoryRate(null);
    setStressLevel(null);
  };

  return {
    heartRate,
    hrv,
    respiratoryRate,
    stressLevel,
    isMonitoring,
    isConnected,
    isConnecting,
    availableDevices,
    connectedDevices,
    currentBiometrics,
    isSimulating,
    error,
    scanForDevices,
    connectDevice,
    disconnectDevice,
    startMonitoring,
    stopMonitoring,
    startSimulation,
    stopSimulation
  };
};
