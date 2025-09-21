import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Briefcase, Brain, Heart, Clock, Zap } from 'lucide-react';
import { useUserPreferences } from '@/context';
import { toast } from 'sonner';
import {
  WorkStressor,
  StressfulTime,
  CopingMethod,
  BreakLength,
  BreathingTechnique,
  EnhancedWorkLifePreferences
} from '@/types/workLifeBalance';
import { migrateToEnhancedWorkLife } from '@/utils/workLifeBalanceMigration';

// Option definitions for the UI
const WORK_STRESSORS: Array<{ value: WorkStressor; label: string; description: string }> = [
  { value: 'deadlines', label: 'Tight Deadlines', description: 'Time-sensitive project pressure' },
  { value: 'meetings', label: 'Too Many Meetings', description: 'Back-to-back scheduled calls' },
  { value: 'multitasking', label: 'Multitasking', description: 'Juggling multiple tasks' },
  { value: 'interruptions', label: 'Frequent Interruptions', description: 'Constant distractions' },
  { value: 'email-overload', label: 'Email Overload', description: 'Overwhelming inbox' },
  { value: 'difficult-conversations', label: 'Difficult Conversations', description: 'Challenging interactions' },
  { value: 'technical-issues', label: 'Technical Problems', description: 'System or tool failures' },
  { value: 'workload', label: 'Heavy Workload', description: 'Too much to accomplish' },
  { value: 'uncertainty', label: 'Uncertainty', description: 'Unclear expectations or changes' },
  { value: 'presentations', label: 'Presentations', description: 'Public speaking anxiety' },
];

const STRESSFUL_TIMES: Array<{ value: StressfulTime; label: string; description: string }> = [
  { value: 'morning-rush', label: 'Morning Rush', description: 'Getting started for the day' },
  { value: 'pre-meetings', label: 'Before Meetings', description: 'Anticipation anxiety' },
  { value: 'mid-morning', label: 'Mid-Morning', description: '10-11 AM energy dip' },
  { value: 'pre-lunch', label: 'Before Lunch', description: 'Pre-break pressure' },
  { value: 'post-lunch', label: 'After Lunch', description: 'Afternoon fatigue' },
  { value: 'mid-afternoon', label: 'Mid-Afternoon', description: '2-4 PM slump' },
  { value: 'end-of-day', label: 'End of Day', description: 'Wrapping up tasks' },
  { value: 'monday-mornings', label: 'Monday Mornings', description: 'Week startup stress' },
];

const COPING_METHODS: Array<{ value: CopingMethod; label: string; description: string }> = [
  { value: 'coffee', label: 'Coffee/Caffeine', description: 'Energy boost from drinks' },
  { value: 'short-walks', label: 'Short Walks', description: 'Quick movement breaks' },
  { value: 'deep-breaths', label: 'Deep Breathing', description: 'Simple breathing exercises' },
  { value: 'social-chat', label: 'Social Chat', description: 'Talking with colleagues' },
  { value: 'music', label: 'Music', description: 'Listening to calming sounds' },
  { value: 'stretching', label: 'Stretching', description: 'Physical tension relief' },
  { value: 'meditation', label: 'Meditation', description: 'Mindfulness practice' },
  { value: 'fresh-air', label: 'Fresh Air', description: 'Stepping outside' },
  { value: 'none', label: 'None Currently', description: 'No specific coping strategy' },
];

const BREAK_LENGTHS: Array<{ value: BreakLength; label: string; description: string }> = [
  { value: '1-minute', label: '1 Minute', description: 'Quick reset breath' },
  { value: '2-minutes', label: '2 Minutes', description: 'Standard micro-break' },
  { value: '5-minutes', label: '5 Minutes', description: 'Extended breathing session' },
  { value: '10-minutes', label: '10 Minutes', description: 'Deep relaxation' },
  { value: 'flexible', label: 'Flexible', description: 'Adapt to situation' },
];

const BREATHING_TECHNIQUES: Array<{ value: BreathingTechnique; label: string; description: string }> = [
  { value: 'box-breathing', label: 'Box Breathing', description: '4-4-4-4 pattern for focus' },
  { value: 'coherent-breathing', label: 'Coherent Breathing', description: '5-5 rhythm for balance' },
  { value: 'belly-breathing', label: 'Belly Breathing', description: 'Diaphragmatic breathing' },
  { value: 'four-seven-eight', label: '4-7-8 Breathing', description: 'Calming exhale focus' },
  { value: 'quick-coherence', label: 'Quick Coherence', description: 'HeartMath technique' },
  { value: 'physiological-sigh', label: 'Physiological Sigh', description: 'Double inhale + long exhale' },
];

export const EnhancedWorkLifeSettings: React.FC = () => {
  const { preferences, updatePreferences } = useUserPreferences();
  const [enhancedPrefs, setEnhancedPrefs] = useState<EnhancedWorkLifePreferences | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Migrate existing preferences to enhanced structure
    const migrated = migrateToEnhancedWorkLife(preferences);
    setEnhancedPrefs(migrated);
  }, [preferences]);

  const handleUpdateStressors = (stressors: WorkStressor[]) => {
    if (!enhancedPrefs) return;
    setEnhancedPrefs({
      ...enhancedPrefs,
      workStressors: stressors,
    });
  };

  const handleUpdateStressfulTimes = (times: StressfulTime[]) => {
    if (!enhancedPrefs) return;
    setEnhancedPrefs({
      ...enhancedPrefs,
      stressfulTimes: times,
    });
  };

  const handleUpdateCopingMethods = (methods: CopingMethod[]) => {
    if (!enhancedPrefs) return;
    setEnhancedPrefs({
      ...enhancedPrefs,
      currentCopingMethods: methods,
    });
  };

  const handleUpdateBreakLength = (length: BreakLength) => {
    if (!enhancedPrefs) return;
    setEnhancedPrefs({
      ...enhancedPrefs,
      preferredBreakLength: length,
    });
  };

  const handleUpdateBreathingTechniques = (techniques: BreathingTechnique[]) => {
    if (!enhancedPrefs) return;
    setEnhancedPrefs({
      ...enhancedPrefs,
      breathingPreferences: {
        ...enhancedPrefs.breathingPreferences!,
        preferredTechniques: techniques,
      },
    });
  };

  const handleSave = async () => {
    if (!enhancedPrefs) return;

    setIsLoading(true);
    try {
      // Convert enhanced preferences back to user preferences format
      await updatePreferences({
        workStressors: enhancedPrefs.workStressors,
        stressfulTimes: enhancedPrefs.stressfulTimes,
        currentCopingMethods: enhancedPrefs.currentCopingMethods,
        preferredBreakLength: enhancedPrefs.preferredBreakLength,
        breathingPreferences: enhancedPrefs.breathingPreferences,
        energyPatterns: enhancedPrefs.energyPatterns,
        workEnvironment: enhancedPrefs.workEnvironment,
        stressLevel: enhancedPrefs.stressLevel,
      });

      toast.success('Work-life balance preferences updated', {
        description: 'Your breathing reminders will now be more personalized',
      });
    } catch (error) {
      toast.error('Failed to save preferences', {
        description: 'Please try again or contact support if the issue persists',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!enhancedPrefs) {
    return <div>Loading preferences...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Work Stressors */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-primary" />
            <CardTitle>Work Stressors</CardTitle>
          </div>
          <CardDescription>
            What situations at work typically cause you stress? This helps us recommend the right breathing techniques.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {WORK_STRESSORS.map((stressor) => (
              <div key={stressor.value} className="flex items-start space-x-2">
                <Checkbox
                  id={stressor.value}
                  checked={enhancedPrefs.workStressors.includes(stressor.value)}
                  onCheckedChange={(checked) => {
                    const current = enhancedPrefs.workStressors;
                    if (checked) {
                      handleUpdateStressors([...current, stressor.value]);
                    } else {
                      handleUpdateStressors(current.filter(s => s !== stressor.value));
                    }
                  }}
                />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor={stressor.value} className="text-sm font-medium">
                    {stressor.label}
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {stressor.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Stressful Times */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            <CardTitle>Peak Stress Times</CardTitle>
          </div>
          <CardDescription>
            When during your workday do you typically feel most stressed?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {STRESSFUL_TIMES.map((time) => (
              <div key={time.value} className="flex items-start space-x-2">
                <Checkbox
                  id={time.value}
                  checked={enhancedPrefs.stressfulTimes.includes(time.value)}
                  onCheckedChange={(checked) => {
                    const current = enhancedPrefs.stressfulTimes;
                    if (checked) {
                      handleUpdateStressfulTimes([...current, time.value]);
                    } else {
                      handleUpdateStressfulTimes(current.filter(t => t !== time.value));
                    }
                  }}
                />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor={time.value} className="text-sm font-medium">
                    {time.label}
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {time.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Current Coping Methods */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            <CardTitle>Current Coping Methods</CardTitle>
          </div>
          <CardDescription>
            How do you currently handle work stress? This helps us understand your preferences.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {COPING_METHODS.map((method) => (
              <div key={method.value} className="flex items-start space-x-2">
                <Checkbox
                  id={method.value}
                  checked={enhancedPrefs.currentCopingMethods.includes(method.value)}
                  onCheckedChange={(checked) => {
                    const current = enhancedPrefs.currentCopingMethods;
                    if (checked) {
                      handleUpdateCopingMethods([...current, method.value]);
                    } else {
                      handleUpdateCopingMethods(current.filter(m => m !== method.value));
                    }
                  }}
                />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor={method.value} className="text-sm font-medium">
                    {method.label}
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {method.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Break Preferences */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            <CardTitle>Break Preferences</CardTitle>
          </div>
          <CardDescription>
            How long should your typical breathing breaks be?
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select
            value={enhancedPrefs.preferredBreakLength}
            onValueChange={(value: BreakLength) => handleUpdateBreakLength(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select preferred break length" />
            </SelectTrigger>
            <SelectContent>
              {BREAK_LENGTHS.map((length) => (
                <SelectItem key={length.value} value={length.value}>
                  <div>
                    <div className="font-medium">{length.label}</div>
                    <div className="text-xs text-muted-foreground">{length.description}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Separator />

          <div>
            <Label className="text-sm font-medium mb-3 block">Preferred Breathing Techniques</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {BREATHING_TECHNIQUES.map((technique) => (
                <div key={technique.value} className="flex items-start space-x-2">
                  <Checkbox
                    id={technique.value}
                    checked={enhancedPrefs.breathingPreferences?.preferredTechniques.includes(technique.value) || false}
                    onCheckedChange={(checked) => {
                      const current = enhancedPrefs.breathingPreferences?.preferredTechniques || [];
                      if (checked) {
                        handleUpdateBreathingTechniques([...current, technique.value]);
                      } else {
                        handleUpdateBreathingTechniques(current.filter(t => t !== technique.value));
                      }
                    }}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label htmlFor={technique.value} className="text-sm font-medium">
                      {technique.label}
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      {technique.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            <CardTitle>Personalization Summary</CardTitle>
          </div>
          <CardDescription>
            Based on your selections, we'll provide smart breathing recommendations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <Label className="text-sm font-medium">Main Stressors:</Label>
              <div className="flex flex-wrap gap-1 mt-1">
                {enhancedPrefs.workStressors.map((stressor) => (
                  <Badge key={stressor} variant="secondary" className="text-xs">
                    {WORK_STRESSORS.find(s => s.value === stressor)?.label}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Stress Peak Times:</Label>
              <div className="flex flex-wrap gap-1 mt-1">
                {enhancedPrefs.stressfulTimes.map((time) => (
                  <Badge key={time} variant="outline" className="text-xs">
                    {STRESSFUL_TIMES.find(t => t.value === time)?.label}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Preferred Break Length:</Label>
              <Badge className="ml-2 text-xs">
                {BREAK_LENGTHS.find(l => l.value === enhancedPrefs.preferredBreakLength)?.label}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Preferences'}
        </Button>
      </div>
    </div>
  );
};