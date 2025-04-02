
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
  biometrics?: SessionBiometrics;
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

export interface StartSessionParams {
  sessionType: string;
  duration: number;
}

export interface MeditationCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
}
