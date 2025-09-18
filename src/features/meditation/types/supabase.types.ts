// Supabase specific type definitions

// Supabase specific type definitions

export interface SupabaseFileObject {
  name: string;
  id: string;
  updated_at: string;
  created_at: string;
  last_accessed_at: string;
  metadata: Record<string, any>;
}

export interface SupabaseStorageResponse {
  data: SupabaseFileObject[] | null;
  error: Error | null;
}

export interface SupabaseSignedUrlResponse {
  data: {
    signedUrl: string;
  } | null;
  error: Error | null;
}

export interface SupabaseUploadResponse {
  data: {
    path: string;
    id: string;
    fullPath: string;
  } | null;
  error: Error | null;
}

// Database table types matching Supabase schema
export interface DatabaseMeditationContent {
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

export interface DatabaseMeditationProgress {
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

export interface DatabaseCategory {
  id: string;
  name: string;
  description: string;
  color_theme: string;
  icon_name: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

// Generic Supabase response wrapper
export interface SupabaseResponse<T> {
  data: T | null;
  error: Error | null;
  count?: number;
  status: number;
  statusText: string;
}