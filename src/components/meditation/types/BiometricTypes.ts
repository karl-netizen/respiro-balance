
export interface BiometricData {
  id: string;
  user_id: string;
  session_id?: string;
  timestamp?: string;
  recorded_at?: string;
  heart_rate?: number;
  heartRate?: number;  // For backward compatibility
  hrv?: number;
  respiratory_rate?: number;
  breath_rate?: number;
  breathRate?: number;  // For backward compatibility
  stress_score?: number;
  stress_level?: number;
  stress?: number;  // Add missing stress property
  focus_score?: number;
  calm_score?: number;
  coherence?: number;
  device_source?: string;
  brainwaves?: {
    alpha: number;
    beta: number;
    delta: number;
    gamma: number;
    theta: number;
  };
}

// For data that represents changes over time
export interface BiometricChangeData {
  timestamp?: string;
  heart_rate?: number;
  heartRate?: number; // For backward compatibility
  hrv?: number;
  respiratory_rate?: number;
  breath_rate?: number;
  breathRate?: number; // For backward compatibility
  stress_score?: number;
  stress_level?: number;
  focus_score?: number;
  calm_score?: number;
  coherence?: number;
  alpha?: number;
  beta?: number;
  delta?: number;
  gamma?: number;
  theta?: number;
}

// Define device types
export enum BiofeedbackDeviceType {
  HeartRateMonitor = 'heart_rate_monitor',
  RespirationSensor = 'respiration_sensor',
  EEG = 'eeg',
  GSR = 'gsr',
  Unknown = 'unknown'
}

// Define connection states
export enum ConnectionState {
  Disconnected = 'disconnected',
  Connecting = 'connecting',
  Connected = 'connected',
  Error = 'error'
}

// Export necessary types for services
export interface BiometricServiceInterface {
  biometricData: BiometricData[];
  isLoading: boolean;
  error: Error | null;
  addBiometricData: (data: Partial<BiometricData>) => Promise<void>;
  // Add other methods as needed
}
