
import React from 'react';
import { useSubscriptionContext } from '@/hooks/useSubscriptionContext';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Crown, AlertCircle } from 'lucide-react';

export const SubscriptionBanner = () => {
  const { 
    subscriptionData, 
    isPremium, 
    hasExceededUsageLimit,
    tierName,
    startPremiumCheckout 
  } = useSubscriptionContext();
  
  // If premium, don't show the banner
  if (isPremium) return null;
  
  const minutesUsed = subscriptionData?.meditation_minutes_used || 0;
  const minutesLimit = subscriptionData?.meditation_minutes_limit || 60;
  const usagePercentage = Math.min(Math.round((minutesUsed / minutesLimit) * 100), 100);
  
  const handleUpgrade = async () => {
    try {
      const checkoutUrl = await startPremiumCheckout();
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error('Error starting checkout:', error);
    }
  };
  
  return (
    <div className="rounded-lg border p-4 mb-6 bg-background">
      <div className="flex flex-col space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Current Plan: {tierName}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1 bg-primary/10 hover:bg-primary/20 text-primary border-primary/20"
            onClick={handleUpgrade}
          >
            <Crown className="h-4 w-4" />
            <span>Upgrade</span>
          </Button>
        </div>
        
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span>Meditation Minutes</span>
            <span>
              {minutesUsed} / {minutesLimit} minutes
            </span>
          </div>
          <Progress value={usagePercentage} className="h-2" />
        </div>
        
        {hasExceededUsageLimit && (
          <Alert variant="destructive" className="py-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs ml-2">
              You've reached your monthly limit. Upgrade for unlimited meditation sessions.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="text-xs text-muted-foreground">
          <p>Upgrade to Premium for unlimited meditation minutes, advanced features, and personalized recommendations.</p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionBanner;
