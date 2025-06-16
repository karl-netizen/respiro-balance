
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from 'lucide-react';

interface SessionRatingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  sessionId: string;
  sessionTitle?: string;
  onSubmitRating: (sessionId: string, rating: number, feedback: string) => void;
}

const SessionRatingDialog: React.FC<SessionRatingDialogProps> = ({
  isOpen,
  onClose,
  sessionId,
  sessionTitle = "Meditation Session",
  onSubmitRating
}) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  
  const handleSubmit = () => {
    onSubmitRating(sessionId, rating, feedback);
    setRating(0);
    setFeedback('');
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Rate your experience</DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            How was your meditation session: {sessionTitle}?
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex justify-center my-4 sm:my-6">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              className="p-1 min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <Star
                className={`h-6 w-6 sm:h-8 sm:w-8 cursor-pointer transition-all ${
                  (hoveredRating || rating) >= star
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                }`}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
              />
            </button>
          ))}
        </div>
        
        <Textarea
          placeholder="Share your thoughts about this session (optional)"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          className="min-h-[80px] sm:min-h-[100px] text-sm sm:text-base"
        />
        
        <DialogFooter className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto min-h-[44px]">
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={rating === 0} className="w-full sm:w-auto min-h-[44px]">
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SessionRatingDialog;
