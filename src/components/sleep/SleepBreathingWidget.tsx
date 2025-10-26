import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import {
  Moon,
  Play,
  Clock,
  Brain,
  Heart,
  Zap,
  Wind,
  Target
} from 'lucide-react';
import { toast } from 'sonner';
import { SleepBreathingRecommendationEngine } from '@/services/SleepBreathingRecommendationEngine';
import {
  EnhancedSleepRecovery,
  SleepBreathingRecommendation,
  SleepBreathingSession,
  SleepChallenge,
  SleepBreathingPurpose
} from '@/types/sleepRecovery';
import { BreathingTechnique } from '@/types/workLifeBalance';

interface SleepBreathingWidgetProps {
  sleepPreferences: EnhancedSleepRecovery;
  onSessionStart?: (recommendation: SleepBreathingRecommendation) => void;
  onSessionComplete?: (session: SleepBreathingSession) => void;
  className?: string;
}

// Technique descriptions for sleep context
const SLEEP_TECHNIQUE_DESCRIPTIONS: Record<BreathingTechnique, {
  name: string;
  sleepContext: string;
  instructions: string[];
  bestFor: string[];
}> = {
  'four-seven-eight': {
    name: '4-7-8 Sleep Breathing',
    sleepContext: 'Specifically designed to activate your natural sleep response',
    instructions: [
      'Exhale completely through your mouth',
      'Inhale through nose for 4 counts',
      'Hold your breath for 7 counts',
      'Exhale through mouth for 8 counts',
      'Repeat 3-4 cycles'
    ],
    bestFor: ['Falling asleep', 'Bedtime anxiety', 'Racing thoughts']
  },
  'belly-breathing': {
    name: 'Deep Sleep Breathing',
    sleepContext: 'Activates relaxation response and releases physical tension',
    instructions: [
      'Place hand on belly, hand on chest',
      'Breathe so only belly hand moves',
      'Inhale slowly for 4-6 counts',
      'Exhale slowly for 6-8 counts',
      'Focus on releasing tension'
    ],
    bestFor: ['Physical tension', 'Restless sleep', 'Night wakings']
  },
  'coherent-breathing': {
    name: 'Rhythmic Sleep Breathing',
    sleepContext: 'Balances nervous system for peaceful sleep',
    instructions: [
      'Breathe in for 5 counts',
      'Breathe out for 5 counts',
      'Keep rhythm smooth and effortless',
      'Continue for 5-10 minutes',
      'Let mind follow the rhythm'
    ],
    bestFor: ['Wind-down routine', 'Consistency', 'Early morning waking']
  },
  'box-breathing': {
    name: 'Mind-Quieting Breathing',
    sleepContext: 'Structured pattern helps calm mental activity',
    instructions: [
      'Inhale for 4 counts',
      'Hold for 4 counts',
      'Exhale for 4 counts',
      'Hold empty for 4 counts',
      'Focus only on counting'
    ],
    bestFor: ['Racing thoughts', 'Mental hyperactivity', 'Sleep anxiety']
  },
  'physiological-sigh': {
    name: 'Quick Sleep Reset',
    sleepContext: 'Rapid nervous system calming for immediate relief',
    instructions: [
      'Take normal inhale through nose',
      'Add second, smaller inhale on top',
      'Exhale slowly through mouth',
      'Repeat 5-10 times',
      'Notice immediate calming effect'
    ],
    bestFor: ['Crisis intervention', 'Acute anxiety', 'Middle of night']
  },
  'triangular-breathing': {
    name: 'Stress-Release Breathing',
    sleepContext: 'Processes daily stress before sleep',
    instructions: [
      'Inhale for 4 counts',
      'Hold for 4 counts',
      'Exhale for 8 counts (key: longer exhale)',
      'Release stress with each exhale',
      'Continue for 8-12 minutes'
    ],
    bestFor: ['High stress', 'Work stress', 'Emotional processing']
  },
  'alternate-nostril': {
    name: 'Mind-Balancing Breathing',
    sleepContext: 'Traditional technique to calm mental chatter',
    instructions: [
      'Use thumb to close right nostril',
      'Inhale through left for 4 counts',
      'Switch: close left, open right',
      'Exhale through right for 4 counts',
      'Continue alternating pattern'
    ],
    bestFor: ['Mental balance', 'Overthinking', 'Meditation preparation']
  },
  'tactical-breathing': {
    name: 'Controlled Sleep Breathing',
    sleepContext: 'Military technique for staying calm under pressure',
    instructions: [
      'Inhale for 4 counts',
      'Hold for 4 counts',
      'Exhale for 4 counts',
      'Hold empty for 4 counts',
      'Maintain steady control'
    ],
    bestFor: ['Performance anxiety', 'Control', 'Discipline building']
  },
  'quick-coherence': {
    name: 'Heart-Centered Sleep Breathing',
    sleepContext: 'HeartMath technique combining breath with positive emotion',
    instructions: [
      'Breathe in for 5 counts',
      'Breathe out for 5 counts',
      'Focus on heart area',
      'Add feeling of gratitude or peace',
      'Continue for 3-5 minutes'
    ],
    bestFor: ['Emotional balance', 'Gratitude practice', 'Heart coherence']
  }
};

export const SleepBreathingWidget: React.FC<SleepBreathingWidgetProps> = ({
  sleepPreferences,
  onSessionStart,
  onSessionComplete,
  className
}) => {
  const [recommendations, setRecommendations] = useState<SleepBreathingRecommendation[]>([]);
  const [activeSession, setActiveSession] = useState<SleepBreathingRecommendation | null>(null);
  const [sessionProgress, setSessionProgress] = useState(0);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [sessionHistory, setSessionHistory] = useState<SleepBreathingSession[]>([]);
  const [engine, setEngine] = useState<SleepBreathingRecommendationEngine | null>(null);

  // Context inputs for recommendations
  const [currentStressLevel, setCurrentStressLevel] = useState(5);
  const [physicalTension, setPhysicalTension] = useState(3);
  const [mentalActivity, setMentalActivity] = useState(4);
  const [currentChallenge, setCurrentChallenge] = useState<SleepChallenge | undefined>();
  const [currentPurpose, setCurrentPurpose] = useState<SleepBreathingPurpose>('bedtime-routine');

  // Initialize recommendation engine
  useEffect(() => {
    const newEngine = new SleepBreathingRecommendationEngine(sleepPreferences, sessionHistory);
    setEngine(newEngine);
  }, [sleepPreferences, sessionHistory]);

  // Get fresh recommendations when context changes
  useEffect(() => {
    if (!engine) return;

    const context = {
      currentTime: new Date(),
      currentSleepChallenge: currentChallenge,
      stressLevel: currentStressLevel,
      physicalTension,
      mentalActivity,
      purpose: currentPurpose,
      environment: 'bedroom' as const,
      canMakeNoise: true,
    };

    const newRecommendations = engine.getSleepRecommendations(context);
    setRecommendations(newRecommendations);
  }, [engine, currentChallenge, currentStressLevel, physicalTension, mentalActivity, currentPurpose]);

  const calculateTimeUntilBedtime = () => {
    const now = new Date();
    const [bedHour, bedMinute] = sleepPreferences.bedtime.split(':').map(Number);
    const bedtimeToday = new Date(now);
    bedtimeToday.setHours(bedHour, bedMinute, 0, 0);

    if (bedtimeToday <= now) {
      bedtimeToday.setDate(bedtimeToday.getDate() + 1);
    }

    return Math.floor((bedtimeToday.getTime() - now.getTime()) / (1000 * 60));
  };

  const startBreathingSession = (recommendation: SleepBreathingRecommendation) => {
    setActiveSession(recommendation);
    setIsSessionActive(true);
    setSessionProgress(0);

    const duration = recommendation.duration * 60; // Convert to seconds
    const startTime = new Date();

    // Simulate session progress
    const progressInterval = setInterval(() => {
      setSessionProgress(prev => {
        const newProgress = prev + (100 / duration);
        if (newProgress >= 100) {
          clearInterval(progressInterval);
          completeSession(recommendation, startTime);
          return 100;
        }
        return newProgress;
      });
    }, 1000);

    onSessionStart?.(recommendation);

    toast.success(`Starting ${recommendation.title}`, {
      description: `${recommendation.duration} minute session for ${recommendation.purpose.replace('-', ' ')}`,
    });
  };

  const completeSession = (recommendation: SleepBreathingRecommendation, startTime: Date) => {
    setIsSessionActive(false);
    const endTime = new Date();

    // Create session record
    const session: SleepBreathingSession = {
      id: `sleep-session-${Date.now()}`,
      userId: 'current-user',
      technique: recommendation.technique,
      purpose: recommendation.purpose,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      duration: recommendation.duration * 60,
      timeRelativeToBedtime: calculateTimeUntilBedtime(),
      sleepChallenge: currentChallenge,
      stressLevelBefore: currentStressLevel,
      physicalTensionBefore: physicalTension,
      mentalActivityBefore: mentalActivity,
      guidedOrSelfDirected: 'guided',
      backgroundSounds: true,
      completed: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Add to history and update engine
    const newHistory = [...sessionHistory, session];
    setSessionHistory(newHistory);

    if (engine) {
      engine.recordSleepSession(session);
    }

    setActiveSession(null);
    onSessionComplete?.(session);

    toast.success('Sleep breathing session completed!', {
      description: 'How did that feel? Rate your session to improve future recommendations.',
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-blue-500';
      case 'low': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent': return <Zap className="h-4 w-4" />;
      case 'high': return <Target className="h-4 w-4" />;
      case 'medium': return <Clock className="h-4 w-4" />;
      case 'low': return <Wind className="h-4 w-4" />;
      default: return <Wind className="h-4 w-4" />;
    }
  };

  const timeUntilBedtime = calculateTimeUntilBedtime();

  if (isSessionActive && activeSession) {
    const technique = SLEEP_TECHNIQUE_DESCRIPTIONS[activeSession.technique];

    return (
      <Card className={`bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200 ${className}`}>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-100 rounded-full">
              <Moon className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <CardTitle className="text-lg">{technique.name} in Progress</CardTitle>
              <CardDescription>{technique.sleepContext}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-indigo-600 mb-2">
              {Math.ceil((100 - sessionProgress) * activeSession.duration / 100)}
            </div>
            <div className="text-sm text-muted-foreground">seconds remaining</div>
          </div>

          <Progress value={sessionProgress} className="h-3" />

          <div className="bg-indigo-50 p-3 rounded-lg">
            <p className="text-sm text-indigo-700 font-medium mb-2">Current Instructions:</p>
            <ul className="text-xs text-indigo-600 space-y-1">
              {technique.instructions.map((instruction, index) => (
                <li key={index}>• {instruction}</li>
              ))}
            </ul>
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">{activeSession.reasoning}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300 ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Moon className="h-5 w-5 text-primary" />
            <CardTitle className="text-xl">Sleep Breathing</CardTitle>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium">
              {timeUntilBedtime > 0 ? `${Math.floor(timeUntilBedtime / 60)}h ${timeUntilBedtime % 60}m` : 'Past bedtime'}
            </div>
            <div className="text-xs text-muted-foreground">
              {timeUntilBedtime > 0 ? 'until bedtime' : 'time for sleep'}
            </div>
          </div>
        </div>
        <CardDescription>
          Personalized breathing techniques for better sleep quality
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Context Controls */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm">Current State (helps personalize recommendations)</h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground flex items-center gap-1">
                <Heart className="h-3 w-3" />
                Stress Level: {currentStressLevel}/10
              </Label>
              <Slider
                value={[currentStressLevel]}
                onValueChange={(values) => setCurrentStressLevel(values[0])}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground flex items-center gap-1">
                <Brain className="h-3 w-3" />
                Mental Activity: {mentalActivity}/10
              </Label>
              <Slider
                value={[mentalActivity]}
                onValueChange={(values) => setMentalActivity(values[0])}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground flex items-center gap-1">
                <Zap className="h-3 w-3" />
                Physical Tension: {physicalTension}/10
              </Label>
              <Slider
                value={[physicalTension]}
                onValueChange={(values) => setPhysicalTension(values[0])}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Current Sleep Challenge</Label>
              <Select value={currentChallenge || ''} onValueChange={(value) => setCurrentChallenge(value as SleepChallenge || undefined)}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Select challenge" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No specific challenge</SelectItem>
                  <SelectItem value="falling-asleep">Trouble falling asleep</SelectItem>
                  <SelectItem value="staying-asleep">Frequent night wakings</SelectItem>
                  <SelectItem value="racing-thoughts">Racing thoughts</SelectItem>
                  <SelectItem value="physical-tension">Physical tension</SelectItem>
                  <SelectItem value="early-waking">Waking too early</SelectItem>
                  <SelectItem value="anxiety-bedtime">Bedtime anxiety</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Session Purpose</Label>
              <Select value={currentPurpose} onValueChange={(value) => setCurrentPurpose(value as SleepBreathingPurpose)}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bedtime-routine">Bedtime routine</SelectItem>
                  <SelectItem value="falling-asleep">Help falling asleep</SelectItem>
                  <SelectItem value="middle-of-night">Middle of night wake</SelectItem>
                  <SelectItem value="stress-relief">Stress relief</SelectItem>
                  <SelectItem value="preparation">Sleep preparation</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Separator />

        {/* Recommendations */}
        {recommendations.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <Moon className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No recommendations right now</p>
            <p className="text-xs">Adjust your current state above for personalized suggestions</p>
          </div>
        ) : (
          <div className="space-y-4">
            <h4 className="font-medium text-sm">Recommended for You</h4>
            {recommendations.map((recommendation: any) => {
              const defaultTechnique = { name: 'Relaxation Breathing', sleepContext: 'Calming technique for better sleep', instructions: ['Breathe in', 'Hold', 'Breathe out'], bestFor: ['Relaxation', 'Sleep'] };
              const technique = SLEEP_TECHNIQUE_DESCRIPTIONS[recommendation.technique as BreathingTechnique] || defaultTechnique;

              return (
                <div
                  key={recommendation.id}
                  className="p-4 border border-gray-200 rounded-lg hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`p-1 rounded-full text-white ${getPriorityColor(recommendation.priority)}`}>
                        {getPriorityIcon(recommendation.priority)}
                      </div>
                      <div>
                        <h5 className="font-medium text-sm">{technique.name}</h5>
                        <p className="text-xs text-muted-foreground">{technique.sleepContext}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{recommendation.duration}m</div>
                      <Badge
                        variant="outline"
                        className={`text-xs ${getPriorityColor(recommendation.priority)} text-white border-transparent`}
                      >
                        {recommendation.priority}
                      </Badge>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground mb-3">
                    {recommendation.reasoning}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {technique?.bestFor?.slice(0, 2).map((benefit: string, index: number) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {benefit}
                        </Badge>
                      ))}
                    </div>

                    <Button
                      size="sm"
                      onClick={() => startBreathingSession(recommendation)}
                      className="h-8 px-3"
                    >
                      <Play className="h-3 w-3 mr-1" />
                      Start
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Quick stats */}
        {engine && sessionHistory.length > 0 && (
          <div className="pt-4 border-t border-gray-200">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-semibold text-primary">
                  {engine.getSleepBreathingAnalytics().totalSleepSessions}
                </div>
                <div className="text-xs text-muted-foreground">Sleep Sessions</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-primary">
                  {engine.getSleepBreathingAnalytics().averageTimeToFallAsleep}m
                </div>
                <div className="text-xs text-muted-foreground">Avg Time to Sleep</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-primary">
                  {engine.getSleepBreathingAnalytics().averageRelaxationRating}
                </div>
                <div className="text-xs text-muted-foreground">Avg Relaxation</div>
              </div>
            </div>

            {engine.getSleepBreathingAnalytics().recommendationsForImprovement.length > 0 && (
              <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                <p className="text-xs font-medium text-blue-800 mb-1">💡 Improvement Tip:</p>
                <p className="text-xs text-blue-700">
                  {engine.getSleepBreathingAnalytics().recommendationsForImprovement[0]}
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

function Label({ className, children, ...props }: any) {
  return (
    <label className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`} {...props}>
      {children}
    </label>
  );
}