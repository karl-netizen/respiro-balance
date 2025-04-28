
import React from 'react';
import { MeditationSession } from '@/types/meditation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Heart } from 'lucide-react';

export interface FavoritesSectionProps {
  favoriteSessions: MeditationSession[];
  onSelectSession: (session: MeditationSession) => void;
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (session: MeditationSession) => void;
}

const FavoritesSection: React.FC<FavoritesSectionProps> = ({
  favoriteSessions,
  onSelectSession,
  isFavorite,
  onToggleFavorite
}) => {
  if (favoriteSessions.length === 0) {
    return null;
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 fill-red-500 text-red-500" />
          Favorites
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[200px] pr-4">
          <div className="grid gap-2">
            {favoriteSessions.map((session) => (
              <div 
                key={session.id}
                className="flex items-center gap-3 p-2 rounded-md hover:bg-accent cursor-pointer"
                onClick={() => onSelectSession(session)}
              >
                <div className="bg-primary/10 rounded-md p-2">
                  <Heart className="h-4 w-4 text-primary fill-red-500" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium">{session.title}</h4>
                  <p className="text-xs text-muted-foreground">{session.duration} min</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default FavoritesSection;
