import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, Play, Clock, User, Star, Lock } from 'lucide-react';
import { MeditationContent, UserProgress } from '@/hooks/useMeditationContent';
import { cn } from '@/lib/utils';

interface MeditationCardProps {
  content: MeditationContent;
  userProgress?: UserProgress;
  hasAccess: boolean;
  onPlay: (content: MeditationContent) => void;
  onToggleFavorite: (contentId: string) => void;
  onRate: (contentId: string, rating: number) => void;
  className?: string;
}

export const MeditationCard: React.FC<MeditationCardProps> = ({
  content,
  userProgress,
  hasAccess,
  onPlay,
  onToggleFavorite,
  onRate,
  className
}) => {
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
  };

  const getDifficultyColor = (level: string): string => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
    }
  };

  const getTierColor = (tier: string): string => {
    switch (tier) {
      case 'free': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      case 'premium': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100';
      case 'premium_pro': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100';
      case 'premium_plus': return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-100';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
    }
  };

  const progressPercentage = userProgress?.progress_seconds 
    ? Math.min((userProgress.progress_seconds / content.duration) * 100, 100)
    : 0;

  return (
    <Card className={cn(
      "group hover:shadow-lg transition-all duration-300 relative overflow-hidden",
      !hasAccess && "opacity-75",
      className
    )}>
      {!hasAccess && (
        <div className="absolute top-3 right-3 z-10">
          <Lock className="w-5 h-5 text-gray-500" />
        </div>
      )}
      
      {content.is_featured && (
        <div className="absolute top-3 left-3 z-10">
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
            <Star className="w-3 h-3 mr-1" />
            Featured
          </Badge>
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg leading-tight">{content.title}</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggleFavorite(content.id)}
            className="p-1 h-auto"
            disabled={!hasAccess}
          >
            <Heart 
              className={cn(
                "w-4 h-4",
                userProgress?.is_favorite 
                  ? "fill-red-500 text-red-500" 
                  : "text-gray-400 hover:text-red-400"
              )} 
            />
          </Button>
        </div>
        
        <CardDescription className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
          {content.description}
        </CardDescription>

        <div className="flex flex-wrap gap-2 mt-3">
          <Badge className={getDifficultyColor(content.difficulty_level)}>
            {content.difficulty_level}
          </Badge>
          <Badge className={getTierColor(content.subscription_tier)}>
            {content.subscription_tier.replace('_', ' ')}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{formatDuration(content.duration)}</span>
          </div>
          <div className="flex items-center gap-1">
            <User className="w-4 h-4" />
            <span>{content.instructor}</span>
          </div>
        </div>

        {userProgress && progressPercentage > 0 && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-gray-600 dark:text-gray-300">
              <span>Progress</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        )}

        {userProgress?.completed && (
          <div className="flex justify-between items-center">
            <Badge variant="outline" className="text-green-600 border-green-600">
              Completed {userProgress.completion_count}x
            </Badge>
            
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => onRate(content.id, star)}
                  disabled={!hasAccess}
                  className="p-0"
                >
                  <Star 
                    className={cn(
                      "w-4 h-4 transition-colors",
                      userProgress.rating && star <= userProgress.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300 hover:text-yellow-400"
                    )}
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        <Button 
          onClick={() => onPlay(content)}
          disabled={!hasAccess}
          className="w-full"
          variant={hasAccess ? "default" : "outline"}
        >
          <Play className="w-4 h-4 mr-2" />
          {hasAccess ? 'Play Session' : 'Upgrade to Play'}
        </Button>

        {content.tags && content.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-2 border-t dark:border-gray-700">
            {content.tags.slice(0, 3).map((tag) => (
              <span 
                key={tag}
                className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded"
              >
                #{tag}
              </span>
            ))}
            {content.tags.length > 3 && (
              <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded">
                +{content.tags.length - 3} more
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};