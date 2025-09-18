import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, Heart, Clock, User, Crown } from 'lucide-react';
import { MeditationContent, MeditationProgress } from '../types/meditation.types';

interface MeditationCardProps {
  content: MeditationContent;
  progress?: MeditationProgress;
  isCurrentlyPlaying: boolean;
  onPlay: (content: MeditationContent) => void;
  onToggleFavorite: (id: string) => void;
}

export const MeditationCard = React.memo<MeditationCardProps>(({
  content,
  progress,
  isCurrentlyPlaying,
  onPlay,
  onToggleFavorite
}) => {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{content.title}</CardTitle>
            <CardDescription className="line-clamp-2">
              {content.description}
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggleFavorite(content.id)}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Heart 
              className={`h-4 w-4 ${progress?.is_favorite ? 'fill-red-500 text-red-500' : ''}`} 
            />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{content.duration} min</span>
            </div>
            {content.instructor && (
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{content.instructor}</span>
              </div>
            )}
          </div>
          {content.subscription_tier !== 'free' && (
            <Badge variant="secondary" className="text-xs">
              <Crown className="h-3 w-3 mr-1" />
              Premium
            </Badge>
          )}
        </div>

        <div className="flex flex-wrap gap-1">
          <Badge variant="outline" className="text-xs">
            {content.category}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {content.difficulty_level}
          </Badge>
        </div>

        {progress && progress.progress_seconds > 0 && (
          <div className="w-full bg-muted rounded-full h-1.5">
            <div 
              className="bg-primary h-1.5 rounded-full transition-all"
              style={{ 
                width: `${Math.min((progress.progress_seconds / (content.duration * 60)) * 100, 100)}%`
              }}
            />
          </div>
        )}

        <Button 
          onClick={() => onPlay(content)}
          className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
          variant={isCurrentlyPlaying ? "default" : "outline"}
        >
          <Play className="h-4 w-4 mr-2" />
          {isCurrentlyPlaying ? 'Now Playing' : 'Start Session'}
        </Button>
      </CardContent>
    </Card>
  );
});

MeditationCard.displayName = 'MeditationCard';