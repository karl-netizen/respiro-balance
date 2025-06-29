
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

export interface BiofeedbackDevice {
  id: string;
  name: string;
  type: 'apple_watch' | 'fitbit' | 'garmin' | 'polar' | 'samsung';
  connected: boolean;
  batteryLevel?: number;
  lastSync?: Date;
  capabilities: string[];
}

export interface LiveBiometricData {
  heartRate: number;
  hrv: number;
  stressLevel: number;
  breathingRate: number;
  skinTemperature?: number;
  oxygenSaturation?: number;
  timestamp: Date;
}

export interface BiometricInsight {
  type: 'stress' | 'recovery' | 'focus' | 'energy';
  level: 'low' | 'medium' | 'high' | 'optimal';
  message: string;
  recommendation: string;
  confidence: number;
}

export const useAdvancedBiofeedback = () => {
  const [devices, setDevices] = useState<BiofeedbackDevice[]>([]);
  const [liveData, setLiveData] = useState<LiveBiometricData | null>(null);
  const [insights, setInsights] = useState<BiometricInsight[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  // Simulate device scanning
  const scanForDevices = useCallback(async () => {
    setIsScanning(true);
    
    // Simulate scanning delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockDevices: BiofeedbackDevice[] = [
      {
        id: 'apple_watch_1',
        name: 'Apple Watch Series 9',
        type: 'apple_watch',
        connected: false,
        batteryLevel: 85,
        capabilities: ['heart_rate', 'hrv', 'stress', 'breathing', 'temperature']
      },
      {
        id: 'fitbit_1',
        name: 'Fitbit Sense 2',
        type: 'fitbit',
        connected: false,
        batteryLevel: 72,
        capabilities: ['heart_rate', 'hrv', 'stress', 'breathing', 'oxygen']
      },
      {
        id: 'garmin_1',
        name: 'Garmin Venu 3',
        type: 'garmin',
        connected: false,
        batteryLevel: 91,
        capabilities: ['heart_rate', 'hrv', 'stress', 'breathing']
      }
    ];
    
    setDevices(mockDevices);
    setIsScanning(false);
    toast.success('Found compatible devices');
  }, []);

  // Connect to device
  const connectDevice = useCallback(async (deviceId: string) => {
    const device = devices.find(d => d.id === deviceId);
    if (!device) return;

    try {
      // Simulate connection process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setDevices(prev => prev.map(d => 
        d.id === deviceId 
          ? { ...d, connected: true, lastSync: new Date() }
          : { ...d, connected: false }
      ));
      
      setIsConnected(true);
      toast.success(`Connected to ${device.name}`);
      
      // Start live data simulation
      startLiveDataStream();
    } catch (error) {
      toast.error('Failed to connect device');
    }
  }, [devices]);

  // Start live data streaming
  const startLiveDataStream = useCallback(() => {
    const interval = setInterval(() => {
      const newData: LiveBiometricData = {
        heartRate: 65 + Math.random() * 30,
        hrv: 30 + Math.random() * 40,
        stressLevel: 20 + Math.random() * 60,
        breathingRate: 12 + Math.random() * 8,
        skinTemperature: 36.5 + Math.random() * 1.5,
        oxygenSaturation: 95 + Math.random() * 5,
        timestamp: new Date()
      };
      
      setLiveData(newData);
      
      // Generate insights based on data
      const newInsights = generateInsights(newData);
      setInsights(newInsights);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Generate AI insights from biometric data
  const generateInsights = (data: LiveBiometricData): BiometricInsight[] => {
    const insights: BiometricInsight[] = [];
    
    // Stress level insight
    if (data.stressLevel > 70) {
      insights.push({
        type: 'stress',
        level: 'high',
        message: 'High stress detected',
        recommendation: 'Try a 5-minute breathing exercise to reduce stress',
        confidence: 0.9
      });
    }
    
    // HRV insight
    if (data.hrv < 25) {
      insights.push({
        type: 'recovery',
        level: 'low',
        message: 'Low heart rate variability',
        recommendation: 'Consider a gentle meditation session for recovery',
        confidence: 0.85
      });
    }
    
    // Heart rate insight
    if (data.heartRate > 85) {
      insights.push({
        type: 'energy',
        level: 'high',
        message: 'Elevated heart rate detected',
        recommendation: 'Perfect time for a calming meditation',
        confidence: 0.8
      });
    }
    
    return insights;
  };

  // Disconnect device
  const disconnectDevice = useCallback(() => {
    setDevices(prev => prev.map(d => ({ ...d, connected: false })));
    setIsConnected(false);
    setLiveData(null);
    setInsights([]);
    toast.info('Device disconnected');
  }, []);

  return {
    devices,
    liveData,
    insights,
    isScanning,
    isConnected,
    scanForDevices,
    connectDevice,
    disconnectDevice
  };
};
