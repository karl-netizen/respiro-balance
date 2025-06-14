
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Crown, Calendar, CreditCard, Check, X, Sparkles, Target, Users, BarChart3 } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { toast } from 'sonner';

const AccountSubscriptionSettings = () => {
  const { isPremium, subscriptionData, startPremiumCheckout, manageSubscription } = useSubscription();
  const [isLoading, setIsLoading] = useState(false);

  // Mock usage data for free users
  const usageData = {
    minutesUsed: 45,
    minutesLimit: 60,
    sessionsUsedWeekly: 2,
    sessionsLimitWeekly: 3,
    resetDate: new Date(2024, 3, 1) // April 1st
  };

  const handleUpgrade = async () => {
    setIsLoading(true);
    try {
      const checkoutUrl = await startPremiumCheckout();
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      }
    } catch (error) {
      toast.error("Failed to start checkout", {
        description: "Please try again later."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    setIsLoading(true);
    try {
      const portalUrl = await manageSubscription();
      if (portalUrl) {
        window.location.href = portalUrl;
      }
    } catch (error) {
      toast.error("Failed to open subscription management", {
        description: "Please try again later."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 85) return 'bg-red-500';
    if (percentage >= 60) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const usagePercentage = (usageData.minutesUsed / usageData.minutesLimit) * 100;
  const daysUntilReset = Math.ceil((usageData.resetDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  const features = [
    {
      category: 'Meditation Minutes',
      free: '60 minutes/month',
      premium: 'Unlimited',
      icon: <Target className="h-4 w-4" />
    },
    {
      category: 'Meditation Techniques',
      free: 'Basic techniques',
      premium: 'Advanced techniques',
      icon: <Sparkles className="h-4 w-4" />
    },
    {
      category: 'Biometric Tracking',
      free: 'Basic progress',
      premium: 'Advanced biometric tracking',
      icon: <BarChart3 className="h-4 w-4" />
    },
    {
      category: 'Focus Sessions',
      free: 'Standard timer',
      premium: 'Advanced analytics',
      icon: <Calendar className="h-4 w-4" />
    },
    {
      category: 'Social Features',
      free: 'Basic community',
      premium: 'Full social features',
      icon: <Users className="h-4 w-4" />
    }
  ];

  return (
    <div className="space-y-6">
      {/* Current Plan Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5" />
            Current Plan & Status
          </CardTitle>
          <CardDescription>
            Your subscription information and benefits
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge 
                  variant={isPremium ? "default" : "secondary"}
                  className={isPremium ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white" : ""}
                >
                  {isPremium ? (
                    <>
                      <Crown className="h-3 w-3 mr-1" />
                      Premium
                    </>
                  ) : (
                    "Free"
                  )}
                </Badge>
                <Badge variant={isPremium ? "default" : "outline"}>
                  {isPremium ? "Active" : "Limited"}
                </Badge>
              </div>
              
              {isPremium ? (
                <div className="space-y-1">
                  <p className="font-medium">Premium Plan</p>
                  <p className="text-sm text-muted-foreground">
                    Unlimited meditation sessions and advanced features
                  </p>
                  {subscriptionData?.subscription_period_end && (
                    <p className="text-sm text-muted-foreground">
                      Renews on {new Date(subscriptionData.subscription_period_end).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="font-medium">Free Plan</p>
                  <p className="text-sm text-muted-foreground">
                    Basic meditation features with monthly limits
                  </p>
                </div>
              )}
            </div>
            
            {isPremium ? (
              <Button 
                variant="outline" 
                onClick={handleManageSubscription}
                disabled={isLoading}
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Manage Subscription
              </Button>
            ) : (
              <Button 
                onClick={handleUpgrade}
                disabled={isLoading}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
              >
                <Crown className="h-4 w-4 mr-2" />
                Upgrade to Premium
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Usage Tracking for Free Plan */}
      {!isPremium && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Monthly Usage
            </CardTitle>
            <CardDescription>
              Track your meditation time and session usage
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="font-medium">Meditation Minutes</Label>
                  <span className="text-sm font-medium">
                    {usageData.minutesUsed} / {usageData.minutesLimit} minutes
                  </span>
                </div>
                <Progress 
                  value={usagePercentage} 
                  className="h-2"
                />
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span className={usagePercentage >= 85 ? 'text-red-600' : usagePercentage >= 60 ? 'text-yellow-600' : 'text-green-600'}>
                    {usagePercentage >= 85 ? 'Approaching limit' : usagePercentage >= 60 ? 'Good progress' : 'Just getting started'}
                  </span>
                  <span>Resets in {daysUntilReset} days</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="font-medium">Weekly Sessions</Label>
                  <span className="text-sm font-medium">
                    {usageData.sessionsUsedWeekly} / {usageData.sessionsLimitWeekly} sessions
                  </span>
                </div>
                <Progress 
                  value={(usageData.sessionsUsedWeekly / usageData.sessionsLimitWeekly) * 100} 
                  className="h-2"
                />
              </div>
            </div>

            {usagePercentage >= 80 && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <Crown className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-amber-800">
                      You're close to your monthly limit
                    </p>
                    <p className="text-sm text-amber-700 mt-1">
                      Upgrade to Premium for unlimited meditation time and advanced features.
                    </p>
                    <Button 
                      size="sm" 
                      className="mt-3 bg-amber-600 hover:bg-amber-700"
                      onClick={handleUpgrade}
                    >
                      Upgrade Now
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Feature Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Comprehensive Feature Comparison</CardTitle>
          <CardDescription>
            Compare Free and Premium plan features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {features.map((feature, index) => (
              <div key={index}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center py-4">
                  <div className="flex items-center gap-2 font-medium">
                    {feature.icon}
                    {feature.category}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="justify-start">
                      {!isPremium ? <Check className="h-3 w-3 mr-1 text-green-600" /> : <X className="h-3 w-3 mr-1 text-muted-foreground" />}
                      {feature.free}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={isPremium ? "default" : "secondary"} className={isPremium ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white" : ""}>
                      {isPremium ? <Check className="h-3 w-3 mr-1" /> : <Crown className="h-3 w-3 mr-1" />}
                      {feature.premium}
                    </Badge>
                  </div>
                </div>
                {index < features.length - 1 && <Separator />}
              </div>
            ))}
          </div>

          {!isPremium && (
            <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg">
              <div className="text-center space-y-3">
                <h3 className="font-medium text-amber-800">Ready to unlock all features?</h3>
                <p className="text-sm text-amber-700">
                  Get unlimited meditation time, advanced analytics, and premium content for just $7.99/month.
                </p>
                <Button 
                  onClick={handleUpgrade}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                >
                  <Crown className="h-4 w-4 mr-2" />
                  Start Your Premium Journey
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountSubscriptionSettings;
