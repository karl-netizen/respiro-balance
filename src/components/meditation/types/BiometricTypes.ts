
export interface BiometricData {
  id: string;
  user_id: string;
  heart_rate?: number;
  hrv?: number;
  respiratory_rate?: number;
  stress_score?: number;
  coherence?: number;
  recorded_at: string;
  device_source?: string;
  timestamp?: string; // Added for compatibility
}
