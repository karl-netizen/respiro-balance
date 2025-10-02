import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Activity, LogOut, Info } from 'lucide-react';
import { UnifiedHeartRateManager } from '@/services/biofeedback/UnifiedHeartRateManager';
import { toast } from 'sonner';

interface FitbitConnectionCardProps {
  manager: UnifiedHeartRateManager;
  onConnectionChange?: (connected: boolean) => void;
}

export const FitbitConnectionCard: React.FC<FitbitConnectionCardProps> = ({
  manager,
  onConnectionChange
}) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(manager.isFitbitAuthenticated());

  const handleConnect = () => {
    setIsConnecting(true);
    
    const result = manager.connectFitbit();
    
    if (result.success) {
      setIsConnected(true);
      toast.success('Connected to Fitbit', {
        description: result.message
      });
      onConnectionChange?.(true);
    } else if (result.requiresRedirect) {
      toast.info('Redirecting to Fitbit...', {
        description: 'You will be redirected to authenticate'
      });
      // User will be redirected, no need to reset state
    } else {
      toast.error('Connection failed', {
        description: result.message
      });
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    manager.logoutFitbit();
    await manager.disconnect();
    setIsConnected(false);
    toast.info('Disconnected from Fitbit');
    onConnectionChange?.(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Fitbit API Connection
          </div>
          {isConnected && (
            <Badge variant="secondary" className="gap-1 bg-success/20 text-success border-success/30">
              <div className="h-2 w-2 rounded-full bg-success" />
              Connected
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-accent/50 border border-border rounded-lg p-4">
          <div className="flex items-start gap-2">
            <Info className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div className="text-sm space-y-2">
              <p className="font-medium">Fitbit API Connection</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
                <li>Syncs data every 15 seconds</li>
                <li>Requires Fitbit account</li>
                <li>Works with all Fitbit devices</li>
                <li>No Bluetooth pairing needed</li>
              </ul>
            </div>
          </div>
        </div>

        {!isConnected ? (
          <Button
            onClick={handleConnect}
            disabled={isConnecting}
            className="w-full"
          >
            <Activity className="h-4 w-4 mr-2" />
            {isConnecting ? 'Connecting...' : 'Connect Fitbit Account'}
          </Button>
        ) : (
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground text-center p-2 bg-success/10 rounded-lg">
              Your Fitbit data will update every 15 seconds
            </div>
            <Button
              onClick={handleDisconnect}
              variant="outline"
              className="w-full"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Disconnect Fitbit
            </Button>
          </div>
        )}

        <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t">
          <p className="font-medium">Setup Requirements:</p>
          <ol className="list-decimal list-inside space-y-1 ml-2">
            <li>Register app at dev.fitbit.com</li>
            <li>Get your Client ID</li>
            <li>Add Client ID to app configuration</li>
            <li>Request Intraday API access from Fitbit</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};

export default FitbitConnectionCard;
