// Standardized component prop interfaces

export interface BaseSessionProps {
  session: MeditationSession;
  onSelect?: (session: MeditationSession) => void;
  onToggleFavorite?: (session: MeditationSession) => void;
  isFavorite?: boolean;
}

export interface SessionListProps {
  sessions: MeditationSession[];
  onSessionSelect?: (session: MeditationSession) => void;
  onToggleFavorite?: (session: MeditationSession) => void;
  className?: string;
}

export interface FilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  className?: string;
}

export interface ViewModeProps {
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  className?: string;
}

export interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

// Utility prop interfaces
export interface UtilityProps {
  formatTime?: (seconds: number) => string;
  getDifficultyColor?: (difficulty: string) => string;
  getCategoryIcon?: (category: string) => React.ReactNode;
}

// Combined interfaces for complex components
export interface SessionCardComposerProps extends BaseSessionProps, UtilityProps {
  showProgress?: boolean;
  showRating?: boolean;
  compact?: boolean;
}

export interface SessionGridComposerProps extends SessionListProps, ViewModeProps, UtilityProps {
  emptyState?: EmptyStateProps;
}

import { MeditationSession } from '@/types/meditation';