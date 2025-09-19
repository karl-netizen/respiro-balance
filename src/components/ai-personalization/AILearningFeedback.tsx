import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useAIPersonalization } from '@/hooks/useAIPersonalization';
import { SessionRecommendation, SessionActivity, SessionFeedback } from '@/lib/ai-personalization/types';
import { 
  Star, 
  ThumbsUp, 
  ThumbsDown, 
  MessageSquare, 
  Brain,
  TrendingUp,
  CheckCircle
} from 'lucide-react';

interface AILearningFeedbackProps {
  recommendation: SessionRecommendation;
  sessionCompleted: boolean;
  onFeedbackSubmitted?: () => void;
}

export const AILearningFeedback: React.FC<AILearningFeedbackProps> = ({
  recommendation,
  sessionCompleted,
  onFeedbackSubmitted
}) => {
  const { recordFeedback } = useAIPersonalization();
  const [rating, setRating] = useState<number>(0);
  const [helpful, setHelpful] = useState<boolean | null>(null);
  const [comments, setComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitFeedback = async () => {
    if (rating === 0) return;

    setIsSubmitting(true);
    
    // Create mock session activity based on recommendation
    const sessionActivity: SessionActivity = {
      sessionId: `session_${Date.now()}`,
      sessionType: recommendation.sessionType,
      duration: recommendation.duration,
      completionRate: sessionCompleted ? 1.0 : 0.5,
      userRating: rating,
      difficulty: recommendation.difficulty,
      audioGuide: recommendation.audioGuide || null,
      backgroundSounds: recommendation.backgroundSound || null,
      timestamp: new Date(),
      preSessionMood: 5, // Would come from actual session data
      postSessionMood: Math.min(10, 5 + rating), // Simulated improvement
      environmentalFactors: {
        timeOfDay: new Date().getHours() < 12 ? 'morning' : 
                   new Date().getHours() < 18 ? 'afternoon' : 'evening',
        location: 'home',
        stressLevel: Math.max(1, 10 - rating),
        energyLevel: Math.min(10, 5 + rating)
      }
    };

    const feedback: SessionFeedback = {
      rating,
      completed: sessionCompleted,
      helpful: helpful || false,
      comments: comments.trim() || undefined
    };

    try {
      await recordFeedback(
        recommendation.id,
        sessionActivity,
        feedback
      );
      
      setSubmitted(true);
      onFeedbackSubmitted?.();
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <Card className="border-2 border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-900/20">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 text-green-700 dark:text-green-400">
            <CheckCircle className="w-6 h-6" />
            <div>
              <h3 className="font-semibold">Feedback Received!</h3>
              <p className="text-sm text-green-600 dark:text-green-500">
                Thank you for helping improve our AI recommendations. Your feedback makes the system smarter!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5" />
          Help AI Learn From Your Experience
          <Badge variant="secondary" className="ml-2">
            Learning System
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Session Summary */}
        <div className="bg-muted/50 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">Session: {recommendation.title}</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
            <div>
              <span className="text-muted-foreground">Duration: </span>
              <span className="font-medium">{recommendation.duration} min</span>
            </div>
            <div>
              <span className="text-muted-foreground">Type: </span>
              <span className="font-medium capitalize">{recommendation.sessionType}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Status: </span>
              <Badge variant={sessionCompleted ? "default" : "secondary"}>
                {sessionCompleted ? "Completed" : "Partial"}
              </Badge>
            </div>
          </div>
        </div>

        {/* Rating */}
        <div>
          <label className="text-sm font-semibold mb-3 block">
            How would you rate this session? *
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Button
                key={star}
                variant={rating >= star ? "default" : "outline"}
                size="sm"
                onClick={() => setRating(star)}
                className="p-2"
              >
                <Star className={`w-4 h-4 ${rating >= star ? 'fill-current' : ''}`} />
              </Button>
            ))}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {rating > 0 && (
              <span>
                {rating === 1 && "Poor"}
                {rating === 2 && "Fair"}
                {rating === 3 && "Good"}
                {rating === 4 && "Very Good"}
                {rating === 5 && "Excellent"}
              </span>
            )}
          </div>
        </div>

        {/* Helpfulness */}
        <div>
          <label className="text-sm font-semibold mb-3 block">
            Was this recommendation helpful for your current needs?
          </label>
          <div className="flex gap-2">
            <Button
              variant={helpful === true ? "default" : "outline"}
              size="sm"
              onClick={() => setHelpful(true)}
              className="flex items-center gap-2"
            >
              <ThumbsUp className="w-4 h-4" />
              Yes, helpful
            </Button>
            <Button
              variant={helpful === false ? "destructive" : "outline"}
              size="sm"
              onClick={() => setHelpful(false)}
              className="flex items-center gap-2"
            >
              <ThumbsDown className="w-4 h-4" />
              Not helpful
            </Button>
          </div>
        </div>

        {/* Comments */}
        <div>
          <label className="text-sm font-semibold mb-3 block">
            Any additional feedback? (Optional)
          </label>
          <Textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Tell us what worked well or what could be improved..."
            className="min-h-[80px]"
          />
        </div>

        {/* AI Learning Explanation */}
        <div className="bg-blue-50/50 dark:bg-blue-900/20 p-4 rounded-lg">
          <div className="flex items-start gap-3">
            <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-1">
                How Your Feedback Improves AI
              </h4>
              <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                <li>• Ratings help adjust recommendation confidence scores</li>
                <li>• Completion data optimizes session duration predictions</li>
                <li>• Comments identify patterns for better personalization</li>
                <li>• Feedback trains the system to understand your preferences</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            {rating === 0 ? "Please rate your session to continue" : "Ready to submit feedback"}
          </div>
          
          <Button 
            onClick={handleSubmitFeedback}
            disabled={rating === 0 || isSubmitting}
            className="flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            {isSubmitting ? "Submitting..." : "Submit Feedback"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};