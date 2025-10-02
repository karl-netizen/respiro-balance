import React, { useState, useEffect, useRef } from 'react';
import { Heart, Activity, TrendingDown, TrendingUp, Play, Pause, RotateCcw, Info, Bluetooth, Clock, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UnifiedHeartRateManager } from '@/services/biofeedback/UnifiedHeartRateManager';
import { DeviceCompatibilityModal } from '@/components/meditation/DeviceCompatibilityModal';
import { BrowserCompatibilityCheck } from '@/components/biofeedback/BrowserCompatibilityCheck';
import {
  analyzeMeditationState,
  getBreathingGuidance,
  getStateColorClasses,
  formatTime,
  type HeartRateDataPoint,
  type MeditationState
} from '@/utils/meditationAnalysis';
import { toast } from 'sonner';

interface SessionStats {
  minHR: number | null;
  maxHR: number | null;
  avgHR: number | null;
  timeInDeep: number;
}

const MeditationMonitorPage: React.FC = () => {
  const [connected, setConnected] = useState(false);
  const [deviceName, setDeviceName] = useState('');
  const [connectionType, setConnectionType] = useState<'bluetooth' | 'fitbit' | ''>('');
  const [currentHR, setCurrentHR] = useState(0);
  const [hrHistory, setHrHistory] = useState<HeartRateDataPoint[]>([]);
  const [meditationState, setMeditationState] = useState<MeditationState | null>(null);
  const [sessionActive, setSessionActive] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [sessionStats, setSessionStats] = useState<SessionStats>({
    minHR: null,
    maxHR: null,
    avgHR: null,
    timeInDeep: 0
  });
  const [showCompatibility, setShowCompatibility] = useState(false);
  const [showConnectionMenu, setShowConnectionMenu] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const managerRef = useRef<UnifiedHeartRateManager | null>(null);
  const sessionTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    managerRef.current = new UnifiedHeartRateManager();

    managerRef.current.onData((data) => {
      if (data.type === 'heartrate' && data.heartRate) {
        if (data.heartRate > 0 && data.heartRate < 250) {
          setCurrentHR(data.heartRate);
          
          setHrHistory(prev => {
            const newHistory = [...prev, { hr: data.heartRate!, time: data.timestamp || Date.now() }];
            return newHistory.slice(-120);
          });
        }
      } else if (data.type === 'disconnected') {
        setConnected(false);
        setSessionActive(false);
        setCurrentHR(0);
        setConnectionType('');
        toast.info('Device disconnected');
      }
    });

    return () => {
      if (managerRef.current) {
        managerRef.current.disconnect();
      }
      if (sessionTimerRef.current) {
        clearInterval(sessionTimerRef.current);
      }
    };
  }, []);

  const handleConnectBluetooth = async () => {
    if (!managerRef.current) return;
    
    setIsConnecting(true);
    setShowConnectionMenu(false);
    
    try {
      const result = await managerRef.current.connectBluetooth();
      
      if (result.success) {
        setConnected(true);
        setDeviceName(result.deviceName || 'Bluetooth Device');
        setConnectionType('bluetooth');
        toast.success('Connected', {
          description: result.message
        });
      } else {
        toast.error('Connection failed', {
          description: result.message
        });
      }
    } catch (error: any) {
      toast.error('Connection failed', {
        description: error.message
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleConnectFitbit = () => {
    if (!managerRef.current) return;
    
    setShowConnectionMenu(false);
    const result = managerRef.current.connectFitbit();
    
    if (result.success) {
      setConnected(true);
      setDeviceName(result.deviceName || 'Fitbit Device');
      setConnectionType('fitbit');
      toast.success('Connected to Fitbit');
    }
  };

  const handleDisconnect = async () => {
    if (managerRef.current) {
      await managerRef.current.disconnect();
      setConnected(false);
      setSessionActive(false);
      setCurrentHR(0);
      setDeviceName('');
      setConnectionType('');
      toast.info('Disconnected');
    }
  };

  const startSession = () => {
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

  const breathingGuidance = meditationState ? getBreathingGuidance(meditationState.state) : null;

  return (
    <BrowserCompatibilityCheck>
      <div className="min-h-screen bg-gradient-to-br from-background to-accent/20 p-4">
        {showCompatibility && <DeviceCompatibilityModal onClose={() => setShowCompatibility(false)} />}
        
        <div className="max-w-4xl mx-auto space-y-4">
        {/* Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold flex items-center gap-2">
                  <Heart className="text-primary" />
                  Meditation Monitor
                </h1>
                <p className="text-muted-foreground mt-1">Real-time heart rate guided meditation</p>
              </div>
              {!connected ? (
                <div className="relative">
                  <Button
                    onClick={() => setShowConnectionMenu(!showConnectionMenu)}
                    disabled={isConnecting}
                  >
                    {isConnecting ? 'Connecting...' : 'Connect Device'}
                  </Button>
                  
                  {showConnectionMenu && (
                    <Card className="absolute right-0 mt-2 w-80 z-10">
                      <CardContent className="p-4">
                        <h3 className="font-bold mb-3">Choose Connection Method</h3>
                        
                        <div className="space-y-3">
                          <Button
                            onClick={handleConnectBluetooth}
                            className="w-full justify-start h-auto py-4"
                            variant="outline"
                          >
                            <div className="flex flex-col items-start gap-2 w-full">
                              <div className="flex items-center gap-3">
                                <Bluetooth size={24} />
                                <span className="font-semibold">Bluetooth Device</span>
                                <Badge className="ml-auto">RECOMMENDED</Badge>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Real-time updates • No delay • Best for meditation
                              </div>
                            </div>
                          </Button>

                          <Button
                            onClick={handleConnectFitbit}
                            className="w-full justify-start h-auto py-4"
                            variant="outline"
                          >
                            <div className="flex flex-col items-start gap-2 w-full">
                              <div className="flex items-center gap-3">
                                <Clock size={24} />
                                <span className="font-semibold">Fitbit (API)</span>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                15-30s delay • Requires Fitbit app
                              </div>
                            </div>
                          </Button>

                          <Button
                            onClick={() => {
                              setShowCompatibility(true);
                              setShowConnectionMenu(false);
                            }}
                            variant="ghost"
                            className="w-full text-sm"
                          >
                            <Info size={16} className="mr-2" />
                            View Full Compatibility Guide
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              ) : (
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">
                    Connected via {connectionType === 'bluetooth' ? 'Bluetooth' : 'Fitbit API'}
                  </div>
                  <div className="font-semibold flex items-center gap-2 justify-end">
                    {connectionType === 'bluetooth' && <Zap className="text-success" size={16} />}
                    {deviceName}
                  </div>
                  <Button
                    onClick={handleDisconnect}
                    variant="ghost"
                    size="sm"
                    className="mt-1 text-destructive hover:text-destructive"
                  >
                    Disconnect
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Device Compatibility Notice */}
        {!connected && (
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Info className="text-primary flex-shrink-0 mt-1" size={20} />
                <div className="flex-1">
                  <div className="font-semibold mb-1">
                    Important: Device Compatibility
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">
                    <strong>Fitbit devices</strong> require app sync with 15-30 second delay. 
                    For <strong>real-time meditation</strong>, we recommend Bluetooth chest straps like Polar H10 or CooSpo H6.
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setShowCompatibility(true)}
                      variant="link"
                      size="sm"
                      className="p-0 h-auto"
                    >
                      Device compatibility →
                    </Button>
                    <Button
                      onClick={() => window.open('/setup-guide', '_blank')}
                      variant="link"
                      size="sm"
                      className="p-0 h-auto"
                    >
                      Full setup guide →
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {connected && (
          <>
            {/* Current Heart Rate */}
            <Card className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
              <CardContent className="p-8 text-center">
                <div className="flex items-center justify-center gap-2 text-lg font-medium opacity-90 mb-2">
                  Current Heart Rate
                  {connectionType === 'bluetooth' && (
                    <Badge variant="secondary" className="bg-success/20 text-success">
                      <Zap size={12} className="mr-1" /> Real-time
                    </Badge>
                  )}
                </div>
                <div className="text-7xl font-bold mb-2">{currentHR || '--'}</div>
                <div className="text-xl opacity-90">BPM</div>
              </CardContent>
            </Card>

            {/* Session Controls */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold">Meditation Session</h2>
                    <div className="text-3xl font-mono font-bold text-primary mt-2">
                      {formatTime(sessionTime)}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {!sessionActive ? (
                      <Button
                        onClick={startSession}
                        size="lg"
                        title="Start Session"
                      >
                        <Play size={24} />
                      </Button>
                    ) : (
                      <Button
                        onClick={pauseSession}
                        size="lg"
                        variant="secondary"
                        title="Pause Session"
                      >
                        <Pause size={24} />
                      </Button>
                    )}
                    <Button
                      onClick={resetSession}
                      size="lg"
                      variant="outline"
                      title="Reset Session"
                    >
                      <RotateCcw size={24} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Meditation State */}
            {meditationState && sessionActive && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity />
                    Meditation Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className={`p-4 rounded-lg ${getStateColorClasses(meditationState.state)}`}>
                      <div className="text-sm font-medium opacity-80 mb-1">State</div>
                      <div className="text-2xl font-bold capitalize">
                        {meditationState.state.replace('-', ' ')}
                      </div>
                      <div className="text-sm mt-1">{meditationState.confidence}% confidence</div>
                    </div>
                    
                    <div className="bg-accent p-4 rounded-lg">
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
                    <div className="bg-accent/50 p-6 rounded-lg">
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
                            <div className="text-3xl font-bold text-primary">
                              {breathingGuidance.hold}s
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">Hold</div>
                          </div>
                        )}
                        <div className="text-center">
                          <div className="text-3xl font-bold text-primary">
                            {breathingGuidance.exhale}s
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">Exhale</div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Session Statistics */}
            {sessionStats.avgHR && (
              <Card>
                <CardHeader>
                  <CardTitle>Session Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-success/10 p-4 rounded-lg">
                      <div className="text-sm text-muted-foreground">Min HR</div>
                      <div className="text-2xl font-bold">
                        {sessionStats.minHR}
                      </div>
                    </div>
                    <div className="bg-destructive/10 p-4 rounded-lg">
                      <div className="text-sm text-muted-foreground">Max HR</div>
                      <div className="text-2xl font-bold">
                        {sessionStats.maxHR}
                      </div>
                    </div>
                    <div className="bg-primary/10 p-4 rounded-lg">
                      <div className="text-sm text-muted-foreground">Avg HR</div>
                      <div className="text-2xl font-bold">
                        {sessionStats.avgHR}
                      </div>
                    </div>
                    <div className="bg-accent p-4 rounded-lg">
                      <div className="text-sm text-muted-foreground">Deep State</div>
                      <div className="text-2xl font-bold">
                        {formatTime(sessionStats.timeInDeep)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Heart Rate Chart */}
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
                          className="flex-1 bg-gradient-to-t from-primary to-primary/50 rounded-t"
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

        {/* Info when not connected */}
        {!connected && (
          <Card>
            <CardContent className="p-8 text-center">
              <Heart className="mx-auto text-muted-foreground mb-4" size={64} />
              <h2 className="text-2xl font-bold mb-2">
                Connect Your Heart Rate Monitor
              </h2>
              <p className="text-muted-foreground mb-6">
                Support for Bluetooth devices and Fitbit API
              </p>
              <div className="grid md:grid-cols-3 gap-4 text-left">
                <div className="bg-accent/50 p-4 rounded-lg">
                  <div className="font-semibold mb-2">📊 Real-time Analysis</div>
                  <div className="text-sm text-muted-foreground">
                    Track your meditation state based on heart rate patterns
                  </div>
                </div>
                <div className="bg-accent/50 p-4 rounded-lg">
                  <div className="font-semibold mb-2">🧘 Guided Breathing</div>
                  <div className="text-sm text-muted-foreground">
                    Personalized breathing guidance based on your current state
                  </div>
                </div>
                <div className="bg-accent/50 p-4 rounded-lg">
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
    </div>
    </BrowserCompatibilityCheck>
  );
};

export default MeditationMonitorPage;
