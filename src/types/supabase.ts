
// Add this if it doesn't exist yet, or modify as needed
export interface BluetoothDevice {
  id: string;
  name: string;
  type: string;
  connected: boolean;
}

export type SubscriptionTier = 'free' | 'premium' | 'team' | 'enterprise' | 'coach';

export interface UserPreferencesData {
  id?: string;
  user_id?: string;
  theme?: string;
  preferred_session_duration?: number;
  work_days?: string[];
  meditation_experience?: string;
  meditation_goals?: string[];
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
  notification_settings?: any;
  connected_devices?: any;
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
  instructor?: string;
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

export interface BiometricData {
  id?: string;
  user_id?: string;
  session_id?: string;
  heart_rate?: number;
  hrv?: number;
  respiratory_rate?: number;
  stress_score?: number;
  timestamp?: string;
  created_at?: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  display_name?: string;
  avatar_url?: string;
  subscription_id?: string;
  subscription_status?: string;
  subscription_tier?: string;
  subscription_period_start?: string;
  subscription_period_end?: string;
  meditation_minutes_used?: number;
  meditation_minutes_limit?: number;
  created_at?: string;
  updated_at?: string;
}
