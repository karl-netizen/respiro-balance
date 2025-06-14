
import React from 'react';
import { MeditationSession } from '@/types/meditation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart } from 'lucide-react';
import EnhancedAudioPlayer from '@/components/meditation/audio/EnhancedAudioPlayer';

interface PlayerTabProps {
  selectedSession: MeditationSession | null;
  favorites: string[];
  toggleFavorite: (session: MeditationSession) => void;
  formatDuration: (minutes: number) => string;
  onPlay: () => void;
  onPause: () => void;
  onComplete: () => void;
}

const PlayerTab: React.FC<PlayerTabProps> = ({
  selectedSession,
  favorites,
  toggleFavorite,
  formatDuration,
  onPlay,
  onPause,
  onComplete
}) => {
  if (!selectedSession) return null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{selectedSession.title}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => toggleFavorite(selectedSession)}
              className={`${favorites.includes(selectedSession.id) ? 'text-red-500' : 'text-muted-foreground'} hover:text-red-500`}
            >
              <Heart className={`h-5 w-5 ${favorites.includes(selectedSession.id) ? 'fill-current' : ''}`} />
            </Button>
          </CardTitle>
          <p className="text-muted-foreground">
            {selectedSession.instructor} • {formatDuration(selectedSession.duration)}
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">{selectedSession.description}</p>
          
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{selectedSession.category}</Badge>
            {selectedSession.level && (
              <Badge variant="secondary">{selectedSession.level}</Badge>
            )}
            {selectedSession.tags?.map(tag => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <EnhancedAudioPlayer
        audioUrl={selectedSession.audio_url || '/placeholder-audio.mp3'}
        title={selectedSession.title}
        onPlay={onPlay}
        onPause={onPause}
        onComplete={onComplete}
        autoPlay={false}
      />
    </div>
  );
};

export default PlayerTab;
