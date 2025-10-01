import { useState, useEffect, useCallback, useRef } from 'react';
import { HeartRateMonitor, HeartRateData, ConnectionResult } from '@/services/bluetooth/HeartRateMonitor';
import { toast } from 'sonner';
import { Capacitor } from '@capacitor/core';
import * as CapacitorBluetooth from './biofeedback/capacitorBluetooth';

interface DeviceInfo {
  id: string;
  name: string;
  connected: boolean;
}

export const useHeartRateMonitor = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [heartRate, setHeartRate] = useState(0);
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  
  const monitorRef = useRef<HeartRateMonitor | null>(null);
  const isNativeMobile = Capacitor.isNativePlatform();

  // Initialize monitor
  useEffect(() => {
    if (!isNativeMobile) {
      monitorRef.current = new HeartRateMonitor();
      
      // Set up callbacks
      monitorRef.current.setOnHeartRateUpdate((data: HeartRateData) => {
        setHeartRate(data.heartRate);
        setLastUpdate(new Date(data.timestamp));
      });
      
      monitorRef.current.setOnDisconnect(() => {
        setIsConnected(false);
        setDeviceInfo(null);
        setHeartRate(0);
        toast.info('Device disconnected');
      });
    }
    
    return () => {
      if (monitorRef.current) {
        monitorRef.current.disconnect();
      }
    };
  }, [isNativeMobile]);

  // Connect to device
  const connect = useCallback(async (): Promise<boolean> => {
    if (isNativeMobile) {
      // Use Capacitor for native mobile
      setIsConnecting(true);
      try {
        await CapacitorBluetooth.initializeCapacitorBluetooth();
        const devices = await CapacitorBluetooth.scanForCapacitorDevices();
        
        if (devices.length > 0) {
          const device = devices[0];
          const connected = await CapacitorBluetooth.connectToCapacitorDevice(device.id);
          
          if (connected) {
            setIsConnected(true);
            setDeviceInfo({
              id: device.id,
              name: device.name,
              connected: true
            });
            
            // Start heart rate subscription
            CapacitorBluetooth.subscribeToCapacitorHeartRate(device.id, (hr) => {
              setHeartRate(hr);
              setLastUpdate(new Date());
            });
            
            toast.success('Connected', {
              description: `Connected to ${device.name}`
            });
            return true;
          }
        }
        
        toast.error('No devices found');
        return false;
      } catch (error: any) {
        console.error('Connection error:', error);
        toast.error('Connection failed', {
          description: error.message
        });
        return false;
      } finally {
        setIsConnecting(false);
      }
    }

    // Web Bluetooth for desktop/web
    if (!monitorRef.current) {
      toast.error('Monitor not initialized');
      return false;
    }
    
    if (!HeartRateMonitor.isSupported()) {
      toast.error('Bluetooth not supported', {
        description: 'Please use Chrome, Edge, or Opera browser, or install the native mobile app.'
      });
      return false;
    }

    setIsConnecting(true);
    
    try {
      const result: ConnectionResult = await monitorRef.current.scanAndConnect();
      
      if (result.success) {
        setIsConnected(true);
        const device = monitorRef.current.getDeviceInfo();
        if (device) {
          setDeviceInfo({
            id: device.id,
            name: device.name,
            connected: true
          });
        }
        
        toast.success('Connected', {
          description: result.message
        });
        return true;
      } else {
        if (result.error !== 'No device selected') {
          toast.error('Connection failed', {
            description: result.message
          });
        }
        return false;
      }
    } catch (error: any) {
      console.error('Connection error:', error);
      toast.error('Connection failed', {
        description: error.message
      });
      return false;
    } finally {
      setIsConnecting(false);
    }
  }, [isNativeMobile]);

  // Disconnect from device
  const disconnect = useCallback(async (): Promise<void> => {
    if (isNativeMobile && deviceInfo) {
      await CapacitorBluetooth.disconnectFromCapacitorDevice(deviceInfo.id);
    } else if (monitorRef.current) {
      await monitorRef.current.disconnect();
    }
    
    setIsConnected(false);
    setDeviceInfo(null);
    setHeartRate(0);
    setLastUpdate(null);
    
    toast.info('Disconnected');
  }, [isNativeMobile, deviceInfo]);

  // Get current heart rate reading
  const getCurrentHeartRate = useCallback(async (): Promise<number> => {
    if (!isConnected) {
      throw new Error('Device not connected');
    }
    
    if (isNativeMobile && deviceInfo) {
      return await CapacitorBluetooth.getCapacitorHeartRate(deviceInfo.id);
    } else if (monitorRef.current) {
      return await monitorRef.current.getCurrentHeartRate();
    }
    
    throw new Error('No monitor available');
  }, [isConnected, isNativeMobile, deviceInfo]);

  return {
    isConnected,
    isConnecting,
    heartRate,
    deviceInfo,
    lastUpdate,
    connect,
    disconnect,
    getCurrentHeartRate,
    isSupported: HeartRateMonitor.isSupported() || isNativeMobile
  };
};
