
import { supabase } from '@/integrations/supabase/client';
import { BiometricData } from '@/components/meditation/types/BiometricTypes';
import { toast } from 'sonner';

export interface BluetoothDeviceInfo {
  id: string;
  name?: string;
  deviceType: string;
  connected: boolean;
  gatt?: BluetoothRemoteGATTServer;
}

export interface BiometricReadingOptions {
  samplingRate?: number;
  duration?: number;
  processRealTime?: boolean;
  saveToDatabase?: boolean;
}

export class BiofeedbackService {
  private static instance: BiofeedbackService;
  private devices: Map<string, BluetoothDeviceInfo> = new Map();
  private heartRateCharacteristic?: BluetoothRemoteGATTCharacteristic;
  private onDataUpdateCallbacks: ((data: BiometricData) => void)[] = [];
  private isMonitoring = false;
  private userId?: string;

  private constructor() {
    // Private constructor to enforce singleton pattern
  }

  public static getInstance(): BiofeedbackService {
    if (!BiofeedbackService.instance) {
      BiofeedbackService.instance = new BiofeedbackService();
    }
    return BiofeedbackService.instance;
  }

  public setUserId(userId: string): void {
    this.userId = userId;
  }

  public async scanForDevices(): Promise<BluetoothDeviceInfo[]> {
    try {
      if (!navigator.bluetooth) {
        throw new Error('Web Bluetooth API not available');
      }

      const device = await navigator.bluetooth.requestDevice({
        filters: [
          { services: ['heart_rate'] },
          { services: ['battery_service'] },
          { namePrefix: 'Polar' },
          { namePrefix: 'Fitbit' },
          { namePrefix: 'Garmin' }
        ],
        optionalServices: ['heart_rate', 'battery_service', 'device_information']
      });

      if (!device.gatt) {
        throw new Error('GATT server not available');
      }

      const deviceInfo: BluetoothDeviceInfo = {
        id: device.id,
        name: device.name,
        deviceType: this.determineDeviceType(device.name || ''),
        connected: device.gatt.connected
      };

      this.devices.set(device.id, deviceInfo);
      
      // Setup disconnect listener
      if ('addEventListener' in device) {
        (device as EventTarget).addEventListener('gattserverdisconnected', () => {
          this.handleDeviceDisconnection(device.id);
        });
      }
      
      return Array.from(this.devices.values());
    } catch (error) {
      console.error('Error scanning for Bluetooth devices:', error);
      throw error;
    }
  }

  public async connectToDevice(deviceId: string): Promise<BluetoothDeviceInfo> {
    const deviceInfo = this.devices.get(deviceId);
    
    if (!deviceInfo) {
      throw new Error('Device not found');
    }

    try {
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ deviceId }],
        optionalServices: ['heart_rate', 'battery_service', 'device_information']
      });

      if (!device.gatt) {
        throw new Error('GATT server not available');
      }

      const server = await device.gatt.connect();
      deviceInfo.gatt = server;
      deviceInfo.connected = true;
      
      this.devices.set(deviceId, deviceInfo);
      
      // Try to get heart rate service
      await this.setupHeartRateMonitoring(server);
      
      return deviceInfo;
    } catch (error) {
      console.error(`Error connecting to device ${deviceId}:`, error);
      throw error;
    }
  }

  public async disconnectFromDevice(deviceId: string): Promise<void> {
    const deviceInfo = this.devices.get(deviceId);
    
    if (!deviceInfo || !deviceInfo.gatt) {
      return;
    }

    try {
      // Stop monitoring before disconnecting
      this.stopMonitoring();
      
      deviceInfo.gatt.disconnect();
      deviceInfo.connected = false;
      this.devices.set(deviceId, deviceInfo);
    } catch (error) {
      console.error(`Error disconnecting from device ${deviceId}:`, error);
    }
  }

  public getConnectedDevices(): BluetoothDeviceInfo[] {
    return Array.from(this.devices.values()).filter(device => device.connected);
  }

  public addDataUpdateListener(callback: (data: BiometricData) => void): void {
    this.onDataUpdateCallbacks.push(callback);
  }

  public removeDataUpdateListener(callback: (data: BiometricData) => void): void {
    this.onDataUpdateCallbacks = this.onDataUpdateCallbacks.filter(cb => cb !== callback);
  }

  public async startMonitoring(options: BiometricReadingOptions = {}): Promise<void> {
    if (!this.heartRateCharacteristic) {
      throw new Error('Heart rate characteristic not available. Connect to a device first.');
    }

    this.isMonitoring = true;
    
    try {
      await this.heartRateCharacteristic.startNotifications();
      
      this.heartRateCharacteristic.addEventListener('characteristicvaluechanged', 
        // Use type assertion to handle the event properly
        ((event: Event) => {
          // Cast the event target to the correct type with an assertion
          const characteristic = event.target as unknown as BluetoothRemoteGATTCharacteristic;
          this.handleHeartRateChange(characteristic);
        }) as EventListener
      );
    } catch (error) {
      console.error('Error starting heart rate notifications:', error);
      this.isMonitoring = false;
      throw error;
    }
  }

  public stopMonitoring(): void {
    if (this.heartRateCharacteristic && this.isMonitoring) {
      try {
        this.heartRateCharacteristic.stopNotifications();
        this.isMonitoring = false;
      } catch (error) {
        console.error('Error stopping heart rate notifications:', error);
      }
    }
  }

  public isMonitoringActive(): boolean {
    return this.isMonitoring;
  }

  private async setupHeartRateMonitoring(server: BluetoothRemoteGATTServer): Promise<void> {
    try {
      const service = await server.getPrimaryService('heart_rate');
      this.heartRateCharacteristic = await service.getCharacteristic('heart_rate_measurement');
    } catch (error) {
      console.error('Error setting up heart rate monitoring:', error);
      throw error;
    }
  }

  private handleHeartRateChange(characteristic: BluetoothRemoteGATTCharacteristic): void {
    if (!characteristic.value) {
      return;
    }
    
    const value = characteristic.value;
    const flags = value.getUint8(0);
    const rate16Bits = flags & 0x1;
    let heartRate: number;
    
    if (rate16Bits) {
      heartRate = value.getUint16(1, true);
    } else {
      heartRate = value.getUint8(1);
    }
    
    // Calculate mock HRV and stress values based on heart rate
    // In a real app, these would come from more sophisticated algorithms
    const hrv = this.calculateMockHRV(heartRate);
    const stressScore = this.calculateMockStressScore(heartRate, hrv);
    
    // Create biometric data object
    const biometricData: BiometricData = {
      id: `temp-${Date.now()}`,
      user_id: this.userId || 'anonymous',
      heart_rate: heartRate,
      hrv: hrv,
      stress_score: stressScore,
      recorded_at: new Date().toISOString(),
      device_source: this.devices.values().next().value?.name || 'unknown'
    };
    
    // Notify all listeners
    this.onDataUpdateCallbacks.forEach(callback => callback(biometricData));
    
    // Save to database if user is authenticated
    this.saveDataToDatabase(biometricData);
  }
  
  private handleDeviceDisconnection(deviceId: string): void {
    const deviceInfo = this.devices.get(deviceId);
    
    if (deviceInfo) {
      deviceInfo.connected = false;
      this.devices.set(deviceId, deviceInfo);
      
      // Stop monitoring if this was the active device
      if (this.isMonitoring) {
        this.stopMonitoring();
      }
      
      console.log(`Device ${deviceId} disconnected`);
      
      // Notify listeners that device was disconnected
      // We could implement a separate listener system for device states
    }
  }

  private determineDeviceType(deviceName: string): string {
    const nameLower = deviceName.toLowerCase();
    if (nameLower.includes('polar')) return 'Polar';
    if (nameLower.includes('fitbit')) return 'Fitbit';
    if (nameLower.includes('garmin')) return 'Garmin';
    if (nameLower.includes('apple')) return 'Apple Watch';
    return 'Unknown Device';
  }
  
  // Mock calculations - in a real app these would use proper algorithms
  private calculateMockHRV(heartRate: number): number {
    // Simple mock calculation: higher HR generally corresponds to lower HRV
    // Real HRV calculation requires beat-to-beat intervals
    const baseHRV = 65; // Average HRV
    const hrFactor = Math.max(0, (80 - heartRate) / 2); // Higher HR = lower HRV
    return Math.round(baseHRV + hrFactor + (Math.random() * 10 - 5)); // Add some randomness
  }
  
  private calculateMockStressScore(heartRate: number, hrv: number): number {
    // Simplified mock calculation: higher HR and lower HRV generally means higher stress
    // Real stress algorithms are much more complex
    const baseStress = 50; // Base stress level (0-100)
    const hrFactor = Math.max(0, (heartRate - 70) * 1.2);
    const hrvFactor = Math.max(0, (50 - hrv) * 0.8);
    
    // Calculate stress score (0-100)
    return Math.min(100, Math.max(0, Math.round(baseStress + hrFactor + hrvFactor)));
  }
  
  private async saveDataToDatabase(data: BiometricData): Promise<void> {
    // Only save if user is authenticated and has an ID
    if (!this.userId) return;
    
    try {
      const { error } = await supabase
        .from('biometric_data')
        .insert({
          user_id: this.userId,
          heart_rate: data.heart_rate,
          hrv: data.hrv,
          stress_score: data.stress_score,
          recorded_at: data.recorded_at,
          device_source: data.device_source,
        });
      
      if (error) throw error;
    } catch (err) {
      console.error('Error saving biometric data to database:', err);
    }
  }
}

// Create a singleton instance
export const biofeedbackService = BiofeedbackService.getInstance();

export default biofeedbackService;
