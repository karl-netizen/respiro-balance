import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { Separator } from '@/components/ui/separator';
import {
  TrendingUp,
  Calendar,
  Activity,
  Wind,
  BarChart3,
  Brain,
  PlayCircle,
  PauseCircle,
  RotateCcw
} from 'lucide-react';

import { SleepAnalytics } from '../components/sleep/SleepAnalytics';
import { SleepTrackingService } from '../services/SleepTrackingService';

import {
  SleepAnalytics as SleepAnalyticsType,
  SleepTrend,
  EnhancedSleepRecovery
} from '@/types/sleepRecovery';

/**
 * Comprehensive demo of the sleep tracking and analytics system
 */
export const SleepTrackingDemo: React.FC = () => {
  const [currentView, setCurrentView] = useState<'demo' | 'analytics' | 'simulation'>('demo');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationDay, setSimulationDay] = useState(0);
  const [analytics, setAnalytics] = useState<SleepAnalyticsType | null>(null);
  const [trends, setTrends] = useState<SleepTrend[]>([]);

  const sleepService = SleepTrackingService.getInstance();

  // Sample sleep data for demonstration
  const sampleSleepData: EnhancedSleepRecovery = {
    bedtime: '22:30',
    wakeTime: '07:00',
    sleepQuality: 6,
    sleepChallenges: ['falling-asleep', 'racing-thoughts'],
    windDownRoutine: ['reading', 'breathing-exercises', 'dim-lighting'],
    morningEnergy: 5,
    interestedInSleepBreathing: true,
    currentSleepAids: ['breathing'],
    timeToFallAsleep: 25,
    nightTimeWakeups: 1,
    sleepGoals: ['fall-asleep-faster', 'sleep-through-night', 'wake-refreshed'],
    lastSleepAssessment: new Date().toISOString()
  };

  useEffect(() => {
    // Initialize with sample data
    initializeSampleData();
  }, []);

  const initializeSampleData = async () => {
    const userId = 'demo-user';

    // Save initial assessment
    await sleepService.saveSleepAssessment(userId, sampleSleepData);

    // Generate sample trends for the past month
    const trends: SleepTrend[] = [];
    for (let i = 30; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      // Simulate realistic sleep data with some variability
      const baseQuality = 6 + Math.sin(i * 0.1) * 2 + (Math.random() - 0.5) * 1.5;
      const baseEnergy = 5 + Math.sin(i * 0.12) * 1.5 + (Math.random() - 0.5) * 1;
      const stressLevel = 5 + Math.sin(i * 0.08) * 2 + (Math.random() - 0.5) * 1;

      trends.push({
        date: date.toISOString(),
        sleepQuality: Math.max(1, Math.min(10, baseQuality)),
        morningEnergy: Math.max(1, Math.min(10, baseEnergy)),
        timeToFallAsleep: 20 + Math.random() * 20,
        nightWakeups: Math.floor(Math.random() * 3),
        totalSleepTime: 7.5 + (Math.random() - 0.5) * 1,
        breathingSessionUsed: Math.random() > 0.6,
        stressLevelBeforeBed: Math.max(1, Math.min(10, stressLevel)),
        windDownActivities: ['reading', 'breathing-exercises'],
        notesOrFactors: i % 7 === 0 ? 'Weekend sleep pattern' : undefined
      });
    }

    // Record sample breathing sessions
    for (let i = 0; i < 15; i++) {
      const sessionDate = new Date();
      sessionDate.setDate(sessionDate.getDate() - Math.floor(Math.random() * 30));

      await sleepService.recordBreathingSession(userId, {
        technique: ['four-seven-eight', 'box-breathing', 'coherent-breathing'][Math.floor(Math.random() * 3)] as any,
        purpose: 'bedtime-routine',
        startTime: sessionDate.toISOString(),
        duration: 300 + Math.random() * 600,
        timeRelativeToBedtime: -30 + Math.random() * 60,
        sleepChallenge: sampleSleepData.sleepChallenges[Math.floor(Math.random() * sampleSleepData.sleepChallenges.length)],
        stressLevelBefore: 3 + Math.random() * 5,
        physicalTensionBefore: 2 + Math.random() * 4,
        mentalActivityBefore: 4 + Math.random() * 4,
        relaxationAfter: 6 + Math.random() * 3,
        timeToFallAsleepAfter: 10 + Math.random() * 20,
        sleepQualityNextMorning: 6 + Math.random() * 3,
        wouldUseAgain: Math.random() > 0.2,
        guidedOrSelfDirected: Math.random() > 0.5 ? 'guided' : 'self-directed',
        backgroundSounds: Math.random() > 0.5,
        completed: true
      });
    }

    // Generate analytics
    const analyticsData = await sleepService.getSleepAnalytics(userId, 'month');
    const trendsData = sleepService.getSleepTrends(userId, 'month');

    setAnalytics(analyticsData);
    setTrends(trendsData);
  };

  const startSimulation = () => {
    setIsSimulating(true);
    setSimulationDay(0);
    simulateDay();
  };

  const simulateDay = async () => {
    if (simulationDay >= 30) {
      setIsSimulating(false);
      return;
    }

    const userId = 'demo-user';

    // Simulate daily sleep recording with breathing session
    const quality = 5 + Math.random() * 3 + (simulationDay * 0.05); // Gradual improvement
    const energy = 4 + Math.random() * 3 + (simulationDay * 0.04);
    const timeToSleep = Math.max(5, 25 - (simulationDay * 0.3)); // Improvement over time

    await sleepService.recordDailySleep(
      userId,
      quality,
      energy,
      timeToSleep,
      Math.floor(Math.random() * 2),
      3 + Math.random() * 4,
      ['breathing-exercises', 'reading'],
      simulationDay % 5 === 0 ? 'Used breathing technique tonight' : undefined
    );

    // Record breathing session
    if (Math.random() > 0.3) {
      await sleepService.recordBreathingSession(userId, {
        technique: 'four-seven-eight' as any,
        purpose: 'bedtime-routine',
        startTime: new Date().toISOString(),
        duration: 300,
        timeRelativeToBedtime: -15,
        stressLevelBefore: 3 + Math.random() * 3,
        relaxationAfter: 7 + Math.random() * 2,
        sleepQualityNextMorning: quality,
        wouldUseAgain: true,
        guidedOrSelfDirected: 'guided',
        completed: true
      });
    }

    // Update analytics
    const newAnalytics = await sleepService.getSleepAnalytics(userId, 'month');
    const newTrends = sleepService.getSleepTrends(userId, 'month');

    setAnalytics(newAnalytics);
    setTrends(newTrends);
    setSimulationDay(prev => prev + 1);

    // Continue simulation
    setTimeout(simulateDay, 1000);
  };

  const resetDemo = () => {
    setIsSimulating(false);
    setSimulationDay(0);
    initializeSampleData();
  };

  const renderDemo = () => (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Sleep Tracking & Analytics Demo</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Experience a comprehensive sleep tracking system that combines daily sleep monitoring,
          breathing session tracking, and intelligent analytics to improve your sleep quality over time.
        </p>
      </div>

      {/* Demo Controls */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PlayCircle className="h-6 w-6 text-blue-600" />
            Interactive Demo Controls
          </CardTitle>
          <CardDescription>
            Simulate 30 days of sleep tracking to see how analytics evolve over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Button
              onClick={startSimulation}
              disabled={isSimulating}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSimulating ? (
                <>
                  <PauseCircle className="h-4 w-4 mr-2" />
                  Simulating Day {simulationDay}/30
                </>
              ) : (
                <>
                  <PlayCircle className="h-4 w-4 mr-2" />
                  Start 30-Day Simulation
                </>
              )}
            </Button>

            <Button variant="outline" onClick={resetDemo} disabled={isSimulating}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset Demo
            </Button>

            <Button variant="outline" onClick={() => setCurrentView('analytics')}>
              <BarChart3 className="h-4 w-4 mr-2" />
              View Full Analytics
            </Button>

            {isSimulating && (
              <Badge variant="default" className="ml-auto">
                Live Simulation Running
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* System Overview */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-6 w-6 text-blue-500" />
                <h3 className="font-semibold">Daily Sleep Tracking</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Record sleep quality, morning energy, time to fall asleep, and night wakings
              </p>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li>• Sleep quality ratings (1-10)</li>
                <li>• Morning energy levels</li>
                <li>• Wind-down routine tracking</li>
                <li>• Stress level correlation</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Wind className="h-6 w-6 text-green-500" />
                <h3 className="font-semibold">Breathing Sessions</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Track effectiveness of breathing techniques for sleep improvement
              </p>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li>• Session duration and timing</li>
                <li>• Technique effectiveness ratings</li>
                <li>• Impact on sleep quality</li>
                <li>• Personalized recommendations</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-purple-500" />
                <h3 className="font-semibold">Intelligent Analytics</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                AI-powered insights and correlations to optimize your sleep patterns
              </p>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li>• Trend analysis and predictions</li>
                <li>• Correlation insights</li>
                <li>• Personalized recommendations</li>
                <li>• Goal progress tracking</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Key Features */}
      <Card>
        <CardHeader>
          <CardTitle>Key Features Demonstrated</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-green-600">Data Collection</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Comprehensive sleep quality assessment</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Breathing session tracking with effectiveness ratings</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Environmental and contextual factors</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Wind-down routine optimization</span>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-blue-600">Analytics & Insights</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Sleep pattern trend analysis</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Breathing technique effectiveness comparison</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Stress-sleep correlation analysis</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Personalized optimization recommendations</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Data Preview */}
      {analytics && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Current Sleep Analytics Summary
            </CardTitle>
            <CardDescription>
              Live data from the demo simulation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 border rounded-lg">
                <div className="text-xl font-bold text-blue-500">
                  {analytics.averageSleepQuality.toFixed(1)}/10
                </div>
                <div className="text-xs text-muted-foreground">Sleep Quality</div>
              </div>
              <div className="text-center p-3 border rounded-lg">
                <div className="text-xl font-bold text-green-500">
                  {analytics.averageMorningEnergy.toFixed(1)}/10
                </div>
                <div className="text-xs text-muted-foreground">Morning Energy</div>
              </div>
              <div className="text-center p-3 border rounded-lg">
                <div className="text-xl font-bold text-purple-500">
                  {Math.round(analytics.averageTimeToFallAsleep)}m
                </div>
                <div className="text-xs text-muted-foreground">Time to Sleep</div>
              </div>
              <div className="text-center p-3 border rounded-lg">
                <div className="text-xl font-bold text-orange-500">
                  {analytics.breathingSessionsUsed}
                </div>
                <div className="text-xs text-muted-foreground">Breathing Sessions</div>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="font-medium mb-1">Trend Analysis:</div>
                <div className="flex items-center gap-2">
                  <Badge variant={analytics.sleepQualityTrend === 'improving' ? 'default' : 'secondary'}>
                    Sleep: {analytics.sleepQualityTrend}
                  </Badge>
                  <Badge variant={analytics.morningEnergyTrend === 'improving' ? 'default' : 'secondary'}>
                    Energy: {analytics.morningEnergyTrend}
                  </Badge>
                </div>
              </div>
              <div>
                <div className="font-medium mb-1">Breathing Impact:</div>
                <div className="text-muted-foreground">
                  {(analytics.breathingImpactOnSleep * 100).toFixed(0)}% improvement when used
                </div>
              </div>
              <div>
                <div className="font-medium mb-1">Correlations:</div>
                <div className="text-muted-foreground">
                  Stress: {(analytics.stressImpactOnSleep * 100).toFixed(0)}% impact
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Technical Implementation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-500" />
            Technical Implementation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Core Services</h4>
              <ul className="text-sm space-y-1 text-muted-foreground font-mono">
                <li>• SleepTrackingService.ts - Data management</li>
                <li>• SleepAnalytics.tsx - Visualization components</li>
                <li>• SleepBreathingRecommendationEngine.ts</li>
                <li>• Real-time correlation analysis</li>
                <li>• Trend detection algorithms</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Data Types</h4>
              <ul className="text-sm space-y-1 text-muted-foreground font-mono">
                <li>• SleepTrend interface - Daily tracking</li>
                <li>• SleepBreathingSession - Session data</li>
                <li>• SleepAnalytics - Computed insights</li>
                <li>• Correlation algorithms</li>
                <li>• Recommendation engines</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  if (currentView === 'analytics' && analytics) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => setCurrentView('demo')}>
            ← Back to Demo
          </Button>
          <Badge variant="secondary">Full Analytics View</Badge>
        </div>
        <SleepAnalytics
          analytics={analytics}
          trends={trends}
          onViewDetails={(metric) => console.log('View details for:', metric)}
          onUpdateGoals={() => console.log('Update goals')}
        />
      </div>
    );
  }

  return renderDemo();
};