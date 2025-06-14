
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useSubscriptionContext } from '@/hooks/useSubscriptionContext';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';
import { 
  CreditCard, 
  Crown, 
  Calendar, 
  Clock, 
  TrendingUp, 
  Download, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Users,
  Shield,
  Zap,
  Star
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const AccountSubscriptionSettings = () => {
  const { 
    isPremium, 
    tierName
  } = useSubscriptionContext();

  // Mock usage data since it's not available in the subscription context
  const mockUsageData = {
    sessionsUsed: 2,
    sessionsLimit: 3,
    weeklySessionsUsed: 2,
    weeklySessionsLimit: 3
  };

  // Mock subscription data - in real implementation, this would come from Stripe/payment provider
  const subscriptionData = {
    planName: isPremium ? (tierName === 'Premium Plus' ? 'Premium Plus' : 'Premium') : 'Free',
    price: isPremium ? (tierName === 'Premium Plus' ? '$12.99/month' : '$7.99/month') : 'Free',
    nextBilling: '2024-07-15',
    paymentMethod: '**** **** **** 4242',
    status: 'Active',
    features: isPremium ? (
      tierName === 'Premium Plus' ? [
        'Complete Library - All 22 sessions including exclusive content',
        'Biofeedback Integration - Real-time heart rate monitoring',
        'Advanced Analytics - AI-powered insights and recommendations',
        'Priority Support - Enhanced customer service',
        'Early Access - First access to new features and content',
        'Social Hub Premium - Advanced community features'
      ] : [
        '14 Meditation Sessions - Comprehensive guided library',
        'Advanced Breathing Techniques - All patterns and customizations',
        'Unlimited Sessions - No weekly limits or restrictions',
        'Full Progress Analytics - Detailed insights and trends',
        'Social Features - Complete community engagement',
        'Focus Mode - Advanced Pomodoro timer with analytics'
      ]
    ) : [
      '5 Core Sessions - Essential meditation and quick breaks',
      'Basic Breathing Techniques - 3 fundamental patterns',
      'Simple Progress Tracking - Basic analytics and streaks',
      'Community Access - Join discussions and view content',
      'Weekly Session Limit - Up to 3 sessions per week'
    ]
  };

  const [autoRenewal, setAutoRenewal] = useState(true);

  // Calculate usage percentages for free tier
  const sessionUsagePercent = !isPremium && mockUsageData.sessionsLimit > 0 
    ? Math.round((mockUsageData.sessionsUsed / mockUsageData.sessionsLimit) * 100)
    : 0;

  const getUsageColor = (percent: number) => {
    if (percent >= 100) return 'text-red-600';
    if (percent >= 80) return 'text-orange-600';
    return 'text-green-600';
  };

  const handleUpgrade = () => {
    // Mock upgrade flow - in real implementation, this would redirect to Stripe checkout
    toast.success("Redirecting to upgrade page...");
  };

  const handleDowngrade = () => {
    // Mock downgrade flow
    toast.success("Downgrade request submitted");
  };

  const handleCancelSubscription = () => {
    // Mock cancellation flow
    toast.success("Subscription will be cancelled at the end of the billing period");
  };

  const handleUpdatePayment = () => {
    // Mock payment update flow
    toast.success("Redirecting to payment update...");
  };

  const days = Math.ceil((new Date('2024-07-15').getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="space-y-6">
      {/* Current Plan Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5" />
            Current Plan
          </CardTitle>
          <CardDescription>
            Your subscription details and plan information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isPremium ? 'bg-primary' : 'bg-muted'}`}>
                {isPremium ? <Crown className="h-6 w-6 text-primary-foreground" /> : <Users className="h-6 w-6 text-muted-foreground" />}
              </div>
              <div>
                <div className="font-semibold text-lg">{subscriptionData.planName}</div>
                <div className="text-sm text-muted-foreground">{subscriptionData.price}</div>
              </div>
            </div>
            <Badge variant={isPremium ? 'default' : 'secondary'} className="flex items-center gap-1">
              {isPremium ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
              {subscriptionData.status}
            </Badge>
          </div>

          {isPremium && (
            <>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Next billing: {subscriptionData.nextBilling}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <span>Payment: {subscriptionData.paymentMethod}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{days} days until renewal</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <span>Auto-renewal: {autoRenewal ? 'Enabled' : 'Disabled'}</span>
                </div>
              </div>
            </>
          )}

          <Separator />

          <div>
            <h4 className="font-medium mb-3">Plan Features</h4>
            <div className="grid grid-cols-1 gap-2">
              {subscriptionData.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage Tracking for Free Plan */}
      {!isPremium && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Usage This Week
            </CardTitle>
            <CardDescription>
              Track your usage against your plan limits
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Weekly Sessions</Label>
                <span className={`text-sm font-medium ${getUsageColor(sessionUsagePercent)}`}>
                  {mockUsageData.sessionsUsed} / {mockUsageData.sessionsLimit} sessions
                </span>
              </div>
              <Progress 
                value={sessionUsagePercent} 
                className="w-full h-2"
              />
              {sessionUsagePercent >= 80 && (
                <p className="text-sm text-orange-600 mt-1">
                  {sessionUsagePercent >= 100 ? 'Weekly limit reached!' : 'Approaching your weekly limit'}
                </p>
              )}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Zap className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900">Upgrade for Unlimited Access</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Get unlimited meditation sessions, advanced breathing techniques, and premium content with our Premium plan.
                  </p>
                  <Button onClick={handleUpgrade} className="mt-3" size="sm">
                    Upgrade to Premium
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Plan Comparison & Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Plan Management
          </CardTitle>
          <CardDescription>
            Compare plans and manage your subscription
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Free Plan */}
            <div className={`border rounded-lg p-4 ${!isPremium ? 'border-primary bg-primary/5' : ''}`}>
              <div className="flex items-center gap-2 mb-3">
                <Users className="h-5 w-5" />
                <h3 className="font-semibold">Free</h3>
                {!isPremium && <Badge>Current</Badge>}
              </div>
              <div className="text-2xl font-bold mb-2">$0<span className="text-sm font-normal">/month</span></div>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• 5 core sessions</li>
                <li>• Basic breathing techniques</li>
                <li>• 3 sessions per week limit</li>
              </ul>
            </div>

            {/* Premium Plan */}
            <div className={`border rounded-lg p-4 ${isPremium && tierName !== 'Premium Plus' ? 'border-primary bg-primary/5' : ''}`}>
              <div className="flex items-center gap-2 mb-3">
                <Crown className="h-5 w-5" />
                <h3 className="font-semibold">Premium</h3>
                {isPremium && tierName !== 'Premium Plus' && <Badge>Current</Badge>}
              </div>
              <div className="text-2xl font-bold mb-2">$7.99<span className="text-sm font-normal">/month</span></div>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• 14 meditation sessions</li>
                <li>• Unlimited access</li>
                <li>• Advanced breathing</li>
                <li>• Full analytics</li>
              </ul>
            </div>

            {/* Premium Plus Plan */}
            <div className={`border rounded-lg p-4 ${isPremium && tierName === 'Premium Plus' ? 'border-primary bg-primary/5' : ''}`}>
              <div className="flex items-center gap-2 mb-3">
                <Star className="h-5 w-5" />
                <h3 className="font-semibold">Premium Plus</h3>
                {isPremium && tierName === 'Premium Plus' && <Badge>Current</Badge>}
              </div>
              <div className="text-2xl font-bold mb-2">$12.99<span className="text-sm font-normal">/month</span></div>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Complete library (22 sessions)</li>
                <li>• Biofeedback integration</li>
                <li>• AI-powered insights</li>
                <li>• Priority support</li>
              </ul>
            </div>
          </div>

          <Separator />

          <div className="flex flex-wrap gap-3">
            {!isPremium ? (
              <Button onClick={handleUpgrade} className="flex items-center gap-2">
                <Crown className="h-4 w-4" />
                Upgrade to Premium
              </Button>
            ) : (
              <>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      Change Plan
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Change Subscription Plan</DialogTitle>
                      <DialogDescription>
                        You can upgrade or downgrade your plan. Changes will take effect at the next billing cycle.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-4 mt-4">
                      <Button variant="outline">Cancel</Button>
                      <Button onClick={handleUpgrade}>
                        Change Plan
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                      <XCircle className="h-4 w-4 mr-2" />
                      Cancel Subscription
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Cancel Subscription</DialogTitle>
                      <DialogDescription>
                        Your subscription will remain active until {subscriptionData.nextBilling}. After that, you'll be switched to the free plan.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-4 mt-4">
                      <Button variant="outline">Keep Subscription</Button>
                      <Button variant="destructive" onClick={handleCancelSubscription}>
                        Cancel Subscription
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Support & Help */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Support & Help
          </CardTitle>
          <CardDescription>
            Get help with your subscription and billing questions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
              <div className="font-medium">Billing Support</div>
              <div className="text-sm text-muted-foreground">
                Questions about charges or payments
              </div>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
              <div className="font-medium">Plan Questions</div>
              <div className="text-sm text-muted-foreground">
                Need help choosing the right plan
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountSubscriptionSettings;
