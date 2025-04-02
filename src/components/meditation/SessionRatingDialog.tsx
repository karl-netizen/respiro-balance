
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from 'lucide-react';

export interface SessionRatingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  sessionId: string;
  sessionTitle?: string;
  onSubmitRating?: (sessionId: string, rating: number, feedback: string) => void;
  onSubmit?: (rating: number, feedback: string) => void;
}

const SessionRatingDialog: React.FC<SessionRatingDialogProps> = ({
  isOpen,
  onClose,
  sessionId,
  sessionTitle,
  onSubmitRating,
  onSubmit
}) => {
  const [rating, setRating] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>('');
  
  const handleSubmit = () => {
    if (onSubmitRating) {
      onSubmitRating(sessionId, rating, feedback);
    } else if (onSubmit) {
      onSubmit(rating, feedback);
    }
    
    setRating(0);
    setFeedback('');
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>How was your session?</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-center mb-4">
            {sessionTitle || "Rate your meditation experience"}
          </p>
          
          <div className="flex justify-center space-x-2 mb-6">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="focus:outline-none"
              >
                <Star
                  className={`h-8 w-8 ${
                    rating >= star
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>
          
          <Textarea
            placeholder="Share your experience or any feedback (optional)"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="min-h-[100px]"
          />
        </div>
        
        <DialogFooter className="flex space-x-2 sm:justify-end">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleSubmit} disabled={rating === 0}>
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SessionRatingDialog;
