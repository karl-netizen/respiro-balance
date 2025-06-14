
import { MeditationSession, FilterState, SessionProgress } from '@/hooks/useEnhancedMeditationPage';

export interface SessionLibraryProps {
  filteredSessions: MeditationSession[];
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  sortBy: 'title' | 'duration' | 'difficulty' | 'rating';
  setSortBy: (sortBy: 'title' | 'duration' | 'difficulty' | 'rating') => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  favorites: string[];
  toggleFavorite: (session: MeditationSession) => void;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  onSessionSelect: (session: MeditationSession) => void;
  formatTime: (seconds: number) => string;
  getDifficultyColor: (difficulty: string) => string;
  getCategoryIcon: (category: string) => JSX.Element;
}

export interface ResumeTabProps {
  sessions: MeditationSession[];
  onSessionSelect: (session: MeditationSession) => void;
  formatTime: (seconds: number) => string;
  getDifficultyColor: (difficulty: string) => string;
  getCategoryIcon: (category: string) => JSX.Element;
}

export interface PlayerTabProps {
  selectedSession: MeditationSession | null;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  currentTime: number;
  setCurrentTime: (time: number) => void;
  progress: Record<string, SessionProgress>;
  setProgress: (progress: Record<string, SessionProgress>) => void;
  onSessionComplete: (sessionId: string) => void;
  formatTime: (seconds: number) => string;
}
