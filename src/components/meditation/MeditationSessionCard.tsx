
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Star } from "lucide-react";
import { MeditationSession as SupabaseMeditationSession } from '@/types/supabase';

// Define the MeditationSession type for use throughout the app
export interface MeditationSession {
  id: string;
  title: string;
  description: string;
  duration: number;
  category: string;
  level?: string;
  icon?: React.ReactNode;
  audioUrl?: string;
  imageUrl?: string;
  instructor?: string;
  tags?: string[];
  premium?: boolean;
}

export interface MeditationSessionCardProps {
  session: MeditationSession;
  onSelect: (session: MeditationSession) => void;
  isFavorite: boolean;
  onToggleFavorite: (session: MeditationSession) => void;
  disabled?: boolean;
  isPremiumLocked?: boolean;
}

export const MeditationSessionCard: React.FC<MeditationSessionCardProps> = ({
  session,
  onSelect,
  isFavorite,
  onToggleFavorite,
  disabled,
  isPremiumLocked
}) => {
  return (
    <Card className="h-full hover:shadow-md transition-shadow">
      <CardContent className="p-6 flex flex-col h-full">
        <div className="flex justify-between items-start mb-3">
          <div className="p-2 bg-primary/10 rounded-md">
            {session.icon || <Clock className="h-5 w-5 text-primary" />}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-primary"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(session);
            }}
          >
            {isFavorite ? (
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            ) : (
              <Star className="h-5 w-5" />
            )}
          </Button>
        </div>
        
        <h3 className="font-semibold text-lg mb-2">{session.title}</h3>
        <p className="text-muted-foreground text-sm mb-4 flex-grow">{session.description}</p>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{session.duration} min</span>
          </div>
          
          <Button 
            size="sm"
            onClick={() => onSelect(session)}
            disabled={disabled || isPremiumLocked}
          >
            {isPremiumLocked ? 'Premium' : 'Start'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Export both the component and the type
export default MeditationSessionCard;
