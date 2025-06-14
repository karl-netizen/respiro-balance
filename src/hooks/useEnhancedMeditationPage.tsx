
import { useState } from 'react';
import { useSessionData } from './meditation/useSessionData';
import { useSessionManagement } from './meditation/useSessionManagement';
import { useMeditationUtils } from './meditation/useMeditationUtils';

export interface FilterState {
  categories: string[];
  durations: string[];
  levels: string[];
  instructors: string[];
  searchTerm: string;
}

export interface MeditationSession {
  id: string;
  title: string;
  instructor: string;
  duration: number;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  audioUrl?: string;
  imageUrl?: string;
  tags: string[];
  rating: number;
  completionCount: number;
  session_type: string;
  level: string;
}

export interface SessionProgress {
  sessionId: string;
  progress: number;
  lastPlayedAt: Date;
  completed: boolean;
}

export const useEnhancedMeditationPage = () => {
  const [activeTab, setActiveTab] = useState<'library' | 'resume' | 'player'>('library');

  // Use separate hooks for different concerns
  const sessionData = useSessionData();
  const sessionManagement = useSessionManagement(sessionData.sessions);
  const utils = useMeditationUtils();

  // Enhanced session select handler that also sets active tab
  const handleSessionSelect = (session: MeditationSession) => {
    sessionManagement.handleSessionSelect(session);
    setActiveTab('player');
  };

  return {
    activeTab,
    setActiveTab,
    ...sessionData,
    ...sessionManagement,
    ...utils,
    handleSessionSelect // Override with enhanced version
  };
};
