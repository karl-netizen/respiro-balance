import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Moon,
  Sun,
  Clock,
  Activity,
  Brain,
  Heart,
  CheckCircle,
  
  Wind
} from 'lucide-react';
import {
  EnhancedSleepRecovery,
  SleepChallenge,
  WindDownActivity,
  SleepAid,
  SleepGoal
} from '@/types/sleepRecovery';

interface SleepAssessmentProps {
  onComplete: (sleepData: EnhancedSleepRecovery) => void;
  initialData?: Partial<EnhancedSleepRecovery>;
}

type AssessmentStep = 'schedule' | 'quality' | 'challenges' | 'routine' | 'breathing' | 'review';

// Option definitions
const SLEEP_CHALLENGES: Array<{ value: SleepChallenge; label: string; description: string; emoji: string }> = [
  { value: 'falling-asleep', label: 'Trouble falling asleep', description: 'Takes more than 20-30 minutes', emoji: '😴' },
  { value: 'staying-asleep', label: 'Frequent night wakings', description: 'Wake up multiple times', emoji: '🌙' },
  { value: 'racing-thoughts', label: 'Racing thoughts', description: 'Mind won\'t quiet down', emoji: '🧠' },
  { value: 'physical-tension', label: 'Physical tension', description: 'Body feels tense or restless', emoji: '😤' },
  { value: 'early-waking', label: 'Waking too early', description: 'Can\'t get back to sleep', emoji: '🌅' },
  { value: 'restless-sleep', label: 'Restless sleep', description: 'Tossing and turning', emoji: '🔄' },
  { value: 'anxiety-bedtime', label: 'Bedtime anxiety', description: 'Worry about sleep itself', emoji: '😰' },
  { value: 'irregular-schedule', label: 'Irregular schedule', description: 'Inconsistent sleep times', emoji: '⏰' },
  { value: 'light-sensitive', label: 'Light sensitivity', description: 'Easily awakened by light', emoji: '💡' },
  { value: 'temperature-sensitive', label: 'Temperature issues', description: 'Too hot or cold', emoji: '🌡️' },
  { value: 'none', label: 'No specific challenges', description: 'Sleep is generally good', emoji: '✅' },
];

const WIND_DOWN_ACTIVITIES: Array<{ value: WindDownActivity; label: string; category: string; emoji: string }> = [
  { value: 'reading', label: 'Reading', category: 'Mental', emoji: '📚' },
  { value: 'stretching', label: 'Gentle stretching', category: 'Physical', emoji: '🤸‍♀️' },
  { value: 'breathing-exercises', label: 'Breathing exercises', category: 'Breathing', emoji: '💨' },
  { value: 'meditation', label: 'Meditation', category: 'Mental', emoji: '🧘‍♀️' },
  { value: 'warm-bath', label: 'Warm bath/shower', category: 'Physical', emoji: '🛁' },
  { value: 'gentle-music', label: 'Calming music', category: 'Environment', emoji: '🎵' },
  { value: 'journaling', label: 'Journaling', category: 'Mental', emoji: '📝' },
  { value: 'herbal-tea', label: 'Herbal tea', category: 'Physical', emoji: '🍵' },
  { value: 'dim-lighting', label: 'Dim lighting', category: 'Environment', emoji: '🕯️' },
  { value: 'no-screens', label: 'No screens', category: 'Environment', emoji: '📵' },
  { value: 'progressive-relaxation', label: 'Progressive muscle relaxation', category: 'Physical', emoji: '😌' },
  { value: 'aromatherapy', label: 'Aromatherapy', category: 'Environment', emoji: '🌸' },
  { value: 'prayer-spiritual', label: 'Prayer/spiritual practice', category: 'Mental', emoji: '🙏' },
  { value: 'organize-tomorrow', label: 'Plan tomorrow', category: 'Mental', emoji: '📅' },
  { value: 'none', label: 'No specific routine', category: 'None', emoji: '🤷‍♀️' },
];

const SLEEP_AIDS: Array<{ value: SleepAid; label: string; category: string; emoji: string }> = [
  { value: 'none', label: 'None currently', category: 'None', emoji: '🚫' },
  { value: 'apps', label: 'Sleep apps', category: 'Technology', emoji: '📱' },
  { value: 'music', label: 'Music/sounds', category: 'Audio', emoji: '🎧' },
  { value: 'medication', label: 'Sleep medication', category: 'Medical', emoji: '💊' },
  { value: 'breathing', label: 'Breathing techniques', category: 'Natural', emoji: '💨' },
  { value: 'supplements', label: 'Supplements (melatonin, etc.)', category: 'Natural', emoji: '🌿' },
  { value: 'weighted-blanket', label: 'Weighted blanket', category: 'Physical', emoji: '🛏️' },
  { value: 'eye-mask', label: 'Eye mask', category: 'Environment', emoji: '👁️' },
  { value: 'earplugs', label: 'Earplugs', category: 'Environment', emoji: '👂' },
  { value: 'temperature-control', label: 'Temperature control', category: 'Environment', emoji: '❄️' },
  { value: 'aromatherapy', label: 'Essential oils', category: 'Natural', emoji: '🌸' },
  { value: 'meditation-apps', label: 'Meditation apps', category: 'Technology', emoji: '🧘‍♀️' },
];

const SLEEP_GOALS: Array<{ value: SleepGoal; label: string; description: string; emoji: string }> = [
  { value: 'fall-asleep-faster', label: 'Fall asleep faster', description: 'Reduce time to fall asleep', emoji: '⚡' },
  { value: 'sleep-through-night', label: 'Sleep through the night', description: 'Reduce night wakings', emoji: '🌙' },
  { value: 'wake-refreshed', label: 'Wake up refreshed', description: 'Improve morning energy', emoji: '☀️' },
  { value: 'consistent-schedule', label: 'Consistent schedule', description: 'Regular sleep times', emoji: '⏰' },
  { value: 'deeper-sleep', label: 'Deeper sleep', description: 'Improve sleep quality', emoji: '😴' },
  { value: 'reduce-sleep-anxiety', label: 'Reduce sleep anxiety', description: 'Less worry about sleep', emoji: '😌' },
  { value: 'natural-waking', label: 'Wake naturally', description: 'Wake without alarm', emoji: '🐓' },
  { value: 'recover-from-stress', label: 'Stress recovery', description: 'Use sleep for stress relief', emoji: '💆‍♀️' },
];

export const SleepAssessment: React.FC<SleepAssessmentProps> = ({
  onComplete,
  initialData
}) => {
  const [currentStep, setCurrentStep] = useState<AssessmentStep>('schedule');

  // Sleep schedule
  const [bedtime, setBedtime] = useState(initialData?.bedtime || '22:00');
  const [wakeTime, setWakeTime] = useState(initialData?.wakeTime || '07:00');

  // Sleep quality
  const [sleepQuality, setSleepQuality] = useState(initialData?.sleepQuality || 6);
  const [morningEnergy, setMorningEnergy] = useState(initialData?.morningEnergy || 4);
  const [timeToFallAsleep, setTimeToFallAsleep] = useState(initialData?.timeToFallAsleep || 20);
  const [nightTimeWakeups, setNightTimeWakeups] = useState(initialData?.nightTimeWakeups || 1);

  // Sleep challenges
  const [sleepChallenges, setSleepChallenges] = useState<SleepChallenge[]>(
    initialData?.sleepChallenges || []
  );

  // Wind-down routine
  const [windDownRoutine, setWindDownRoutine] = useState<WindDownActivity[]>(
    initialData?.windDownRoutine || []
  );

  // Sleep aids
  const [currentSleepAids, setCurrentSleepAids] = useState<SleepAid[]>(
    initialData?.currentSleepAids || ['none']
  );

  // Breathing preferences
  const [interestedInSleepBreathing, setInterestedInSleepBreathing] = useState(
    initialData?.interestedInSleepBreathing ?? true
  );

  // Goals
  const [sleepGoals, setSleepGoals] = useState<SleepGoal[]>([]);

  const steps: Record<AssessmentStep, string> = {
    schedule: 'Sleep Schedule',
    quality: 'Sleep Quality',
    challenges: 'Sleep Challenges',
    routine: 'Wind-Down Routine',
    breathing: 'Breathing Integration',
    review: 'Review & Complete'
  };

  const stepOrder: AssessmentStep[] = ['schedule', 'quality', 'challenges', 'routine', 'breathing', 'review'];
  const currentStepIndex = stepOrder.indexOf(currentStep);
  const progress = ((currentStepIndex + 1) / stepOrder.length) * 100;

  const getSleepQualityEmoji = (quality: number) => {
    if (quality <= 3) return '😫';
    if (quality <= 5) return '😴';
    if (quality <= 7) return '😊';
    return '😌';
  };

  const getEnergyEmoji = (energy: number) => {
    if (energy <= 3) return '🔋';
    if (energy <= 5) return '⚡';
    if (energy <= 7) return '✨';
    return '🌟';
  };

  const handleChallengeChange = (challenge: SleepChallenge, checked: boolean) => {
    if (challenge === 'none') {
      setSleepChallenges(checked ? ['none'] : []);
    } else {
      setSleepChallenges(prev => {
        const filtered = prev.filter(c => c !== 'none');
        if (checked) {
          return [...filtered, challenge];
        } else {
          return filtered.filter(c => c !== challenge);
        }
      });
    }
  };

  const handleWindDownChange = (activity: WindDownActivity, checked: boolean) => {
    if (activity === 'none') {
      setWindDownRoutine(checked ? ['none'] : []);
    } else {
      setWindDownRoutine(prev => {
        const filtered = prev.filter(a => a !== 'none');
        if (checked) {
          return [...filtered, activity];
        } else {
          return filtered.filter(a => a !== activity);
        }
      });
    }
  };

  const handleSleepAidChange = (aid: SleepAid, checked: boolean) => {
    if (aid === 'none') {
      setCurrentSleepAids(checked ? ['none'] : []);
    } else {
      setCurrentSleepAids(prev => {
        const filtered = prev.filter(a => a !== 'none');
        if (checked) {
          return [...filtered, aid];
        } else {
          return filtered.filter(a => a !== aid);
        }
      });
    }
  };

  const handleGoalChange = (goal: SleepGoal, checked: boolean) => {
    setSleepGoals(prev =>
      checked
        ? [...prev, goal].slice(0, 4) // Limit to 4 goals
        : prev.filter(g => g !== goal)
    );
  };

  const handleNext = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < stepOrder.length) {
      setCurrentStep(stepOrder[nextIndex]);
    }
  };

  const handlePrevious = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(stepOrder[prevIndex]);
    }
  };

  const handleComplete = () => {
    const sleepData: EnhancedSleepRecovery = {
      bedtime,
      wakeTime,
      sleepQuality,
      sleepChallenges,
      windDownRoutine,
      morningEnergy,
      interestedInSleepBreathing,
      currentSleepAids,
      timeToFallAsleep,
      nightTimeWakeups,
      sleepGoals,
      lastSleepAssessment: new Date().toISOString(),
    };

    onComplete(sleepData);
  };

  const renderSchedule = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-500" />
            <CardTitle>Sleep Schedule</CardTitle>
          </div>
          <CardDescription>
            What time do you usually go to bed and wake up?
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="bedtime" className="flex items-center gap-2">
                <Moon className="h-4 w-4" />
                Bedtime
              </Label>
              <Input
                id="bedtime"
                type="time"
                value={bedtime}
                onChange={(e) => setBedtime(e.target.value)}
                className="text-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="waketime" className="flex items-center gap-2">
                <Sun className="h-4 w-4" />
                Wake Time
              </Label>
              <Input
                id="waketime"
                type="time"
                value={wakeTime}
                onChange={(e) => setWakeTime(e.target.value)}
                className="text-lg"
              />
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-blue-800">Sleep Duration</span>
            </div>
            <p className="text-blue-700">
              Based on your schedule, you're aiming for{' '}
              <strong>
                {(() => {
                  const bedHour = parseInt(bedtime.split(':')[0]);
                  const bedMinute = parseInt(bedtime.split(':')[1]);
                  const wakeHour = parseInt(wakeTime.split(':')[0]);
                  const wakeMinute = parseInt(wakeTime.split(':')[1]);

                  let totalMinutes = (wakeHour * 60 + wakeMinute) - (bedHour * 60 + bedMinute);
                  if (totalMinutes < 0) totalMinutes += 24 * 60; // Handle overnight

                  const hours = Math.floor(totalMinutes / 60);
                  const minutes = totalMinutes % 60;

                  return `${hours}h ${minutes}m`;
                })()}
              </strong>{' '}
              of sleep
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderQuality = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            <CardTitle>Sleep Quality Assessment</CardTitle>
          </div>
          <CardDescription>
            How would you rate your current sleep quality and energy levels?
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Sleep Quality */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Overall Sleep Quality</Label>
            <div className="text-center">
              <div className="text-4xl mb-2">{getSleepQualityEmoji(sleepQuality)}</div>
              <div className="text-2xl font-semibold">{sleepQuality}/10</div>
              <div className="text-sm text-muted-foreground">
                {sleepQuality <= 3 ? 'Poor sleep' :
                 sleepQuality <= 5 ? 'Fair sleep' :
                 sleepQuality <= 7 ? 'Good sleep' : 'Excellent sleep'}
              </div>
            </div>
            <Slider
              value={[sleepQuality]}
              onValueChange={(values) => setSleepQuality(values[0])}
              max={10}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1 - Very poor</span>
              <span>10 - Excellent</span>
            </div>
          </div>

          <Separator />

          {/* Morning Energy */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Morning Energy Level</Label>
            <div className="text-center">
              <div className="text-4xl mb-2">{getEnergyEmoji(morningEnergy)}</div>
              <div className="text-2xl font-semibold">{morningEnergy}/10</div>
              <div className="text-sm text-muted-foreground">
                {morningEnergy <= 3 ? 'Very tired' :
                 morningEnergy <= 5 ? 'Somewhat tired' :
                 morningEnergy <= 7 ? 'Refreshed' : 'Very energized'}
              </div>
            </div>
            <Slider
              value={[morningEnergy]}
              onValueChange={(values) => setMorningEnergy(values[0])}
              max={10}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1 - Exhausted</span>
              <span>10 - Energized</span>
            </div>
          </div>

          <Separator />

          {/* Sleep Metrics */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="timeToSleep">Time to fall asleep (minutes)</Label>
              <Input
                id="timeToSleep"
                type="number"
                value={timeToFallAsleep}
                onChange={(e) => setTimeToFallAsleep(parseInt(e.target.value) || 0)}
                min="0"
                max="120"
                className="text-center"
              />
              <p className="text-xs text-muted-foreground">
                Normal: 10-20 minutes
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nightWakeups">Night wakings (per night)</Label>
              <Input
                id="nightWakeups"
                type="number"
                value={nightTimeWakeups}
                onChange={(e) => setNightTimeWakeups(parseInt(e.target.value) || 0)}
                min="0"
                max="10"
                className="text-center"
              />
              <p className="text-xs text-muted-foreground">
                Normal: 0-1 times
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderChallenges = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-500" />
            <CardTitle>Sleep Challenges</CardTitle>
          </div>
          <CardDescription>
            What specific sleep challenges do you experience? (Select all that apply)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {SLEEP_CHALLENGES.map((challenge) => (
              <div key={challenge.value} className="flex items-start space-x-2">
                <Checkbox
                  id={challenge.value}
                  checked={sleepChallenges.includes(challenge.value)}
                  onCheckedChange={(checked) => handleChallengeChange(challenge.value, checked as boolean)}
                />
                <Label htmlFor={challenge.value} className="text-sm">
                  <div className="flex items-center gap-2">
                    <span>{challenge.emoji}</span>
                    <div>
                      <div className="font-medium">{challenge.label}</div>
                      <div className="text-xs text-muted-foreground">{challenge.description}</div>
                    </div>
                  </div>
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderRoutine = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Moon className="h-5 w-5 text-indigo-500" />
            <CardTitle>Wind-Down Routine</CardTitle>
          </div>
          <CardDescription>
            What activities do you currently do to prepare for sleep? (Select all that apply)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(
              WIND_DOWN_ACTIVITIES.reduce((acc, activity) => {
                acc[activity.category] = acc[activity.category] || [];
                acc[activity.category].push(activity);
                return acc;
              }, {} as Record<string, typeof WIND_DOWN_ACTIVITIES>)
            ).map(([category, activities]) => (
              <div key={category}>
                <h4 className="font-medium text-sm mb-2 text-muted-foreground">{category}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {activities.map((activity) => (
                    <div key={activity.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={activity.value}
                        checked={windDownRoutine.includes(activity.value)}
                        onCheckedChange={(checked) => handleWindDownChange(activity.value, checked as boolean)}
                      />
                      <Label htmlFor={activity.value} className="text-sm">
                        <span className="mr-2">{activity.emoji}</span>
                        {activity.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current Sleep Aids</CardTitle>
          <CardDescription>
            What do you currently use to help with sleep? (Select all that apply)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(
              SLEEP_AIDS.reduce((acc, aid) => {
                acc[aid.category] = acc[aid.category] || [];
                acc[aid.category].push(aid);
                return acc;
              }, {} as Record<string, typeof SLEEP_AIDS>)
            ).map(([category, aids]) => (
              <div key={category}>
                <h4 className="font-medium text-sm mb-2 text-muted-foreground">{category}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {aids.map((aid) => (
                    <div key={aid.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={aid.value}
                        checked={currentSleepAids.includes(aid.value)}
                        onCheckedChange={(checked) => handleSleepAidChange(aid.value, checked as boolean)}
                      />
                      <Label htmlFor={aid.value} className="text-sm">
                        <span className="mr-2">{aid.emoji}</span>
                        {aid.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderBreathing = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Wind className="h-5 w-5 text-green-500" />
            <CardTitle>Breathing for Sleep</CardTitle>
          </div>
          <CardDescription>
            Breathing techniques can be highly effective for improving sleep quality
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2">Benefits of Sleep Breathing:</h4>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Activates your body's natural relaxation response</li>
              <li>• Helps quiet racing thoughts and mental activity</li>
              <li>• Reduces physical tension that can prevent sleep</li>
              <li>• Provides a healthy, non-dependency forming sleep aid</li>
              <li>• Can be used anytime, anywhere without equipment</li>
            </ul>
          </div>

          <div className="space-y-4">
            <Label className="text-base font-medium">Interest in Sleep Breathing</Label>
            <RadioGroup
              value={interestedInSleepBreathing ? 'yes' : 'no'}
              onValueChange={(value) => setInterestedInSleepBreathing(value === 'yes')}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="breathing-yes" />
                <Label htmlFor="breathing-yes">
                  <div className="font-medium">Yes, I'm interested</div>
                  <div className="text-sm text-muted-foreground">
                    I'd like to learn breathing techniques for better sleep
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="breathing-no" />
                <Label htmlFor="breathing-no">
                  <div className="font-medium">Not right now</div>
                  <div className="text-sm text-muted-foreground">
                    I'll focus on other sleep improvements first
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {interestedInSleepBreathing && (
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg">Sleep Goals</CardTitle>
                <CardDescription>
                  What specific sleep improvements are you hoping to achieve? (Select up to 4)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {SLEEP_GOALS.map((goal) => (
                    <div key={goal.value} className="flex items-start space-x-2">
                      <Checkbox
                        id={goal.value}
                        checked={sleepGoals.includes(goal.value)}
                        onCheckedChange={(checked) => handleGoalChange(goal.value, checked as boolean)}
                        disabled={!sleepGoals.includes(goal.value) && sleepGoals.length >= 4}
                      />
                      <Label htmlFor={goal.value} className="text-sm">
                        <div className="flex items-center gap-2">
                          <span>{goal.emoji}</span>
                          <div>
                            <div className="font-medium">{goal.label}</div>
                            <div className="text-xs text-muted-foreground">{goal.description}</div>
                          </div>
                        </div>
                      </Label>
                    </div>
                  ))}
                </div>
                {sleepGoals.length >= 4 && (
                  <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-md">
                    <p className="text-sm text-amber-700">
                      You've selected the maximum of 4 goals. Uncheck one to select another.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderReview = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <CardTitle>Sleep Assessment Summary</CardTitle>
          </div>
          <CardDescription>
            Review your sleep profile before completing the assessment
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Schedule Summary */}
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-500" />
              Sleep Schedule
            </h4>
            <div className="text-sm space-y-1">
              <p>Bedtime: <strong>{bedtime}</strong> • Wake time: <strong>{wakeTime}</strong></p>
              <p>Sleep quality: <strong>{sleepQuality}/10</strong> {getSleepQualityEmoji(sleepQuality)}</p>
              <p>Morning energy: <strong>{morningEnergy}/10</strong> {getEnergyEmoji(morningEnergy)}</p>
              <p>Time to fall asleep: <strong>{timeToFallAsleep} minutes</strong></p>
              <p>Night wakings: <strong>{nightTimeWakeups} per night</strong></p>
            </div>
          </div>

          <Separator />

          {/* Challenges Summary */}
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Brain className="h-4 w-4 text-purple-500" />
              Sleep Challenges
            </h4>
            <div className="flex flex-wrap gap-1">
              {sleepChallenges.map(challenge => (
                <Badge key={challenge} variant="secondary" className="text-xs">
                  {SLEEP_CHALLENGES.find(c => c.value === challenge)?.emoji}
                  {SLEEP_CHALLENGES.find(c => c.value === challenge)?.label}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Routine Summary */}
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Moon className="h-4 w-4 text-indigo-500" />
              Current Routine & Aids
            </h4>
            <div className="space-y-2">
              <div>
                <p className="text-sm font-medium">Wind-down activities:</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {windDownRoutine.map(activity => (
                    <Badge key={activity} variant="outline" className="text-xs">
                      {WIND_DOWN_ACTIVITIES.find(a => a.value === activity)?.emoji}
                      {WIND_DOWN_ACTIVITIES.find(a => a.value === activity)?.label}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium">Sleep aids:</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {currentSleepAids.map(aid => (
                    <Badge key={aid} variant="outline" className="text-xs">
                      {SLEEP_AIDS.find(a => a.value === aid)?.emoji}
                      {SLEEP_AIDS.find(a => a.value === aid)?.label}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Breathing Summary */}
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Wind className="h-4 w-4 text-green-500" />
              Breathing Integration
            </h4>
            <div className="text-sm space-y-1">
              <p>
                Interested in sleep breathing: <strong>{interestedInSleepBreathing ? 'Yes' : 'No'}</strong>
              </p>
              {interestedInSleepBreathing && sleepGoals.length > 0 && (
                <div>
                  <p className="font-medium">Sleep goals:</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {sleepGoals.map(goal => (
                      <Badge key={goal} variant="default" className="text-xs">
                        {SLEEP_GOALS.find(g => g.value === goal)?.emoji}
                        {SLEEP_GOALS.find(g => g.value === goal)?.label}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Moon className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Sleep Assessment</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Help us understand your sleep patterns and create personalized breathing recommendations
        </p>
      </div>

      {/* Progress */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{steps[currentStep]}</span>
              <span>{currentStepIndex + 1} of {stepOrder.length}</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      {currentStep === 'schedule' && renderSchedule()}
      {currentStep === 'quality' && renderQuality()}
      {currentStep === 'challenges' && renderChallenges()}
      {currentStep === 'routine' && renderRoutine()}
      {currentStep === 'breathing' && renderBreathing()}
      {currentStep === 'review' && renderReview()}

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStepIndex === 0}
        >
          Previous
        </Button>

        <div className="flex gap-2">
          {currentStep === 'review' ? (
            <Button onClick={handleComplete} className="bg-green-600 hover:bg-green-700">
              <CheckCircle className="h-4 w-4 mr-2" />
              Complete Assessment
            </Button>
          ) : (
            <Button onClick={handleNext}>
              Next
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};