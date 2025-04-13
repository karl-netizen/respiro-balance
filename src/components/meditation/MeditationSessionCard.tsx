
import React from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';

export interface MeditationSession {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  instructor: string;
  imageUrl?: string;
  audioUrl?: string;
  benefits?: string[];
}

interface MeditationSessionCardProps {
  session: MeditationSession;
  onSelect?: (session: MeditationSession) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
}

const MeditationSessionCard: React.FC<MeditationSessionCardProps> = ({
  session,
  onSelect,
  isFavorite = false,
  onToggleFavorite
}) => {
  const handleSelect = () => {
    if (onSelect) {
      onSelect(session);
    }
  };
  
  return (
    <Card className="h-full flex flex-col">
      <CardContent className="pt-6 flex-grow">
        <div className="flex justify-between items-start mb-2">
          <div className="space-y-1">
            <h3 className="font-semibold text-lg leading-tight">{session.title}</h3>
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="h-4 w-4 mr-1" />
              <span>{session.duration} min</span>
            </div>
          </div>
          
          <Badge variant="outline" className="capitalize">
            {session.level}
          </Badge>
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-3 mt-2">
          {session.description}
        </p>
      </CardContent>
      
      <CardFooter className="pt-0">
        <Link 
          to={`/meditate/session/${session.id}`}
          className="w-full"
          onClick={handleSelect}
        >
          <Button variant="default" className="w-full" onClick={handleSelect}>
            Start Session
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default MeditationSessionCard;
