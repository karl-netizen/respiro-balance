
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Heart } from "lucide-react";

export interface MeditationSession {
  id: string;
  title: string;
  description: string;
  duration: number;
  category: string;
  image?: string;
  instructor: string;
  level: "beginner" | "intermediate" | "advanced";
  tags: string[];
  popular?: boolean;
}

interface MeditationSessionCardProps {
  session: MeditationSession;
  onSelect: (session: MeditationSession) => void;
  isFavorite: boolean;
  onToggleFavorite: (session: MeditationSession) => void;
}

const MeditationSessionCard: React.FC<MeditationSessionCardProps> = ({
  session,
  onSelect,
  isFavorite,
  onToggleFavorite
}) => {
  const handleSelect = () => {
    onSelect(session);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(session);
  };

  return (
    <Card 
      className="h-full cursor-pointer transition-all hover:shadow-md"
      onClick={handleSelect}
    >
      <div className="relative h-40 overflow-hidden">
        <img 
          src={session.image || "/placeholder.svg"} 
          alt={session.title}
          className="object-cover w-full h-full"
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 bg-black/30 hover:bg-black/50 text-white rounded-full"
          onClick={handleToggleFavorite}
        >
          <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
        </Button>
      </div>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs px-2 py-1 rounded-full bg-secondary">
            {session.category}
          </span>
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-3 w-3 mr-1" />
            <span>{session.duration} min</span>
          </div>
        </div>
        <h3 className="font-semibold mb-1">{session.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{session.description}</p>
        <div className="mt-2 text-xs text-muted-foreground">
          By {session.instructor} • {session.level}
        </div>
      </CardContent>
    </Card>
  );
};

export default MeditationSessionCard;
