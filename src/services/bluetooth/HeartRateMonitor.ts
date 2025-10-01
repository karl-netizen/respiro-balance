/**
 * PRODUCTION MODE - Real Bluetooth Heart Rate Monitor Only
 * NO DEMO DATA - NO SIMULATED DEVICES - LIVE CONNECTIONS ONLY
 */

export interface HeartRateData {
  heartRate: number;
  timestamp: string;
  deviceName: string;
  isReal: boolean;
}

export interface ConnectionResult {
  success: boolean;
  deviceName?: string;
  deviceId?: string;
  message: string;
  error?: string;
  canReconnect?: boolean;
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
  
  // Reconnection state
  private reconnectAttempts: number = 0;
  private readonly maxReconnectAttempts: number = 3;
  
  // Event callbacks
  private onHeartRateUpdate?: (data: HeartRateData) => void;
  private onDisconnect?: () => void;

  /**
   * Validate browser support before attempting connection
   */
  private validateBrowserSupport(): void {
    if (!HeartRateMonitor.isSupported()) {
      throw new Error('Web Bluetooth API not supported. Please use Chrome, Edge, or Opera browser.');
    }
    
    // Check if running on localhost or HTTPS
    if (typeof window !== 'undefined') {
      const protocol = window.location.protocol;
      const hostname = window.location.hostname;
      
      if (protocol !== 'https:' && hostname !== 'localhost' && hostname !== '127.0.0.1') {
        throw new Error('HTTPS is required for Bluetooth connections (except on localhost).');
      }
    }
  }

  /**
   * Scan and connect to REAL Bluetooth devices only - NO SIMULATED DEVICES
   */
  async scanAndConnect(): Promise<ConnectionResult> {
    try {
      // Validate browser support
      this.validateBrowserSupport();
      
      console.log('🔍 Scanning for real Bluetooth heart rate monitors...');
      
      // Request REAL Bluetooth device - NO SIMULATED DEVICES
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

      if (!this.device) {
        throw new Error('No device selected');
      }

      console.log('✓ Real device selected:', this.device.name);
      
      // Connect to GATT Server
      this.server = await this.device.gatt?.connect() || null;
      if (!this.server || !this.server.connected) {
        throw new Error('Failed to connect to GATT server');
      }
      console.log('✓ Connected to GATT server');

      // Get Heart Rate Service
      const service = await this.server.getPrimaryService(this.HEART_RATE_SERVICE);
      
      // Get Heart Rate Measurement Characteristic
      this.characteristic = await service.getCharacteristic(this.HEART_RATE_MEASUREMENT);
      
      // Start notifications for REAL data
      await this.characteristic.startNotifications();
      console.log('✓ Started receiving real heart rate data');
      
      // Listen for REAL heart rate data from device
      this.characteristic.addEventListener('characteristicvaluechanged', 
        this.handleHeartRateChange.bind(this));
      
      this.isConnected = true;
      this.reconnectAttempts = 0;
      
      // Handle disconnection
      this.device.addEventListener('gattserverdisconnected', 
        this.handleDisconnect.bind(this));
      
      return {
        success: true,
        deviceName: this.device.name || 'Heart Rate Monitor',
        deviceId: this.device.id,
        message: 'Connected to real device successfully'
      };
      
    } catch (error: any) {
      console.error('❌ Connection error:', error);
      this.isConnected = false;
      
      // Provide helpful error messages
      let userMessage = 'Connection failed. ';
      
      if (error.message.includes('User cancelled') || error.name === 'NotFoundError') {
        userMessage += 'Device selection was cancelled.';
      } else if (error.message.includes('not supported')) {
        userMessage += error.message;
      } else if (error.message.includes('HTTPS')) {
        userMessage += error.message;
      } else {
        userMessage += 'Please ensure:\n• Device is powered on\n• Device is in pairing mode\n• Device is within 10m range\n• Device is not paired with another device\n• Bluetooth is enabled on your computer/phone';
      }
      
      return {
        success: false,
        error: error.message,
        message: userMessage
      };
    }
  }

  /**
   * Parse REAL heart rate data from device - Validates realistic range
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
    
    // Validate heart rate is within realistic range (30-250 BPM)
    if (heartRate < 30 || heartRate > 250) {
      console.warn('⚠️ Received invalid heart rate:', heartRate);
      return 0;
    }
    
    console.log('❤️ Real Heart Rate:', heartRate, 'BPM');
    
    // Call the callback if set - mark as REAL data
    if (this.onHeartRateUpdate && this.device) {
      this.onHeartRateUpdate({
        heartRate: heartRate,
        timestamp: new Date().toISOString(),
        deviceName: this.device.name || 'Heart Rate Monitor',
        isReal: true // Always true in production mode
      });
    }
    
    return heartRate;
  }

  /**
   * Handle device disconnection with reconnection support
   */
  private handleDisconnect(): void {
    console.log('📡 Device disconnected');
    this.isConnected = false;
    
    if (this.onDisconnect) {
      this.onDisconnect();
    }
  }

  /**
   * Manually disconnect from device
   */
  async disconnect(): Promise<boolean> {
    if (this.characteristic) {
      try {
        await this.characteristic.stopNotifications();
      } catch (error) {
        console.error('Error stopping notifications:', error);
      }
    }
    
    if (this.device && this.device.gatt?.connected) {
      console.log('🔌 Disconnecting from device...');
      this.device.gatt.disconnect();
      this.isConnected = false;
      this.device = null;
      this.server = null;
      this.characteristic = null;
      console.log('✓ Disconnected successfully');
      return true;
    }
    return false;
  }

  /**
   * Attempt to reconnect to device
   */
  async reconnect(): Promise<ConnectionResult> {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('❌ Max reconnection attempts reached');
      return { 
        success: false, 
        message: 'Maximum reconnection attempts reached',
        canReconnect: false
      };
    }
    
    this.reconnectAttempts++;
    console.log(`🔄 Reconnection attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
    
    return await this.scanAndConnect();
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
   * Get current connection status with reconnection info
   */
  getConnectionStatus(): { 
    isConnected: boolean; 
    deviceName: string | null;
    deviceId: string | null;
    canReconnect: boolean;
    reconnectAttempts: number;
  } {
    return {
      isConnected: this.isConnected,
      deviceName: this.device ? (this.device.name || null) : null,
      deviceId: this.device ? this.device.id : null,
      canReconnect: this.reconnectAttempts < this.maxReconnectAttempts,
      reconnectAttempts: this.reconnectAttempts
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

  /**
   * Check if heart rate devices are available
   */
  static async isHeartRateDeviceAvailable(): Promise<boolean> {
    try {
      if (!HeartRateMonitor.isSupported()) {
        return false;
      }
      
      const availability = await navigator.bluetooth.getAvailability();
      return availability;
    } catch (error) {
      console.error('Error checking Bluetooth availability:', error);
      return false;
    }
  }
}

// PRODUCTION MODE: Real devices only - no demo/simulation
console.log('🎯 PRODUCTION MODE: Live Bluetooth connections only');

