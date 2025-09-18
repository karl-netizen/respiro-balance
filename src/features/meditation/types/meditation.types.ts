// Core meditation types with comprehensive interfaces

export interface MeditationSession {
  id: string;
  title: string;
  duration: number;
  category: MeditationCategory;
  description: string;
  premium: boolean;
  audioUrl?: string;
  instructor?: string;
  difficulty_level: DifficultyLevel;
  subscription_tier: SubscriptionTier;
  created_at: string;
  updated_at: string;
}

export interface MeditationContent extends MeditationSession {
  tags: string[];
  play_count: number;
  average_rating?: number;
  thumbnail_url?: string;
  audio_file_url?: string;
  audio_file_path?: string;
  transcript?: string;
  background_music_type?: string;
  is_featured: boolean;
  is_active: boolean;
}

export interface AudioFile {
  id: string;
  name: string;
  url: string;
  size: number;
  duration?: number;
  type: string;
  uploadDate: Date;
  isProcessing: boolean;
}

export interface MeditationProgress {
  id: string;
  user_id: string;
  content_id: string;
  progress_seconds: number;
  completed: boolean;
  completed_at?: Date;
  is_favorite: boolean;
  play_count: number;
  last_played_at: Date;
  rating?: number;
  created_at: string;
  updated_at: string;
}

// Enums for better type safety
export enum MeditationCategory {
  MINDFULNESS = 'mindfulness',
  STRESS_RELIEF = 'stress_relief',
  BODY_SCAN = 'body_scan',
  FOCUS = 'focus',
  SLEEP = 'sleep',
  BREATHING = 'breathing',
  GUIDED = 'guided',
  UNGUIDED = 'unguided',
  MOVEMENT = 'movement'
}

export enum DifficultyLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced'
}

export enum SubscriptionTier {
  FREE = 'free',
  PREMIUM = 'premium',
  ENTERPRISE = 'enterprise'
}

// State management types
export interface LoadingState {
  content: boolean;
  audioFiles: boolean;
  uploadingFile: boolean;
  playingContent: boolean;
  favoritingContent: boolean;
}

export interface ErrorState {
  content: string | null;
  audioFiles: string | null;
  upload: string | null;
  playback: string | null;
}

// Component specific types
export interface CategoryTab {
  value: string;
  label: string;
  count: number;
}

export interface PlaybackState {
  isPlaying: boolean;
  currentContent: MeditationContent | null;
  currentTime: number;
  duration: number;
}

// Hook return types
export interface UseMeditationContentReturn {
  content: MeditationContent[];
  categories: MeditationCategory[];
  isLoading: boolean;
  error: string | null;
  getContentByCategory: (category: MeditationCategory | string) => MeditationContent[];
  toggleFavorite: (contentId: string) => Promise<void>;
  getProgressForContent: (contentId: string) => MeditationProgress | undefined;
  incrementPlayCount: (contentId: string) => Promise<void>;
  searchContent: (query: string) => MeditationContent[];
}

export interface UseAudioStorageReturn {
  audioFiles: AudioFile[];
  loading: boolean;
  error: string | null;
  fetchAudioFiles: () => Promise<void>;
  uploadAudioFile: (file: File) => Promise<void>;
}

export interface UseAudioPlayerReturn {
  playbackState: PlaybackState;
  audioRef: React.RefObject<HTMLAudioElement>;
  play: (content: MeditationContent, audioUrl?: string) => Promise<void>;
  pause: () => void;
  stop: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  handleTimeUpdate: () => void;
  handleEnded: () => void;
}

// Component prop types
export interface MeditationCardProps {
  item: MeditationContent;
  progress: MeditationProgress | undefined;
  selectedContent: MeditationContent | null;
  onPlay: (item: MeditationContent) => Promise<void>;
  onToggleFavorite: (id: string) => Promise<void>;
  className?: string;
  variant?: 'default' | 'compact' | 'featured';
}

export interface AudioFileItemProps {
  file: AudioFile;
  onPlay: (file: AudioFile) => void;
  className?: string;
}

export interface CategoryTabsProps {
  categories: CategoryTab[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export interface NowPlayingCardProps {
  content: MeditationContent;
  onClose?: () => void;
}

export interface AudioUploadSectionProps {
  onFileUploaded?: (file: AudioFile) => void;
  maxFileSize?: number;
  acceptedFormats?: string[];
}