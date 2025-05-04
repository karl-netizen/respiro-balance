
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Heart, Play } from 'lucide-react';
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
  // Local state to ensure component doesn't lose session data during transitions
  const [currentSession, setCurrentSession] = useState<MeditationSession | null>(null);
  
  // Update local state when session prop changes
  useEffect(() => {
    if (session) {
      setCurrentSession(session);
    }
  }, [session]);
  
  // Safeguard against null session
  if (!currentSession) {
    return null;
  }

  const handleStartSession = () => {
    if (currentSession) {
      onStart(currentSession);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-white dark:bg-gray-800 text-black dark:text-white max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-black dark:text-white">
            {currentSession.title}
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-300">
            {currentSession.description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 my-2">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-gray-100 dark:bg-gray-700 text-black dark:text-white">
              {currentSession.duration} min
            </Badge>
            <Badge variant="outline" className="bg-gray-100 dark:bg-gray-700 text-black dark:text-white capitalize">
              {currentSession.category}
            </Badge>
          </div>
          
          <div className="text-sm text-black dark:text-gray-200">
            <span className="font-medium">Instructor:</span> {currentSession.instructor}
          </div>
          
          {currentSession.tags && currentSession.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {currentSession.tags.map((tag, i) => (
                <Badge key={i} variant="secondary" className="text-xs bg-gray-200 dark:bg-gray-600 text-black dark:text-white">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          
          {currentSession.image_url && (
            <div className="relative w-full h-48 mb-4">
              <img
                src={currentSession.image_url}
                alt={currentSession.title}
                className="w-full h-full object-cover rounded-md"
              />
            </div>
          )}
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0 mt-4">
          <Button 
            variant="outline" 
            onClick={onToggleFavorite} 
            className="sm:mr-auto flex items-center gap-1 bg-white dark:bg-gray-700 text-black dark:text-white border-gray-300 dark:border-gray-500"
          >
            <Heart className={`h-4 w-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
            {isFavorite ? 'Favorited' : 'Favorite'}
          </Button>
          
          <Button 
            onClick={handleStartSession} 
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Play className="h-4 w-4 mr-2" />
            Begin Meditation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MeditationSessionDialog;
