import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  Brain,
  Heart,
  Moon,
  Activity,
  TrendingUp,
  Target,
  Wind,
  Zap,
  CheckCircle2,
  AlertCircle,
  Gauge
} from 'lucide-react';

import { WellnessAssessment } from './WellnessAssessment';
import { SleepAssessment } from '../sleep/SleepAssessment';
import { SleepBreathingWidget } from '../sleep/SleepBreathingWidget';
import { SmartBreathingWidget } from '../work-life-balance/SmartBreathingWidget';

import {
  StressAssessment,
  BreathingAwareness,
  WellnessGoals
} from '@/types/workLifeBalance';
import {
  EnhancedSleepRecovery,
  SleepWellnessIntegration
} from '@/types/sleepRecovery';

export interface WellnessProfile {
  // General wellness assessment
  stressAssessment?: StressAssessment;
  breathingAwareness?: BreathingAwareness;
  wellnessGoals?: WellnessGoals;

  // Sleep-specific data
  sleepRecovery?: EnhancedSleepRecovery;

  // Integration data
  sleepWellnessIntegration?: SleepWellnessIntegration;
  lastUpdated: string;
  completedAssessments: ('general' | 'sleep')[];
}

interface WellnessDashboardProps {
  profile?: WellnessProfile;
  onProfileUpdate: (profile: WellnessProfile) => void;
}

export const WellnessDashboard: React.FC<WellnessDashboardProps> = ({
  profile,
  onProfileUpdate
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'general' | 'sleep' | 'breathing'>('overview');
  const [showGeneralAssessment, setShowGeneralAssessment] = useState(false);
  const [showSleepAssessment, setShowSleepAssessment] = useState(false);

  const hasGeneralAssessment = profile?.completedAssessments.includes('general');
  const hasSleepAssessment = profile?.completedAssessments.includes('sleep');
  const profileCompleteness = ((hasGeneralAssessment ? 1 : 0) + (hasSleepAssessment ? 1 : 0)) / 2 * 100;

  const handleGeneralAssessmentComplete = (assessment: {
    stressAssessment: StressAssessment;
    breathingAwareness: BreathingAwareness;
    wellnessGoals: WellnessGoals;
  }) => {
    const updatedProfile: WellnessProfile = {
      ...profile,
      stressAssessment: assessment.stressAssessment,
      breathingAwareness: assessment.breathingAwareness,
      wellnessGoals: assessment.wellnessGoals,
      lastUpdated: new Date().toISOString(),
      completedAssessments: [...(profile?.completedAssessments || []).filter(a => a !== 'general'), 'general'],
      sleepWellnessIntegration: generateSleepWellnessIntegration(assessment, profile?.sleepRecovery)
    };

    onProfileUpdate(updatedProfile);
    setShowGeneralAssessment(false);
  };

  const handleSleepAssessmentComplete = (sleepData: EnhancedSleepRecovery) => {
    const updatedProfile: WellnessProfile = {
      ...profile,
      sleepRecovery: sleepData,
      lastUpdated: new Date().toISOString(),
      completedAssessments: [...(profile?.completedAssessments || []).filter(a => a !== 'sleep'), 'sleep'],
      sleepWellnessIntegration: generateSleepWellnessIntegration(
        profile ? {
          stressAssessment: profile.stressAssessment!,
          breathingAwareness: profile.breathingAwareness!,
          wellnessGoals: profile.wellnessGoals!
        } : undefined,
        sleepData
      )
    };

    onProfileUpdate(updatedProfile);
    setShowSleepAssessment(false);
  };

  const generateSleepWellnessIntegration = (
    generalAssessment?: {
      stressAssessment: StressAssessment;
      breathingAwareness: BreathingAwareness;
      wellnessGoals: WellnessGoals;
    },
    sleepData?: EnhancedSleepRecovery
  ): SleepWellnessIntegration => {
    if (!generalAssessment || !sleepData) {
      return {
        relatedWellnessGoals: [],
        sleepImpactOnStress: 0,
        sleepImpactOnFocus: 0,
        sleepImpactOnEnergy: 0,
        sleepImpactOnMood: 0,
        recommendSleepForStressGoal: false,
        recommendSleepForFocusGoal: false,
        recommendSleepForEnergyGoal: false,
        trackSleepInWellnessAssessment: false,
        includeSleepInDailyCheck: false,
        prioritizeSleepBasedOnGoals: false
      };
    }

    const hasStressGoal = generalAssessment.wellnessGoals.primaryGoals.includes('reduce-stress') ||
                         generalAssessment.wellnessGoals.secondaryGoals.includes('reduce-stress');
    const hasFocusGoal = generalAssessment.wellnessGoals.primaryGoals.includes('improve-focus') ||
                        generalAssessment.wellnessGoals.secondaryGoals.includes('improve-focus');
    const hasEnergyGoal = generalAssessment.wellnessGoals.primaryGoals.includes('increase-energy') ||
                         generalAssessment.wellnessGoals.secondaryGoals.includes('increase-energy');
    const hasSleepGoal = generalAssessment.wellnessGoals.primaryGoals.includes('better-sleep') ||
                        generalAssessment.wellnessGoals.secondaryGoals.includes('better-sleep');

    return {
      relatedWellnessGoals: [
        ...(hasStressGoal ? ['reduce-stress'] : []),
        ...(hasFocusGoal ? ['improve-focus'] : []),
        ...(hasEnergyGoal ? ['increase-energy'] : []),
        ...(hasSleepGoal ? ['better-sleep'] : [])
      ],
      sleepImpactOnStress: hasStressGoal ? Math.max(0.7, (10 - generalAssessment.stressAssessment.currentStressLevel) * 0.1) : 0.5,
      sleepImpactOnFocus: hasFocusGoal ? 0.8 : 0.6,
      sleepImpactOnEnergy: hasEnergyGoal ? 0.9 : 0.7,
      sleepImpactOnMood: 0.7,
      recommendSleepForStressGoal: hasStressGoal && generalAssessment.stressAssessment.currentStressLevel >= 6,
      recommendSleepForFocusGoal: hasFocusGoal && sleepData.morningEnergy <= 5,
      recommendSleepForEnergyGoal: hasEnergyGoal && sleepData.morningEnergy <= 4,
      trackSleepInWellnessAssessment: hasSleepGoal || hasStressGoal || hasEnergyGoal,
      includeSleepInDailyCheck: sleepData.sleepQuality <= 6 || sleepData.morningEnergy <= 5,
      prioritizeSleepBasedOnGoals: hasSleepGoal || (hasStressGoal && generalAssessment.stressAssessment.currentStressLevel >= 7)
    };
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Profile Completeness */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gauge className="h-5 w-5 text-primary" />
              <CardTitle>Wellness Profile</CardTitle>
            </div>
            <Badge variant={profileCompleteness === 100 ? 'default' : 'secondary'}>
              {Math.round(profileCompleteness)}% Complete
            </Badge>
          </div>
          <CardDescription>
            Complete both assessments for personalized breathing recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Heart className="h-5 w-5 text-red-500" />
                <div>
                  <div className="font-medium">General Wellness</div>
                  <div className="text-sm text-muted-foreground">Stress, breathing & goals</div>
                </div>
              </div>
              {hasGeneralAssessment ? (
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowGeneralAssessment(true)}
                  >
                    Update
                  </Button>
                </div>
              ) : (
                <Button
                  size="sm"
                  onClick={() => setShowGeneralAssessment(true)}
                >
                  Start Assessment
                </Button>
              )}
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Moon className="h-5 w-5 text-indigo-500" />
                <div>
                  <div className="font-medium">Sleep & Recovery</div>
                  <div className="text-sm text-muted-foreground">Sleep quality & patterns</div>
                </div>
              </div>
              {hasSleepAssessment ? (
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowSleepAssessment(true)}
                  >
                    Update
                  </Button>
                </div>
              ) : (
                <Button
                  size="sm"
                  onClick={() => setShowSleepAssessment(true)}
                >
                  Start Assessment
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Insights */}
      {(hasGeneralAssessment || hasSleepAssessment) && (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {hasGeneralAssessment && profile?.stressAssessment && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-red-500" />
                  <div className="text-sm font-medium text-muted-foreground">Stress Level</div>
                </div>
                <div className="text-2xl font-bold mt-1">
                  {profile.stressAssessment.currentStressLevel}/10
                </div>
                <div className="text-xs text-muted-foreground">
                  {profile.stressAssessment.currentStressLevel <= 3 ? 'Low stress' :
                   profile.stressAssessment.currentStressLevel <= 6 ? 'Moderate' : 'High stress'}
                </div>
              </CardContent>
            </Card>
          )}

          {hasSleepAssessment && profile?.sleepRecovery && (
            <>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2">
                    <Moon className="h-4 w-4 text-indigo-500" />
                    <div className="text-sm font-medium text-muted-foreground">Sleep Quality</div>
                  </div>
                  <div className="text-2xl font-bold mt-1">
                    {profile.sleepRecovery.sleepQuality}/10
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {profile.sleepRecovery.sleepQuality <= 5 ? 'Needs improvement' :
                     profile.sleepRecovery.sleepQuality <= 7 ? 'Good' : 'Excellent'}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-yellow-500" />
                    <div className="text-sm font-medium text-muted-foreground">Morning Energy</div>
                  </div>
                  <div className="text-2xl font-bold mt-1">
                    {profile.sleepRecovery.morningEnergy}/10
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {profile.sleepRecovery.morningEnergy <= 4 ? 'Low energy' :
                     profile.sleepRecovery.morningEnergy <= 7 ? 'Moderate' : 'High energy'}
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {hasGeneralAssessment && profile?.wellnessGoals && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-green-500" />
                  <div className="text-sm font-medium text-muted-foreground">Active Goals</div>
                </div>
                <div className="text-2xl font-bold mt-1">
                  {profile.wellnessGoals.primaryGoals.length}
                </div>
                <div className="text-xs text-muted-foreground">
                  Primary wellness goals
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Integrated Recommendations */}
      {profile?.sleepWellnessIntegration && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-500" />
              Integrated Wellness Insights
            </CardTitle>
            <CardDescription>
              How your sleep and wellness goals connect
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {profile.sleepWellnessIntegration.recommendSleepForStressGoal && (
              <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <div className="font-medium text-blue-800">Sleep-Stress Connection</div>
                  <div className="text-sm text-blue-700">
                    Your stress levels may improve significantly with better sleep quality. Consider prioritizing sleep-focused breathing techniques.
                  </div>
                </div>
              </div>
            )}

            {profile.sleepWellnessIntegration.recommendSleepForEnergyGoal && (
              <div className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <Zap className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <div className="font-medium text-yellow-800">Energy Optimization</div>
                  <div className="text-sm text-yellow-700">
                    Better sleep quality could significantly boost your morning energy levels and overall vitality.
                  </div>
                </div>
              </div>
            )}

            {profile.sleepWellnessIntegration.recommendSleepForFocusGoal && (
              <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <Brain className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <div className="font-medium text-green-800">Focus Enhancement</div>
                  <div className="text-sm text-green-700">
                    Quality sleep is essential for cognitive function and focus. Sleep breathing techniques may help both.
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderGeneralWellness = () => (
    <div className="space-y-6">
      {hasGeneralAssessment && profile ? (
        <div className="space-y-6">
          {/* Current Assessment Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                Current Wellness Profile
              </CardTitle>
              <CardDescription>
                Last updated: {new Date(profile.lastUpdated).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-red-500">{profile.stressAssessment?.currentStressLevel}/10</div>
                  <div className="text-sm text-muted-foreground">Stress Level</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-500">{profile.breathingAwareness?.previousBreathingExperience}</div>
                  <div className="text-sm text-muted-foreground">Experience</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-500">{profile.wellnessGoals?.primaryGoals.length}</div>
                  <div className="text-sm text-muted-foreground">Primary Goals</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="font-medium">Primary Wellness Goals:</div>
                <div className="flex flex-wrap gap-1">
                  {profile.wellnessGoals?.primaryGoals.map(goal => (
                    <Badge key={goal} variant="default" className="text-xs">{goal}</Badge>
                  ))}
                </div>
              </div>

              <Button
                variant="outline"
                onClick={() => setShowGeneralAssessment(true)}
                className="w-full"
              >
                Update Assessment
              </Button>
            </CardContent>
          </Card>

          {/* Smart Breathing Widget */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wind className="h-5 w-5 text-green-500" />
                Personalized Breathing Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SmartBreathingWidget
                onStartSession={(recommendation) => {
                  console.log('Started breathing session:', recommendation);
                }}
              />
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Complete Your General Wellness Assessment</CardTitle>
            <CardDescription>
              Get personalized breathing recommendations based on your stress levels and wellness goals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setShowGeneralAssessment(true)}>
              Start Assessment
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderSleepWellness = () => (
    <div className="space-y-6">
      {hasSleepAssessment && profile?.sleepRecovery ? (
        <div className="space-y-6">
          {/* Sleep Profile Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Moon className="h-5 w-5 text-indigo-500" />
                Sleep Profile
              </CardTitle>
              <CardDescription>
                Last updated: {new Date(profile.lastUpdated).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-4 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-lg font-bold">{profile.sleepRecovery.bedtime}</div>
                  <div className="text-xs text-muted-foreground">Bedtime</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-lg font-bold">{profile.sleepRecovery.wakeTime}</div>
                  <div className="text-xs text-muted-foreground">Wake Time</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-lg font-bold text-indigo-500">{profile.sleepRecovery.sleepQuality}/10</div>
                  <div className="text-xs text-muted-foreground">Sleep Quality</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-lg font-bold text-yellow-500">{profile.sleepRecovery.morningEnergy}/10</div>
                  <div className="text-xs text-muted-foreground">Morning Energy</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="font-medium">Sleep Challenges:</div>
                <div className="flex flex-wrap gap-1">
                  {profile.sleepRecovery.sleepChallenges.map(challenge => (
                    <Badge key={challenge} variant="secondary" className="text-xs">{challenge}</Badge>
                  ))}
                </div>
              </div>

              <Button
                variant="outline"
                onClick={() => setShowSleepAssessment(true)}
                className="w-full"
              >
                Update Sleep Assessment
              </Button>
            </CardContent>
          </Card>

          {/* Sleep Breathing Widget */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wind className="h-5 w-5 text-green-500" />
                Sleep Breathing Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SleepBreathingWidget
                sleepPreferences={profile.sleepRecovery}
                onSessionStart={(session) => {
                  console.log('Started sleep breathing session:', session);
                }}
                onSessionComplete={(session) => {
                  console.log('Completed sleep breathing session:', session);
                }}
              />
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Complete Your Sleep Assessment</CardTitle>
            <CardDescription>
              Get personalized sleep breathing recommendations based on your sleep patterns and challenges
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setShowSleepAssessment(true)}>
              Start Sleep Assessment
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderBreathingSession = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wind className="h-5 w-5 text-green-500" />
            Integrated Breathing Sessions
          </CardTitle>
          <CardDescription>
            Choose the right breathing session for your current context
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {hasGeneralAssessment && (
            <div>
              <h4 className="font-medium mb-3">General Wellness Breathing</h4>
              <SmartBreathingWidget
                onStartSession={(recommendation) => {
                  console.log('Started general breathing session:', recommendation);
                }}
              />
            </div>
          )}

          {hasSleepAssessment && profile?.sleepRecovery && (
            <div>
              <Separator />
              <h4 className="font-medium mb-3">Sleep-Focused Breathing</h4>
              <SleepBreathingWidget
                sleepPreferences={profile.sleepRecovery}
                onSessionStart={(session) => {
                  console.log('Started sleep breathing session:', session);
                }}
                onSessionComplete={(session) => {
                  console.log('Completed sleep breathing session:', session);
                }}
              />
            </div>
          )}

          {!hasGeneralAssessment && !hasSleepAssessment && (
            <div className="text-center py-8">
              <div className="text-muted-foreground mb-4">
                Complete your wellness assessments to access personalized breathing recommendations
              </div>
              <div className="space-x-2">
                <Button onClick={() => setShowGeneralAssessment(true)}>
                  Start General Assessment
                </Button>
                <Button variant="outline" onClick={() => setShowSleepAssessment(true)}>
                  Start Sleep Assessment
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  if (showGeneralAssessment) {
    return (
      <WellnessAssessment
        onComplete={handleGeneralAssessmentComplete}
        initialData={{
          stressAssessment: profile?.stressAssessment,
          breathingAwareness: profile?.breathingAwareness,
          wellnessGoals: profile?.wellnessGoals
        }}
      />
    );
  }

  if (showSleepAssessment) {
    return (
      <SleepAssessment
        onComplete={handleSleepAssessmentComplete}
        initialData={profile?.sleepRecovery}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Activity className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Wellness Dashboard</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Your comprehensive wellness and breathing companion
        </p>
      </div>

      {/* Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            General Wellness
          </TabsTrigger>
          <TabsTrigger value="sleep" className="flex items-center gap-2">
            <Moon className="h-4 w-4" />
            Sleep & Recovery
          </TabsTrigger>
          <TabsTrigger value="breathing" className="flex items-center gap-2">
            <Wind className="h-4 w-4" />
            Breathing Sessions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          {renderOverview()}
        </TabsContent>

        <TabsContent value="general">
          {renderGeneralWellness()}
        </TabsContent>

        <TabsContent value="sleep">
          {renderSleepWellness()}
        </TabsContent>

        <TabsContent value="breathing">
          {renderBreathingSession()}
        </TabsContent>
      </Tabs>
    </div>
  );
};