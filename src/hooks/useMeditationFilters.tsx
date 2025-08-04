
import { useState } from 'react';
import { MeditationSession } from '@/types/meditation';

export const useMeditationFilters = () => {
  const [durationFilter, setDurationFilter] = useState<number | null>(null);
  const [audioFilter, setAudioFilter] = useState<'all' | 'with-audio' | 'no-audio'>('all');
  
  const applyFilters = (sessions: MeditationSession[]) => {
    let filteredSessions = [...sessions];
    
    // Apply duration filter if set
    if (durationFilter !== null) {
      filteredSessions = filteredSessions.filter(session => {
        switch (durationFilter) {
          case 5:
            return session.duration < 5;
          case 10:
            return session.duration >= 5 && session.duration < 10;
          case 15:
            return session.duration >= 10 && session.duration < 15;
          case 30:
            return session.duration >= 15 && session.duration <= 30;
          case 60:
            return session.duration > 30;
          default:
            return true;
        }
      });
    }
    
    // Apply audio filter
    if (audioFilter !== 'all') {
      filteredSessions = filteredSessions.filter(session => {
        const hasAudio = !!session.audio_url;
        
        switch (audioFilter) {
          case 'with-audio':
            return hasAudio;
          case 'no-audio':
            return !hasAudio;
          default:
            return true;
        }
      });
    }
    
    return filteredSessions;
  };
  
  const filterSessionsByCategory = (
    sessions: MeditationSession[], 
    category: 'guided' | 'quick' | 'deep' | 'sleep'
  ) => {
    const categoryFilteredSessions = sessions.filter(session => {
      const sessionCategory = session.category.toLowerCase();
      
      switch (category) {
        case 'guided':
          return ['mindfulness', 'stress relief', 'body scan', 'energy'].includes(sessionCategory);
        case 'quick':
          return session.duration <= 10;
        case 'deep':
          return ['mindfulness', 'body scan'].includes(sessionCategory) && session.duration > 15;
        case 'sleep':
          return sessionCategory === 'sleep';
        default:
          return true;
      }
    });
    
    return applyFilters(categoryFilteredSessions);
  };
  
  const filterAllSessions = (sessions: MeditationSession[]) => {
    return applyFilters(sessions);
  };
  
  const getSessionsWithAudio = (sessions: MeditationSession[]) => {
    return sessions.filter(session => !!session.audio_url);
  };
  
  const resetFilters = () => {
    setDurationFilter(null);
    setAudioFilter('all');
  };
  
  return {
    durationFilter,
    setDurationFilter,
    audioFilter,
    setAudioFilter,
    filterSessionsByCategory,
    filterAllSessions,
    getSessionsWithAudio,
    resetFilters
  };
};
