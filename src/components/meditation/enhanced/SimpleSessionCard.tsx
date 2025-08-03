import React, { memo } from 'react';
import { MeditationSession } from '@/hooks/useEnhancedMeditationPage';

interface SessionCardProps {
  session: MeditationSession;
  onSelect: (session: MeditationSession) => void;
  onToggleFavorite: (session: MeditationSession) => void;
  isFavorite: boolean;
  formatTime: (seconds: number) => string;
  getDifficultyColor: (difficulty: string) => string;
  getCategoryIcon: (category: string) => React.ReactNode;
}

const SimpleSessionCard = memo<SessionCardProps>(({
  session,
  onSelect,
  onToggleFavorite,
  isFavorite,
  formatTime,
  getDifficultyColor,
  getCategoryIcon
}) => {
  return (
    <div
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onSelect(session)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          {getCategoryIcon(session.category)}
          <span className="text-sm text-gray-600">{session.category}</span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(session);
          }}
          className={`p-1 rounded ${isFavorite ? 'text-red-500' : 'text-gray-400'}`}
        >
          ♥
        </button>
      </div>
      
      <h3 className="font-semibold text-lg mb-2">{session.title}</h3>
      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{session.description}</p>
      
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-500">by {session.instructor}</span>
        <span className="text-gray-500">{formatTime(session.duration * 60)}</span>
      </div>
      
      <div className="flex items-center justify-between mt-3">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(session.difficulty)}`}>
          {session.difficulty}
        </span>
        <div className="flex items-center gap-1">
          <span className="text-yellow-500">★</span>
          <span className="text-sm text-gray-600">{session.rating}</span>
        </div>
      </div>
    </div>
  );
});

SimpleSessionCard.displayName = 'SimpleSessionCard';

export default SimpleSessionCard;