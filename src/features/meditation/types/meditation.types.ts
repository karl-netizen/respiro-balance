export interface MeditationContent {
  id: string;
  title: string;
  description: string;
  duration: number;
  category: string;
  difficulty_level: string;
  subscription_tier: string;
  audio_file_url?: string;
  audio_file_path?: string;
  thumbnail_url?: string;
  transcript?: string;
  tags: string[];
  instructor: string;
  background_music_type?: string;
  is_featured: boolean;
  is_active: boolean;
  play_count: number;
  average_rating: number;
  created_at: string;
  updated_at: string;
}

export interface AudioFile {
  name: string;
  url: string;
  size: number;
  duration?: number;
}

export interface PlaybackState {
  isPlaying: boolean;
  currentContent: MeditationContent | null;
  currentTime: number;
  duration: number;
}

export interface CategoryTab {
  value: string;
  label: string;
  count: number;
}

export interface MeditationProgress {
  id: string;
  user_id: string;
  content_id: string;
  progress_seconds: number;
  completed: boolean;
  last_played_at: string;
  completion_count: number;
  rating?: number;
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
}