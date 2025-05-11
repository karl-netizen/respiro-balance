
import React from 'react';
import { Card, CardHeader, CardContent, CardDescription, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSubscriptionContext } from '@/hooks/useSubscriptionContext';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';
import { SubscriptionTier } from '@/context/types';

interface AccountSubscriptionSettingsProps {
  subscriptionTier?: SubscriptionTier | string;
  isPremium?: boolean;
}

const AccountSubscriptionSettings: React.FC<AccountSubscriptionSettingsProps> = ({ subscriptionTier, isPremium }) => {
  const { 
    tierName, 
    subscriptionData 
  } = useSubscriptionContext();
  
  // Use props if provided, otherwise use context values
  const isUserPremium = isPremium !== undefined ? isPremium : false;
  const userTierName = tierName || (subscriptionTier ? subscriptionTier.charAt(0).toUpperCase() + subscriptionTier.slice(1) : 'Free');
  
  const minutesUsed = subscriptionData?.meditation_minutes_used || 0;
  const minutesLimit = subscriptionData?.meditation_minutes_limit || 60;
  const usagePercentage = Math.min(Math.round((minutesUsed / minutesLimit) * 100), 100);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription</CardTitle>
        <CardDescription>
          Manage your subscription and usage
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Current Plan</p>
            <p className="text-sm text-muted-foreground">
              {isUserPremium
                ? "Premium features activated"
                : "Free tier with limited features"}
            </p>
          </div>
          <div className="text-right">
            <p className="font-semibold">{userTierName}</p>
            {!isUserPremium && (
              <p className="text-xs text-muted-foreground">Upgrade for more features</p>
            )}
          </div>
        </div>
        
        {!isUserPremium && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span>Meditation Minutes Usage</span>
              <span className="font-medium">{minutesUsed} / {minutesLimit}</span>
            </div>
            <Progress value={usagePercentage} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {usagePercentage >= 80 
                ? "You're close to your limit. Consider upgrading to premium." 
                : "Monthly usage resets on the 1st of each month."}
            </p>
          </div>
        )}
        
        <div className="pt-2">
          <h4 className="font-medium text-sm mb-2">Plan Features:</h4>
          <ul className="text-sm space-y-1">
            <li className="flex items-baseline">
              <div className="h-1.5 w-1.5 rounded-full bg-primary mr-2 mt-1.5"></div>
              <span>{isUserPremium ? "Unlimited meditation minutes" : "Limited meditation minutes (60/month)"}</span>
            </li>
            <li className="flex items-baseline">
              <div className="h-1.5 w-1.5 rounded-full bg-primary mr-2 mt-1.5"></div>
              <span>{isUserPremium ? "Advanced meditation techniques" : "Basic meditation techniques"}</span>
            </li>
            <li className="flex items-baseline">
              <div className="h-1.5 w-1.5 rounded-full bg-primary mr-2 mt-1.5"></div>
              <span>{isUserPremium ? "Advanced biometric tracking" : "Basic progress tracking"}</span>
            </li>
          </ul>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link to="/subscription">
            {isUserPremium ? "Manage Subscription" : "Upgrade Plan"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AccountSubscriptionSettings;
