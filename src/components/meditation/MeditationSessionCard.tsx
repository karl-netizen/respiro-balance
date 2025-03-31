
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Heart } from "lucide-react";

export interface MeditationSession {
  id: string;
  title: string;
  description: string;
  duration: number;
  category: 'guided' | 'quick' | 'deep' | 'sleep';
  level: 'beginner' | 'intermediate' | 'advanced';
  icon: React.ReactNode;
  rating?: number;
  userRating?: number;
  userFeedback?: string;
}

interface MeditationSessionCardProps {
  session: MeditationSession;
  onSelect: (session: MeditationSession) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (session: MeditationSession) => void;
}

const MeditationSessionCard: React.FC<MeditationSessionCardProps> = ({ 
  session, 
  onSelect,
  isFavorite = false,
  onToggleFavorite
}) => {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(session);
    }
  };

  return (
    <Card 
      className="h-full hover:shadow-md transition-shadow cursor-pointer" 
      onClick={() => onSelect(session)}
    >
      <CardHeader>
        <div className="flex justify-between items-center">
          {session.icon}
          <div className="flex items-center gap-2">
            <span className={`text-xs font-medium px-2 py-1 bg-secondary rounded-full 
              ${session.level === 'beginner' ? 'text-green-600' : 
              session.level === 'intermediate' ? 'text-blue-600' : 'text-purple-600'}`}
            >
              {session.level}
            </span>
            {onToggleFavorite && (
              <button 
                onClick={handleFavoriteClick}
                className="p-1 rounded-full hover:bg-secondary transition-colors"
                aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
              >
                <Heart 
                  size={18} 
                  className={isFavorite ? "fill-red-500 text-red-500" : "text-muted-foreground"} 
                />
              </button>
            )}
          </div>
        </div>
        <CardTitle className="mt-2">{session.title}</CardTitle>
        <CardDescription className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {session.duration} minutes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-foreground/70">{session.description}</p>
      </CardContent>
      <CardFooter>
        <Button className="w-full">
          Begin Session
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MeditationSessionCard;
