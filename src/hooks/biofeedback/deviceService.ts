
import { DeviceInfo } from './biofeedbackTypes';
import { BiofeedbackService } from '@/services/BiofeedbackService';

/**
 * Service to handle biofeedback device interactions
 */
export class BiofeedbackDeviceService {
  private biofeedbackService: BiofeedbackService;
  
  constructor(biofeedbackService: BiofeedbackService) {
    this.biofeedbackService = biofeedbackService;
  }
  
  /**
   * Scan for available devices
   */
  async scanForDevices(): Promise<string[]> {
    try {
      // Mock implementation
      const mockDevices = ['Device 1', 'Device 2', 'Polar H10'];
      return mockDevices;
    } catch (err: any) {
      throw new Error(`Failed to scan for devices: ${err.message}`);
    }
  }
  
  /**
   * Connect to a device
   * @param deviceId Optional device ID
   */
  async connectDevice(deviceId?: string): Promise<DeviceInfo> {
    try {
      const success = await this.biofeedbackService.connect();
      
      if (success) {
        // Return mock device info
        const mockDeviceInfo: DeviceInfo = {
          id: deviceId || 'mock-device-id',
          name: deviceId || 'Heart Rate Monitor',
          type: 'heart_rate_monitor',
          connected: true
        };
        
        return mockDeviceInfo;
      }
      
      throw new Error('Failed to connect to device');
    } catch (err: any) {
      throw new Error(`Connection error: ${err.message}`);
    }
  }
  
  /**
   * Disconnect from a device
   * @param deviceId Optional device ID
   */
  async disconnectDevice(deviceId?: string): Promise<boolean> {
    try {
      await this.biofeedbackService.disconnect();
      return true;
    } catch (err: any) {
      throw new Error(`Disconnection error: ${err.message}`);
    }
  }
  
  /**
   * Start monitoring biometric data
   */
  async startMonitoring(): Promise<boolean> {
    try {
      await this.biofeedbackService.startMonitoring();
      return true;
    } catch (err: any) {
      throw new Error(`Failed to start monitoring: ${err.message}`);
    }
  }
  
  /**
   * Stop monitoring biometric data
   */
  async stopMonitoring(): Promise<boolean> {
    try {
      await this.biofeedbackService.stopMonitoring();
      return true;
    } catch (err: any) {
      throw new Error(`Failed to stop monitoring: ${err.message}`);
    }
  }
}
