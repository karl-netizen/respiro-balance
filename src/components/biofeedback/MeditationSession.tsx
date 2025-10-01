import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, Activity, TrendingDown, TrendingUp } from 'lucide-react';
import { analyzeMeditationState, getBreathingGuidance, type HeartRateReading, type MeditationState } from '@/utils/meditationAnalysis';

interface MeditationSessionProps {
  heartRate: number;
  isConnected: boolean;
}

interface SessionStats {
  minHR: number | null;
  maxHR: number | null;
  avgHR: number | null;
  timeInDeep: number;
}

export const MeditationSession: React.FC<MeditationSessionProps> = ({ heartRate, isConnected }) => {
  const [sessionActive, setSessionActive] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [hrHistory, setHrHistory] = useState<HeartRateReading[]>([]);
  const [meditationState, setMeditationState] = useState<MeditationState | null>(null);
  const [sessionStats, setSessionStats] = useState<SessionStats>({
    minHR: null,
    maxHR: null,
    avgHR: null,
    timeInDeep: 0
  });

  const sessionTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (sessionActive && heartRate > 0) {
      setHrHistory(prev => {
        const newHistory = [...prev, { hr: heartRate, time: Date.now() }];
        return newHistory.slice(-120);
      });
    }
  }, [heartRate, sessionActive]);

  useEffect(() => {
    if (hrHistory.length > 0 && sessionActive) {
      const analysis = analyzeMeditationState(hrHistory);
      setMeditationState(analysis);

      const hrs = hrHistory.map(d => d.hr);
      setSessionStats(prev => ({
        minHR: Math.min(...hrs),
        maxHR: Math.max(...hrs),
        avgHR: Math.round(hrs.reduce((sum, hr) => sum + hr, 0) / hrs.length),
        timeInDeep: prev.timeInDeep + (analysis.state === 'deep-meditation' ? 1 : 0)
      }));
    }
  }, [hrHistory, sessionActive]);

  useEffect(() => {
    return () => {
      if (sessionTimerRef.current) {
        clearInterval(sessionTimerRef.current);
      }
    };
  }, []);

  const startSession = () => {
    if (!isConnected) return;
    setSessionActive(true);
    setSessionTime(0);
    setHrHistory([]);
    setSessionStats({ minHR: null, maxHR: null, avgHR: null, timeInDeep: 0 });
    
    sessionTimerRef.current = setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 1000);
  };

  const pauseSession = () => {
    setSessionActive(false);
    if (sessionTimerRef.current) {
      clearInterval(sessionTimerRef.current);
    }
  };

  const resetSession = () => {
    pauseSession();
    setSessionTime(0);
    setHrHistory([]);
    setSessionStats({ minHR: null, maxHR: null, avgHR: null, timeInDeep: 0 });
    setMeditationState(null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStateColor = (state: string) => {
    const colors: Record<string, string> = {
      'deep-meditation': 'bg-purple-500/10 text-purple-600 border-purple-500/20',
      'relaxed': 'bg-blue-500/10 text-blue-600 border-blue-500/20',
      'focused': 'bg-green-500/10 text-green-600 border-green-500/20',
      'active': 'bg-orange-500/10 text-orange-600 border-orange-500/20',
      'warming-up': 'bg-muted text-muted-foreground border-muted'
    };
    return colors[state] || colors['warming-up'];
  };

  const breathingGuidance = meditationState ? getBreathingGuidance(meditationState.state) : null;

  return (
    <div className="space-y-4">
      {/* Session Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Meditation Session</span>
            <div className="text-3xl font-mono text-primary">
              {formatTime(sessionTime)}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex gap-2">
          {!sessionActive ? (
            <Button
              onClick={startSession}
              disabled={!isConnected}
              className="flex-1"
            >
              <Play className="h-4 w-4 mr-2" />
              Start Session
            </Button>
          ) : (
            <Button
              onClick={pauseSession}
              variant="secondary"
              className="flex-1"
            >
              <Pause className="h-4 w-4 mr-2" />
              Pause
            </Button>
          )}
          <Button onClick={resetSession} variant="outline">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>

      {/* Meditation State Analysis */}
      {meditationState && sessionActive && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Meditation Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className={`p-4 rounded-lg border ${getStateColor(meditationState.state)}`}>
                  <div className="text-sm font-medium opacity-80 mb-1">State</div>
                  <div className="text-2xl font-bold capitalize">
                    {meditationState.state.replace('-', ' ')}
                  </div>
                  <div className="text-sm mt-1">{meditationState.confidence}% confidence</div>
                </div>
                
                <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
                  <div className="text-sm font-medium opacity-80 mb-1">Avg HR</div>
                  <div className="text-2xl font-bold">
                    {Math.round(meditationState.avgHR)} BPM
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    {meditationState.trend < -0.5 ? (
                      <TrendingDown className="text-success" size={16} />
                    ) : meditationState.trend > 0.5 ? (
                      <TrendingUp className="text-warning" size={16} />
                    ) : null}
                    <span className="text-sm">
                      HRV: {Math.round(meditationState.hrVariability)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Breathing Guidance */}
              {breathingGuidance && (
                <div className="bg-gradient-to-r from-primary/5 to-accent/5 p-6 rounded-lg border border-primary/10">
                  <div className="text-center mb-4">
                    <div className="text-sm font-medium text-muted-foreground mb-2">
                      {breathingGuidance.message}
                    </div>
                    <div className="text-lg font-semibold">
                      Recommended Breathing Pattern
                    </div>
                  </div>
                  <div className="flex justify-center gap-8">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary">
                        {breathingGuidance.inhale}s
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">Inhale</div>
                    </div>
                    {breathingGuidance.hold > 0 && (
                      <div className="text-center">
                        <div className="text-3xl font-bold text-info">
                          {breathingGuidance.hold}s
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">Hold</div>
                      </div>
                    )}
                    <div className="text-center">
                      <div className="text-3xl font-bold text-accent">
                        {breathingGuidance.exhale}s
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">Exhale</div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Session Statistics */}
          {sessionStats.avgHR && (
            <Card>
              <CardHeader>
                <CardTitle>Session Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-success/10 p-4 rounded-lg border border-success/20">
                    <div className="text-sm text-success opacity-80">Min HR</div>
                    <div className="text-2xl font-bold text-success">
                      {sessionStats.minHR}
                    </div>
                  </div>
                  <div className="bg-destructive/10 p-4 rounded-lg border border-destructive/20">
                    <div className="text-sm text-destructive opacity-80">Max HR</div>
                    <div className="text-2xl font-bold text-destructive">
                      {sessionStats.maxHR}
                    </div>
                  </div>
                  <div className="bg-info/10 p-4 rounded-lg border border-info/20">
                    <div className="text-sm text-info opacity-80">Avg HR</div>
                    <div className="text-2xl font-bold text-info">
                      {sessionStats.avgHR}
                    </div>
                  </div>
                  <div className="bg-purple-500/10 p-4 rounded-lg border border-purple-500/20">
                    <div className="text-sm text-purple-600 opacity-80">Deep State</div>
                    <div className="text-2xl font-bold text-purple-600">
                      {formatTime(sessionStats.timeInDeep)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Heart Rate Trend Chart */}
          {hrHistory.length > 5 && (
            <Card>
              <CardHeader>
                <CardTitle>Heart Rate Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-32 flex items-end justify-between gap-1">
                  {hrHistory.slice(-60).map((data, i) => {
                    const maxHr = Math.max(...hrHistory.map(d => d.hr));
                    const minHr = Math.min(...hrHistory.map(d => d.hr));
                    const range = maxHr - minHr || 1;
                    const height = ((data.hr - minHr) / range) * 100;
                    
                    return (
                      <div
                        key={i}
                        className="flex-1 bg-gradient-to-t from-primary to-primary-glow rounded-t"
                        style={{ height: `${height}%`, minHeight: '4px' }}
                      />
                    );
                  })}
                </div>
                <div className="flex justify-between text-sm text-muted-foreground mt-2">
                  <span>Last minute</span>
                  <span>Now</span>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Info when not active */}
      {!sessionActive && (
        <Card>
          <CardContent className="py-8 text-center space-y-4">
            <Activity className="h-12 w-12 mx-auto text-muted-foreground" />
            <div>
              <h3 className="text-xl font-semibold mb-2">Start Your Meditation Session</h3>
              <p className="text-muted-foreground">
                {isConnected 
                  ? 'Click "Start Session" to begin tracking your meditation state'
                  : 'Connect your heart rate monitor first to start a session'
                }
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-4 text-left pt-4">
              <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
                <div className="font-semibold mb-2">📊 Real-time Analysis</div>
                <div className="text-sm text-muted-foreground">
                  Track your meditation state based on heart rate patterns
                </div>
              </div>
              <div className="bg-accent/5 p-4 rounded-lg border border-accent/10">
                <div className="font-semibold mb-2">🧘 Guided Breathing</div>
                <div className="text-sm text-muted-foreground">
                  Personalized breathing guidance based on your current state
                </div>
              </div>
              <div className="bg-success/5 p-4 rounded-lg border border-success/10">
                <div className="font-semibold mb-2">📈 Session Tracking</div>
                <div className="text-sm text-muted-foreground">
                  Monitor progress and time spent in deep meditation
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
