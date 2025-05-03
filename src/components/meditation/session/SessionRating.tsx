
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rate your meditation experience</DialogTitle>
          <DialogDescription>
            How was your meditation session? Your feedback helps us improve.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 flex flex-col space-y-6">
          <div className="flex justify-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="focus:outline-none"
                onClick={() => onRatingChange(star)}
              >
                <Star
                  className={cn(
                    "w-8 h-8 transition-all",
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
            className="min-h-[100px]"
          />
        </div>
        
        <DialogFooter>
          <Button 
            className="bg-primary text-white hover:bg-primary/90"
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
