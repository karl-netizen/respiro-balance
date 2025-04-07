
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rate your experience</DialogTitle>
          <DialogDescription>
            How was your meditation session: {sessionTitle}?
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex justify-center my-6">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-8 w-8 cursor-pointer transition-all ${
                (hoveredRating || rating) >= star
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300"
              }`}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
            />
          ))}
        </div>
        
        <Textarea
          placeholder="Share your thoughts about this session (optional)"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          className="min-h-[100px]"
        />
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={rating === 0}>Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SessionRatingDialog;
