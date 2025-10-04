import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { useNavigate } from 'react-router-dom';
import { Activity, Zap, TrendingUp } from 'lucide-react';

export const SessionCounterWidget: React.FC = () => {
  const navigate = useNavigate();
  const { tier, sessionsUsed, sessionsLimit, getSessionsRemaining } = useSubscriptionStore();

  // Don't show for premium users (unlimited)
  if (tier === 'premium') {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            Session Usage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <Badge variant="secondary" className="text-base px-4 py-2">
              <Zap className="w-4 h-4 mr-2" />
              Unlimited Sessions
            </Badge>
            <p className="text-sm text-muted-foreground mt-3">
              Enjoy unlimited meditation sessions with Premium
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const sessionsRemaining = getSessionsRemaining();
  const progressPercentage = (sessionsUsed / sessionsLimit) * 100;
  
  // Determine status
  const isOutOfSessions = sessionsRemaining === 0;
  const isRunningLow = sessionsRemaining <= 5 && sessionsRemaining > 0;

  return (
    <Card className={isOutOfSessions ? 'border-destructive' : ''}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Session Usage
          </div>
          {isOutOfSessions && (
            <Badge variant="destructive">Out of sessions</Badge>
          )}
          {isRunningLow && (
            <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-700 dark:text-yellow-400">
              Running low
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-2xl font-bold">
              {sessionsUsed} / {sessionsLimit}
            </span>
            <span className="text-sm text-muted-foreground">
              {sessionsRemaining} remaining
            </span>
          </div>
          
          <Progress 
            value={progressPercentage} 
            className="h-2"
          />
        </div>

        {isOutOfSessions ? (
          <div className="space-y-3 pt-2">
            <p className="text-sm text-muted-foreground">
              You've reached your monthly session limit. Upgrade to continue your wellness journey.
            </p>
            <Button 
              onClick={() => navigate('/pricing')}
              className="w-full"
              size="sm"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Upgrade Now
            </Button>
          </div>
        ) : isRunningLow ? (
          <div className="space-y-2 pt-2">
            <p className="text-sm text-muted-foreground">
              You're running low on sessions. Consider upgrading for more.
            </p>
            <Button 
              onClick={() => navigate('/pricing')}
              variant="outline"
              className="w-full"
              size="sm"
            >
              View Plans
            </Button>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Sessions reset on the 1st of each month
          </p>
        )}
      </CardContent>
    </Card>
  );
};
