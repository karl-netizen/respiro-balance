/**
 * Unified Heart Rate Manager
 * Handles both Bluetooth (real-time) and Fitbit API (polling) connections
 */

import { HeartRateMonitor } from '../bluetooth/HeartRateMonitor';
import { FitbitAPIConnector } from '../fitbit/FitbitAPIConnector';

export type HeartRateSource = 'bluetooth' | 'fitbit' | null;

export interface UnifiedHeartRateData {
  type: 'heartrate' | 'error' | 'disconnected';
  heartRate?: number;
  timestamp?: number;
  source?: string;
  isRealTime?: boolean;
  deviceName?: string;
  message?: string;
}

export interface ConnectionResult {
  success: boolean;
  deviceName?: string;
  message: string;
  requiresRedirect?: boolean;
}

export class UnifiedHeartRateManager {
  private bluetoothMonitor: HeartRateMonitor | null = null;
  private fitbitAPI: FitbitAPIConnector;
  private activeSource: HeartRateSource = null;
  private onDataCallback: ((data: UnifiedHeartRateData) => void) | null = null;

  constructor() {
    this.fitbitAPI = new FitbitAPIConnector();
  }

  /**
   * Connect via Bluetooth (standard BLE heart rate monitors)
   */
  async connectBluetooth(): Promise<ConnectionResult> {
    try {
      this.bluetoothMonitor = new HeartRateMonitor();
      const result = await this.bluetoothMonitor.scanAndConnect();

      if (result.success) {
        this.activeSource = 'bluetooth';

        this.bluetoothMonitor.setOnHeartRateUpdate((data) => {
          if (this.onDataCallback) {
            this.onDataCallback({
              type: 'heartrate',
              heartRate: data.heartRate,
              timestamp: typeof data.timestamp === 'string' ? new Date(data.timestamp).getTime() : data.timestamp,
              source: 'bluetooth',
              isRealTime: true,
              deviceName: data.deviceName || 'Bluetooth Device'
            });
          }
        });

        this.bluetoothMonitor.setOnDisconnect(() => {
          if (this.onDataCallback) {
            this.onDataCallback({
              type: 'disconnected',
              source: 'bluetooth',
              message: 'Bluetooth device disconnected'
            });
          }
          this.activeSource = null;
        });

        return {
          success: true,
          deviceName: result.deviceName || 'Bluetooth Device',
          message: 'Connected to Bluetooth device'
        };
      }

      return {
        success: false,
        message: result.message || 'Failed to connect'
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Bluetooth connection failed'
      };
    }
  }

  /**
   * Connect via Fitbit API (OAuth + polling)
   */
  connectFitbit(): ConnectionResult {
    if (this.fitbitAPI.isAuthenticated()) {
      this.activeSource = 'fitbit';

      this.fitbitAPI.onData((data: UnifiedHeartRateData) => {
        if (this.onDataCallback) {
          this.onDataCallback(data);
        }
      });

      this.fitbitAPI.startPolling(15000); // Poll every 15 seconds

      return {
        success: true,
        deviceName: 'Fitbit Device',
        message: 'Connected to Fitbit API (15s updates)'
      };
    } else {
      // Need to authenticate - will redirect
      this.fitbitAPI.startOAuthFlow();
      return {
        success: false,
        message: 'Redirecting to Fitbit authentication...',
        requiresRedirect: true
      };
    }
  }

  /**
   * Handle Fitbit OAuth callback
   */
  handleFitbitCallback(): boolean {
    return this.fitbitAPI.handleOAuthCallback();
  }

  /**
   * Disconnect current source
   */
  async disconnect(): Promise<void> {
    if (this.activeSource === 'bluetooth' && this.bluetoothMonitor) {
      await this.bluetoothMonitor.disconnect();
      this.bluetoothMonitor = null;
    } else if (this.activeSource === 'fitbit') {
      this.fitbitAPI.stopPolling();
    }

    this.activeSource = null;
  }

  /**
   * Set data callback
   */
  onData(callback: (data: UnifiedHeartRateData) => void): void {
    this.onDataCallback = callback;
  }

  /**
   * Get current status
   */
  getStatus() {
    return {
      activeSource: this.activeSource,
      bluetooth: this.bluetoothMonitor ? {
        connected: true,
        deviceName: this.bluetoothMonitor.getDeviceInfo()?.name
      } : null,
      fitbit: this.fitbitAPI.getStatus()
    };
  }

  /**
   * Check if Fitbit is authenticated
   */
  isFitbitAuthenticated(): boolean {
    return this.fitbitAPI.isAuthenticated();
  }

  /**
   * Logout from Fitbit
   */
  logoutFitbit(): void {
    this.fitbitAPI.logout();
    if (this.activeSource === 'fitbit') {
      this.activeSource = null;
    }
  }
}
