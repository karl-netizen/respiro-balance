import { useState, useMemo } from 'react';
import { useMeditationFetch } from './meditation/useMeditationFetch';
import { useMeditationFavorites } from './useMeditationFavorites';

export const useMeditationLibrary = () => {
  const { sessions, isLoading, error } = useMeditationFetch();
  const { favorites, isFavorite, toggleFavorite, removeFavorites, getFavoriteSessions } = useMeditationFavorites();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedDuration, setSelectedDuration] = useState<string>('');
  
  const filteredSessions = useMemo(() => {
    return sessions.filter(session => {
      const matchesSearch = session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           session.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || session.category === selectedCategory;
      const matchesDuration = !selectedDuration || 
        (selectedDuration === 'short' && session.duration <= 10) ||
        (selectedDuration === 'medium' && session.duration > 10 && session.duration <= 20) ||
        (selectedDuration === 'long' && session.duration > 20);
      
      return matchesSearch && matchesCategory && matchesDuration;
    });
  }, [sessions, searchTerm, selectedCategory, selectedDuration]);

  const favoriteSessions = useMemo(() => {
    return getFavoriteSessions(sessions);
  }, [sessions, getFavoriteSessions]);

  return {
    sessions: filteredSessions,
    favorites,
    favoriteSessions,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    selectedDuration,
    setSelectedDuration,
    isFavorite,
    toggleFavorite,
    removeFavorites
  };
};