// =============================================
// ADVANCED TYPESCRIPT PATTERNS IMPLEMENTATION
// =============================================

import { 
  MeditationContent, 
  MeditationProgress, 
  MeditationCategory, 
  DifficultyLevel,
  SubscriptionTier,
  AudioFile 
} from './meditation.types';
import { MeditationId } from './branded.types';
import { ResourceState, AsyncOperationState, AudioPlayerState } from './state.types';
import { 
  Identifiable, 
  Timestamped, 
  Favoritable, 
  ContentFeatures 
} from './generic.types';

// =============================================
// ADVANCED INTERFACE COMPOSITIONS
// =============================================

// Base interfaces for composition
interface BaseContent extends Identifiable, Timestamped {
  title: string;
  description: string;
}

interface Playable {
  duration: number;
  audio_url?: string;
  play_count: number;
}

interface Categorizable {
  category: string;
  tags: string[];
}

interface Accessible {
  difficulty_level: DifficultyLevel;
  subscription_tier: SubscriptionTier;
}

// Composed meditation content interface
export interface AdvancedMeditationContent 
  extends BaseContent, Playable, Categorizable, Accessible, Favoritable {
  instructor?: string;
  thumbnail_url?: string;
  average_rating?: number;
  total_ratings?: number;
  language: string;
  transcript_url?: string;
}

// =============================================
// CONDITIONAL TYPES FOR CONTENT SPECIALIZATION
// =============================================

// Specialized content types based on category
export interface SleepMeditationContent extends MeditationContent {
  category: MeditationCategory.SLEEP;
  bedtime_routine?: string[];
  sleep_sounds?: string[];
}

export interface FocusMeditationContent extends MeditationContent {
  category: MeditationCategory.FOCUS;
  focus_technique: 'breathing' | 'visualization' | 'mantra';
  concentration_level: 1 | 2 | 3 | 4 | 5;
}

// Conditional type for content filtering
export type ContentByCategory<C extends MeditationCategory> = 
  C extends MeditationCategory.SLEEP 
    ? SleepMeditationContent 
    : C extends MeditationCategory.FOCUS 
    ? FocusMeditationContent 
    : MeditationContent;

// =============================================
// ADVANCED HOOK RETURN TYPES
// =============================================

// Advanced hook return type with discriminated union state
export interface UseMeditationContentReturn {
  // State using discriminated union
  state: ResourceState<MeditationContent[]>;
  
  // Computed values with proper typing
  computed: {
    filteredContent: MeditationContent[];
    categoryCounts: Record<MeditationCategory, number>;
    favoriteContent: MeditationContent[];
    recentContent: MeditationContent[];
    recommendedContent: MeditationContent[];
  };
  
  // Actions with proper error handling types
  actions: {
    loadContent: () => Promise<void>;
    refreshContent: () => Promise<void>;
    playContent: (id: MeditationId) => AsyncOperationState<void>;
    toggleFavorite: (id: MeditationId) => AsyncOperationState<boolean>;
    updateProgress: (id: MeditationId, seconds: number) => AsyncOperationState<void>;
    searchContent: (query: string) => AsyncOperationState<MeditationContent[]>;
  };
  
  // Selectors with type-safe getters
  selectors: {
    getContentById: (id: MeditationId) => MeditationContent | undefined;
    getContentByCategory: <C extends MeditationCategory>(category: C) => ContentByCategory<C>[];
    getProgressForContent: (id: MeditationId) => MeditationProgress | undefined;
    getFavoriteStatus: (id: MeditationId) => boolean;
  };
  
  // Filters and sorting
  filters: {
    setCategory: (category: MeditationCategory) => void;
    setSearchQuery: (query: string) => void;
    setDifficultyFilter: (levels: DifficultyLevel[]) => void;
    setDurationRange: (range: [number, number]) => void;
    clearFilters: () => void;
  };
}

// Advanced audio player hook return type
export interface UseAudioPlayerReturn {
  state: AudioPlayerState;
  
  controls: {
    play: (content: MeditationContent) => Promise<AsyncOperationState<void>>;
    pause: () => void;
    resume: () => void;
    stop: () => void;
    seek: (time: number) => void;
    setVolume: (volume: number) => void;
    setPlaybackRate: (rate: number) => void;
  };
  
  properties: {
    currentTime: number;
    duration: number;
    volume: number;
    playbackRate: number;
    buffered: TimeRanges | null;
    isSupported: boolean;
  };
  
  events: {
    onTimeUpdate: (callback: (time: number) => void) => () => void;
    onEnded: (callback: () => void) => () => void;
    onError: (callback: (error: Error) => void) => () => void;
  };
}

// =============================================
// ADVANCED COMPONENT PROPS WITH GENERICS
// =============================================

// Generic meditation card props
export interface AdvancedMeditationCardProps<T extends MeditationContent = MeditationContent> {
  content: T;
  progress?: MeditationProgress;
  state: {
    isSelected: boolean;
    isPlaying: boolean;
    isFavorite: boolean;
    isLoading: boolean;
  };
  actions: {
    onPlay: (content: T) => AsyncOperationState<void>;
    onPause: () => void;
    onToggleFavorite: (id: MeditationId) => AsyncOperationState<boolean>;
    onViewDetails: (content: T) => void;
  };
  customization?: {
    showProgress?: boolean;
    showFavorite?: boolean;
    showDetails?: boolean;
    variant?: 'card' | 'list' | 'minimal';
    size?: 'sm' | 'md' | 'lg';
  };
  accessibility?: {
    ariaLabel?: string;
    tabIndex?: number;
    role?: string;
  };
}

// =============================================
// FUNCTION OVERLOADS
// =============================================

// Function overloads for different use cases
export interface ContentLoader {
  // Load all content
  loadContent(): Promise<MeditationContent[]>;
  
  // Load content by category
  loadContent(category: MeditationCategory): Promise<MeditationContent[]>;
  
  // Load content by multiple categories
  loadContent(categories: MeditationCategory[]): Promise<MeditationContent[]>;
  
  // Load content with filters
  loadContent(filters: {
    category?: MeditationCategory;
    difficulty?: DifficultyLevel;
    duration?: [number, number];
    search?: string;
  }): Promise<MeditationContent[]>;
}

// Export all types for use throughout the application
export type {
  BaseContent,
  Playable,
  Categorizable,
  Accessible
};