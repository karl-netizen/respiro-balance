
export { useBiofeedback } from './useBiofeedback';
export type { BiofeedbackHookReturn } from './types';
export type { BiometricReadings } from './types';

// Since these imported modules don't actually exist yet, let's remove them
// export { useBiofeedbackConnection } from './useBiofeedbackConnection';
// export { useBiofeedbackMonitoring } from './useBiofeedbackMonitoring';
// export { useBiofeedbackStorage } from './useBiofeedbackStorage';

// Export specific types from biofeedbackTypes that do exist
import { 
  DeviceInfo,
  BiometricData,
  SensorReading,
  Device,
  DeviceConnectionOptions,
  SimulationOptions
} from './biofeedbackTypes';

export type {
  DeviceInfo,
  BiometricData,
  SensorReading,
  Device,
  DeviceConnectionOptions,
  SimulationOptions
};
