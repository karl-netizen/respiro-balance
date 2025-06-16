
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Star, Heart, Share2, BookOpen } from 'lucide-react';
import { MeditationSession } from '@/types/meditation';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface EnhancedSessionCompletionDialogProps {
  session: MeditationSession;
  onClose: () => void;
}

const EnhancedSessionCompletionDialog: React.FC<EnhancedSessionCompletionDialogProps> = ({
  session,
  onClose
}) => {
  const [rating, setRating] = useState<number>(0);
  const [comments, setComments] = useState<string>('');
  const [hoveredStar, setHoveredStar] = useState<number>(0);

  const handleSubmit = () => {
    // Here you would typically save the feedback to your backend
    console.log('Session feedback:', { rating, comments, sessionId: session.id });
    onClose();
  };

  const handleSkip = () => {
    onClose();
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMins = minutes % 60;
    return remainingMins > 0 ? `${hours}h ${remainingMins}m` : `${hours}h`;
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-lg sm:text-xl">Session Complete! 🧘‍♀️</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 sm:space-y-6">
          {/* Session Summary */}
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="text-center space-y-2">
                <h3 className="font-medium text-sm sm:text-base">{session.title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">{session.instructor}</p>
                <div className="flex justify-center space-x-2">
                  <Badge variant="outline" className="text-xs">{session.category}</Badge>
                  <Badge variant="outline" className="text-xs">{formatDuration(session.duration)}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Completion Stats */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
            <div>
              <div className="text-lg sm:text-2xl font-bold text-primary">+{session.duration}</div>
              <div className="text-xs text-muted-foreground">Minutes</div>
            </div>
            <div>
              <div className="text-lg sm:text-2xl font-bold text-primary">+1</div>
              <div className="text-xs text-muted-foreground">Session</div>
            </div>
            <div>
              <div className="text-lg sm:text-2xl font-bold text-primary">🏆</div>
              <div className="text-xs text-muted-foreground">Achievement</div>
            </div>
          </div>

          {/* Rating Section */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">How was your session?</Label>
            <div className="flex justify-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  className="p-1 hover:scale-110 transition-transform min-h-[44px] min-w-[44px] flex items-center justify-center"
                >
                  <Star
                    className={`h-6 w-6 sm:h-8 sm:w-8 ${
                      star <= (hoveredStar || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-muted-foreground'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Comments Section */}
          <div className="space-y-2">
            <Label htmlFor="comments" className="text-sm font-medium">
              Share your thoughts (optional)
            </Label>
            <Textarea
              id="comments"
              placeholder="How did this session make you feel? Any insights or reflections to share?"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="min-h-[60px] sm:min-h-[80px] text-sm"
            />
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-3 gap-2">
            <Button variant="outline" size="sm" className="flex items-center text-xs h-10">
              <Heart className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              <span className="hidden sm:inline">Favorite</span>
              <span className="sm:hidden">♥</span>
            </Button>
            <Button variant="outline" size="sm" className="flex items-center text-xs h-10">
              <Share2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              <span className="hidden sm:inline">Share</span>
              <span className="sm:hidden">↗</span>
            </Button>
            <Button variant="outline" size="sm" className="flex items-center text-xs h-10">
              <BookOpen className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              <span className="hidden sm:inline">Journal</span>
              <span className="sm:hidden">📔</span>
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-3">
            <Button variant="outline" onClick={handleSkip} className="flex-1 min-h-[44px]">
              Skip
            </Button>
            <Button onClick={handleSubmit} className="flex-1 min-h-[44px]">
              Submit Feedback
            </Button>
          </div>

          {/* Encouragement Message */}
          <div className="text-center p-3 bg-primary/5 rounded-lg">
            <p className="text-xs sm:text-sm text-muted-foreground">
              Great job on completing your meditation! Your mindfulness journey continues to grow stronger with each session.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedSessionCompletionDialog;
