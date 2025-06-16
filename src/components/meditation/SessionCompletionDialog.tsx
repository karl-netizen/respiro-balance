
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Star, ThumbsUp } from 'lucide-react';
import { cn } from "@/lib/utils";
import { MeditationSession } from '@/types/meditation';

interface SessionCompletionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  session: MeditationSession;
  meditationStats?: {
    focusScore?: number;
    calmScore?: number;
    timeCompleted?: number;
  };
  onSubmitFeedback: (rating: number, comment: string) => void;
  onContinue: () => void;
}

const SessionCompletionDialog: React.FC<SessionCompletionDialogProps> = ({
  isOpen,
  onClose,
  session,
  meditationStats = {},
  onSubmitFeedback,
  onContinue
}) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [step, setStep] = useState<'stats' | 'feedback'>('stats');
  
  const handleSubmitFeedback = () => {
    onSubmitFeedback(rating, comment);
    setRating(0);
    setComment('');
    setStep('stats');
    onClose();
  };
  
  const handleSkipFeedback = () => {
    setRating(0);
    setComment('');
    setStep('stats');
    onContinue();
    onClose();
  };
  
  const handleNextStep = () => {
    setStep('feedback');
  };
  
  const { focusScore = 85, calmScore = 75, timeCompleted = session.duration * 60 } = meditationStats;
  
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  const renderStatsView = () => (
    <>
      <DialogHeader>
        <DialogTitle className="text-center text-lg sm:text-xl">Session Completed!</DialogTitle>
        <DialogDescription className="text-center text-sm sm:text-base">
          Great job completing your meditation session
        </DialogDescription>
      </DialogHeader>
      
      <div className="py-4 sm:py-6 space-y-4 sm:space-y-6">
        <div className="flex justify-center mb-2">
          <div className="w-16 h-16 sm:w-24 sm:h-24 bg-primary/10 rounded-full flex items-center justify-center">
            <ThumbsUp className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm">Focus</span>
              <span className="text-sm font-medium">{focusScore}%</span>
            </div>
            <Progress value={focusScore} className="h-2" />
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm">Calm</span>
              <span className="text-sm font-medium">{calmScore}%</span>
            </div>
            <Progress value={calmScore} className="h-2" />
          </div>
          
          <div className="text-center pt-2">
            <p className="text-sm text-muted-foreground">Session Duration</p>
            <p className="text-lg sm:text-xl font-mono">{formatTime(timeCompleted)}</p>
          </div>
        </div>
      </div>
      
      <DialogFooter className="flex flex-col space-y-2">
        <Button onClick={handleNextStep} className="w-full min-h-[44px]">
          Share Your Feedback
        </Button>
        <Button variant="ghost" onClick={handleSkipFeedback} className="w-full min-h-[44px]">
          Skip & Continue
        </Button>
      </DialogFooter>
    </>
  );
  
  const renderFeedbackView = () => (
    <>
      <DialogHeader>
        <DialogTitle className="text-lg sm:text-xl">How was your meditation?</DialogTitle>
        <DialogDescription className="text-sm sm:text-base">
          Your feedback helps us improve your experience
        </DialogDescription>
      </DialogHeader>
      
      <div className="py-4 space-y-4 sm:space-y-6">
        <div className="flex justify-center space-x-1 sm:space-x-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className="focus:outline-none p-1 min-h-[44px] min-w-[44px] flex items-center justify-center"
              onClick={() => setRating(star)}
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
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="min-h-[80px] sm:min-h-[120px] text-sm sm:text-base"
        />
      </div>
      
      <DialogFooter className="flex flex-col space-y-2">
        <Button onClick={handleSubmitFeedback} disabled={rating === 0} className="w-full min-h-[44px]">
          Submit Feedback
        </Button>
        <Button variant="ghost" onClick={() => setStep('stats')} className="w-full min-h-[44px]">
          Back
        </Button>
      </DialogFooter>
    </>
  );
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-md">
        {step === 'stats' ? renderStatsView() : renderFeedbackView()}
      </DialogContent>
    </Dialog>
  );
};

export default SessionCompletionDialog;
