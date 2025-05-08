
import { useState, useEffect } from 'react';
import { BiofeedbackDeviceService } from './deviceService';
import { simulationService } from './simulationService';
import { BiometricData } from '@/components/meditation/types/BiometricTypes';
import { BiofeedbackService } from '@/services/BiofeedbackService';
import { DeviceInfo } from './biofeedbackTypes';

// Create a biofeedback service instance
const biofeedbackService = new BiofeedbackService();
const deviceService = new BiofeedbackDeviceService(biofeedbackService);

export interface BiofeedbackHookReturn {
  heartRate: number | null;
  hrv: number | null;
  respiratoryRate: number | null;
  stressLevel: number | null;
  isMonitoring: boolean;
  isConnected: boolean;
  isConnecting: boolean;
  availableDevices: string[];
  connectedDevices: DeviceInfo[];
  currentBiometrics: Partial<BiometricData> | null;
  isSimulating: boolean;
  error: string | null;
  scanForDevices: () => Promise<string[]>;
  connectDevice: (deviceId?: string) => Promise<boolean>;
  disconnectDevice: (deviceId?: string) => Promise<boolean>;
  startMonitoring: () => Promise<boolean>;
  stopMonitoring: () => Promise<boolean>;
  startSimulation: () => (() => void);
  stopSimulation: () => void;
}

/**
 * Hook to interact with biofeedback devices
 */
export const useBiofeedback = (): BiofeedbackHookReturn => {
  const [heartRate, setHeartRate] = useState<number | null>(null);
  const [hrv, setHrv] = useState<number | null>(null);
  const [respiratoryRate, setRespiratoryRate] = useState<number | null>(null);
  const [stressLevel, setStressLevel] = useState<number | null>(null);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [availableDevices, setAvailableDevices] = useState<string[]>([]);
  const [connectedDevices, setConnectedDevices] = useState<DeviceInfo[]>([]);
  const [currentBiometrics, setCurrentBiometrics] = useState<Partial<BiometricData> | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  /**
   * Scan for available biofeedback devices
   */
  const scanForDevices = async () => {
    try {
      const devices = await deviceService.scanForDevices();
      setAvailableDevices(devices);
      setError(null);
      return devices;
    } catch (err: any) {
      setError(`Error scanning for devices: ${err.message}`);
      return [];
    }
  };
  
  /**
   * Connect to a biofeedback device
   * @param deviceId Optional device ID
   */
  const connectDevice = async (deviceId?: string) => {
    try {
      setIsConnecting(true);
      setError(null);
      
      const deviceInfo = await deviceService.connectDevice(deviceId);
      
      // Add device to connected devices list
      setConnectedDevices(prev => [...prev, deviceInfo]);
      setIsConnected(true);
      return true;
    } catch (err: any) {
      setError(`Connection error: ${err.message}`);
      return false;
    } finally {
      setIsConnecting(false);
    }
  };
  
  /**
   * Disconnect from a biofeedback device
   * @param deviceId Optional device ID
   */
  const disconnectDevice = async (deviceId?: string) => {
    try {
      const success = await deviceService.disconnectDevice(deviceId);
      
      if (success) {
        // Remove device from connected devices list
        if (deviceId) {
          setConnectedDevices(prev => prev.filter(d => d.id !== deviceId));
        } else {
          setConnectedDevices([]);
        }
        
        // If no devices left, set isConnected to false
        if (connectedDevices.length <= 1) {
          setIsConnected(false);
        }
      }
      
      return success;
    } catch (err: any) {
      setError(`Disconnection error: ${err.message}`);
      return false;
    }
  };
  
  /**
   * Start monitoring biometric data
   */
  const startMonitoring = async () => {
    if (!isConnected && connectedDevices.length === 0) {
      setError('No connected devices');
      return false;
    }
    
    try {
      const success = await deviceService.startMonitoring();
      setIsMonitoring(success);
      setError(null);
      return success;
    } catch (err: any) {
      setError(`Monitoring error: ${err.message}`);
      return false;
    }
  };
  
  /**
   * Stop monitoring biometric data
   */
  const stopMonitoring = async () => {
    try {
      const success = await deviceService.stopMonitoring();
      setIsMonitoring(!success);
      return success;
    } catch (err: any) {
      setError(`Stop monitoring error: ${err.message}`);
      return false;
    }
  };
  
  /**
   * Start simulation of biometric data
   */
  const startSimulation = () => {
    setIsSimulating(true);
    setError(null);
    
    const cleanupFn = simulationService.startSimulation((data) => {
      // Update state with simulated data
      if (data.heart_rate) setHeartRate(data.heart_rate);
      if (data.hrv) setHrv(data.hrv);
      if (data.breath_rate) setRespiratoryRate(data.breath_rate);
      if (data.stress_level) setStressLevel(data.stress_level);
      setCurrentBiometrics(data);
    });
    
    return cleanupFn;
  };
  
  /**
   * Stop simulation
   */
  const stopSimulation = () => {
    simulationService.stopSimulation();
    setIsSimulating(false);
  };
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isSimulating) {
        stopSimulation();
      }
    };
  }, [isSimulating]);
  
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
