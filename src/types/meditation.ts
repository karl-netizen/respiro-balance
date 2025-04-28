
export interface MeditationSession {
  id: string;
  title: string;
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
  level?: string;
  favorite: boolean;
  premium?: boolean;
  biometrics?: SessionBiometrics;
  imageUrl?: string;
  audioUrl?: string;
  icon?: React.ReactNode;
  tags?: string[];
  completions?: number;
  instructor?: string;
  benefits?: string[];
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
