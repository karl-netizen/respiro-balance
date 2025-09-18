import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useMeditationContent } from '@/hooks/useMeditationContent';
import { useAudioStorage } from './hooks/useAudioStorage';
import { useAudioPlayer } from './hooks/useAudioPlayer';
import { usePerformanceMonitor } from './hooks/usePerformanceMonitor';
import { MeditationHeader } from './components/MeditationHeader';
import { PremiumBanner } from './components/PremiumBanner';
import { AudioFilesList } from './components/AudioFilesList';
import { CategoryTabs } from './components/CategoryTabs';
import { MeditationGrid } from './components/MeditationGrid';
import { NowPlayingCard } from './components/NowPlayingCard';
import { MeditationLibrarySkeleton } from './components/MeditationLibrarySkeleton';
import { MeditationErrorBoundary } from './components/MeditationErrorBoundary';
import { CategoryTab, MeditationContent, AudioFile } from './types/meditation.types';

export const MeditationLibrary = () => {
  const { 
    content, 
    isLoading, 
    getContentByCategory, 
    toggleFavorite, 
    getProgressForContent,
    incrementPlayCount
  } = useMeditationContent();
  
  const audioStorage = useAudioStorage();
  const audioPlayer = useAudioPlayer();
  const { measureAsyncOperation } = usePerformanceMonitor('MeditationLibrary');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Memoized filtered content with stable dependency
  const filteredContent = useMemo(() => {
    if (selectedCategory === 'all') return content;
    return getContentByCategory(selectedCategory);
  }, [content, selectedCategory, getContentByCategory]);

  // Memoized category tabs with stable calculations
  const categoryTabs = useMemo<CategoryTab[]>(() => [
    { value: 'all', label: 'All Sessions', count: content.length },
    { value: 'guided', label: 'Guided', count: getContentByCategory('Mindfulness').length },
    { value: 'quick', label: 'Quick Breaks', count: getContentByCategory('Focus').length },
    { value: 'deep', label: 'Deep Focus', count: getContentByCategory('Body Scan').length },
    { value: 'sleep', label: 'Sleep', count: getContentByCategory('Sleep').length }
  ], [content.length, getContentByCategory]);

  // Optimized event handlers with useCallback and performance monitoring
  const handlePlayContent = useCallback(async (contentItem: MeditationContent) => {
    await measureAsyncOperation(async () => {
      try {
        await audioPlayer.play(contentItem);
        await incrementPlayCount(contentItem.id);
      } catch (error) {
        console.error('Failed to play content:', error);
      }
    }, `PlayContent-${contentItem.title}`);
  }, [audioPlayer, incrementPlayCount, measureAsyncOperation]);

  const handlePlayAudioFile = useCallback((file: AudioFile) => {
    // Create a temporary meditation content object for the audio file
    const audioContent: MeditationContent = {
      id: `audio-${file.name}`,
      title: file.name.replace(/\.[^/.]+$/, ""),
      description: `Playing audio file: ${file.name}`,
      duration: 0,
      category: 'custom',
      difficulty_level: 'beginner',
      subscription_tier: 'free',
      tags: [],
      instructor: 'Unknown',
      background_music_type: undefined,
      is_featured: false,
      is_active: true,
      play_count: 0,
      average_rating: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    audioPlayer.play(audioContent, file.url);
  }, [audioPlayer]);

  const handleToggleFavorite = useCallback((id: string) => {
    toggleFavorite(id);
  }, [toggleFavorite]);

  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category);
  }, []);

  // Audio event setup
  React.useEffect(() => {
    const audio = audioPlayer.audioRef.current;
    if (audio) {
      audio.addEventListener('timeupdate', audioPlayer.handleTimeUpdate);
      audio.addEventListener('ended', audioPlayer.handleEnded);
      
      return () => {
        audio.removeEventListener('timeupdate', audioPlayer.handleTimeUpdate);
        audio.removeEventListener('ended', audioPlayer.handleEnded);
      };
    }
  }, [audioPlayer.handleTimeUpdate, audioPlayer.handleEnded]);

  if (isLoading) {
    return <MeditationLibrarySkeleton />;
  }

  return (
    <MeditationErrorBoundary>
      <div className="container mx-auto p-6 space-y-8">
        <audio ref={audioPlayer.audioRef} />
        
        <MeditationHeader />
        <PremiumBanner />
        
        <AudioFilesList 
          audioFiles={audioStorage.audioFiles}
          loading={audioStorage.loading}
          onPlayAudio={handlePlayAudioFile}
        />

        <CategoryTabs
          categories={categoryTabs}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        >
          <MeditationGrid
            content={filteredContent}
            currentlyPlayingId={audioPlayer.playbackState.currentContent?.id}
            onPlay={handlePlayContent}
            onToggleFavorite={handleToggleFavorite}
            getProgressForContent={getProgressForContent}
            selectedCategory={selectedCategory}
          />
        </CategoryTabs>

        {audioPlayer.playbackState.currentContent && (
          <NowPlayingCard content={audioPlayer.playbackState.currentContent} />
        )}
      </div>
    </MeditationErrorBoundary>
  );
};

export default MeditationLibrary;