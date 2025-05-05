
import React from 'react';
import { Heart, Play } from 'lucide-react';
import { MeditationSession } from '@/types/meditation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface MeditationSessionDialogProps {
  session: MeditationSession | null;
  open: boolean;
  setOpen: (open: boolean) => void;
  onStart: (session: MeditationSession) => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

/**
 * Dialog that displays meditation session details and provides options to start or favorite a session
 */
export const MeditationSessionDialog: React.FC<MeditationSessionDialogProps> = ({
  session,
  open,
  setOpen,
  onStart,
  isFavorite,
  onToggleFavorite,
}) => {
  // Safeguard against null session
  if (!session) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md bg-black border-4 border-white text-white">
        <DialogHeader>
          <DialogTitle className="text-white text-xl">{session.title}</DialogTitle>
          <DialogDescription className="text-gray-300">
            {session.duration} minutes • {session.category}
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4">
          {session.image_url && (
            <div className="relative w-full h-48 mb-4">
              <img
                src={session.image_url}
                alt={session.title}
                className="w-full h-full object-cover rounded-md border-2 border-white"
              />
            </div>
          )}
          
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge variant="outline" className="bg-black border-2 border-white text-white">
              {session.duration} min
            </Badge>
            <Badge variant="outline" className="bg-black border-2 border-white text-white capitalize">
              {session.category}
            </Badge>
            
            {session.instructor && (
              <Badge variant="outline" className="bg-black border-2 border-white text-white">
                {session.instructor}
              </Badge>
            )}
          </div>
          
          <p className="text-md text-white">
            {session.description}
          </p>
          
          {session.tags && session.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {session.tags.map((tag, i) => (
                <Badge key={i} variant="secondary" className="text-sm bg-black text-white border border-white">
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
            className="sm:mr-auto flex items-center gap-1 bg-black text-white border-2 border-white hover:bg-gray-900"
          >
            <Heart className={`h-4 w-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : 'text-white'}`} />
            {isFavorite ? 'Favorited' : 'Favorite'}
          </Button>
          
          <Button 
            onClick={() => onStart(session)} 
            className="w-full sm:w-auto bg-white text-black hover:bg-gray-200 font-bold text-lg border-2 border-white"
          >
            <Play className="h-5 w-5 mr-2" />
            Begin Meditation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MeditationSessionDialog;
