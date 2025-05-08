
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { BiofeedbackService } from '@/services/BiofeedbackService';
import { BiometricData, ConnectionState } from '@/components/meditation/types/BiometricTypes';

// Interface for device information
export interface DeviceInfo {
  id: string;
  name: string;
  type: string;
  connected: boolean;
}

// Create a singleton instance of the service
const biofeedbackService = new BiofeedbackService();

export const useBiofeedback = () => {
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
      // Mock implementation
      const mockDevices = ['Device 1', 'Device 2', 'Polar H10'];
      setAvailableDevices(mockDevices);
      return mockDevices;
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
      
      const success = await biofeedbackService.connect();
      
      if (success) {
        setIsConnected(true);
        
        // Add mock device to connected devices
        const mockDeviceInfo: DeviceInfo = {
          id: deviceId || 'mock-device-id',
          name: deviceId || 'Heart Rate Monitor',
          type: 'heart_rate_monitor',
          connected: true
        };
        
        setConnectedDevices([mockDeviceInfo]);
      }
      
      setIsConnecting(false);
      return success;
    } catch (err: any) {
      setError(err.message);
      setIsConnecting(false);
      return false;
    }
  };

  // Function to disconnect from a device
  const disconnectDevice = async (deviceId?: string) => {
    try {
      await biofeedbackService.disconnect();
      setIsConnected(false);
      setIsMonitoring(false);
      setConnectedDevices([]);
      return true;
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
      await biofeedbackService.startMonitoring();
      setIsMonitoring(true);
      
      // Set up interval to get current data
      const interval = setInterval(() => {
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
      }, 1000);
      
      // Clean up interval on unmount
      return () => clearInterval(interval);
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  // Function to stop monitoring biometrics
  const stopMonitoring = async () => {
    try {
      await biofeedbackService.stopMonitoring();
      setIsMonitoring(false);
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  // Simulation functionality
  const startSimulation = () => {
    setIsSimulating(true);
    
    // Mock data
    const simulateData = () => {
      const mockData: Partial<BiometricData> = {
        heart_rate: 60 + Math.floor(Math.random() * 20),
        hrv: 40 + Math.floor(Math.random() * 30),
        breath_rate: 12 + Math.floor(Math.random() * 6),
        stress_level: Math.floor(Math.random() * 100),
        focus_score: 60 + Math.floor(Math.random() * 40),
        brainwaves: {
          alpha: Math.random() * 10,
          beta: Math.random() * 20,
          delta: Math.random() * 5,
          gamma: Math.random() * 2,
          theta: Math.random() * 8
        }
      };
      
      setCurrentBiometrics(mockData);
      setHeartRate(mockData.heart_rate || null);
      setHrv(mockData.hrv || null);
      setRespiratoryRate(mockData.breath_rate || null);
      setStressLevel(mockData.stress_level || null);
    };
    
    // Initial simulation
    simulateData();
    
    // Set interval for ongoing simulation
    const interval = setInterval(simulateData, 2000);
    
    // Return cleanup function
    return () => clearInterval(interval);
  };

  // Function to stop simulation
  const stopSimulation = () => {
    setIsSimulating(false);
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
