
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { 
  Play, Pause, Square, Star, Clock, Trophy, 
  Mic, CheckCircle, Target, Sparkles 
} from 'lucide-react';
import { MorningRitual } from '@/context/types';
import { toast } from 'sonner';

interface CompletionFlowProps {
  ritual: MorningRitual;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (completionData: CompletionData) => void;
}

export interface CompletionData {
  ritualId: string;
  startTime: Date;
  endTime: Date;
  actualDuration: number;
  rating: number;
  notes?: string;
  completionMethod: 'manual' | 'timer' | 'voice' | 'quick';
  qualityMetrics: {
    focus: number;
    satisfaction: number;
    energy: number;
  };
  achievements?: Achievement[];
}

interface Achievement {
  id: string;
  type: 'streak' | 'consistency' | 'duration' | 'quality';
  title: string;
  description: string;
  icon: string;
}

const AdvancedCompletionFlow: React.FC<CompletionFlowProps> = ({
  ritual,
  isOpen,
  onClose,
  onComplete
}) => {
  const [currentStep, setCurrentStep] = useState<'prepare' | 'active' | 'complete' | 'reflect'>('prepare');
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [rating, setRating] = useState(0);
  const [notes, setNotes] = useState('');
  const [completionMethod, setCompletionMethod] = useState<'manual' | 'timer' | 'voice' | 'quick'>('manual');
  const [qualityMetrics, setQualityMetrics] = useState({
    focus: 0,
    satisfaction: 0,
    energy: 0
  });
  const [detectedAchievements, setDetectedAchievements] = useState<Achievement[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);

  const plannedDuration = ritual.duration * 60; // Convert to seconds

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && startTime) {
      interval = setInterval(() => {
        const now = new Date();
        const elapsed = Math.floor((now.getTime() - startTime.getTime()) / 1000);
        setElapsedTime(elapsed);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, startTime]);

  // Achievement detection
  useEffect(() => {
    if (currentStep === 'complete') {
      const achievements = detectAchievements();
      setDetectedAchievements(achievements);
      if (achievements.length > 0) {
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 3000);
      }
    }
  }, [currentStep, ritual.streak, elapsedTime]);

  const detectAchievements = (): Achievement[] => {
    const achievements: Achievement[] = [];
    
    // Streak achievements
    if (ritual.streak && ritual.streak > 0) {
      if ((ritual.streak + 1) % 7 === 0) {
        achievements.push({
          id: 'weekly-streak',
          type: 'streak',
          title: 'Weekly Warrior',
          description: `${ritual.streak + 1} days in a row!`,
          icon: '🔥'
        });
      }
      
      if ((ritual.streak + 1) === 30) {
        achievements.push({
          id: 'monthly-master',
          type: 'streak',
          title: 'Monthly Master',
          description: 'Incredible 30-day streak!',
          icon: '👑'
        });
      }
    }
    
    // Duration achievements
    if (elapsedTime >= plannedDuration * 1.5) {
      achievements.push({
        id: 'extra-mile',
        type: 'duration',
        title: 'Going the Extra Mile',
        description: 'Exceeded planned duration by 50%!',
        icon: '🏃‍♂️'
      });
    }
    
    // First completion
    if (ritual.streak === 0) {
      achievements.push({
        id: 'first-step',
        type: 'consistency',
        title: 'First Step',
        description: 'Journey of a thousand miles begins!',
        icon: '🌱'
      });
    }
    
    return achievements;
  };

  const handleStart = (method: 'manual' | 'timer' | 'voice' | 'quick') => {
    setCompletionMethod(method);
    setStartTime(new Date());
    setCurrentStep('active');
    
    if (method === 'timer') {
      setIsActive(true);
    }
    
    toast.success('Ritual started!', {
      description: `Using ${method} completion method`,
    });
  };

  const handleComplete = () => {
    if (!startTime) return;
    
    const endTime = new Date();
    const actualDuration = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
    
    setElapsedTime(actualDuration);
    setIsActive(false);
    setCurrentStep('complete');
  };

  const handleFinish = () => {
    if (!startTime) return;
    
    const completionData: CompletionData = {
      ritualId: ritual.id,
      startTime: startTime,
      endTime: new Date(),
      actualDuration: elapsedTime,
      rating,
      notes: notes.trim() || undefined,
      completionMethod,
      qualityMetrics,
      achievements: detectedAchievements
    };
    
    onComplete(completionData);
    handleClose();
    
    // Show success toast with achievements
    if (detectedAchievements.length > 0) {
      toast.success('Ritual completed with achievements!', {
        description: `${detectedAchievements.length} new achievement${detectedAchievements.length > 1 ? 's' : ''} unlocked`,
      });
    } else {
      toast.success('Ritual completed successfully!');
    }
  };

  const handleClose = () => {
    setCurrentStep('prepare');
    setStartTime(null);
    setElapsedTime(0);
    setIsActive(false);
    setRating(0);
    setNotes('');
    setQualityMetrics({ focus: 0, satisfaction: 0, energy: 0 });
    setDetectedAchievements([]);
    onClose();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    if (plannedDuration === 0) return 0;
    return Math.min(100, (elapsedTime / plannedDuration) * 100);
  };

  const QualitySlider = ({ 
    label, 
    value, 
    onChange 
  }: { 
    label: string; 
    value: number; 
    onChange: (value: number) => void; 
  }) => (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium">{label}</label>
        <span className="text-sm text-muted-foreground">{value}/5</span>
      </div>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            onClick={() => onChange(rating)}
            className={`w-8 h-8 rounded-full border-2 transition-all ${
              rating <= value 
                ? 'bg-blue-500 border-blue-500 text-white' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            {rating}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-500" />
            {ritual.title} - Advanced Completion
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Celebration Animation */}
          {showCelebration && (
            <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
              <div className="text-6xl animate-bounce">🎉</div>
            </div>
          )}

          {/* Step Indicator */}
          <div className="flex items-center justify-between">
            {['prepare', 'active', 'complete', 'reflect'].map((step, index) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep === step 
                    ? 'bg-blue-500 text-white' 
                    : index < ['prepare', 'active', 'complete', 'reflect'].indexOf(currentStep)
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {index + 1}
                </div>
                {index < 3 && (
                  <div className={`w-16 h-1 mx-2 ${
                    index < ['prepare', 'active', 'complete', 'reflect'].indexOf(currentStep)
                      ? 'bg-green-500'
                      : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Prepare Step */}
          {currentStep === 'prepare' && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Ready to begin your ritual?</h3>
                <p className="text-muted-foreground">
                  Choose how you'd like to track your {ritual.title} session
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={() => handleStart('timer')}
                  className="h-20 flex flex-col items-center gap-2"
                  variant="outline"
                >
                  <Clock className="h-6 w-6" />
                  <span>Guided Timer</span>
                  <span className="text-xs text-muted-foreground">{ritual.duration} min</span>
                </Button>

                <Button
                  onClick={() => handleStart('manual')}
                  className="h-20 flex flex-col items-center gap-2"
                  variant="outline"
                >
                  <CheckCircle className="h-6 w-6" />
                  <span>Manual Tracking</span>
                  <span className="text-xs text-muted-foreground">Self-paced</span>
                </Button>

                <Button
                  onClick={() => handleStart('voice')}
                  className="h-20 flex flex-col items-center gap-2"
                  variant="outline"
                >
                  <Mic className="h-6 w-6" />
                  <span>Voice Control</span>
                  <span className="text-xs text-muted-foreground">Hands-free</span>
                </Button>

                <Button
                  onClick={() => handleStart('quick')}
                  className="h-20 flex flex-col items-center gap-2"
                  variant="outline"
                >
                  <Sparkles className="h-6 w-6" />
                  <span>Quick Complete</span>
                  <span className="text-xs text-muted-foreground">Mark done</span>
                </Button>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium mb-2">Ritual Details</h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>Duration: {ritual.duration} minutes</p>
                  <p>Time: {ritual.timeOfDay}</p>
                  {ritual.description && <p>Focus: {ritual.description}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Active Step */}
          {currentStep === 'active' && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold">{formatTime(elapsedTime)}</h3>
                <p className="text-muted-foreground">
                  {completionMethod === 'timer' ? 'Timer Active' : 'Session In Progress'}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{Math.round(getProgressPercentage())}%</span>
                </div>
                <Progress value={getProgressPercentage()} className="h-3" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Started</span>
                  <span>Target: {formatTime(plannedDuration)}</span>
                </div>
              </div>

              <div className="flex justify-center gap-4">
                {completionMethod === 'timer' && (
                  <Button
                    onClick={() => setIsActive(!isActive)}
                    variant="outline"
                    size="lg"
                  >
                    {isActive ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                  </Button>
                )}
                
                <Button onClick={handleComplete} size="lg">
                  <Square className="h-5 w-5 mr-2" />
                  Complete Ritual
                </Button>
              </div>

              <div className="p-4 bg-green-50 rounded-lg text-center">
                <p className="text-sm text-green-700">
                  Focus on your practice. You're building something meaningful.
                </p>
              </div>
            </div>
          )}

          {/* Complete Step */}
          {currentStep === 'complete' && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
                <h3 className="text-lg font-semibold">Ritual Completed!</h3>
                <p className="text-muted-foreground">
                  Duration: {formatTime(elapsedTime)} 
                  {elapsedTime !== plannedDuration && (
                    <span className="ml-2">
                      ({elapsedTime > plannedDuration ? '+' : '-'}
                      {Math.abs(elapsedTime - plannedDuration)}s from plan)
                    </span>
                  )}
                </p>
              </div>

              {/* Achievements */}
              {detectedAchievements.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-yellow-500" />
                    Achievements Unlocked!
                  </h4>
                  <div className="space-y-2">
                    {detectedAchievements.map((achievement) => (
                      <div key={achievement.id} className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                        <span className="text-2xl">{achievement.icon}</span>
                        <div>
                          <h5 className="font-medium text-yellow-800">{achievement.title}</h5>
                          <p className="text-sm text-yellow-700">{achievement.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Button 
                onClick={() => setCurrentStep('reflect')} 
                className="w-full"
                size="lg"
              >
                Continue to Reflection
              </Button>
            </div>
          )}

          {/* Reflect Step */}
          {currentStep === 'reflect' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">How was your session?</h3>
                
                {/* Rating */}
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Overall Rating</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setRating(star)}
                          className={`w-10 h-10 rounded-full transition-all ${
                            star <= rating 
                              ? 'text-yellow-500' 
                              : 'text-gray-300 hover:text-gray-400'
                          }`}
                        >
                          <Star className={`w-6 h-6 ${star <= rating ? 'fill-current' : ''}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quality Metrics */}
                  <div className="space-y-4">
                    <QualitySlider
                      label="Focus Level"
                      value={qualityMetrics.focus}
                      onChange={(value) => setQualityMetrics(prev => ({ ...prev, focus: value }))}
                    />
                    
                    <QualitySlider
                      label="Satisfaction"
                      value={qualityMetrics.satisfaction}
                      onChange={(value) => setQualityMetrics(prev => ({ ...prev, satisfaction: value }))}
                    />
                    
                    <QualitySlider
                      label="Energy Level"
                      value={qualityMetrics.energy}
                      onChange={(value) => setQualityMetrics(prev => ({ ...prev, energy: value }))}
                    />
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Notes (Optional)</label>
                    <Textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="How did it feel? Any insights or observations..."
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={handleClose} variant="outline" className="flex-1">
                  Skip Reflection
                </Button>
                <Button 
                  onClick={handleFinish} 
                  className="flex-1"
                  disabled={rating === 0}
                >
                  Save & Complete
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdvancedCompletionFlow;
