
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { useSubscription } from '@/components/subscription/SubscriptionProvider';
import { Crown } from 'lucide-react';

interface SubscriptionBadgeProps {
  className?: string;
  showIcon?: boolean;
}

export const SubscriptionBadge: React.FC<SubscriptionBadgeProps> = ({ 
  className = '',
  showIcon = true
}) => {
  const { subscription, isPremium } = useSubscription();
  const tierName = subscription.tier || 'free';
  
  return (
    <Badge 
      variant={isPremium ? "default" : "outline"} 
      className={`${className} ${isPremium ? 'bg-primary/20 text-primary hover:bg-primary/30' : ''}`}
    >
      {showIcon && isPremium && <Crown className="h-3 w-3 mr-1" />}
      {tierName}
    </Badge>
  );
};

export default SubscriptionBadge;
