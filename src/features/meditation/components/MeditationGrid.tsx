import React from 'react';
import { MeditationCard } from './MeditationCard';
import { MeditationContent, MeditationProgress } from '../types/meditation.types';

interface MeditationGridProps {
  content: MeditationContent[];
  currentlyPlayingId?: string;
  onPlay: (content: MeditationContent) => void;
  onToggleFavorite: (id: string) => void;
  getProgressForContent: (id: string) => MeditationProgress | undefined;
  selectedCategory: string;
}

export const MeditationGrid: React.FC<MeditationGridProps> = ({
  content,
  currentlyPlayingId,
  onPlay,
  onToggleFavorite,
  getProgressForContent,
  selectedCategory
}) => {
  if (content.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">
          {selectedCategory === 'sleep' 
            ? 'No sleep meditations available' 
            : `No ${selectedCategory} sessions found`
          }
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {content.map((item) => {
        const progress = getProgressForContent(item.id);
        const isCurrentlyPlaying = currentlyPlayingId === item.id;
        
        return (
          <MeditationCard
            key={item.id}
            content={item}
            progress={progress}
            isCurrentlyPlaying={isCurrentlyPlaying}
            onPlay={onPlay}
            onToggleFavorite={onToggleFavorite}
          />
        );
      })}
    </div>
  );
};