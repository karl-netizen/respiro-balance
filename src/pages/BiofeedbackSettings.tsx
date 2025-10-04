/**
 * Biofeedback Settings Page
 */

import { useBiofeedbackStore } from '@/store/biofeedbackStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  Activity, 
  Brain, 
  Smartphone, 
  Shield,
  Download,
  Trash2,
  ArrowLeft
} from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

export function BiofeedbackSettings() {
  const navigate = useNavigate();
  const {
    isConnected,
    currentMetrics,
    lastSyncTime,
    sessionInsights,
    disconnectHealthApp,
    syncHealthData
  } = useBiofeedbackStore();

  const handleDisconnect = () => {
    if (confirm('Are you sure you want to disconnect? Your data will be preserved.')) {
      disconnectHealthApp();
    }
  };

  const handleExportData = () => {
    const data = {
      metrics: currentMetrics,
      insights: sessionInsights
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `biofeedback-data-${format(new Date(), 'yyyy-MM-dd')}.json`;
    a.click();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/dashboard')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-bold mb-2">Biofeedback Settings</h1>
        <p className="text-muted-foreground">
          Manage your health data connection and privacy
        </p>
      </div>

      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="w-5 h-5" />
            Connection Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Health App</p>
              <p className="text-sm text-muted-foreground">
                {isConnected ? 'Connected & syncing' : 'Not connected'}
              </p>
            </div>
            <Badge variant={isConnected ? 'default' : 'secondary'}>
              {isConnected ? 'Active' : 'Inactive'}
            </Badge>
          </div>

          {isConnected && lastSyncTime && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Last sync</span>
              <span>{format(new Date(lastSyncTime), 'MMM d, h:mm a')}</span>
            </div>
          )}

          {isConnected && (
            <div className="flex gap-2">
              <Button variant="outline" onClick={syncHealthData} className="flex-1">
                Sync Now
              </Button>
              <Button variant="outline" onClick={handleDisconnect}>
                Disconnect
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tracked Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Tracked Metrics</CardTitle>
          <CardDescription>
            Data collected from your health app
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Heart className="w-5 h-5 text-red-500" />
              <div>
                <p className="font-medium">Resting Heart Rate</p>
                <p className="text-sm text-muted-foreground">Measured in BPM</p>
              </div>
            </div>
            <Switch checked={isConnected} disabled />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Activity className="w-5 h-5 text-blue-500" />
              <div>
                <p className="font-medium">Heart Rate Variability</p>
                <p className="text-sm text-muted-foreground">Measured in ms</p>
              </div>
            </div>
            <Switch checked={isConnected} disabled />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Brain className="w-5 h-5 text-purple-500" />
              <div>
                <p className="font-medium">Stress Score</p>
                <p className="text-sm text-muted-foreground">Calculated metric</p>
              </div>
            </div>
            <Switch checked={isConnected} disabled />
          </div>
        </CardContent>
      </Card>

      {/* Privacy & Data */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Privacy & Data
          </CardTitle>
          <CardDescription>
            Your health data is processed locally and never shared
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted/50 p-4 rounded-lg space-y-2">
            <p className="text-sm font-medium">How we protect your data:</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>All health data is encrypted on your device</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Insights are generated locally</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>We never sell or share your health data</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>You can export or delete your data anytime</span>
              </li>
            </ul>
          </div>

          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={handleExportData}
              disabled={!isConnected}
              className="flex-1"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
            <Button 
              variant="outline" 
              disabled={!isConnected}
              className="flex-1"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Data
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            {sessionInsights.length} session insights • Last updated {lastSyncTime ? format(new Date(lastSyncTime), 'MMM d, yyyy') : 'Never'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default BiofeedbackSettings;
