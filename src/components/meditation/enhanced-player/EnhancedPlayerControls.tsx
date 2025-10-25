
import React from 'react';
import { MeditationSession } from '@/types/meditation';

interface EnhancedPlayerControlsProps {
  session: MeditationSession;
  isPlaying: boolean;
  sessionStarted: boolean;
  sessionCompleted: boolean;
  onPlayPause: () => void;
  onSessionComplete: () => void;
}

export const EnhancedPlayerControls: React.FC<EnhancedPlayerControlsProps> = ({
  isPlaying,
  sessionStarted,
  sessionCompleted,
  onPlayPause,
  onSessionComplete
}) => {
  if (!sessionStarted || sessionCompleted || isPlaying) {
    return null;
  }

  return (
    <div className="flex space-x-2 mt-4">
      <button 
        onClick={onPlayPause}
        className="flex-1 py-2 bg-respiro-dark text-white rounded-md text-sm font-medium hover:bg-respiro-darker transition-colors"
      >
        Resume
      </button>
      <button 
        onClick={onSessionComplete}
        className="flex-1 py-2 bg-respiro-light text-respiro-dark rounded-md text-sm font-medium hover:bg-respiro-default hover:text-white transition-colors"
      >
        End Session
      </button>
    </div>
  );
};
