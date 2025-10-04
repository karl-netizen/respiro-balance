
import React from 'react';
import { useSubscription } from '@/components/subscription/SubscriptionProvider';
import { Progress } from '@/components/ui/progress';
import { Clock } from 'lucide-react';

interface MeditationMinutesDisplayProps {
  showIcon?: boolean;
  compact?: boolean;
}

export const MeditationMinutesDisplay: React.FC<MeditationMinutesDisplayProps> = ({
  showIcon = true,
  compact = false
}) => {
  const { subscription, isPremium } = useSubscription();
  
  // Don't show for premium users
  if (isPremium) return null;
  
  // Mock data for free tier - in production this would come from user profile
  const minutesUsed = 0; // Would be tracked in user profile
  const minutesLimit = 60; // Free tier limit
  const usagePercentage = Math.min(Math.round((minutesUsed / minutesLimit) * 100), 100);
  
  return (
    <div className={`${compact ? 'space-y-1' : 'space-y-2'}`}>
      <div className="flex items-center justify-between text-xs">
        {showIcon && <Clock className="h-3 w-3 mr-1" />}
        <span className={`${compact ? 'text-xs' : 'text-sm'} flex-grow`}>
          Meditation Minutes
        </span>
        <span className="font-medium">
          {minutesUsed}/{minutesLimit}
        </span>
      </div>
      <Progress value={usagePercentage} className="h-1.5" />
    </div>
  );
};

export default MeditationMinutesDisplay;
