import React from 'react';
import MeditationSessionCard from "./MeditationSessionCard";
import type { MeditationSession } from "./MeditationSessionCard";

interface FavoritesSectionProps {
  favorites: MeditationSession[];
  onSelectSession: (session: MeditationSession) => void;
  onToggleFavorite: (session: MeditationSession) => void;
}

const FavoritesSection: React.FC<FavoritesSectionProps> = ({
  favorites,
  onSelectSession,
  onToggleFavorite
}) => {
  if (favorites.length === 0) {
    return null;
  }
  
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Favorites</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites.map((session) => (
          <MeditationSessionCard 
            key={session.id}
            session={session}
            onSelect={onSelectSession}
            isFavorite={true}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </div>
    </div>
  );
};

export default FavoritesSection;
