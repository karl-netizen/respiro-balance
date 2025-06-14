
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Star, Heart, Share2, RotateCcw, ArrowRight } from 'lucide-react';
import { MeditationSession } from '@/types/meditation';
import { motion } from 'framer-motion';

interface MoodOption {
  id: string;
  emoji: string;
  label: string;
  color: string;
}

interface SessionFeedback {
  rating: number;
  mood: string;
  comment: string;
  focusImprovement: number;
  stressReduction: number;
  wouldRecommend: boolean;
  favorite: boolean;
}

interface EnhancedSessionCompletionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  session: MeditationSession;
  meditationStats: {
    focusScore: number;
    calmScore: number;
    timeCompleted: number;
  };
  onSubmitFeedback: (feedback: SessionFeedback) => void;
  onContinue: () => void;
  onReplay?: () => void;
  onShare?: () => void;
}

const moodOptions: MoodOption[] = [
  { id: 'peaceful', emoji: '😌', label: 'Peaceful', color: 'bg-blue-100 text-blue-800' },
  { id: 'relaxed', emoji: '😊', label: 'Relaxed', color: 'bg-green-100 text-green-800' },
  { id: 'focused', emoji: '🎯', label: 'Focused', color: 'bg-purple-100 text-purple-800' },
  { id: 'energized', emoji: '⚡', label: 'Energized', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'calm', emoji: '🧘', label: 'Calm', color: 'bg-indigo-100 text-indigo-800' },
  { id: 'grateful', emoji: '🙏', label: 'Grateful', color: 'bg-pink-100 text-pink-800' },
];

const EnhancedSessionCompletionDialog: React.FC<EnhancedSessionCompletionDialogProps> = ({
  isOpen,
  onClose,
  session,
  meditationStats,
  onSubmitFeedback,
  onContinue,
  onReplay,
  onShare
}) => {
  const [feedback, setFeedback] = useState<SessionFeedback>({
    rating: 0,
    mood: '',
    comment: '',
    focusImprovement: 0,
    stressReduction: 0,
    wouldRecommend: false,
    favorite: false
  });

  const [currentStep, setCurrentStep] = useState<'celebration' | 'rating' | 'details' | 'complete'>('celebration');

  const updateFeedback = (key: keyof SessionFeedback, value: any) => {
    setFeedback(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    onSubmitFeedback(feedback);
    setCurrentStep('complete');
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const renderStarRating = (rating: number, onRatingChange: (rating: number) => void, size = 'default') => {
    const starSize = size === 'large' ? 'h-8 w-8' : 'h-5 w-5';
    
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            onClick={() => onRatingChange(star)}
            className={`${starSize} transition-colors ${
              star <= rating 
                ? 'text-yellow-400 fill-current' 
                : 'text-gray-300 hover:text-yellow-200'
            }`}
          >
            <Star className={starSize} />
          </button>
        ))}
      </div>
    );
  };

  const renderSliderRating = (
    value: number,
    onChange: (value: number) => void,
    label: string,
    lowLabel: string,
    highLabel: string
  ) => (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      <div className="px-4">
        <input
          type="range"
          min="0"
          max="10"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>{lowLabel}</span>
          <span className="font-medium">{value}/10</span>
          <span>{highLabel}</span>
        </div>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        {currentStep === 'celebration' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-6"
          >
            <div className="mb-6">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold mb-2">Session Complete!</h2>
              <p className="text-muted-foreground">
                You've completed "{session.title}"
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {formatTime(meditationStats.timeCompleted)}
                </div>
                <div className="text-sm text-muted-foreground">Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {meditationStats.focusScore}%
                </div>
                <div className="text-sm text-muted-foreground">Focus</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {meditationStats.calmScore}%
                </div>
                <div className="text-sm text-muted-foreground">Calm</div>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button onClick={() => setCurrentStep('rating')} className="flex-1">
                Rate Session
              </Button>
              <Button variant="outline" onClick={onContinue}>
                Skip
              </Button>
            </div>
          </motion.div>
        )}

        {currentStep === 'rating' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <DialogHeader>
              <DialogTitle>How was your session?</DialogTitle>
            </DialogHeader>

            <div className="text-center space-y-4">
              <p className="text-muted-foreground">Rate your overall experience</p>
              {renderStarRating(
                feedback.rating, 
                (rating) => updateFeedback('rating', rating),
                'large'
              )}
            </div>

            <div>
              <Label className="text-sm font-medium mb-3 block">How are you feeling?</Label>
              <div className="grid grid-cols-3 gap-2">
                {moodOptions.map(mood => (
                  <button
                    key={mood.id}
                    onClick={() => updateFeedback('mood', mood.id)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      feedback.mood === mood.id
                        ? 'border-primary bg-primary/10'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-2xl mb-1">{mood.emoji}</div>
                    <div className="text-xs font-medium">{mood.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex space-x-3">
              <Button 
                onClick={() => setCurrentStep('details')}
                disabled={feedback.rating === 0}
                className="flex-1"
              >
                Continue
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              <Button variant="outline" onClick={() => setCurrentStep('celebration')}>
                Back
              </Button>
            </div>
          </motion.div>
        )}

        {currentStep === 'details' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <DialogHeader>
              <DialogTitle>Tell us more (Optional)</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              {renderSliderRating(
                feedback.focusImprovement,
                (value) => updateFeedback('focusImprovement', value),
                'Focus Improvement',
                'No change',
                'Much better'
              )}

              {renderSliderRating(
                feedback.stressReduction,
                (value) => updateFeedback('stressReduction', value),
                'Stress Reduction',
                'No change',
                'Much calmer'
              )}

              <div>
                <Label className="text-sm font-medium mb-2 block">
                  Additional Comments
                </Label>
                <Textarea
                  placeholder="Share your thoughts about this session..."
                  value={feedback.comment}
                  onChange={(e) => updateFeedback('comment', e.target.value)}
                  className="resize-none"
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-4">
                <button
                  onClick={() => updateFeedback('wouldRecommend', !feedback.wouldRecommend)}
                  className={`flex items-center space-x-2 p-3 rounded-lg border-2 transition-all ${
                    feedback.wouldRecommend
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Share2 className="h-4 w-4" />
                  <span className="text-sm">Would recommend</span>
                </button>

                <button
                  onClick={() => updateFeedback('favorite', !feedback.favorite)}
                  className={`flex items-center space-x-2 p-3 rounded-lg border-2 transition-all ${
                    feedback.favorite
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Heart className={`h-4 w-4 ${feedback.favorite ? 'fill-current' : ''}`} />
                  <span className="text-sm">Add to favorites</span>
                </button>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button onClick={handleSubmit} className="flex-1">
                Submit Feedback
              </Button>
              <Button variant="outline" onClick={() => setCurrentStep('rating')}>
                Back
              </Button>
            </div>
          </motion.div>
        )}

        {currentStep === 'complete' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-6"
          >
            <div className="text-4xl mb-4">🙏</div>
            <h2 className="text-xl font-bold mb-2">Thank you!</h2>
            <p className="text-muted-foreground mb-6">
              Your feedback helps us improve the experience for everyone.
            </p>

            <div className="flex space-x-3">
              {onReplay && (
                <Button variant="outline" onClick={onReplay}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Replay
                </Button>
              )}
              {onShare && (
                <Button variant="outline" onClick={onShare}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              )}
              <Button onClick={onContinue} className="flex-1">
                Continue
              </Button>
            </div>
          </motion.div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedSessionCompletionDialog;
