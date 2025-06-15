
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Heart, Star, Brain, Zap, Target, Moon } from "lucide-react";
import { MeditationSession } from '@/types/meditation';

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
  const getCategoryIcon = (category: string) => {
    const iconProps = { className: "h-8 w-8 text-respiro-dark mb-3" };
    switch (category.toLowerCase()) {
      case 'guided': return <Brain {...iconProps} />;
      case 'quick': return <Zap {...iconProps} />;
      case 'deep': return <Target {...iconProps} />;
      case 'sleep': return <Moon {...iconProps} />;
      default: return <Brain {...iconProps} />;
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer group">
      <div 
        className="h-32 bg-secondary/50 flex items-center justify-center"
        style={session.image_url ? { backgroundImage: `url(${session.image_url})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
      >
        {!session.image_url && (
          <div className="text-4xl">{session.icon || '🧘'}</div>
        )}
      </div>
      
      <CardHeader className="p-4 pb-2">
        <div className="flex flex-col items-center text-center">
          {getCategoryIcon(session.category)}
          <div className="flex justify-between items-start w-full">
            <CardTitle className="text-lg group-hover:text-respiro-dark transition-colors duration-300">{session.title}</CardTitle>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 hover:scale-110 transition-transform duration-200" 
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite();
              }}
            >
              <Heart className={`h-4 w-4 transition-colors duration-200 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-respiro-dark hover:text-red-500'}`} />
              <span className="sr-only">Toggle favorite</span>
            </Button>
          </div>
        </div>
        <div className="flex gap-2 items-center mt-1 justify-center">
          <Badge variant="outline" className="text-xs group-hover:border-respiro-dark transition-colors duration-300">
            {session.category}
          </Badge>
          <Badge variant="outline" className="text-xs group-hover:border-respiro-dark transition-colors duration-300">
            {session.level || session.difficulty || 'Beginner'}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 pt-0">
        <CardDescription className="line-clamp-2 mb-3 h-10 text-center">
          {session.description}
        </CardDescription>
        
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3 text-respiro-dark" />
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
        <Button 
          className="w-full bg-respiro-dark hover:bg-respiro-darker text-white transition-colors duration-300" 
          variant="ghost" 
          onClick={onSelect}
        >
          Begin Session
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MeditationSessionCard;
