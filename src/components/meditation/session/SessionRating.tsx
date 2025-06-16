
import React from 'react';
import { Star } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SessionRatingProps {
  showDialog: boolean;
  onOpenChange: (open: boolean) => void;
  rating: number;
  notes: string;
  onRatingChange: (rating: number) => void;
  onNotesChange: (notes: string) => void;
  onSubmit: () => void;
}

const SessionRating: React.FC<SessionRatingProps> = ({
  showDialog,
  onOpenChange,
  rating,
  notes,
  onRatingChange,
  onNotesChange,
  onSubmit
}) => {
  return (
    <Dialog open={showDialog} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Rate your meditation experience</DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            How was your meditation session? Your feedback helps us improve.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 flex flex-col space-y-6">
          <div className="flex justify-center space-x-1 sm:space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="focus:outline-none p-1 min-h-[44px] min-w-[44px] flex items-center justify-center"
                onClick={() => onRatingChange(star)}
              >
                <Star
                  className={cn(
                    "w-6 h-6 sm:w-8 sm:h-8 transition-all",
                    rating >= star
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-muted-foreground"
                  )}
                />
              </button>
            ))}
          </div>
          
          <Textarea
            placeholder="Share your thoughts about this session (optional)"
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            className="min-h-[80px] sm:min-h-[100px] text-sm sm:text-base"
          />
        </div>
        
        <DialogFooter className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
          <Button 
            className="w-full bg-primary text-white hover:bg-primary/90 min-h-[44px]"
            onClick={onSubmit}
          >
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SessionRating;
