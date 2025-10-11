import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, Play, Clock, User, Lock, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TIER_LABELS } from '@/utils/tierAccess';
import { MeditationContent as HookMeditationContent } from '@/hooks/useMeditationContent';

interface MeditationContent extends Partial<HookMeditationContent> {
  id: string;
  title: string;
  description: string;
  duration: number;
  category: string;
  tier: 'free' | 'standard' | 'premium';
  is_available: boolean;
  instructor?: string;
  difficulty_level?: string;
}

interface UserProgress {
  progress_seconds: number;
  is_favorite: boolean;
  completed: boolean;
}

interface EnhancedMeditationCardProps {
  item: MeditationContent;
  progress?: UserProgress;
  hasAccess: boolean;
  onPlay: (item: any) => void;
  onToggleFavorite: (id: string) => void;
  onUpgrade: (item: any) => void;
}

export const EnhancedMeditationCard: React.FC<EnhancedMeditationCardProps> = ({
  item,
  progress,
  hasAccess,
  onPlay,
  onToggleFavorite,
  onUpgrade
}) => {
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min`;
  };

  return (
    <Card className={cn(
      "group hover:shadow-lg transition-all duration-300 relative",
      !hasAccess && "opacity-75"
    )}>
      {/* Lock icon for inaccessible content */}
      {!hasAccess && (
        <div className="absolute top-3 right-3 z-10">
          <div className="bg-background/80 backdrop-blur-sm p-1.5 rounded-full shadow-sm">
            <Lock className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      )}

      {/* Coming Soon badge */}
      {!item.is_available && (
        <div className="absolute top-3 left-3 z-10">
          <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100">
            <AlertCircle className="h-3 w-3 mr-1" />
            Coming Soon
          </Badge>
        </div>
      )}

      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{item.title}</CardTitle>
            <CardDescription className="line-clamp-2">
              {item.description}
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggleFavorite(item.id)}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            disabled={!hasAccess || !item.is_available}
          >
            <Heart 
              className={cn(
                "h-4 w-4",
                progress?.is_favorite && "fill-red-500 text-red-500"
              )} 
            />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{formatDuration(item.duration)}</span>
            </div>
            {item.instructor && (
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span className="text-xs truncate max-w-[100px]">{item.instructor}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="text-xs">
            {item.category}
          </Badge>
          {item.difficulty_level && (
            <Badge variant="outline" className="text-xs">
              {item.difficulty_level}
            </Badge>
          )}
          <Badge 
            variant="secondary" 
            className={cn(
              "text-xs",
              item.tier === 'free' && "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
              item.tier === 'standard' && "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-100",
              item.tier === 'premium' && "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100"
            )}
          >
            {TIER_LABELS[item.tier]}
          </Badge>
        </div>
        
        {progress && progress.progress_seconds > 0 && (
          <div className="w-full bg-muted rounded-full h-1.5">
            <div 
              className="bg-primary h-1.5 rounded-full transition-all"
              style={{ 
                width: `${Math.min((progress.progress_seconds / item.duration) * 100, 100)}%`
              }}
            />
          </div>
        )}

        {hasAccess && item.is_available ? (
          <Button 
            onClick={() => onPlay(item)}
            className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
            variant="outline"
          >
            <Play className="h-4 w-4 mr-2" />
            Start Session
          </Button>
        ) : !hasAccess ? (
          <Button 
            onClick={() => onUpgrade(item)}
            className="w-full"
            variant="default"
          >
            <Lock className="h-4 w-4 mr-2" />
            Upgrade to Access
          </Button>
        ) : (
          <Button 
            disabled
            className="w-full"
            variant="outline"
          >
            <AlertCircle className="h-4 w-4 mr-2" />
            Coming Soon
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
