
export interface BiometricData {
  heart_rate?: number;
  heartRate?: number;
  hrv?: number;
  stress_score?: number;
  respiratory_rate?: number;
  breathRate?: number;
  coherence?: number;
  brainwaves?: {
    alpha?: number;
    beta?: number;
    theta?: number;
    delta?: number;
  };
}

export interface BiometricChangeData {
  heart_rate?: number;
  hrv?: number;
  respiratory_rate?: number;
  stress_score?: number;
}

export interface BiometricDisplayProps {
  biometricData: BiometricData;
  isInitial?: boolean;
  showChange?: boolean;
  change?: BiometricChangeData;
}
