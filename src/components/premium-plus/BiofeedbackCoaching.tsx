
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Heart, Activity, Brain, TrendingUp, Play, Pause, RotateCcw } from 'lucide-react';
import { FeatureGate } from '@/components/subscription/FeatureGate';
import { toast } from 'sonner';

interface BiofeedbackCoachingProps {
  sessionActive?: boolean;
  onSessionStart?: () => void;
  onSessionEnd?: () => void;
}

const BiofeedbackCoaching: React.FC<BiofeedbackCoachingProps> = ({
  sessionActive = false,
  onSessionStart,
  onSessionEnd
}) => {
  const [isActive, setIsActive] = useState(sessionActive);
  const [heartRate, setHeartRate] = useState(72);
  const [hrv, setHrv] = useState(45);
  const [stressLevel, setStressLevel] = useState(65);
  const [coherenceScore, setCoherenceScore] = useState(3.2);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [breathingGuidance, setBreathingGuidance] = useState('inhale');

  // Simulate real-time biometric data
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      // Simulate heart rate variability
      setHeartRate(prev => {
        const variation = (Math.random() - 0.5) * 10;
        return Math.max(60, Math.min(100, prev + variation));
      });

      // Simulate HRV changes
      setHrv(prev => {
        const variation = (Math.random() - 0.5) * 5;
        return Math.max(20, Math.min(80, prev + variation));
      });

      // Simulate stress level improvement over time
      setStressLevel(prev => {
        const improvement = isActive ? -0.5 : 0;
        const variation = (Math.random() - 0.5) * 3;
        return Math.max(0, Math.min(100, prev + improvement + variation));
      });

      // Simulate coherence score improvement
      setCoherenceScore(prev => {
        const improvement = isActive ? 0.02 : 0;
        const variation = (Math.random() - 0.5) * 0.3;
        return Math.max(0, Math.min(5, prev + improvement + variation));
      });

      setSessionDuration(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive]);

  // Breathing guidance
  useEffect(() => {
    if (!isActive) return;

    const breathingCycle = setInterval(() => {
      setBreathingGuidance(prev => {
        if (prev === 'inhale') return 'hold';
        if (prev === 'hold') return 'exhale';
        return 'inhale';
      });
    }, 4000); // 4-second cycles

    return () => clearInterval(breathingCycle);
  }, [isActive]);

  const handleStartSession = () => {
    setIsActive(true);
    setSessionDuration(0);
    onSessionStart?.();
    toast.success('Biofeedback coaching session started');
  };

  const handleEndSession = () => {
    setIsActive(false);
    onSessionEnd?.();
    toast.success(`Session completed! Duration: ${Math.floor(sessionDuration / 60)}:${(sessionDuration % 60).toString().padStart(2, '0')}`);
  };

  const handleReset = () => {
    setIsActive(false);
    setSessionDuration(0);
    setStressLevel(65);
    setCoherenceScore(3.2);
  };

  const getStressLevelColor = (level: number) => {
    if (level < 30) return 'text-green-600 bg-green-100';
    if (level < 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getCoherenceLevel = (score: number) => {
    if (score < 2) return { level: 'Low', color: 'text-red-600 bg-red-100' };
    if (score < 3.5) return { level: 'Medium', color: 'text-yellow-600 bg-yellow-100' };
    return { level: 'High', color: 'text-green-600 bg-green-100' };
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <FeatureGate
      requiredTier="premium_plus"
      featureName="Advanced Biofeedback Coaching"
      featureDescription="Real-time physiological monitoring with adaptive guidance"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Biofeedback Coaching</h2>
            <p className="text-muted-foreground">Real-time physiological monitoring and guidance</p>
          </div>
          
          <div className="flex items-center space-x-2">
            {!isActive ? (
              <Button onClick={handleStartSession} className="flex items-center space-x-2">
                <Play className="w-4 h-4" />
                <span>Start Session</span>
              </Button>
            ) : (
              <>
                <Button onClick={handleEndSession} variant="outline" className="flex items-center space-x-2">
                  <Pause className="w-4 h-4" />
                  <span>End Session</span>
                </Button>
                <Button onClick={handleReset} variant="outline" size="icon">
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Session Status */}
        {isActive && (
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-medium">Session Active</span>
                  <span className="text-muted-foreground">Duration: {formatTime(sessionDuration)}</span>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold capitalize">{breathingGuidance}</div>
                  <div className="text-sm text-muted-foreground">Follow the guidance</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Real-time Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Heart className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{Math.round(heartRate)}</div>
                  <div className="text-sm text-muted-foreground">Heart Rate (BPM)</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Activity className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{Math.round(hrv)}</div>
                  <div className="text-sm text-muted-foreground">HRV Score</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Brain className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{Math.round(stressLevel)}%</div>
                  <div className="text-sm text-muted-foreground">Stress Level</div>
                </div>
              </div>
              <div className="mt-2">
                <Progress value={stressLevel} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{coherenceScore.toFixed(1)}</div>
                  <div className="text-sm text-muted-foreground">Coherence</div>
                </div>
              </div>
              <div className="mt-2">
                <Badge className={getCoherenceLevel(coherenceScore).color}>
                  {getCoherenceLevel(coherenceScore).level}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analysis */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Real-time Coaching</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Stress Level</span>
                  <Badge className={getStressLevelColor(stressLevel)}>
                    {stressLevel < 30 ? 'Low' : stressLevel < 70 ? 'Moderate' : 'High'}
                  </Badge>
                </div>
                <Progress value={100 - stressLevel} className="h-2" />
              </div>

              <div className="p-3 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Current Guidance</h4>
                <p className="text-sm text-blue-700">
                  {isActive ? (
                    stressLevel > 70 ? 
                      "Your stress levels are elevated. Focus on deeper, slower breaths. Try extending your exhales." :
                    stressLevel > 40 ?
                      "Good progress! Maintain steady breathing rhythm. You're moving in the right direction." :
                      "Excellent! Your stress levels are low. Continue with your current breathing pattern."
                  ) : (
                    "Start a session to receive personalized guidance based on your biometric data."
                  )}
                </p>
              </div>

              {isActive && (
                <div className="space-y-2">
                  <h4 className="font-medium">Breathing Pattern Recommendation</h4>
                  <div className="grid grid-cols-3 gap-2 text-center text-sm">
                    <div className="p-2 bg-green-100 rounded">
                      <div className="font-medium">Inhale</div>
                      <div className="text-xs text-muted-foreground">4 sec</div>
                    </div>
                    <div className="p-2 bg-yellow-100 rounded">
                      <div className="font-medium">Hold</div>
                      <div className="text-xs text-muted-foreground">4 sec</div>
                    </div>
                    <div className="p-2 bg-blue-100 rounded">
                      <div className="font-medium">Exhale</div>
                      <div className="text-xs text-muted-foreground">6 sec</div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Session Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Heart Rate Variability</span>
                  <div className="text-right">
                    <div className="font-medium">{Math.round(hrv)}</div>
                    <div className="text-xs text-muted-foreground">
                      {hrv > 50 ? 'Excellent' : hrv > 30 ? 'Good' : 'Needs Improvement'}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm">Coherence Score</span>
                  <div className="text-right">
                    <div className="font-medium">{coherenceScore.toFixed(1)}/5.0</div>
                    <div className="text-xs text-muted-foreground">
                      {getCoherenceLevel(coherenceScore).level}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm">Recovery Rate</span>
                  <div className="text-right">
                    <div className="font-medium">{Math.round((100 - stressLevel) / (sessionDuration || 1) * 60)}%/min</div>
                    <div className="text-xs text-muted-foreground">Stress reduction</div>
                  </div>
                </div>
              </div>

              {sessionDuration > 60 && (
                <div className="p-3 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">Progress Summary</h4>
                  <div className="text-sm text-green-700 space-y-1">
                    <div>• Session duration: {formatTime(sessionDuration)}</div>
                    <div>• Stress reduced by {Math.max(0, 65 - stressLevel).toFixed(0)}%</div>
                    <div>• Coherence improved by {Math.max(0, coherenceScore - 3.2).toFixed(1)} points</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </FeatureGate>
  );
};

export default BiofeedbackCoaching;
