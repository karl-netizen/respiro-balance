
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { useSubscriptionContext } from '@/context/SubscriptionProvider';
import { Crown } from 'lucide-react';

interface SubscriptionBadgeProps {
  className?: string;
  showIcon?: boolean;
}

export const SubscriptionBadge: React.FC<SubscriptionBadgeProps> = ({ 
  className = '',
  showIcon = true
}) => {
  const { tierName, isPremium } = useSubscriptionContext();
  
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
