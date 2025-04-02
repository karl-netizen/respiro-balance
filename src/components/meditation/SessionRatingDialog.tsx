
import React, { useState } from 'react';
import { Star, ThumbsUp, MessageSquare } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { MeditationSession } from './MeditationSessionCard';

interface SessionRatingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitRating?: (sessionId: string, rating: number, feedback: string) => void;
  sessionId?: string;
  sessionTitle?: string;
  session?: MeditationSession;
  onSubmit?: (rating: number, feedback: string) => void;
}

const SessionRatingDialog: React.FC<SessionRatingDialogProps> = ({
  isOpen,
  onClose,
  sessionId,
  sessionTitle,
  onSubmitRating,
  session,
  onSubmit
}) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const { toast } = useToast();

  const handleSubmit = () => {
    if (rating === 0) {
      toast({
        title: "Rating required",
        description: "Please select a star rating before submitting",
        variant: "destructive"
      });
      return;
    }

    if (onSubmitRating && sessionId) {
      onSubmitRating(sessionId, rating, feedback);
    } else if (onSubmit) {
      onSubmit(rating, feedback);
    }
    
    onClose();
    
    toast({
      title: "Thank you for your feedback!",
      description: "Your rating helps us improve our meditation content."
    });
  };

  const title = session?.title || sessionTitle || "this session";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rate your experience</DialogTitle>
          <DialogDescription>
            How was your meditation session: {title}?
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-center mb-4 mt-2">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="focus:outline-none transition-colors p-1"
              >
                <Star
                  size={32}
                  className={`${
                    star <= (hoveredRating || rating)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-300'
                  } transition-colors`}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="feedback" className="text-sm font-medium flex items-center gap-2">
            <MessageSquare size={16} />
            Share your thoughts (optional)
          </label>
          <Textarea
            id="feedback"
            placeholder="What did you like or dislike about this session?"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={4}
          />
        </div>

        <DialogFooter className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Submit Feedback
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SessionRatingDialog;
