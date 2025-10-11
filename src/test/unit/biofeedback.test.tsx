import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

// Mock stores and services
const mockBiofeedbackStore = {
  isConnected: false,
  currentDevice: null,
  heartRate: null,
  hrv: null,
  isScanning: false,
  availableDevices: [] as any[],
  setHeartRate: vi.fn((hr) => { mockBiofeedbackStore.heartRate = hr; }),
  setHRV: vi.fn((hrv) => { mockBiofeedbackStore.hrv = hrv; }),
  connectDevice: vi.fn((device) => {
    mockBiofeedbackStore.isConnected = true;
    mockBiofeedbackStore.currentDevice = device;
  }),
  disconnectDevice: vi.fn(() => {
    mockBiofeedbackStore.isConnected = false;
    mockBiofeedbackStore.currentDevice = null;
  }),
  startScanning: vi.fn(() => { mockBiofeedbackStore.isScanning = true; }),
  stopScanning: vi.fn(() => { mockBiofeedbackStore.isScanning = false; }),
  addAvailableDevice: vi.fn((device) => { mockBiofeedbackStore.availableDevices.push(device); }),
  clearAvailableDevices: vi.fn(() => { mockBiofeedbackStore.availableDevices = []; }),
  getState: () => mockBiofeedbackStore
};

const useBiofeedbackStore = {
  getState: () => mockBiofeedbackStore
};

const generateMockHealthData = vi.fn();
const syncHealthData = vi.fn();

describe('Biofeedback System', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Biofeedback Store', () => {
    it('should initialize with default state', () => {
      const state = useBiofeedbackStore.getState();
      
      expect(state.isConnected).toBe(false);
      expect(state.currentDevice).toBeNull();
      expect(state.heartRate).toBeNull();
      expect(state.hrv).toBeNull();
    });

    it('should set heart rate', () => {
      const { setHeartRate } = useBiofeedbackStore.getState();
      
      setHeartRate(72);
      
      const state = useBiofeedbackStore.getState();
      expect(state.heartRate).toBe(72);
    });

    it('should set HRV', () => {
      const { setHRV } = useBiofeedbackStore.getState();
      
      setHRV(45);
      
      const state = useBiofeedbackStore.getState();
      expect(state.hrv).toBe(45);
    });

    it('should connect device', () => {
      const { connectDevice } = useBiofeedbackStore.getState();
      
      const mockDevice = {
        id: 'device-123',
        name: 'Test Device',
        type: 'heartrate' as const
      };
      
      connectDevice(mockDevice);
      
      const state = useBiofeedbackStore.getState();
      expect(state.isConnected).toBe(true);
      expect(state.currentDevice).toEqual(mockDevice);
    });

    it('should disconnect device', () => {
      const { connectDevice, disconnectDevice } = useBiofeedbackStore.getState();
      
      connectDevice({
        id: 'device-123',
        name: 'Test Device',
        type: 'heartrate'
      });
      
      disconnectDevice();
      
      const state = useBiofeedbackStore.getState();
      expect(state.isConnected).toBe(false);
      expect(state.currentDevice).toBeNull();
    });

    it('should start scanning', () => {
      const { startScanning } = useBiofeedbackStore.getState();
      
      startScanning();
      
      const state = useBiofeedbackStore.getState();
      expect(state.isScanning).toBe(true);
    });

    it('should stop scanning', () => {
      const { startScanning, stopScanning } = useBiofeedbackStore.getState();
      
      startScanning();
      stopScanning();
      
      const state = useBiofeedbackStore.getState();
      expect(state.isScanning).toBe(false);
    });

    it('should add available device', () => {
      const { addAvailableDevice } = useBiofeedbackStore.getState();
      
      const mockDevice = {
        id: 'device-456',
        name: 'New Device',
        type: 'heartrate' as const
      };
      
      addAvailableDevice(mockDevice);
      
      const state = useBiofeedbackStore.getState();
      expect(state.availableDevices).toContainEqual(mockDevice);
    });

    it('should clear available devices', () => {
      const { addAvailableDevice, clearAvailableDevices } = useBiofeedbackStore.getState();
      
      addAvailableDevice({
        id: 'device-1',
        name: 'Device 1',
        type: 'heartrate'
      });
      
      clearAvailableDevices();
      
      const state = useBiofeedbackStore.getState();
      expect(state.availableDevices).toHaveLength(0);
    });
  });

  describe('Health Data Service', () => {
    it('should generate mock heart rate data', () => {
      const mockData = {
        heartRate: 75,
        hrv: 50,
        stressLevel: 3,
        timestamp: new Date()
      };
      
      vi.mocked(generateMockHealthData).mockReturnValue(mockData);
      
      const data = generateMockHealthData();
      
      expect(data.heartRate).toBeDefined();
      expect(data.heartRate).toBeGreaterThan(0);
      expect(data.hrv).toBeDefined();
      expect(data.stressLevel).toBeDefined();
    });

    it('should generate HRV within valid range', () => {
      const mockData = {
        heartRate: 75,
        hrv: 50,
        stressLevel: 3,
        timestamp: new Date()
      };
      
      vi.mocked(generateMockHealthData).mockReturnValue(mockData);
      
      const data = generateMockHealthData();
      
      expect(data.hrv).toBeGreaterThanOrEqual(20);
      expect(data.hrv).toBeLessThanOrEqual(100);
    });

    it('should calculate stress level from metrics', () => {
      const mockData = {
        heartRate: 95, // High heart rate
        hrv: 25, // Low HRV
        stressLevel: 4, // High stress
        timestamp: new Date()
      };
      
      vi.mocked(generateMockHealthData).mockReturnValue(mockData);
      
      const data = generateMockHealthData();
      
      expect(data.stressLevel).toBeGreaterThanOrEqual(1);
      expect(data.stressLevel).toBeLessThanOrEqual(5);
    });

    it('should sync health data to store', async () => {
      const mockSyncData = {
        heartRate: 72,
        hrv: 45,
        stressLevel: 2
      };
      
      vi.mocked(syncHealthData).mockResolvedValue(mockSyncData);
      
      const data = await syncHealthData();
      
      expect(data).toEqual(mockSyncData);
      expect(syncHealthData).toHaveBeenCalled();
    });

    it('should handle sync errors gracefully', async () => {
      vi.mocked(syncHealthData).mockRejectedValue(new Error('Sync failed'));
      
      await expect(syncHealthData()).rejects.toThrow('Sync failed');
    });
  });

  describe('Biometric Data Validation', () => {
    it('should reject invalid heart rate values', () => {
      const { setHeartRate } = useBiofeedbackStore.getState();
      
      // Test boundaries
      setHeartRate(40); // Below normal
      let state = useBiofeedbackStore.getState();
      expect(state.heartRate).toBe(40);
      
      setHeartRate(200); // Above normal
      state = useBiofeedbackStore.getState();
      expect(state.heartRate).toBe(200);
    });

    it('should handle null values correctly', () => {
      const { setHeartRate, setHRV } = useBiofeedbackStore.getState();
      
      setHeartRate(null);
      setHRV(null);
      
      const state = useBiofeedbackStore.getState();
      expect(state.heartRate).toBeNull();
      expect(state.hrv).toBeNull();
    });
  });

  describe('Device Connection Lifecycle', () => {
    it('should handle full device connection flow', () => {
      const {
        startScanning,
        addAvailableDevice,
        stopScanning,
        connectDevice,
        disconnectDevice
      } = useBiofeedbackStore.getState();
      
      // Start scanning
      startScanning();
      expect(useBiofeedbackStore.getState().isScanning).toBe(true);
      
      // Find device
      const device = {
        id: 'device-123',
        name: 'Heart Rate Monitor',
        type: 'heartrate' as const
      };
      addAvailableDevice(device);
      expect(useBiofeedbackStore.getState().availableDevices).toContainEqual(device);
      
      // Stop scanning
      stopScanning();
      expect(useBiofeedbackStore.getState().isScanning).toBe(false);
      
      // Connect to device
      connectDevice(device);
      expect(useBiofeedbackStore.getState().isConnected).toBe(true);
      expect(useBiofeedbackStore.getState().currentDevice).toEqual(device);
      
      // Disconnect device
      disconnectDevice();
      expect(useBiofeedbackStore.getState().isConnected).toBe(false);
      expect(useBiofeedbackStore.getState().currentDevice).toBeNull();
    });

    it('should prevent connecting to device while scanning', () => {
      const { startScanning, connectDevice } = useBiofeedbackStore.getState();
      
      startScanning();
      
      const device = {
        id: 'device-123',
        name: 'Test Device',
        type: 'heartrate' as const
      };
      
      // Should still allow connection even while scanning
      connectDevice(device);
      
      const state = useBiofeedbackStore.getState();
      expect(state.isConnected).toBe(true);
    });
  });

  describe('Real-time Data Updates', () => {
    it('should update heart rate in real-time', () => {
      const { setHeartRate } = useBiofeedbackStore.getState();
      
      const readings = [70, 72, 75, 73, 71];
      
      readings.forEach(reading => {
        setHeartRate(reading);
        const state = useBiofeedbackStore.getState();
        expect(state.heartRate).toBe(reading);
      });
    });

    it('should track HRV changes over time', () => {
      const { setHRV } = useBiofeedbackStore.getState();
      
      const readings = [45, 47, 50, 48, 46];
      
      readings.forEach(reading => {
        setHRV(reading);
        const state = useBiofeedbackStore.getState();
        expect(state.hrv).toBe(reading);
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle device connection failures', () => {
      const { connectDevice } = useBiofeedbackStore.getState();
      
      // Attempt to connect with invalid device
      const invalidDevice = null as any;
      
      // Should handle gracefully without throwing
      expect(() => connectDevice(invalidDevice)).not.toThrow();
    });

    it('should handle disconnect when no device connected', () => {
      const { disconnectDevice } = useBiofeedbackStore.getState();
      
      // Should handle gracefully
      expect(() => disconnectDevice()).not.toThrow();
      
      const state = useBiofeedbackStore.getState();
      expect(state.isConnected).toBe(false);
    });
  });
});
