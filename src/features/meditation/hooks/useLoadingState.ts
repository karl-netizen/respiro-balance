import { useState, useCallback } from 'react';

interface LoadingState {
  audioFiles: boolean;
  playingContent: boolean;
  uploadingFile: boolean;
  content: boolean;
  favoriteToggle: boolean;
}

export const useLoadingState = () => {
  const [loading, setLoading] = useState<LoadingState>({
    audioFiles: false,
    playingContent: false,
    uploadingFile: false,
    content: false,
    favoriteToggle: false
  });

  const setLoadingState = useCallback((key: keyof LoadingState, value: boolean) => {
    setLoading(prev => ({ ...prev, [key]: value }));
  }, []);

  const setMultipleLoadingStates = useCallback((updates: Partial<LoadingState>) => {
    setLoading(prev => ({ ...prev, ...updates }));
  }, []);

  const isAnyLoading = useCallback(() => {
    return Object.values(loading).some(Boolean);
  }, [loading]);

  const resetAllLoading = useCallback(() => {
    setLoading({
      audioFiles: false,
      playingContent: false,
      uploadingFile: false,
      content: false,
      favoriteToggle: false
    });
  }, []);

  return {
    loading,
    setLoadingState,
    setMultipleLoadingStates,
    isAnyLoading,
    resetAllLoading
  };
};