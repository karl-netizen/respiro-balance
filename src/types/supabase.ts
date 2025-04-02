
export interface UserProfile {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  created_at: string;
}

export interface UserPreferencesRecord {
  id: string;
  user_id: string;
  preferences_data: {
    userRole: "client" | "coach" | "admin";
    workDays: string[];
    workStartTime: string;
    workEndTime: string;
    workEnvironment: "office" | "home" | "hybrid";
    stressLevel: "low" | "moderate" | "high";
    focusChallenges: string[];
    energyPattern: string;
    lunchBreak: boolean;
    lunchTime: string;
    morningExercise: boolean;
    exerciseTime: string;
    bedTime: string;
    meditationExperience: "none" | "beginner" | "intermediate" | "advanced";
    meditationGoals: string[];
    preferredSessionDuration: number;
    metricsOfInterest: string[];
    subscriptionTier: string;
    morningRituals?: any[]; // Add morningRituals to the schema
  };
  created_at: string;
  updated_at: string;
}

export interface BiometricData {
  id: string;
  user_id: string;
  heart_rate?: number;
  hrv?: number;
  respiratory_rate?: number;
  stress_score?: number;
  recorded_at: string;
  device_id?: string;
}

export interface MeditationSession {
  id: string;
  user_id: string;
  duration: number;
  started_at: string;
  completed: boolean;
  session_type: string;
  biometric_before?: BiometricData;
  biometric_after?: BiometricData;
}

export interface BalanceMetric {
  id: string;
  user_id: string;
  work_life_ratio: number;
  stress_level: number;
  recorded_at: string;
  notes?: string;
}

// Define the same BluetoothDevice interface here to ensure consistency
export interface BluetoothDevice {
  id: string;
  name: string;
  type: string;
  connected: boolean; // Make this required to match the connected-devices-list component
}
