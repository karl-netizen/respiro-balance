import React, { createContext, useContext, ReactNode } from 'react';
import { MeditationSession } from '@/hooks/useEnhancedMeditationPage';

interface MeditationContextValue {
  // Session data
  sessions: MeditationSession[];
  filteredSessions: MeditationSession[];
  selectedSession: MeditationSession | null;
  
  // Session actions
  onSessionSelect: (session: MeditationSession) => void;
  onToggleFavorite: (session: MeditationSession) => void;
  
  // UI state
  viewMode: 'grid' | 'list';
  searchTerm: string;
  sortBy: string;
  favorites: string[];
  
  // UI actions  
  setViewMode: (mode: 'grid' | 'list') => void;
  setSearchTerm: (term: string) => void;
  setSortBy: (sort: string) => void;
  
  // Utility functions
  formatTime: (seconds: number) => string;
  getDifficultyColor: (difficulty: string) => string;
  getCategoryIcon: (category: string) => React.ReactNode;
}

const MeditationContext = createContext<MeditationContextValue | undefined>(undefined);

interface MeditationProviderProps {
  children: ReactNode;
  value: MeditationContextValue;
}

export const MeditationProvider: React.FC<MeditationProviderProps> = ({ 
  children, 
  value 
}) => {
  return (
    <MeditationContext.Provider value={value}>
      {children}
    </MeditationContext.Provider>
  );
};

export const useMeditationContext = () => {
  const context = useContext(MeditationContext);
  if (context === undefined) {
    throw new Error('useMeditationContext must be used within a MeditationProvider');
  }
  return context;
};