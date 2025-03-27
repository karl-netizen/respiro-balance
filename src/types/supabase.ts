
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
    userRole: string;
    workDays: string[];
    workStartTime: string;
    workEndTime: string;
    workEnvironment: string;
    stressLevel: string;
    focusChallenges: string[];
    energyPattern: string;
    lunchBreak: boolean;
    lunchTime: string;
    morningExercise: boolean;
    exerciseTime: string;
    bedTime: string;
    meditationExperience: string;
    meditationGoals: string[];
    preferredSessionDuration: number;
    metricsOfInterest: string[];
    subscriptionTier: string;
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
