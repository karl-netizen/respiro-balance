
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Calendar, Settings } from 'lucide-react';
import { useSubscriptionContext } from './SubscriptionProvider';
import { format } from 'date-fns';

export const SubscriptionStatus: React.FC = () => {
  const { subscription, isPremium, startCheckout, manageSubscription, checkSubscription } = useSubscriptionContext();

  const handleUpgrade = async () => {
    try {
      const checkoutUrl = await startCheckout();
      window.open(checkoutUrl, '_blank');
    } catch (error) {
      console.error('Error starting checkout:', error);
    }
  };

  const handleManage = async () => {
    try {
      const portalUrl = await manageSubscription();
      window.open(portalUrl, '_blank');
    } catch (error) {
      console.error('Error opening customer portal:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'trialing': return 'bg-blue-100 text-blue-800';
      case 'past_due': return 'bg-yellow-100 text-yellow-800';
      case 'canceled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'premium': return 'bg-gradient-to-r from-amber-500 to-orange-500 text-white';
      case 'team': return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="h-5 w-5 text-amber-500" />
          Subscription Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium">Current Plan</p>
            <div className="flex items-center gap-2">
              <Badge className={getTierColor(subscription.tier)}>
                {subscription.tier.charAt(0).toUpperCase() + subscription.tier.slice(1)}
              </Badge>
              {isPremium && (
                <Badge className={getStatusColor(subscription.status)}>
                  {subscription.status}
                </Badge>
              )}
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={checkSubscription}
          >
            Refresh
          </Button>
        </div>

        {subscription.periodEnd && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>
              {subscription.status === 'active' ? 'Renews' : 'Expires'} on{' '}
              {format(new Date(subscription.periodEnd), 'MMM dd, yyyy')}
            </span>
          </div>
        )}

        <div className="flex gap-2">
          {isPremium ? (
            <Button onClick={handleManage} className="flex-1">
              <Settings className="h-4 w-4 mr-2" />
              Manage Subscription
            </Button>
          ) : (
            <Button onClick={handleUpgrade} className="flex-1">
              <Crown className="h-4 w-4 mr-2" />
              Upgrade to Premium
            </Button>
          )}
        </div>

        {!isPremium && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800">
              <strong>Free Plan:</strong> Limited to 60 minutes of meditation per month. 
              Upgrade to premium for unlimited access and advanced features.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
