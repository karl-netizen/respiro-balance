import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Activity,
  Heart,
  Moon,
  Wind,
  TrendingUp,
  Target,
  Zap,
  Brain,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

import { WellnessDashboard, WellnessProfile } from '@/components/wellness/WellnessDashboard';

/**
 * Example demonstrating the integrated wellness system
 *
 * This shows how the general wellness assessment and sleep assessment
 * work together to provide comprehensive, personalized breathing recommendations
 */
export const IntegratedWellnessExample: React.FC = () => {
  const [currentProfile, setCurrentProfile] = useState<WellnessProfile | undefined>(undefined);
  const [showDashboard, setShowDashboard] = useState(false);

  // Example of a complete wellness profile
  const exampleProfile: WellnessProfile = {
    stressAssessment: {
      currentStressLevel: 7,
      stressFrequency: 'daily',
      physicalStressSymptoms: ['tension', 'headaches', 'shallow-breathing'],
      assessmentDate: '2024-01-15T10:00:00Z'
    },
    breathingAwareness: {
      breathingAwareness: 'sometimes-notice',
      breathingIssues: ['shallow', 'breath-holding'],
      previousBreathingExperience: 'beginner',
      assessmentDate: '2024-01-15T10:00:00Z'
    },
    wellnessGoals: {
      primaryGoals: ['reduce-stress', 'better-sleep', 'improve-focus'],
      secondaryGoals: ['increase-energy'],
      timeframe: 'medium-term',
      motivationLevel: 'motivated',
      goalSetDate: '2024-01-15T10:00:00Z'
    },
    sleepRecovery: {
      bedtime: '22:30',
      wakeTime: '07:00',
      sleepQuality: 5,
      sleepChallenges: ['falling-asleep', 'racing-thoughts', 'physical-tension'],
      windDownRoutine: ['reading', 'breathing-exercises', 'dim-lighting'],
      morningEnergy: 4,
      interestedInSleepBreathing: true,
      currentSleepAids: ['none'],
      timeToFallAsleep: 35,
      nightTimeWakeups: 2,
      sleepGoals: ['fall-asleep-faster', 'sleep-through-night', 'wake-refreshed'],
      lastSleepAssessment: '2024-01-15T10:00:00Z'
    },
    sleepWellnessIntegration: {
      relatedWellnessGoals: ['reduce-stress', 'better-sleep', 'improve-focus'],
      sleepImpactOnStress: 0.8,
      sleepImpactOnFocus: 0.7,
      sleepImpactOnEnergy: 0.9,
      sleepImpactOnMood: 0.7,
      recommendSleepForStressGoal: true,
      recommendSleepForFocusGoal: true,
      recommendSleepForEnergyGoal: false,
      trackSleepInWellnessAssessment: true,
      includeSleepInDailyCheck: true,
      prioritizeSleepBasedOnGoals: true
    },
    lastUpdated: '2024-01-15T10:00:00Z',
    completedAssessments: ['general', 'sleep']
  };

  const handleProfileUpdate = (newProfile: WellnessProfile) => {
    setCurrentProfile(newProfile);
    console.log('Profile updated:', newProfile);
  };

  const loadExampleProfile = () => {
    setCurrentProfile(exampleProfile);
  };

  if (showDashboard) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => setShowDashboard(false)}>
            ← Back to Example
          </Button>
          <Badge variant="secondary">Live Dashboard</Badge>
        </div>
        <WellnessDashboard
          profile={currentProfile}
          onProfileUpdate={handleProfileUpdate}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Integrated Wellness System</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          A comprehensive wellness platform that combines general health assessment with sleep analysis
          to provide personalized breathing recommendations tailored to your unique needs and goals.
        </p>
      </div>

      {/* System Overview */}
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-primary" />
            How the Integrated System Works
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <Heart className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="font-semibold">1. General Wellness Assessment</h3>
              <p className="text-sm text-muted-foreground">
                Evaluate stress levels, breathing awareness, and wellness goals to understand your baseline health
              </p>
            </div>

            <div className="flex items-center justify-center">
              <ArrowRight className="h-6 w-6 text-muted-foreground" />
            </div>

            {/* Step 2 */}
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto">
                <Moon className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="font-semibold">2. Sleep & Recovery Assessment</h3>
              <p className="text-sm text-muted-foreground">
                Analyze sleep patterns, quality, and challenges to identify opportunities for improvement
              </p>
            </div>

            <div className="col-span-3 flex items-center justify-center">
              <ArrowRight className="h-6 w-6 text-muted-foreground rotate-90" />
            </div>

            {/* Step 3 */}
            <div className="col-span-3 text-center space-y-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Wind className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold">3. Integrated Breathing Recommendations</h3>
              <p className="text-sm text-muted-foreground">
                Receive personalized breathing techniques that address both your wellness goals and sleep challenges
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Features */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <Brain className="h-8 w-8 text-purple-500" />
              <h3 className="font-semibold">Smart Integration</h3>
              <p className="text-sm text-muted-foreground">
                Connects sleep quality with stress levels and wellness goals for holistic recommendations
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <Target className="h-8 w-8 text-green-500" />
              <h3 className="font-semibold">Goal-Driven</h3>
              <p className="text-sm text-muted-foreground">
                Prioritizes breathing techniques based on your primary wellness objectives
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <TrendingUp className="h-8 w-8 text-blue-500" />
              <h3 className="font-semibold">Progress Tracking</h3>
              <p className="text-sm text-muted-foreground">
                Monitors improvements across both general wellness and sleep metrics
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <Zap className="h-8 w-8 text-yellow-500" />
              <h3 className="font-semibold">Context-Aware</h3>
              <p className="text-sm text-muted-foreground">
                Suggests different techniques for daytime stress vs. nighttime sleep preparation
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Integration Benefits */}
      <Card>
        <CardHeader>
          <CardTitle>Integration Benefits</CardTitle>
          <CardDescription>
            What happens when your wellness and sleep data work together
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-green-600 mb-3">Enhanced Recommendations</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Breathing techniques optimized for both stress reduction AND sleep improvement</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Time-specific recommendations (energizing for morning, calming for evening)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Correlation insights between sleep quality and stress levels</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-blue-600 mb-3">Intelligent Prioritization</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span>Sleep-focused techniques when poor sleep affects your primary goals</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span>Stress management priority when high stress disrupts sleep</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span>Energy optimization when both sleep and stress are affecting vitality</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Example Profile */}
      <Card className="border-amber-200 bg-amber-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-amber-600" />
            Example: Complete Wellness Profile
          </CardTitle>
          <CardDescription>
            See how a comprehensive profile creates personalized recommendations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <h5 className="font-medium text-amber-800 mb-2">General Wellness</h5>
              <ul className="space-y-1 text-amber-700">
                <li>• Stress level: 7/10 (high)</li>
                <li>• Daily stress frequency</li>
                <li>• Physical symptoms: tension, headaches</li>
                <li>• Goals: reduce stress, better sleep</li>
              </ul>
            </div>
            <div>
              <h5 className="font-medium text-amber-800 mb-2">Sleep Assessment</h5>
              <ul className="space-y-1 text-amber-700">
                <li>• Sleep quality: 5/10 (fair)</li>
                <li>• Morning energy: 4/10 (low)</li>
                <li>• Challenges: falling asleep, racing thoughts</li>
                <li>• Takes 35 min to fall asleep</li>
              </ul>
            </div>
            <div>
              <h5 className="font-medium text-amber-800 mb-2">Smart Integration</h5>
              <ul className="space-y-1 text-amber-700">
                <li>• Prioritizes sleep-stress connection</li>
                <li>• Evening breathing for racing thoughts</li>
                <li>• Morning techniques for energy</li>
                <li>• Tracks sleep impact on stress</li>
              </ul>
            </div>
          </div>

          <Separator />

          <div className="flex gap-3">
            <Button onClick={loadExampleProfile} variant="outline">
              Load Example Profile
            </Button>
            <Button onClick={() => setShowDashboard(true)} className="bg-amber-600 hover:bg-amber-700">
              Try Interactive Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Technical Implementation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-500" />
            Technical Implementation
          </CardTitle>
          <CardDescription>
            Key components and data flow in the integrated system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Core Components</h4>
              <ul className="text-sm space-y-1 text-muted-foreground font-mono">
                <li>• WellnessDashboard.tsx - Main integration hub</li>
                <li>• WellnessAssessment.tsx - General health evaluation</li>
                <li>• SleepAssessment.tsx - Sleep-specific analysis</li>
                <li>• SleepBreathingWidget.tsx - Sleep recommendations</li>
                <li>• SmartBreathingWidget.tsx - General recommendations</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Data Integration</h4>
              <ul className="text-sm space-y-1 text-muted-foreground font-mono">
                <li>• types/sleepRecovery.ts - Sleep data structures</li>
                <li>• types/workLifeBalance.ts - Wellness types</li>
                <li>• SleepWellnessIntegration interface</li>
                <li>• Cross-assessment correlation algorithms</li>
                <li>• Unified recommendation engine</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Status */}
      {currentProfile && (
        <Card className="bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <CheckCircle className="h-5 w-5" />
              Profile Loaded Successfully
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="font-medium">Assessments Complete:</div>
                <div className="flex gap-1 mt-1">
                  {currentProfile.completedAssessments.map(assessment => (
                    <Badge key={assessment} variant="default" className="text-xs">
                      {assessment}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <div className="font-medium">Primary Goals:</div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {currentProfile.wellnessGoals?.primaryGoals.slice(0, 2).map(goal => (
                    <Badge key={goal} variant="secondary" className="text-xs">
                      {goal}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <div className="font-medium">Integration Status:</div>
                <Badge variant="default" className="text-xs">
                  {currentProfile.sleepWellnessIntegration ? 'Active' : 'Pending'}
                </Badge>
              </div>
            </div>
            <div className="mt-4">
              <Button onClick={() => setShowDashboard(true)}>
                Open Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};