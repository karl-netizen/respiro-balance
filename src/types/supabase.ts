
// Define our Supabase database schema types
export interface UserProfile {
  id: string;
  created_at: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  subscription_tier: 'free' | 'premium' | 'team' | 'enterprise';
  subscription_status: 'active' | 'trialing' | 'past_due' | 'canceled' | 'incomplete';
  subscription_id?: string;
  subscription_period_end?: string;
  meditation_minutes_used: number;
  meditation_minutes_limit: number;
  biometric_sync_enabled: boolean;
  last_active: string;
}

export interface MeditationSession {
  id: string;
  user_id: string;
  session_type: string;
  duration: number;
  started_at: string;
  completed: boolean;
  rating?: number;
  feedback?: string;
  // Adding missing fields to fix type errors
  title: string;
  description: string;
  category: 'guided' | 'quick' | 'deep' | 'sleep';
  level: 'beginner' | 'intermediate' | 'advanced';
  icon?: React.ReactNode;
  instructor?: string;
  tags?: string[];
  imageUrl?: string;
  premium?: boolean;
  favorite?: boolean;
}

export interface BiometricData {
  id: string;
  user_id: string;
  session_id?: string;
  recorded_at: string;
  heart_rate?: number;
  hrv?: number;
  respiratory_rate?: number;
  stress_score?: number;
  coherence?: number;
  // Adding additional fields needed from BiometricTypes
  heartRate?: number;
  breathRate?: number;
  brainwaves?: {
    alpha?: number;
    beta?: number;
    theta?: number;
    delta?: number;
  };
}

export interface BluetoothDevice {
  id: string;
  name: string;
  type: string;
  connected: boolean;
}

export interface UserPreferencesData {
  id: string;
  user_id: string;
  work_days: string[];
  work_start_time: string;
  work_end_time: string;
  lunch_break: boolean;
  lunch_time?: string;
  morning_exercise: boolean;
  exercise_time?: string;
  bed_time?: string;
  meditation_experience: string;
  meditation_goals: string[];
  preferred_session_duration: number;
  stress_level?: string;
  work_environment?: string;
  connected_devices?: string[];
  has_completed_onboarding: boolean;
  theme?: string;
  notification_settings?: Record<string, boolean>;
  created_at: string;
  updated_at: string;
}

// Alias for backwards compatibility
export type UserPreferencesRecord = UserPreferencesData;

export interface MorningRitualData {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  start_time: string;
  duration: number;
  recurrence: string;
  days_of_week?: string[];
  priority: string;
  tags?: string[];
  reminder_enabled: boolean;
  reminder_time?: number;
  created_at: string;
  updated_at: string;
  last_completed?: string;
  streak: number;
  status: string;
}

// Add BalanceMetric interface
export interface BalanceMetric {
  id: string;
  user_id: string;
  work_life_ratio: number;
  stress_level: number;
  notes?: string;
  recorded_at: string;
  created_at: string;
}
