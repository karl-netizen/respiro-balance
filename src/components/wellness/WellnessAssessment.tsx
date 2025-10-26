import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Heart,
  Target,
  CheckCircle,
  Stethoscope,
  Wind
} from 'lucide-react';
import {
  StressAssessment,
  BreathingAwareness,
  WellnessGoals,
  StressFrequency,
  PhysicalStressSymptom,
  BreathingAwarenessLevel,
  BreathingIssue,
  ExperienceLevel,
  WellnessGoal,
  GoalTimeframe,
  MotivationLevel
} from '@/types/workLifeBalance';

interface WellnessAssessmentProps {
  onComplete: (assessment: {
    stressAssessment: StressAssessment;
    breathingAwareness: BreathingAwareness;
    wellnessGoals: WellnessGoals;
  }) => void;
  initialData?: {
    stressAssessment?: Partial<StressAssessment>;
    breathingAwareness?: Partial<BreathingAwareness>;
    wellnessGoals?: Partial<WellnessGoals>;
  };
}

type AssessmentStep = 'stress' | 'breathing' | 'goals' | 'review';

// Option definitions
const STRESS_FREQUENCIES: Array<{ value: StressFrequency; label: string; description: string }> = [
  { value: 'rarely', label: 'Rarely', description: 'Once a month or less' },
  { value: 'weekly', label: 'Weekly', description: 'A few times per month' },
  { value: 'daily', label: 'Daily', description: 'Most days of the week' },
  { value: 'constantly', label: 'Constantly', description: 'Throughout the day' },
];

const PHYSICAL_SYMPTOMS: Array<{ value: PhysicalStressSymptom; label: string; emoji: string }> = [
  { value: 'tension', label: 'Muscle tension (neck, shoulders)', emoji: '😤' },
  { value: 'headaches', label: 'Tension headaches', emoji: '🤕' },
  { value: 'fatigue', label: 'Feeling tired or drained', emoji: '😴' },
  { value: 'shallow-breathing', label: 'Shallow or restricted breathing', emoji: '💨' },
  { value: 'digestive-issues', label: 'Stomach problems, appetite changes', emoji: '🤢' },
  { value: 'sleep-problems', label: 'Trouble sleeping', emoji: '😵‍💫' },
  { value: 'heart-racing', label: 'Racing heart, palpitations', emoji: '💓' },
  { value: 'sweating', label: 'Stress-related sweating', emoji: '💦' },
  { value: 'restlessness', label: 'Feeling fidgety, can\'t sit still', emoji: '😰' },
  { value: 'none', label: 'None of these', emoji: '✅' },
];

const BREATHING_AWARENESS_LEVELS: Array<{ value: BreathingAwarenessLevel; label: string; description: string }> = [
  { value: 'never-think-about', label: 'Never think about it', description: 'Rarely conscious of breathing' },
  { value: 'sometimes-notice', label: 'Sometimes notice', description: 'Occasionally aware of breath patterns' },
  { value: 'often-aware', label: 'Often aware', description: 'Frequently notice breathing' },
  { value: 'very-aware', label: 'Very aware', description: 'Highly conscious of breathing patterns' },
];

const BREATHING_ISSUES: Array<{ value: BreathingIssue; label: string; description: string }> = [
  { value: 'shallow', label: 'Shallow breathing', description: 'Breathing feels too shallow or only in chest' },
  { value: 'irregular', label: 'Irregular rhythm', description: 'Breathing rhythm is inconsistent' },
  { value: 'breath-holding', label: 'Breath holding', description: 'Tendency to hold breath during stress/focus' },
  { value: 'rapid', label: 'Too fast', description: 'Breathing too fast, feeling breathless' },
  { value: 'effortful', label: 'Feels effortful', description: 'Breathing feels like work or forced' },
  { value: 'mouth-breathing', label: 'Mouth breathing', description: 'Primarily breathing through mouth' },
  { value: 'unsatisfying', label: 'Unsatisfying', description: 'Breathing doesn\'t feel fulfilling' },
  { value: 'none', label: 'No issues', description: 'No specific breathing problems noticed' },
];

const EXPERIENCE_LEVELS: Array<{ value: ExperienceLevel; label: string; description: string }> = [
  { value: 'beginner', label: 'Beginner', description: 'Little to no experience with breathing techniques' },
  { value: 'some-experience', label: 'Some experience', description: 'Tried breathing exercises occasionally' },
  { value: 'experienced', label: 'Experienced', description: 'Regular practice with breathing techniques' },
];

const WELLNESS_GOALS: Array<{ value: WellnessGoal; label: string; category: string; emoji: string }> = [
  { value: 'reduce-stress', label: 'Reduce stress', category: 'Mental Health', emoji: '😌' },
  { value: 'anxiety-management', label: 'Manage anxiety', category: 'Mental Health', emoji: '🧘‍♀️' },
  { value: 'improve-focus', label: 'Improve focus', category: 'Cognitive', emoji: '🎯' },
  { value: 'cognitive-enhancement', label: 'Enhance mental clarity', category: 'Cognitive', emoji: '🧠' },
  { value: 'better-sleep', label: 'Better sleep', category: 'Recovery', emoji: '😴' },
  { value: 'increase-energy', label: 'Increase energy', category: 'Vitality', emoji: '⚡' },
  { value: 'pain-relief', label: 'Pain relief', category: 'Physical Health', emoji: '💊' },
  { value: 'blood-pressure', label: 'Manage blood pressure', category: 'Physical Health', emoji: '❤️' },
  { value: 'athletic-performance', label: 'Athletic performance', category: 'Performance', emoji: '🏃‍♀️' },
  { value: 'emotional-balance', label: 'Emotional balance', category: 'Emotional', emoji: '⚖️' },
  { value: 'habit-formation', label: 'Build healthy habits', category: 'Lifestyle', emoji: '📅' },
  { value: 'general-wellness', label: 'General wellness', category: 'Overall', emoji: '🌟' },
];

const GOAL_TIMEFRAMES: Array<{ value: GoalTimeframe; label: string; description: string }> = [
  { value: 'immediate', label: 'Immediate', description: 'Results needed right away (within days)' },
  { value: 'short-term', label: 'Short-term', description: '1-4 weeks' },
  { value: 'medium-term', label: 'Medium-term', description: '1-3 months' },
  { value: 'long-term', label: 'Long-term', description: '3-12 months' },
  { value: 'lifestyle-change', label: 'Lifestyle change', description: 'Permanent habit integration' },
];

const MOTIVATION_LEVELS: Array<{ value: MotivationLevel; label: string; emoji: string }> = [
  { value: 'very-motivated', label: 'Very motivated', emoji: '🔥' },
  { value: 'motivated', label: 'Motivated', emoji: '👍' },
  { value: 'somewhat-motivated', label: 'Somewhat motivated', emoji: '🤔' },
  { value: 'low-motivation', label: 'Low motivation', emoji: '😕' },
  { value: 'variable', label: 'Varies day to day', emoji: '🌊' },
];

export const WellnessAssessment: React.FC<WellnessAssessmentProps> = ({
  onComplete,
  initialData
}) => {
  const [currentStep, setCurrentStep] = useState<AssessmentStep>('stress');
  const [stressLevel, setStressLevel] = useState(initialData?.stressAssessment?.currentStressLevel || 5);
  const [stressFrequency, setStressFrequency] = useState<StressFrequency>(
    initialData?.stressAssessment?.stressFrequency || 'weekly'
  );
  const [physicalSymptoms, setPhysicalSymptoms] = useState<PhysicalStressSymptom[]>(
    initialData?.stressAssessment?.physicalStressSymptoms || []
  );

  const [breathingAwareness, setBreathingAwareness] = useState<BreathingAwarenessLevel>(
    initialData?.breathingAwareness?.breathingAwareness || 'sometimes-notice'
  );
  const [breathingIssues, setBreathingIssues] = useState<BreathingIssue[]>(
    initialData?.breathingAwareness?.breathingIssues || []
  );
  const [experience, setExperience] = useState<ExperienceLevel>(
    initialData?.breathingAwareness?.previousBreathingExperience || 'beginner'
  );

  const [primaryGoals, setPrimaryGoals] = useState<WellnessGoal[]>(
    initialData?.wellnessGoals?.primaryGoals || []
  );
  const [secondaryGoals, setSecondaryGoals] = useState<WellnessGoal[]>(
    initialData?.wellnessGoals?.secondaryGoals || []
  );
  const [timeframe, setTimeframe] = useState<GoalTimeframe>(
    initialData?.wellnessGoals?.timeframe || 'medium-term'
  );
  const [motivation, setMotivation] = useState<MotivationLevel>('motivated');

  const steps: Record<AssessmentStep, string> = {
    stress: 'Stress Assessment',
    breathing: 'Breathing Awareness',
    goals: 'Wellness Goals',
    review: 'Review & Complete'
  };

  const stepOrder: AssessmentStep[] = ['stress', 'breathing', 'goals', 'review'];
  const currentStepIndex = stepOrder.indexOf(currentStep);
  const progress = ((currentStepIndex + 1) / stepOrder.length) * 100;

  const getStressEmoji = (level: number) => {
    if (level <= 2) return '😌';
    if (level <= 4) return '🙂';
    if (level <= 6) return '😐';
    if (level <= 8) return '😰';
    return '😫';
  };

  const handleSymptomChange = (symptom: PhysicalStressSymptom, checked: boolean) => {
    if (symptom === 'none') {
      setPhysicalSymptoms(checked ? ['none'] : []);
    } else {
      setPhysicalSymptoms(prev => {
        const filtered = prev.filter(s => s !== 'none');
        if (checked) {
          return [...filtered, symptom];
        } else {
          return filtered.filter(s => s !== symptom);
        }
      });
    }
  };

  const handleBreathingIssueChange = (issue: BreathingIssue, checked: boolean) => {
    if (issue === 'none') {
      setBreathingIssues(checked ? ['none'] : []);
    } else {
      setBreathingIssues(prev => {
        const filtered = prev.filter(i => i !== 'none');
        if (checked) {
          return [...filtered, issue];
        } else {
          return filtered.filter(i => i !== issue);
        }
      });
    }
  };

  const handleGoalChange = (goal: WellnessGoal, checked: boolean, isPrimary: boolean) => {
    if (isPrimary) {
      setPrimaryGoals(prev =>
        checked
          ? [...prev, goal].slice(0, 3) // Limit to 3 primary goals
          : prev.filter(g => g !== goal)
      );
      // Remove from secondary if added to primary
      if (checked) {
        setSecondaryGoals(prev => prev.filter(g => g !== goal));
      }
    } else {
      setSecondaryGoals(prev =>
        checked
          ? [...prev, goal].slice(0, 5) // Limit to 5 secondary goals
          : prev.filter(g => g !== goal)
      );
    }
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
    const assessment = {
      stressAssessment: {
        currentStressLevel: stressLevel,
        stressFrequency,
        physicalStressSymptoms: physicalSymptoms,
        assessmentDate: new Date().toISOString(),
      } as StressAssessment,
      breathingAwareness: {
        breathingAwareness,
        breathingIssues,
        previousBreathingExperience: experience,
        assessmentDate: new Date().toISOString(),
      } as BreathingAwareness,
      wellnessGoals: {
        primaryGoals,
        secondaryGoals,
        timeframe,
        motivationLevel: motivation,
        goalSetDate: new Date().toISOString(),
      } as WellnessGoals,
    };

    onComplete(assessment);
  };

  const renderStressAssessment = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            <CardTitle>Current Stress Level</CardTitle>
          </div>
          <CardDescription>
            How would you rate your stress level right now?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-4xl mb-2">{getStressEmoji(stressLevel)}</div>
              <div className="text-2xl font-semibold">{stressLevel}/10</div>
              <div className="text-sm text-muted-foreground">
                {stressLevel <= 3 ? 'Low stress' :
                 stressLevel <= 6 ? 'Moderate stress' : 'High stress'}
              </div>
            </div>
            <Slider
              value={[stressLevel]}
              onValueChange={(values) => setStressLevel(values[0])}
              max={10}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1 - Very calm</span>
              <span>10 - Extremely stressed</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>How often do you experience stress?</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={stressFrequency}
            onValueChange={(value) => setStressFrequency(value as StressFrequency)}
          >
            {STRESS_FREQUENCIES.map((freq) => (
              <div key={freq.value} className="flex items-center space-x-2">
                <RadioGroupItem value={freq.value} id={freq.value} />
                <Label htmlFor={freq.value} className="flex-1">
                  <div className="font-medium">{freq.label}</div>
                  <div className="text-sm text-muted-foreground">{freq.description}</div>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Physical symptoms you experience</CardTitle>
          <CardDescription>
            Select any physical symptoms you notice when stressed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {PHYSICAL_SYMPTOMS.map((symptom) => (
              <div key={symptom.value} className="flex items-start space-x-2">
                <Checkbox
                  id={symptom.value}
                  checked={physicalSymptoms.includes(symptom.value)}
                  onCheckedChange={(checked) => handleSymptomChange(symptom.value, checked as boolean)}
                />
                <Label htmlFor={symptom.value} className="text-sm">
                  <span className="mr-2">{symptom.emoji}</span>
                  {symptom.label}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderBreathingAwareness = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Wind className="h-5 w-5 text-blue-500" />
            <CardTitle>Breathing Awareness</CardTitle>
          </div>
          <CardDescription>
            How aware are you of your breathing patterns?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={breathingAwareness}
            onValueChange={(value) => setBreathingAwareness(value as BreathingAwarenessLevel)}
          >
            {BREATHING_AWARENESS_LEVELS.map((level) => (
              <div key={level.value} className="flex items-center space-x-2">
                <RadioGroupItem value={level.value} id={level.value} />
                <Label htmlFor={level.value} className="flex-1">
                  <div className="font-medium">{level.label}</div>
                  <div className="text-sm text-muted-foreground">{level.description}</div>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Breathing issues or patterns</CardTitle>
          <CardDescription>
            Do you notice any of these breathing patterns or issues?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {BREATHING_ISSUES.map((issue) => (
              <div key={issue.value} className="flex items-start space-x-2">
                <Checkbox
                  id={issue.value}
                  checked={breathingIssues.includes(issue.value)}
                  onCheckedChange={(checked) => handleBreathingIssueChange(issue.value, checked as boolean)}
                />
                <Label htmlFor={issue.value} className="text-sm">
                  <div className="font-medium">{issue.label}</div>
                  <div className="text-xs text-muted-foreground">{issue.description}</div>
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Previous breathing experience</CardTitle>
          <CardDescription>
            What's your experience with breathing techniques or exercises?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={experience}
            onValueChange={(value) => setExperience(value as ExperienceLevel)}
          >
            {EXPERIENCE_LEVELS.map((level) => (
              <div key={level.value} className="flex items-center space-x-2">
                <RadioGroupItem value={level.value} id={level.value} />
                <Label htmlFor={level.value} className="flex-1">
                  <div className="font-medium">{level.label}</div>
                  <div className="text-sm text-muted-foreground">{level.description}</div>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>
    </div>
  );

  const renderGoalsAssessment = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-green-500" />
            <CardTitle>Primary wellness goals</CardTitle>
          </div>
          <CardDescription>
            Select up to 3 main goals you want to focus on (these will be prioritized)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(
              WELLNESS_GOALS.reduce((acc, goal) => {
                acc[goal.category] = acc[goal.category] || [];
                acc[goal.category].push(goal);
                return acc;
              }, {} as Record<string, typeof WELLNESS_GOALS>)
            ).map(([category, goals]) => (
              <div key={category}>
                <h4 className="font-medium text-sm mb-2 text-muted-foreground">{category}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {goals.map((goal) => (
                    <div key={goal.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`primary-${goal.value}`}
                        checked={primaryGoals.includes(goal.value)}
                        onCheckedChange={(checked) => handleGoalChange(goal.value, checked as boolean, true)}
                        disabled={!primaryGoals.includes(goal.value) && primaryGoals.length >= 3}
                      />
                      <Label htmlFor={`primary-${goal.value}`} className="text-sm">
                        <span className="mr-2">{goal.emoji}</span>
                        {goal.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {primaryGoals.length >= 3 && (
            <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-md">
              <p className="text-sm text-amber-700">
                You've selected the maximum of 3 primary goals. Uncheck one to select another.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Secondary goals (optional)</CardTitle>
          <CardDescription>
            Additional goals you're interested in but with lower priority
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {WELLNESS_GOALS.filter(goal => !primaryGoals.includes(goal.value)).map((goal) => (
              <div key={goal.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`secondary-${goal.value}`}
                  checked={secondaryGoals.includes(goal.value)}
                  onCheckedChange={(checked) => handleGoalChange(goal.value, checked as boolean, false)}
                  disabled={!secondaryGoals.includes(goal.value) && secondaryGoals.length >= 5}
                />
                <Label htmlFor={`secondary-${goal.value}`} className="text-sm">
                  <span className="mr-2">{goal.emoji}</span>
                  {goal.label}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Timeline for results</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={timeframe}
              onValueChange={(value) => setTimeframe(value as GoalTimeframe)}
            >
              {GOAL_TIMEFRAMES.map((tf) => (
                <div key={tf.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={tf.value} id={tf.value} />
                  <Label htmlFor={tf.value} className="flex-1">
                    <div className="font-medium">{tf.label}</div>
                    <div className="text-xs text-muted-foreground">{tf.description}</div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Motivation level</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={motivation}
              onValueChange={(value) => setMotivation(value as MotivationLevel)}
            >
              {MOTIVATION_LEVELS.map((level) => (
                <div key={level.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={level.value} id={level.value} />
                  <Label htmlFor={level.value} className="flex-1">
                    <span className="mr-2">{level.emoji}</span>
                    {level.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderReview = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <CardTitle>Assessment Summary</CardTitle>
          </div>
          <CardDescription>
            Review your responses before completing the assessment
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Stress Summary */}
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Heart className="h-4 w-4 text-red-500" />
              Stress Assessment
            </h4>
            <div className="text-sm space-y-1">
              <p>Current stress level: <strong>{stressLevel}/10</strong> {getStressEmoji(stressLevel)}</p>
              <p>Frequency: <strong>{STRESS_FREQUENCIES.find(f => f.value === stressFrequency)?.label}</strong></p>
              <div>
                <p>Physical symptoms:</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {physicalSymptoms.map(symptom => (
                    <Badge key={symptom} variant="secondary" className="text-xs">
                      {PHYSICAL_SYMPTOMS.find(s => s.value === symptom)?.label}
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
              <Wind className="h-4 w-4 text-blue-500" />
              Breathing Awareness
            </h4>
            <div className="text-sm space-y-1">
              <p>Awareness level: <strong>{BREATHING_AWARENESS_LEVELS.find(l => l.value === breathingAwareness)?.label}</strong></p>
              <p>Experience: <strong>{EXPERIENCE_LEVELS.find(e => e.value === experience)?.label}</strong></p>
              <div>
                <p>Breathing patterns/issues:</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {breathingIssues.map(issue => (
                    <Badge key={issue} variant="secondary" className="text-xs">
                      {BREATHING_ISSUES.find(i => i.value === issue)?.label}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Goals Summary */}
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Target className="h-4 w-4 text-green-500" />
              Wellness Goals
            </h4>
            <div className="text-sm space-y-2">
              <div>
                <p className="font-medium">Primary goals:</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {primaryGoals.map(goal => (
                    <Badge key={goal} variant="default" className="text-xs">
                      {WELLNESS_GOALS.find(g => g.value === goal)?.emoji}
                      {WELLNESS_GOALS.find(g => g.value === goal)?.label}
                    </Badge>
                  ))}
                </div>
              </div>
              {secondaryGoals.length > 0 && (
                <div>
                  <p className="font-medium">Secondary goals:</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {secondaryGoals.map(goal => (
                      <Badge key={goal} variant="outline" className="text-xs">
                        {WELLNESS_GOALS.find(g => g.value === goal)?.emoji}
                        {WELLNESS_GOALS.find(g => g.value === goal)?.label}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              <p>Timeline: <strong>{GOAL_TIMEFRAMES.find(t => t.value === timeframe)?.label}</strong></p>
              <p>Motivation: <strong>{MOTIVATION_LEVELS.find(m => m.value === motivation)?.label}</strong></p>
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
          <Stethoscope className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Wellness Assessment</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Help us personalize your breathing recommendations
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
      {currentStep === 'stress' && renderStressAssessment()}
      {currentStep === 'breathing' && renderBreathingAwareness()}
      {currentStep === 'goals' && renderGoalsAssessment()}
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