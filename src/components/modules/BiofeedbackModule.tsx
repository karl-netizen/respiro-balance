/**
 * Biofeedback Module Component
 * Displays current health metrics and connection status
 */

import { useState } from 'react';
import { useBiofeedbackStore } from '@/store/biofeedbackStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Activity, Heart, Brain, TrendingDown, TrendingUp, RefreshCw } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function BiofeedbackModule() {
  const {
    isConnected,
    currentMetrics,
    lastSyncTime,
    connectHealthApp,
    syncHealthData
  } = useBiofeedbackStore();

  const [isConnecting, setIsConnecting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    await connectHealthApp();
    setIsConnecting(false);
  };

  const handleSync = async () => {
    setIsSyncing(true);
    await syncHealthData();
    setIsSyncing(false);
  };

  // Not connected state
  if (!isConnected) {
    return (
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>📱</span> Biofeedback Lite
          </CardTitle>
          <CardDescription>
            Connect your health app to track wellness metrics
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted p-4 rounded-lg space-y-2">
            <p className="text-sm font-medium">What you'll get:</p>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-500" />
                Heart rate tracking
              </li>
              <li className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-500" />
                HRV monitoring
              </li>
              <li className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-purple-500" />
                Stress level insights
              </li>
            </ul>
          </div>
          
          <Button 
            className="w-full" 
            onClick={handleConnect}
            disabled={isConnecting}
          >
            {isConnecting ? 'Connecting...' : 'Connect Health App'}
          </Button>
          
          <p className="text-xs text-muted-foreground text-center">
            Works with Apple Health & Google Fit
          </p>
        </CardContent>
      </Card>
    );
  }

  // Connected state with metrics
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <span>📱</span> Biofeedback Lite
            </CardTitle>
            <CardDescription>
              {lastSyncTime && `Last synced ${formatDistanceToNow(new Date(lastSyncTime))} ago`}
            </CardDescription>
          </div>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleSync}
            disabled={isSyncing}
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Resting Heart Rate */}
        {currentMetrics?.restingHeartRate && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-500" />
                <span className="text-sm font-medium">Resting HR</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">
                  {currentMetrics.restingHeartRate.value}
                </span>
                <span className="text-sm text-muted-foreground">BPM</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Progress value={Math.min(100, (60 / currentMetrics.restingHeartRate.value) * 100)} className="flex-1" />
              <Badge variant={currentMetrics.restingHeartRate.value < 70 ? 'default' : 'secondary'}>
                {currentMetrics.restingHeartRate.value < 70 ? 'Good' : 'Normal'}
              </Badge>
            </div>
          </div>
        )}

        {/* Heart Rate Variability */}
        {currentMetrics?.heartRateVariability && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium">HRV</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">
                  {currentMetrics.heartRateVariability.value}
                </span>
                <span className="text-sm text-muted-foreground">ms</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Progress value={Math.min(100, (currentMetrics.heartRateVariability.value / 60) * 100)} className="flex-1" />
              <Badge variant={currentMetrics.heartRateVariability.value > 40 ? 'default' : 'secondary'}>
                {currentMetrics.heartRateVariability.value > 40 ? 'Good' : 'Fair'}
              </Badge>
            </div>
          </div>
        )}

        {/* Stress Score */}
        {currentMetrics?.stressScore !== null && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-purple-500" />
                <span className="text-sm font-medium">Stress Level</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">
                  {currentMetrics.stressScore}%
                </span>
                {currentMetrics.stressScore < 30 ? (
                  <TrendingDown className="w-4 h-4 text-green-500" />
                ) : (
                  <TrendingUp className="w-4 h-4 text-orange-500" />
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Progress 
                value={100 - currentMetrics.stressScore} 
                className="flex-1" 
              />
              <Badge 
                variant={
                  currentMetrics.stressScore < 30 ? 'default' : 
                  currentMetrics.stressScore < 60 ? 'secondary' : 
                  'destructive'
                }
              >
                {currentMetrics.stressScore < 30 ? 'Low' : 
                 currentMetrics.stressScore < 60 ? 'Moderate' : 
                 'High'}
              </Badge>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
