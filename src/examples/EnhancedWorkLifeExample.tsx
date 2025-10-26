import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { EnhancedWorkLifeSettings } from '@/components/work-life-balance/EnhancedWorkLifeSettings';
import { SmartBreathingWidget } from '@/components/work-life-balance/SmartBreathingWidget';
import { WellnessAssessment } from '@/components/wellness/WellnessAssessment';
import { Code, FileText, Zap, Heart, Activity } from 'lucide-react';

/**
 * Example component demonstrating the enhanced work-life balance data structure
 *
 * This shows the evolution from:
 * - Basic work schedule data
 * - To contextual breathing technique integration
 */
export const EnhancedWorkLifeExample: React.FC = () => {
  // Example of the current data structure
  const currentStructure = {
    workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    workingHours: { start: '09:00', end: '17:00' },
    lunchBreak: { duration: 60, time: '12:00' }
  };

  // Example of the enhanced data structure with wellness assessment
  const enhancedStructure = {
    // Existing core structure (unchanged)
    workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    workingHours: { start: '09:00', end: '17:00' },
    lunchBreak: { duration: 60, time: '12:00' },

    // Work context (from previous implementation)
    workStressors: ['deadlines', 'meetings', 'multitasking', 'interruptions'],
    stressfulTimes: ['morning-rush', 'pre-meetings', 'end-of-day'],
    currentCopingMethods: ['coffee', 'short-walks', 'deep-breaths'],
    preferredBreakLength: '2-minutes',

    // Work environment context
    workEnvironment: 'hybrid',
    energyPatterns: {
      morningEnergy: 'low',
      afternoonDip: true,
      eveningEnergy: 'medium'
    },
    breathingPreferences: {
      preferredTechniques: ['box-breathing', 'coherent-breathing', 'four-seven-eight'],
      guidedVsUnguided: 'guided',
      backgroundSounds: true,
      voicePreference: 'female'
    },

    // NEW: Health and wellness assessment
    stressAssessment: {
      currentStressLevel: 7,
      stressFrequency: 'daily',
      physicalStressSymptoms: ['tension', 'headaches', 'fatigue', 'shallow-breathing'],
      assessmentDate: '2024-01-15T10:00:00Z'
    },
    breathingAwareness: {
      breathingAwareness: 'sometimes-notice',
      breathingIssues: ['shallow', 'irregular', 'breath-holding'],
      previousBreathingExperience: 'beginner',
      assessmentDate: '2024-01-15T10:00:00Z'
    },
    wellnessGoals: {
      primaryGoals: ['reduce-stress', 'improve-focus', 'better-sleep'],
      secondaryGoals: ['increase-energy', 'anxiety-management'],
      timeframe: 'medium-term',
      motivationLevel: 'motivated',
      goalSetDate: '2024-01-15T10:00:00Z'
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Enhanced Work-Life Balance</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          From basic work schedules to intelligent breathing recommendations based on
          personal stress patterns and workplace context.
        </p>
      </div>

      {/* Data Structure Comparison */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Current Structure */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-gray-500" />
              <CardTitle className="text-lg">Current Data Structure</CardTitle>
            </div>
            <CardDescription>Basic work schedule information</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-gray-50 p-3 rounded border overflow-x-auto">
{JSON.stringify(currentStructure, null, 2)}
            </pre>
            <div className="mt-3 space-y-2">
              <Badge variant="outline">Work Schedule</Badge>
              <Badge variant="outline">Break Times</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Structure */}
        <Card className="border-primary/50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Enhanced Data Structure</CardTitle>
            </div>
            <CardDescription>
              Context-aware breathing integration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-primary/5 p-3 rounded border overflow-x-auto">
{JSON.stringify(enhancedStructure, null, 2)}
            </pre>
            <div className="mt-3 space-y-2">
              <div className="flex flex-wrap gap-1">
                <Badge>Work Schedule</Badge>
                <Badge>Stress Context</Badge>
                <Badge>Breathing Preferences</Badge>
                <Badge>Energy Patterns</Badge>
                <Badge>Health Assessment</Badge>
                <Badge>Wellness Goals</Badge>
                <Badge>Personalization</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Key Enhancements */}
      <Card>
        <CardHeader>
          <CardTitle>Key Enhancements</CardTitle>
          <CardDescription>
            What the enhanced structure enables
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <h4 className="font-semibold text-primary">Stress Context</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Identifies work stressors</li>
                <li>• Maps stressful time patterns</li>
                <li>• Tracks current coping methods</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-primary">Health Assessment</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Stress level tracking (1-10 scale)</li>
                <li>• Physical symptom monitoring</li>
                <li>• Breathing pattern analysis</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-primary">Goal-Based AI</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Personalized wellness goals</li>
                <li>• Context-aware recommendations</li>
                <li>• Progress-driven adaptations</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-primary">Learning System</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Effectiveness tracking</li>
                <li>• Preference learning</li>
                <li>• Continuous improvement</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Live Demo Components */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Live Demo Components</h2>
          <p className="text-muted-foreground">
            Interactive examples of the enhanced work-life balance system
          </p>
        </div>

        {/* Smart Breathing Widget */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Smart Breathing Widget</h3>
            <SmartBreathingWidget
              onStartSession={(recommendation) => {
                console.log('Started session:', recommendation);
              }}
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Features Demonstrated</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <strong>Time-based recommendations:</strong> Different techniques suggested based on time of day and energy patterns
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <strong>Context-aware prioritization:</strong> Higher priority for stressful times and detected stressors
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <strong>Personalized duration:</strong> Respects user's preferred break length settings
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <strong>Learning from feedback:</strong> Adapts recommendations based on session effectiveness
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Wellness Assessment */}
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            Comprehensive Wellness Assessment
          </h3>
          <p className="text-muted-foreground mb-4">
            Complete health and wellness assessment to enable personalized breathing recommendations based on stress levels, breathing patterns, and personal goals.
          </p>

          <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200 mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Assessment Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl mb-2">😰 → 😌</div>
                  <h4 className="font-semibold">Stress Assessment</h4>
                  <p className="text-sm text-muted-foreground">1-10 stress scale with physical symptom tracking</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">💨</div>
                  <h4 className="font-semibold">Breathing Analysis</h4>
                  <p className="text-sm text-muted-foreground">Awareness levels and breathing pattern issues</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">🎯</div>
                  <h4 className="font-semibold">Goal Setting</h4>
                  <p className="text-sm text-muted-foreground">Primary and secondary wellness objectives</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <WellnessAssessment
            onComplete={(assessment) => {
              console.log('Assessment completed:', assessment);
              // In a real app, this would save to user preferences
            }}
          />
        </div>

        <Separator />

        {/* Settings Component */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Enhanced Work-Life Settings</h3>
          <p className="text-muted-foreground mb-4">
            Configure your work stress patterns and breathing preferences for personalized recommendations.
          </p>
          <div className="max-w-4xl">
            <EnhancedWorkLifeSettings />
          </div>
        </div>
      </div>

      {/* Implementation Benefits */}
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle>Implementation Benefits</CardTitle>
          <CardDescription>
            Why this enhanced structure improves user experience
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold">For Users</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>✓ More relevant breathing technique suggestions</li>
                <li>✓ Better timing of break reminders</li>
                <li>✓ Personalized session durations</li>
                <li>✓ Continuous improvement through learning</li>
                <li>✓ Reduced cognitive load in choosing techniques</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold">For Developers</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>✓ Backward compatible with existing data</li>
                <li>✓ Type-safe enhancement structure</li>
                <li>✓ Extensible for future AI integration</li>
                <li>✓ Clear separation of concerns</li>
                <li>✓ Rich analytics and feedback loops</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Technical Implementation */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            <CardTitle>Technical Implementation</CardTitle>
          </div>
          <CardDescription>
            Key files and components in this enhancement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">New Files</h4>
              <ul className="text-sm space-y-1 text-muted-foreground font-mono">
                <li>• types/workLifeBalance.ts</li>
                <li>• utils/workLifeBalanceMigration.ts</li>
                <li>• services/BreathingRecommendationEngine.ts</li>
                <li>• components/work-life-balance/EnhancedWorkLifeSettings.tsx</li>
                <li>• components/work-life-balance/SmartBreathingWidget.tsx</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Enhanced Files</h4>
              <ul className="text-sm space-y-1 text-muted-foreground font-mono">
                <li>• context/types.ts (extended interfaces)</li>
                <li>• Existing break reminder components</li>
                <li>• User preferences system</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};