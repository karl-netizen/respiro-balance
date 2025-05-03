
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { MeditationSession } from '@/types/meditation';

interface MeditationSessionDialogProps {
  session: MeditationSession | null;
  open: boolean;
  setOpen: (open: boolean) => void;
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
      <DialogContent className="bg-white dark:bg-gray-800 text-foreground max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground">
            {session.title}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {session.description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 my-2">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-background text-foreground">
              {session.duration} min
            </Badge>
            <Badge variant="outline" className="bg-background text-foreground capitalize">
              {session.level}
            </Badge>
            <Badge variant="outline" className="bg-background text-foreground capitalize">
              {session.category}
            </Badge>
          </div>
          
          <div className="text-sm text-foreground">
            <span className="font-medium">Instructor:</span> {session.instructor}
          </div>
          
          {session.tags && session.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {session.tags.map((tag, i) => (
                <Badge key={i} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0 mt-4">
          <Button 
            variant="outline" 
            onClick={onToggleFavorite} 
            className="sm:mr-auto flex items-center gap-1"
          >
            <Heart className={`h-4 w-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
            {isFavorite ? 'Favorited' : 'Favorite'}
          </Button>
          
          <Button 
            onClick={() => onStart(session)} 
            className="w-full sm:w-auto"
          >
            Begin Meditation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MeditationSessionDialog;
