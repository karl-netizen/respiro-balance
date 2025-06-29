
export interface Expert {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  bio: string;
  specializations: string[];
  certifications: string[];
  years_experience: number;
  rating: number;
  total_sessions: number;
  hourly_rate: number;
  languages: string[];
  timezone: string;
  availability: ExpertAvailability[];
  created_at: string;
  updated_at: string;
}

export interface ExpertAvailability {
  id: string;
  expert_id: string;
  day_of_week: number; // 0-6 (Sunday-Saturday)
  start_time: string; // HH:MM format
  end_time: string; // HH:MM format
  is_available: boolean;
}

export interface ExpertSession {
  id: string;
  user_id: string;
  expert_id: string;
  scheduled_at: string;
  duration: number; // minutes
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'rescheduled';
  meeting_url?: string;
  recording_url?: string;
  notes?: string;
  rating?: number;
  feedback?: string;
  created_at: string;
  updated_at: string;
}

export interface ExpertReview {
  id: string;
  user_id: string;
  expert_id: string;
  session_id: string;
  rating: number;
  comment: string;
  created_at: string;
}
