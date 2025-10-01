/**
 * Bluetooth Heart Rate Monitor Service
 * Supports real devices including Fitbit Inspire 2
 * Demo mode removed - live connections only
 */

export interface HeartRateData {
  heartRate: number;
  timestamp: string;
  deviceName: string;
}

export interface ConnectionResult {
  success: boolean;
  deviceName?: string;
  message: string;
  error?: string;
}

export class HeartRateMonitor {
  private device: BluetoothDevice | null = null;
  private server: BluetoothRemoteGATTServer | null = null;
  private characteristic: BluetoothRemoteGATTCharacteristic | null = null;
  private isConnected: boolean = false;
  
  // Standard Bluetooth Heart Rate Service UUID
  private readonly HEART_RATE_SERVICE = 0x180D;
  private readonly HEART_RATE_MEASUREMENT = 0x2A37;
  private readonly BATTERY_SERVICE = 0x180F;
  
  // Event callbacks
  private onHeartRateUpdate?: (data: HeartRateData) => void;
  private onDisconnect?: () => void;

  /**
   * Scan and connect to Bluetooth devices
   */
  async scanAndConnect(): Promise<ConnectionResult> {
    try {
      console.log('Scanning for Bluetooth devices...');
      
      // Request Bluetooth device with Heart Rate Service
      // Support for Fitbit and other BLE heart rate monitors
      this.device = await navigator.bluetooth.requestDevice({
        filters: [
          { services: [this.HEART_RATE_SERVICE], namePrefix: 'Fitbit' },
          { services: [this.HEART_RATE_SERVICE], namePrefix: 'Inspire' },
          { services: [this.HEART_RATE_SERVICE], namePrefix: 'Charge' },
          { services: [this.HEART_RATE_SERVICE], namePrefix: 'Versa' },
          { services: [this.HEART_RATE_SERVICE], namePrefix: 'Sense' },
          { services: [this.HEART_RATE_SERVICE], name: 'Ionic' },
          { services: [this.HEART_RATE_SERVICE] }
        ],
        optionalServices: [this.BATTERY_SERVICE]
      });

      console.log('Device selected:', this.device.name);
      
      // Connect to GATT Server
      this.server = await this.device.gatt?.connect() || null;
      if (!this.server) {
        throw new Error('Failed to connect to GATT server');
      }
      console.log('Connected to GATT server');

      // Get Heart Rate Service
      const service = await this.server.getPrimaryService(this.HEART_RATE_SERVICE);
      
      // Get Heart Rate Measurement Characteristic
      this.characteristic = await service.getCharacteristic(this.HEART_RATE_MEASUREMENT);
      
      // Start notifications
      await this.characteristic.startNotifications();
      console.log('Started heart rate notifications');
      
      // Listen for heart rate data
      this.characteristic.addEventListener('characteristicvaluechanged', 
        this.handleHeartRateChange.bind(this));
      
      this.isConnected = true;
      
      // Handle disconnection
      this.device.addEventListener('gattserverdisconnected', 
        this.handleDisconnect.bind(this));
      
      return {
        success: true,
        deviceName: this.device.name || 'Unknown Device',
        message: 'Successfully connected to device'
      };
      
    } catch (error: any) {
      console.error('Connection error:', error);
      
      // User cancelled the dialog
      if (error.name === 'NotFoundError') {
        return {
          success: false,
          error: 'No device selected',
          message: 'Please select a device to connect'
        };
      }
      
      return {
        success: false,
        error: error.message,
        message: 'Failed to connect. Please ensure device is on, in pairing mode, and within range.'
      };
    }
  }

  /**
   * Parse heart rate data from BLE characteristic
   */
  private handleHeartRateChange(event: Event): number {
    const target = event.target as BluetoothRemoteGATTCharacteristic;
    const value = target.value;
    
    if (!value) return 0;
    
    const flags = value.getUint8(0);
    
    // Check if heart rate is in 8-bit or 16-bit format
    const is16Bit = flags & 0x1;
    let heartRate: number;
    
    if (is16Bit) {
      heartRate = value.getUint16(1, true); // little-endian
    } else {
      heartRate = value.getUint8(1);
    }
    
    console.log('Heart Rate:', heartRate, 'bpm');
    
    // Call the callback if set
    if (this.onHeartRateUpdate && this.device) {
      this.onHeartRateUpdate({
        heartRate: heartRate,
        timestamp: new Date().toISOString(),
        deviceName: this.device.name || 'Unknown Device'
      });
    }
    
    return heartRate;
  }

  /**
   * Handle device disconnection
   */
  private handleDisconnect(): void {
    console.log('Device disconnected');
    this.isConnected = false;
    
    if (this.onDisconnect) {
      this.onDisconnect();
    }
  }

  /**
   * Disconnect from device
   */
  async disconnect(): Promise<void> {
    if (this.characteristic) {
      try {
        await this.characteristic.stopNotifications();
      } catch (error) {
        console.error('Error stopping notifications:', error);
      }
    }
    
    if (this.device && this.device.gatt?.connected) {
      this.device.gatt.disconnect();
      this.isConnected = false;
      console.log('Manually disconnected');
    }
  }

  /**
   * Get current heart rate (read once)
   */
  async getCurrentHeartRate(): Promise<number> {
    if (!this.characteristic) {
      throw new Error('Device not connected');
    }
    
    try {
      const value = await this.characteristic.readValue();
      const flags = value.getUint8(0);
      const is16Bit = flags & 0x1;
      
      if (is16Bit) {
        return value.getUint16(1, true);
      } else {
        return value.getUint8(1);
      }
    } catch (error) {
      console.error('Error reading heart rate:', error);
      throw error;
    }
  }

  /**
   * Check connection status
   */
  getConnectionStatus(): { isConnected: boolean; deviceName: string | null } {
    return {
      isConnected: this.isConnected,
      deviceName: this.device ? (this.device.name || null) : null
    };
  }

  /**
   * Set callback for heart rate updates
   */
  setOnHeartRateUpdate(callback: (data: HeartRateData) => void): void {
    this.onHeartRateUpdate = callback;
  }

  /**
   * Set callback for disconnection
   */
  setOnDisconnect(callback: () => void): void {
    this.onDisconnect = callback;
  }

  /**
   * Get device info
   */
  getDeviceInfo(): { id: string; name: string } | null {
    if (!this.device) return null;
    
    return {
      id: this.device.id,
      name: this.device.name || 'Unknown Device'
    };
  }

  /**
   * Check if Web Bluetooth is supported
   */
  static isSupported(): boolean {
    return typeof navigator !== 'undefined' && 'bluetooth' in navigator;
  }
}

// Singleton instance
export const hrMonitor = new HeartRateMonitor();
