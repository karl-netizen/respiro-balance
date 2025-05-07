
import { useState, useEffect } from 'react';
import { biofeedbackService, BiofeedbackDeviceType, ConnectionState } from '@/services/BiofeedbackService';
import { useUserPreferences } from '@/context';
import { BluetoothDevice } from '@/types/supabase';
import { BiometricData } from '@/components/meditation/types/BiometricTypes';
import { toast } from 'sonner';

export interface UseBiofeedbackReturn {
  // Connection methods
  connectDevice: (deviceType?: BiofeedbackDeviceType) => Promise<BluetoothDevice | null>;
  disconnectDevice: (deviceId: string) => Promise<boolean>;
  
  // Device state and data
  connectedDevices: BluetoothDevice[];
  isConnecting: boolean;
  currentBiometrics: BiometricData | null;
  
  // Simulation methods
  startSimulation: () => void;
  stopSimulation: () => void;
  isSimulating: boolean;
}

export function useBiofeedback(): UseBiofeedbackReturn {
  const { preferences, updatePreferences } = useUserPreferences();
  const [connectedDevices, setConnectedDevices] = useState<BluetoothDevice[]>([]);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [currentBiometrics, setCurrentBiometrics] = useState<BiometricData | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationInterval, setSimulationInterval] = useState<number | null>(null);

  // Initialize from user preferences
  useEffect(() => {
    if (preferences.connectedDevices) {
      setConnectedDevices(preferences.connectedDevices);
    } else {
      setConnectedDevices([]);
    }
  }, [preferences.connectedDevices]);

  // Add listener for all devices' data
  useEffect(() => {
    const handleBiometricData = (data: BiometricData) => {
      setCurrentBiometrics(data);
    };
    
    // Add listener for any device
    biofeedbackService.addListener('all', handleBiometricData);
    
    // Clean up
    return () => {
      biofeedbackService.removeListener('all', handleBiometricData);
    };
  }, []);

  /**
   * Connect to a biofeedback device
   */
  const connectDevice = async (deviceType: BiofeedbackDeviceType = BiofeedbackDeviceType.HEART_RATE) => {
    // Check for Web Bluetooth API support
    if (!navigator.bluetooth) {
      toast.error(
        'Bluetooth not supported', 
        { description: 'This browser does not support the Web Bluetooth API' }
      );
      return null;
    }
    
    setIsConnecting(true);
    
    try {
      // Attempt to connect to device
      const deviceInfo = await biofeedbackService.connectDevice(deviceType);
      
      if (deviceInfo) {
        // Update the connected devices in preferences
        const updatedDevices = [...connectedDevices, deviceInfo];
        setConnectedDevices(updatedDevices);
        
        // Update user preferences
        updatePreferences({
          hasWearableDevice: true,
          wearableDeviceType: deviceInfo.name,
          wearableDeviceId: deviceInfo.id,
          connectedDevices: updatedDevices,
          lastSyncDate: new Date().toISOString()
        });
        
        return deviceInfo;
      }
      return null;
    } catch (error) {
      console.error('Error connecting to biofeedback device:', error);
      toast.error(
        'Connection failed',
        { description: error instanceof Error ? error.message : 'Unable to connect to device' }
      );
      return null;
    } finally {
      setIsConnecting(false);
    }
  };

  /**
   * Disconnect from a biofeedback device
   */
  const disconnectDevice = async (deviceId: string) => {
    try {
      const success = await biofeedbackService.disconnectDevice(deviceId);
      
      if (success) {
        // Remove device from connected devices
        const updatedDevices = connectedDevices.filter(device => device.id !== deviceId);
        setConnectedDevices(updatedDevices);
        
        // Update user preferences
        updatePreferences({
          hasWearableDevice: updatedDevices.length > 0,
          connectedDevices: updatedDevices
        });
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error disconnecting device:', error);
      return false;
    }
  };

  /**
   * Start simulating biometric data (for testing/development)
   */
  const startSimulation = () => {
    if (isSimulating) return;
    
    // Set initial values
    const baseHeartRate = 75;
    const baseHrv = 55;
    const baseRespiratoryRate = 16;
    const baseStressScore = 65;
    
    // Generate and use initial data
    const initialData = biofeedbackService.generateSimulatedData(
      baseHeartRate, 
      baseHrv, 
      baseRespiratoryRate, 
      baseStressScore
    );
    setCurrentBiometrics(initialData);
    
    // Create simulation device if none connected
    if (connectedDevices.length === 0) {
      const simulatedDevice: BluetoothDevice = {
        id: 'simulated-device',
        name: 'Simulated Biofeedback',
        type: 'heart_rate',
        connected: true
      };
      
      setConnectedDevices([simulatedDevice]);
      updatePreferences({
        hasWearableDevice: true,
        wearableDeviceType: 'Simulated Device',
        wearableDeviceId: 'simulated-device',
        connectedDevices: [simulatedDevice]
      });
    }
    
    // Start simulation interval
    const intervalId = window.setInterval(() => {
      const newData = biofeedbackService.generateSimulatedData(
        baseHeartRate, 
        baseHrv, 
        baseRespiratoryRate, 
        baseStressScore
      );
      
      setCurrentBiometrics(newData);
    }, 3000);
    
    setSimulationInterval(intervalId);
    setIsSimulating(true);
  };

  /**
   * Stop simulation
   */
  const stopSimulation = () => {
    if (simulationInterval) {
      clearInterval(simulationInterval);
      setSimulationInterval(null);
    }
    
    // Remove simulated device
    const realDevices = connectedDevices.filter(device => device.id !== 'simulated-device');
    setConnectedDevices(realDevices);
    updatePreferences({
      hasWearableDevice: realDevices.length > 0,
      connectedDevices: realDevices
    });
    
    setIsSimulating(false);
    setCurrentBiometrics(null);
  };

  return {
    connectDevice,
    disconnectDevice,
    connectedDevices,
    isConnecting,
    currentBiometrics,
    startSimulation,
    stopSimulation,
    isSimulating
  };
}
