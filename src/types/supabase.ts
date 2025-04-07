
// Add this if it doesn't exist yet, or modify as needed
export interface BluetoothDevice {
  id: string;
  name: string;
  type: string;
  connected: boolean;
}

export interface UserPreferencesData {
  id?: string;
  user_id?: string;
  theme?: string;
  preferred_session_duration?: number;
  work_days?: string[];
  meditation_experience?: string;
  stress_level?: string;
  work_environment?: string;
  work_start_time?: string;
  work_end_time?: string;
  lunch_break?: boolean;
  lunch_time?: string;
  morning_exercise?: boolean;
  exercise_time?: string;
  bed_time?: string;
  has_completed_onboarding?: boolean;
  updated_at?: string;
}

export interface MeditationSession {
  id: string;
  user_id: string;
  session_type: string;
  duration: number;
  started_at: string;
  completed_at?: string;
  completed: boolean;
  rating?: number;
  feedback?: string;
  description: string;
  category: string;
  difficulty: string;
  favorite: boolean;
  title?: string;
  audioUrl?: string;
  imageUrl?: string;
  biometrics?: SessionBiometrics;
  tags?: string[];
}

export interface SessionBiometrics {
  heart_rate_before?: number;
  heart_rate_during?: number;
  heart_rate_after?: number;
  hrv_before?: number;
  hrv_during?: number;
  hrv_after?: number;
  stress_level_before?: number;
  stress_level_during?: number;
  stress_level_after?: number;
}

export interface BalanceMetric {
  id: string;
  user_id: string;
  date: string;
  work_minutes: number;
  break_minutes: number;
  meditation_minutes: number;
  exercise_minutes: number;
  sleep_minutes: number;
}
