
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Heart, Star } from "lucide-react";

export interface MeditationSession {
  id: string;
  title: string;
  description: string;
  duration: number;
  category: string;
  level: string;
  imageUrl?: string;
  audioUrl?: string;
  icon?: React.ReactNode;
  rating?: number;
  tags?: string[];
  favorite?: boolean;
  completions?: number;
  instructor?: string;
  benefits?: string[];
}

interface MeditationSessionCardProps {
  session: MeditationSession;
  onSelect: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

const MeditationSessionCard: React.FC<MeditationSessionCardProps> = ({
  session,
  onSelect,
  isFavorite,
  onToggleFavorite
}) => {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div 
        className="h-32 bg-secondary/50 flex items-center justify-center"
        style={session.imageUrl ? { backgroundImage: `url(${session.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
      >
        {!session.imageUrl && (
          <div className="text-4xl">{session.icon || '🧘'}</div>
        )}
      </div>
      
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{session.title}</CardTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8" 
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite();
            }}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
            <span className="sr-only">Toggle favorite</span>
          </Button>
        </div>
        <div className="flex gap-2 items-center mt-1">
          <Badge variant="outline" className="text-xs">
            {session.category}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {session.level || 'Beginner'}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 pt-0">
        <CardDescription className="line-clamp-2 mb-3 h-10">
          {session.description}
        </CardDescription>
        
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{session.duration} min</span>
          </div>
          {session.rating && (
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span>{session.rating}</span>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-2 border-t">
        <Button className="w-full" variant="ghost" onClick={onSelect}>
          Begin Session
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MeditationSessionCard;
