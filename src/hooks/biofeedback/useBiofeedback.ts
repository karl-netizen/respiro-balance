
import { useState, useEffect } from 'react';
import { DeviceInfo, BiofeedbackHookReturn } from './types';
import { useSimulation } from './useSimulation';
import * as DeviceService from './deviceService';
import { useBiometricData } from './useBiometricData';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useBiofeedback = (): BiofeedbackHookReturn => {
  const [devices, setDevices] = useState<DeviceInfo[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectedDeviceId, setConnectedDeviceId] = useState<string | null>(null);
  
  const { isSimulating, simulatedData, startSimulation, stopSimulation } = useSimulation();
  const { heartRate: liveHeartRate, stress: liveStress, restingHeartRate: liveRestingHR, startDataReading } = useBiometricData();

  // Use live data if device is connected, otherwise use simulated
  const heartRate = connectedDeviceId ? liveHeartRate : simulatedData.heartRate;
  const stress = connectedDeviceId ? liveStress : simulatedData.stress;
  const restingHeartRate = connectedDeviceId ? liveRestingHR : simulatedData.restingHeartRate;

  // Save biometric data to Supabase
  const saveBiometricData = async (data: { heart_rate: number; stress_level: number }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase.from('biometric_data').insert({
        user_id: user.id,
        heart_rate: data.heart_rate,
        stress_level: data.stress_level,
        recorded_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to save biometric data:', error);
    }
  };

  // Save data periodically when connected
  useEffect(() => {
    if (!connectedDeviceId) return;

    const interval = setInterval(() => {
      saveBiometricData({
        heart_rate: heartRate,
        stress_level: stress
      });
    }, 30000); // Save every 30 seconds

    return () => clearInterval(interval);
  }, [connectedDeviceId, heartRate, stress]);

  const connectDevice = async (deviceId: string, options?: any): Promise<boolean> => {
    setIsConnecting(true);
    try {
      // Check Bluetooth availability
      if (!DeviceService.isBluetoothAvailable()) {
        toast.error('Bluetooth not available', {
          description: 'Your browser does not support Web Bluetooth API. Please use Chrome or Edge.'
        });
        setIsConnecting(false);
        return false;
      }

      const connectedDevice = await DeviceService.connectToDevice(deviceId);
      
      if (!connectedDevice) {
        toast.error('Connection failed', {
          description: 'Could not connect to the device. Please try again.'
        });
        return false;
      }
      
      setDevices(prev => prev.map(device => 
        device.id === deviceId 
          ? { ...device, connected: true }
          : device
      ));
      
      setConnectedDeviceId(deviceId);
      
      // Start reading data from the device
      const cleanup = startDataReading(deviceId);
      
      // If simulated device, start simulation
      if (deviceId.startsWith('sim-')) {
        startSimulation();
      }

      toast.success('Device connected', {
        description: `Successfully connected to ${connectedDevice.name}`
      });
      
      return true;
    } catch (error: any) {
      console.error('Failed to connect device:', error);
      toast.error('Connection error', {
        description: error.message || 'An unexpected error occurred'
      });
      return false;
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectDevice = async (deviceId: string, options?: any): Promise<boolean> => {
    try {
      const success = await DeviceService.disconnectFromDevice(deviceId);
      
      if (success) {
        setDevices(prev => prev.map(device => 
          device.id === deviceId 
            ? { ...device, connected: false }
            : device
        ));
        
        setConnectedDeviceId(null);
        stopSimulation();
        
        toast.info('Device disconnected');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to disconnect device:', error);
      toast.error('Disconnection failed');
      return false;
    }
  };

  const scanForDevices = async (deviceType?: string, options?: any): Promise<boolean> => {
    setIsScanning(true);
    try {
      // Check Bluetooth availability
      if (!DeviceService.isBluetoothAvailable()) {
        toast.info('Using simulated devices', {
          description: 'Web Bluetooth API not available. Showing demo devices.'
        });
        
        // Show simulated devices
        const mockDevices: DeviceInfo[] = [
          {
            id: 'sim-hr-001',
            name: 'Simulated HR Monitor',
            type: 'heart_rate',
            connected: false,
            batteryLevel: 85,
            signalStrength: -45
          }
        ];
        
        setDevices(mockDevices);
        setIsScanning(false);
        return true;
      }

      toast.info('Scanning for devices', {
        description: 'Please select a device from the browser dialog'
      });

      const foundDevices = await DeviceService.scanForDevices();
      
      const deviceInfos: DeviceInfo[] = foundDevices.map(device => ({
        id: device.id,
        name: device.name,
        type: device.type === 'heart-rate' ? 'heart_rate' : 'stress',
        connected: device.connected,
        batteryLevel: 100,
        signalStrength: -50
      }));
      
      setDevices(deviceInfos);
      
      if (deviceInfos.length > 0) {
        toast.success('Devices found', {
          description: `Found ${deviceInfos.length} device(s)`
        });
      }
      
      return true;
    } catch (error: any) {
      console.error('Failed to scan for devices:', error);
      toast.error('Scan failed', {
        description: error.message || 'Could not scan for devices'
      });
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
    isSimulating: isSimulating || connectedDeviceId?.startsWith('sim-') || false
  };
};
