export interface MeditationSession {
  id: string;
  title: string;
  description: string;
  session_type: string;
  duration: number;
  audio_url?: string;
  image_url?: string;
  category: string;
  tags: string[];
  level: string;
  instructor: string;
  popularity?: number;
  started_at?: string;
  completed?: boolean;
  in_progress?: boolean;
  premium?: boolean;
  completion_percentage?: number;
  biometrics?: {
    heart_rate?: number[];
    breathing_rate?: number[];
    focus_score?: number;
  };
  // Additional properties used in different components
  user_id?: string;
  difficulty?: string;
  favorite?: boolean;
  rating?: number;
  icon?: string;
  benefits?: string[];
  completed_at?: string;
}

export interface StartSessionParams {
  sessionType: string;
  duration: number;
}

export interface MeditationSessionFeedback {
  rating: number;
  comment: string;
  sessionId: string;
  submittedAt: string;
  mood?: string;
  focusImprovement?: number;
  stressReduction?: number;
  wouldRecommend?: boolean;
}

export interface MeditationRecommendation {
  id: string;
  title: string;
  description: string;
  reason: string;
  confidence: number; // 0-100
  sessionId: string;
  matchScore?: number; // How well it matches user preferences
  tags?: string[];
}

export interface FilterState {
  categories: string[];
  durations: string[];
  levels: string[];
  instructors: string[];
  tags: string[];
  searchTerm: string;
}
