
import { BluetoothDevice } from '@/types/supabase';
import { notificationService } from './NotificationService';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { BiometricData } from '@/components/meditation/types/BiometricTypes';

// Define available device types
export enum BiofeedbackDeviceType {
  HEART_RATE = 'heart_rate',
  BREATH_MONITOR = 'breath_monitor',
  EEG = 'eeg',
  GSR = 'gsr'  // Galvanic Skin Response
}

// Store device characteristics UUIDs
const HEART_RATE_SERVICE_UUID = 'heart_rate';
const HEART_RATE_CHARACTERISTIC_UUID = 'heart_rate_measurement';
const BODY_SENSOR_LOCATION_CHARACTERISTIC_UUID = 'body_sensor_location';

// Possible device connection states
export enum ConnectionState {
  DISCONNECTED = 'disconnected',
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  ERROR = 'error'
}

// Interface for connected device
export interface ConnectedDevice {
  device: BluetoothDevice;
  gatt?: BluetoothRemoteGATTServer;
  characteristics?: Map<string, BluetoothRemoteGATTCharacteristic>;
  lastSyncTime?: Date;
  connectionState: ConnectionState;
}

class BiofeedbackService {
  private connectedDevices: Map<string, ConnectedDevice> = new Map();
  private listeners: Map<string, Set<(data: BiometricData) => void>> = new Map();
  private offlineCache: BiometricData[] = [];
  private isOnline: boolean = navigator.onLine;

  constructor() {
    // Set up online/offline detection
    window.addEventListener('online', this.handleOnlineStatus.bind(this));
    window.addEventListener('offline', this.handleOnlineStatus.bind(this));
    
    // Check for web bluetooth support
    this.checkBluetoothSupport();
  }

  private checkBluetoothSupport(): boolean {
    if (!navigator.bluetooth) {
      console.warn('Web Bluetooth API is not available in this browser or device');
      return false;
    }
    return true;
  }

  private handleOnlineStatus() {
    this.isOnline = navigator.onLine;
    
    if (this.isOnline) {
      this.syncOfflineData();
    }
  }

  /**
   * Connect to a Bluetooth device
   */
  async connectDevice(deviceType: BiofeedbackDeviceType = BiofeedbackDeviceType.HEART_RATE): Promise<BluetoothDevice | null> {
    if (!this.checkBluetoothSupport()) return null;

    try {
      // Request device based on type
      let requestOptions: RequestDeviceOptions = {
        acceptAllDevices: true
      };
      
      if (deviceType === BiofeedbackDeviceType.HEART_RATE) {
        requestOptions = {
          filters: [{ services: ['heart_rate'] }]
        };
      }
      
      // Show a notification that we're connecting
      toast.info('Searching for biofeedback devices...');

      // Request the device
      const device = await navigator.bluetooth.requestDevice(requestOptions);
      
      if (!device) {
        toast.error('No device selected');
        return null;
      }
      
      // Set up device disconnection listener
      device.addEventListener('gattserverdisconnected', () => this.handleDeviceDisconnect(device.id));

      // Save the device info
      const deviceInfo: BluetoothDevice = {
        id: device.id,
        name: device.name || 'Unknown Device',
        type: deviceType,
        connected: true
      };

      // Connect to GATT server
      toast.loading('Connecting to device...');
      const gattServer = await device.gatt?.connect();
      
      if (!gattServer) {
        toast.error('Failed to connect to device');
        return null;
      }
      
      // Store the connected device
      this.connectedDevices.set(device.id, {
        device: deviceInfo,
        gatt: gattServer,
        characteristics: new Map(),
        connectionState: ConnectionState.CONNECTED,
        lastSyncTime: new Date()
      });

      // Start reading data from the device
      this.startDeviceDataReading(device.id, deviceType);
      
      toast.success(`Connected to ${device.name}`, {
        description: 'The device is now sending biometric data'
      });
      
      // Return the connected device info
      return deviceInfo;
    } catch (error) {
      console.error('Error connecting to device:', error);
      toast.error('Error connecting to device', {
        description: error instanceof Error ? error.message : 'Please try again'
      });
      return null;
    }
  }

  /**
   * Disconnect a specific device
   */
  async disconnectDevice(deviceId: string): Promise<boolean> {
    const connectedDevice = this.connectedDevices.get(deviceId);
    
    if (!connectedDevice) {
      console.warn('Device not found:', deviceId);
      return false;
    }
    
    try {
      // Disconnect GATT connection
      if (connectedDevice.gatt && connectedDevice.gatt.connected) {
        connectedDevice.gatt.disconnect();
      }
      
      // Remove device from connected devices
      this.connectedDevices.delete(deviceId);
      
      toast.success(`Disconnected from ${connectedDevice.device.name}`);
      return true;
    } catch (error) {
      console.error('Error disconnecting device:', error);
      toast.error('Error disconnecting device');
      return false;
    }
  }

  /**
   * Handle device disconnection event
   */
  private handleDeviceDisconnect(deviceId: string) {
    const device = this.connectedDevices.get(deviceId);
    
    if (device) {
      device.connectionState = ConnectionState.DISCONNECTED;
      
      toast.warning(`${device.device.name} disconnected`, {
        description: 'The connection to your device has been lost'
      });
      
      // Update device info
      const updatedDevice = { ...device.device, connected: false };
      this.connectedDevices.set(deviceId, { ...device, device: updatedDevice });
    }
  }

  /**
   * Start reading data from the connected device
   */
  private async startDeviceDataReading(deviceId: string, deviceType: BiofeedbackDeviceType) {
    const connectedDevice = this.connectedDevices.get(deviceId);
    if (!connectedDevice || !connectedDevice.gatt) return;

    try {
      // Handle based on device type
      if (deviceType === BiofeedbackDeviceType.HEART_RATE) {
        await this.setupHeartRateMonitoring(deviceId);
      }
      // Add other device types as needed
    } catch (error) {
      console.error('Error starting device readings:', error);
    }
  }

  /**
   * Set up heart rate monitoring for connected device
   */
  private async setupHeartRateMonitoring(deviceId: string) {
    const device = this.connectedDevices.get(deviceId);
    if (!device || !device.gatt) return;

    try {
      // Get the Heart Rate service
      const service = await device.gatt.getPrimaryService(HEART_RATE_SERVICE_UUID);
      
      // Get the Heart Rate Measurement characteristic
      const heartRateChar = await service.getCharacteristic(HEART_RATE_CHARACTERISTIC_UUID);
      
      // Store the characteristic
      device.characteristics = device.characteristics || new Map();
      device.characteristics.set(HEART_RATE_CHARACTERISTIC_UUID, heartRateChar);
      
      // Start notifications
      await heartRateChar.startNotifications();
      
      // Listen for heart rate data
      heartRateChar.addEventListener('characteristicvaluechanged', 
        (event) => this.handleHeartRateData(deviceId, event)
      );
      
      console.log('Heart rate monitoring started');
    } catch (error) {
      console.error('Error setting up heart rate monitoring:', error);
    }
  }

  /**
   * Handle heart rate data from device
   */
  private handleHeartRateData(deviceId: string, event: Event) {
    // Get the value from the event
    const target = event.target as BluetoothRemoteGATTCharacteristic;
    const value = target.value;
    
    if (!value) return;
    
    // Parse heart rate data according to Bluetooth GATT specification
    // The first byte contains flags for how to read the data
    const flags = value.getUint8(0);
    const rate16Bits = flags & 0x1;
    let heartRate: number;
    
    if (rate16Bits) {
      heartRate = value.getUint16(1, true); // true means little-endian
    } else {
      heartRate = value.getUint8(1);
    }
    
    // Calculate HRV (simplified approach - would be more sophisticated in production)
    // In a real app, you would collect multiple intervals and do statistical analysis
    let hrv: number | undefined;
    
    if (flags & 0x10) {  // Check if RR-Interval data is present
      const rrCount = (value.byteLength - 2) / 2;
      let totalRr = 0;
      let minRr = Infinity;
      let maxRr = 0;
      
      for (let i = 0; i < rrCount; i++) {
        const rrInterval = value.getUint16(2 + i * 2, true) / 1024 * 1000; // Convert to ms
        totalRr += rrInterval;
        minRr = Math.min(minRr, rrInterval);
        maxRr = Math.max(maxRr, rrInterval);
      }
      
      if (rrCount > 0) {
        // Calculate SDNN (Standard Deviation of NN intervals) - a common HRV metric
        // This is a very simplified version
        hrv = maxRr - minRr;
      }
    }
    
    // Calculate respiratory rate (estimated)
    // Using the relationship between heart rate and breathing
    // This is a simplified estimation, not medically accurate
    const respiratoryRate = Math.max(Math.round(heartRate / 4), 8);
    
    // Calculate stress score (simplified algorithm)
    // In a real app, this would use more sophisticated analysis
    let stressScore = 100 - ((hrv || 50) / 100) * 100;
    stressScore = Math.max(0, Math.min(100, stressScore));
    
    // Create biometric data object
    const biometricData: BiometricData = {
      heart_rate: heartRate,
      hrv: hrv,
      respiratory_rate: respiratoryRate,
      stress_score: Math.round(stressScore),
      timestamp: new Date().toISOString()
    };
    
    // Process the biometric data
    this.processData(deviceId, biometricData);
  }

  /**
   * Process and store biometric data
   */
  private processData(deviceId: string, data: BiometricData) {
    // Notify all registered listeners
    this.notifyListeners(deviceId, data);
    
    // Store data (in Supabase if online, otherwise cache)
    this.storeData(data);
  }

  /**
   * Store biometric data in Supabase
   */
  private async storeData(data: BiometricData) {
    if (this.isOnline) {
      // If we're online, store directly in Supabase
      try {
        const user = (await supabase.auth.getUser()).data.user;
        
        if (user) {
          // Add user ID to the data
          const dataToStore = {
            ...data,
            user_id: user.id
          };
          
          // Store in Supabase
          const { error } = await supabase
            .from('biometric_data')
            .insert(dataToStore);
            
          if (error) {
            console.error('Error storing biometric data:', error);
            // Cache data if storage fails
            this.offlineCache.push(data);
          }
        }
      } catch (error) {
        console.error('Error storing biometric data:', error);
        // Cache data if error occurs
        this.offlineCache.push(data);
      }
    } else {
      // If we're offline, add to offline cache
      this.offlineCache.push(data);
      
      // Store in local storage
      this.updateOfflineCache();
    }
  }

  /**
   * Update offline cache in local storage
   */
  private updateOfflineCache() {
    try {
      // Save to local storage
      localStorage.setItem('biometric_offline_cache', JSON.stringify(this.offlineCache));
    } catch (error) {
      console.error('Error saving offline biometric data:', error);
    }
  }

  /**
   * Load cached data from storage
   */
  private loadOfflineCache() {
    try {
      const cached = localStorage.getItem('biometric_offline_cache');
      if (cached) {
        this.offlineCache = JSON.parse(cached);
      }
    } catch (error) {
      console.error('Error loading cached biometric data:', error);
    }
  }

  /**
   * Sync offline data when connection is restored
   */
  private async syncOfflineData() {
    if (this.offlineCache.length === 0) return;
    
    // Load any cached data from storage
    this.loadOfflineCache();
    
    if (this.offlineCache.length > 0) {
      toast.loading(`Syncing ${this.offlineCache.length} cached biometric readings...`);
      
      try {
        const user = (await supabase.auth.getUser()).data.user;
        
        if (user) {
          // Add user ID to each entry
          const dataToSync = this.offlineCache.map(data => ({
            ...data,
            user_id: user.id
          }));
          
          // Upload to Supabase in batches
          const batchSize = 50;
          for (let i = 0; i < dataToSync.length; i += batchSize) {
            const batch = dataToSync.slice(i, i + batchSize);
            
            const { error } = await supabase
              .from('biometric_data')
              .insert(batch);
              
            if (error) {
              console.error('Error syncing biometric data batch:', error);
              // Stop on first error
              break;
            }
          }
          
          // Clear cache if successful
          this.offlineCache = [];
          this.updateOfflineCache();
          
          toast.success('Biometric data synchronized successfully');
        }
      } catch (error) {
        console.error('Error syncing biometric data:', error);
        toast.error('Failed to sync some biometric data');
      }
    }
  }

  /**
   * Register a listener for biometric data
   */
  addListener(deviceId: string, listener: (data: BiometricData) => void): void {
    if (!this.listeners.has(deviceId)) {
      this.listeners.set(deviceId, new Set());
    }
    
    this.listeners.get(deviceId)?.add(listener);
  }

  /**
   * Remove a listener
   */
  removeListener(deviceId: string, listener: (data: BiometricData) => void): void {
    this.listeners.get(deviceId)?.delete(listener);
  }

  /**
   * Notify all registered listeners with new data
   */
  private notifyListeners(deviceId: string, data: BiometricData): void {
    // Notify device-specific listeners
    this.listeners.get(deviceId)?.forEach(listener => listener(data));
    
    // Notify "all" listeners
    this.listeners.get('all')?.forEach(listener => listener(data));
  }

  /**
   * Get all connected devices
   */
  getConnectedDevices(): BluetoothDevice[] {
    return Array.from(this.connectedDevices.values())
      .map(connected => connected.device);
  }

  /**
   * Check if a device is connected
   */
  isDeviceConnected(deviceId: string): boolean {
    const device = this.connectedDevices.get(deviceId);
    return !!(device && device.connectionState === ConnectionState.CONNECTED);
  }

  /**
   * Generate simulated biometric data for testing
   */
  generateSimulatedData(
    baseHeartRate: number = 70, 
    baseHrv: number = 50, 
    baseRespiratoryRate: number = 14, 
    baseStressScore: number = 60
  ): BiometricData {
    // Add some randomness to the values
    const hr = Math.max(40, Math.min(180, baseHeartRate + (Math.random() * 10 - 5)));
    const hrv = Math.max(20, Math.min(100, baseHrv + (Math.random() * 10 - 5)));
    const resp = Math.max(8, Math.min(20, baseRespiratoryRate + (Math.random() * 2 - 1)));
    const stress = Math.max(0, Math.min(100, baseStressScore + (Math.random() * 10 - 5)));
    
    return {
      heart_rate: Math.round(hr),
      hrv: Math.round(hrv),
      respiratory_rate: Math.round(resp),
      stress_score: Math.round(stress),
      coherence: Math.random() * 0.5 + 0.3 // 0.3-0.8 range
    };
  }
}

// Export singleton instance
export const biofeedbackService = new BiofeedbackService();
