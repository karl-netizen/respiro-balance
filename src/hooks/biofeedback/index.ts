
export { useBiofeedback } from './useBiofeedback';
export type { BiofeedbackHookReturn } from './types';
export type { BiometricReadings } from './types';

// Export additional hooks
export { useBiofeedbackConnection } from './useBiofeedbackConnection';
export { useBiofeedbackMonitoring } from './useBiofeedbackMonitoring';
export { useBiofeedbackStorage } from './useBiofeedbackStorage';

// Export specific types from biofeedbackTypes without re-exporting BiofeedbackHookReturn
import { 
  BiofeedbackDevice, 
  BiofeedbackSettings,
  BiofeedbackDeviceState,
  DeviceInfo,
  BiometricData,
  SensorReading,
  Device,
  DeviceConnectionOptions,
  SimulationOptions
} from './biofeedbackTypes';

export type {
  BiofeedbackDevice,
  BiofeedbackSettings,
  BiofeedbackDeviceState,
  DeviceInfo,
  BiometricData,
  SensorReading,
  Device,
  DeviceConnectionOptions,
  SimulationOptions
};
