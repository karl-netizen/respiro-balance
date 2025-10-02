import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UnifiedHeartRateManager } from '@/services/biofeedback/UnifiedHeartRateManager';
import { Loader2 } from 'lucide-react';

/**
 * Fitbit OAuth Callback Page
 * Handles the redirect from Fitbit OAuth and extracts tokens
 */
const FitbitCallback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = () => {
      const manager = new UnifiedHeartRateManager();
      
      if (window.location.hash.includes('access_token')) {
        const success = manager.handleFitbitCallback();
        
        if (success) {
          console.log('✅ Fitbit authentication successful');
          setTimeout(() => {
            navigate('/biofeedback', { state: { autoConnectFitbit: true } });
          }, 1500);
        } else {
          console.error('❌ Failed to process Fitbit callback');
          setTimeout(() => {
            navigate('/biofeedback', { state: { error: 'Authentication failed' } });
          }, 1500);
        }
      } else {
        console.error('❌ No access token in callback');
        setTimeout(() => {
          navigate('/biofeedback', { state: { error: 'No access token received' } });
        }, 1500);
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Connecting to Fitbit</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4 py-8">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground text-center">
            Processing authentication...
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default FitbitCallback;
