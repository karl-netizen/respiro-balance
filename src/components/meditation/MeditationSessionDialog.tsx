
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

  // Handle image error
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.style.display = 'none';
    const fallbackElement = e.currentTarget.nextElementSibling;
    if (fallbackElement) {
      fallbackElement.classList.remove('hidden');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md bg-respiro-dark border-4 border-white text-white max-w-[calc(100vw-2rem)]">
        <DialogHeader>
          <DialogTitle className="text-white text-lg sm:text-xl">{session.title}</DialogTitle>
          <DialogDescription className="text-gray-300 text-sm sm:text-base">
            {session.duration} minutes • {session.category}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="relative w-full h-32 sm:h-48 bg-respiro-dark rounded-md overflow-hidden border-2 border-white">
            {session.image_url && (
              <img
                src={session.image_url}
                alt={session.title}
                className="w-full h-full object-cover"
                onError={handleImageError}
              />
            )}
            <div className={`absolute inset-0 flex items-center justify-center ${session.image_url ? 'hidden' : ''}`}>
              <div className="text-4xl sm:text-6xl">{session.icon || '🧘'}</div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-respiro-darker border-2 border-white text-white text-xs">
              {session.duration} min
            </Badge>
            <Badge variant="outline" className="bg-respiro-darker border-2 border-white text-white capitalize text-xs">
              {session.category}
            </Badge>
            
            {session.instructor && (
              <Badge variant="outline" className="bg-respiro-darker border-2 border-white text-white text-xs">
                {session.instructor}
              </Badge>
            )}
          </div>
          
          <p className="text-sm sm:text-base text-white leading-relaxed">
            {session.description}
          </p>
          
          {session.tags && session.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {session.tags.map((tag, i) => (
                <Badge key={i} variant="secondary" className="text-xs bg-respiro-darker text-white border border-white">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
        
        <DialogFooter className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
          <Button 
            variant="outline" 
            onClick={onToggleFavorite} 
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-respiro-darker text-white border-2 border-white hover:bg-respiro-dark min-h-[44px]"
          >
            <Heart className={`h-4 w-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : 'text-white'}`} />
            {isFavorite ? 'Favorited' : 'Favorite'}
          </Button>
          
          <Button 
            onClick={() => onStart(session)} 
            className="w-full sm:w-auto bg-white text-respiro-dark hover:bg-gray-200 font-bold text-base sm:text-lg border-2 border-white min-h-[44px]"
          >
            <Play className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            Begin Meditation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MeditationSessionDialog;
