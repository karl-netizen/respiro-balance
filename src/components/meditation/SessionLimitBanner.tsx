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
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Weekly Sessions Complete</AlertTitle>
        <AlertDescription className="flex items-center justify-between">
          <span>
            You've completed all {FREE_TIER_WEEKLY_LIMIT} free sessions this week. Great progress! Explore unlimited access when ready.
          </span>
          <Button 
            size="sm" 
            variant="outline"
            onClick={onUpgrade}
            className="ml-4 whitespace-nowrap"
          >
            <Crown className="h-3 w-3 mr-1" />
            View Plans
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (remainingSessions <= 1) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Making great use of your sessions!</AlertTitle>
        <AlertDescription className="flex items-center justify-between">
          <span>
            {remainingSessions} free session{remainingSessions !== 1 ? 's' : ''} left this week. Consider unlimited access for your practice.
          </span>
          <Button 
            size="sm" 
            variant="ghost"
            onClick={onUpgrade}
            className="ml-4 whitespace-nowrap"
          >
            <Crown className="h-3 w-3 mr-1" />
            Explore Plans
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return null;
};
