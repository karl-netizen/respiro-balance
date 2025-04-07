
import React from 'react';
import { Clock, Heart, User, Calendar, Star } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MeditationSession } from '@/types/supabase';

interface MeditationSessionDialogProps {
  session: MeditationSession | null;
  isOpen: boolean;
  onClose: () => void;
  onStart: (session: MeditationSession) => void;
  disabled?: boolean;
}

export const MeditationSessionDialog: React.FC<MeditationSessionDialogProps> = ({
  session,
  isOpen,
  onClose,
  onStart,
  disabled = false
}) => {
  if (!session) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">{session.title}</DialogTitle>
          <DialogDescription className="flex items-center gap-4 pt-2">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{session.duration} min</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <User className="h-4 w-4" />
              <span>{session.instructor}</span>
            </div>
            <Badge variant="outline" className="ml-auto">
              {session.category}
            </Badge>
          </DialogDescription>
        </DialogHeader>
        
        {session.imageUrl && (
          <div className="relative aspect-video w-full overflow-hidden rounded-md">
            <img 
              src={session.imageUrl} 
              alt={session.title} 
              className="object-cover w-full h-full"
            />
          </div>
        )}
        
        <div className="space-y-4">
          <p className="text-sm">{session.description}</p>
          
          <div className="flex flex-wrap gap-2">
            {session.tags?.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
        
        <DialogFooter className="flex sm:justify-between">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            onClick={() => onStart(session)}
            disabled={disabled}
          >
            Start Session
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MeditationSessionDialog;
