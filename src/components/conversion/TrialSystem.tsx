
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Clock, Star, Gift, ArrowRight } from 'lucide-react';

interface TrialSystemProps {
  trialTier: 'premium' | 'premium-pro' | 'premium-plus';
  trialStartDate: string;
  onUpgrade: (tier: string) => void;
  onExtendTrial?: () => void;
}

export const TrialSystem: React.FC<TrialSystemProps> = ({
  trialTier,
  trialStartDate,
  onUpgrade,
  onExtendTrial
}) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });
  const [trialProgress, setTrialProgress] = useState(0);

  const trialDurations = {
    'premium': 7,
    'premium-pro': 7,
    'premium-plus': 3
  };

  const trialDuration = trialDurations[trialTier];

  useEffect(() => {
    const calculateTimeLeft = () => {
      const start = new Date(trialStartDate);
      const end = new Date(start.getTime() + trialDuration * 24 * 60 * 60 * 1000);
      const now = new Date();
      const diff = end.getTime() - now.getTime();

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
        setTimeLeft({ days, hours, minutes });
        
        const elapsed = now.getTime() - start.getTime();
        const total = end.getTime() - start.getTime();
        const progress = (elapsed / total) * 100;
        setTrialProgress(Math.min(100, Math.max(0, progress)));
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0 });
        setTrialProgress(100);
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 60000);

    return () => clearInterval(interval);
  }, [trialStartDate, trialDuration]);

  const isTrialExpired = timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0;
  const isTrialEndingSoon = timeLeft.days === 0 && timeLeft.hours < 24;

  return (
    <Card className={`${isTrialEndingSoon ? 'border-orange-200 bg-orange-50' : 'border-blue-200 bg-blue-50'}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Gift className="w-5 h-5 text-blue-600" />
            <span>Your Free Trial</span>
            <Badge variant={isTrialExpired ? 'destructive' : isTrialEndingSoon ? 'secondary' : 'default'}>
              {isTrialExpired ? 'Expired' : `${trialTier.replace('-', ' ').toUpperCase()}`}
            </Badge>
          </CardTitle>
          {!isTrialExpired && (
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Time remaining</div>
              <div className="font-bold text-lg">
                {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m
              </div>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {!isTrialExpired && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Trial Progress</span>
              <span>{Math.round(trialProgress)}% complete</span>
            </div>
            <Progress value={trialProgress} className="h-2" />
          </div>
        )}

        {isTrialExpired ? (
          <div className="space-y-4">
            <div className="text-center py-4">
              <Clock className="w-12 h-12 text-red-500 mx-auto mb-2" />
              <h3 className="font-semibold text-lg">Your trial has expired</h3>
              <p className="text-muted-foreground">Continue enjoying premium features</p>
            </div>
            
            <div className="space-y-2">
              <Button 
                className="w-full" 
                onClick={() => onUpgrade(trialTier)}
              >
                Continue with {trialTier.replace('-', ' ')} - $11.97/mo
              </Button>
              
              {onExtendTrial && (
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={onExtendTrial}
                >
                  Extend Trial (3 more days)
                </Button>
              )}
            </div>
          </div>
        ) : isTrialEndingSoon ? (
          <div className="space-y-4">
            <div className="bg-orange-100 border border-orange-200 rounded-lg p-3">
              <div className="flex items-center space-x-2 text-orange-800">
                <Clock className="w-4 h-4" />
                <span className="font-medium">Trial ending soon!</span>
              </div>
              <p className="text-sm text-orange-700 mt-1">
                Don't lose access to your premium features
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <Button 
                className="w-full"
                onClick={() => onUpgrade(trialTier)}
              >
                <Star className="w-4 h-4 mr-2" />
                Upgrade Now - Save 50%
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {/* Set reminder */}}
              >
                Remind Me Later
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-blue-100 border border-blue-200 rounded-lg p-3">
              <h4 className="font-medium text-blue-800 mb-2">Enjoying your trial?</h4>
              <p className="text-sm text-blue-700">
                You have access to all {trialTier.replace('-', ' ')} features. Upgrade anytime to keep them after your trial.
              </p>
            </div>

            <div className="flex space-x-2">
              <Button 
                className="flex-1"
                onClick={() => onUpgrade(trialTier)}
              >
                Upgrade Early
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => {/* Send feedback */}}
              >
                Send Feedback
              </Button>
            </div>

            {/* Trial Features Reminder */}
            <div className="text-xs text-muted-foreground space-y-1">
              <div>✓ All premium meditations unlocked</div>
              <div>✓ Advanced analytics available</div>
              <div>✓ No ads or limitations</div>
              {trialTier !== 'premium' && <div>✓ Expert coaching sessions</div>}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
