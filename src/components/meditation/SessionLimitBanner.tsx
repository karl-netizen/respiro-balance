import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, Crown } from 'lucide-react';
import { FREE_TIER_WEEKLY_LIMIT } from '@/utils/tierAccess';

interface SessionLimitBannerProps {
  remainingSessions: number;
  onUpgrade: () => void;
}

export const SessionLimitBanner: React.FC<SessionLimitBannerProps> = ({
  remainingSessions,
  onUpgrade
}) => {
  if (remainingSessions === 0) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Weekly Limit Reached</AlertTitle>
        <AlertDescription className="flex items-center justify-between">
          <span>
            You've used all {FREE_TIER_WEEKLY_LIMIT} free sessions this week. Upgrade for unlimited access!
          </span>
          <Button 
            size="sm" 
            onClick={onUpgrade}
            className="ml-4 whitespace-nowrap"
          >
            <Crown className="h-3 w-3 mr-1" />
            Upgrade
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (remainingSessions <= 1) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Almost at your weekly limit</AlertTitle>
        <AlertDescription className="flex items-center justify-between">
          <span>
            {remainingSessions} free session{remainingSessions !== 1 ? 's' : ''} remaining this week
          </span>
          <Button 
            size="sm" 
            variant="outline"
            onClick={onUpgrade}
            className="ml-4 whitespace-nowrap"
          >
            <Crown className="h-3 w-3 mr-1" />
            Upgrade
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return null;
};
