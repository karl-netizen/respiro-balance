import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Heart, Star, User } from 'lucide-react';
import { MeditationSession } from '@/types/meditation';

export interface MeditationSessionDialogProps {
  session: MeditationSession | null;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onStart: (session: MeditationSession) => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

const MeditationSessionDialog: React.FC<MeditationSessionDialogProps> = ({
  session,
  open,
  setOpen,
  onStart,
  isFavorite,
  onToggleFavorite
}) => {
  if (!session) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-start">
            <span>{session.title}</span>
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
          </DialogTitle>
          <DialogDescription>
            <div className="flex gap-2 items-center mt-1">
              <Badge variant="outline" className="text-xs">
                {session.category}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {session.level || session.difficulty || 'Beginner'}
              </Badge>
            </div>
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {session.description}
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{session.duration} minutes</span>
            </div>
            
            {session.instructor && (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{session.instructor}</span>
              </div>
            )}
            
            {session.rating && (
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                <span className="text-sm">{session.rating}</span>
              </div>
            )}
          </div>
          
          {session.benefits && session.benefits.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Benefits:</h4>
              <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                {session.benefits.map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
            </div>
          )}
          
          {session.premium && (
            <Badge className="bg-amber-500 hover:bg-amber-600">Premium</Badge>
          )}
        </div>
        
        <DialogFooter>
          <Button 
            className="w-full" 
            onClick={() => {
              onStart(session);
              setOpen(false);
            }}
          >
            Begin Session
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MeditationSessionDialog;
