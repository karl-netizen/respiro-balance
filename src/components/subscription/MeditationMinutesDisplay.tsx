
import React from 'react';
import { useSubscriptionContext } from '@/context/SubscriptionProvider';
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
  const { subscriptionData, isPremium } = useSubscriptionContext();
  
  if (isPremium) return null;
  
  const minutesUsed = subscriptionData?.meditation_minutes_used || 0;
  const minutesLimit = subscriptionData?.meditation_minutes_limit || 60;
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
