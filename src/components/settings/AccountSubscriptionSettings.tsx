
import React from 'react';
import { Card, CardHeader, CardContent, CardDescription, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSubscriptionContext } from '@/hooks/useSubscriptionContext';
import { ArrowRight, Crown, CreditCard, Calendar, AlertCircle, CheckCircle, Gift } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { SubscriptionTier } from '@/context/types';

interface AccountSubscriptionSettingsProps {
  subscriptionTier?: SubscriptionTier | string;
  isPremium?: boolean;
}

const AccountSubscriptionSettings: React.FC<AccountSubscriptionSettingsProps> = ({ subscriptionTier, isPremium }) => {
  const { 
    tierName, 
    subscriptionData,
    isPremium: contextIsPremium,
    isSubscribed
  } = useSubscriptionContext();
  
  // Use props if provided, otherwise use context values
  const isUserPremium = isPremium !== undefined ? isPremium : contextIsPremium;
  const userTierName = tierName || (subscriptionTier ? subscriptionTier.charAt(0).toUpperCase() + subscriptionTier.slice(1) : 'Free');
  
  const minutesUsed = subscriptionData?.meditation_minutes_used || 15;
  const minutesLimit = subscriptionData?.meditation_minutes_limit || 60;
  const usagePercentage = Math.min(Math.round((minutesUsed / minutesLimit) * 100), 100);

  // Mock billing data for premium users
  const billingData = isUserPremium ? {
    nextBillingDate: 'April 15, 2024',
    billingAmount: '$7.99',
    paymentMethod: '**** **** **** 1234',
    autoRenewal: true,
    subscriptionStart: 'March 15, 2024'
  } : null;

  // Calculate days until reset for free users
  const getDaysUntilReset = () => {
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const diffTime = nextMonth.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const daysUntilReset = getDaysUntilReset();

  const getUsageColor = () => {
    if (usagePercentage >= 100) return 'text-red-600';
    if (usagePercentage >= 85) return 'text-red-500';
    if (usagePercentage >= 60) return 'text-yellow-500';
    return 'text-green-600';
  };

  const getProgressColor = () => {
    if (usagePercentage >= 100) return 'bg-red-500';
    if (usagePercentage >= 85) return 'bg-red-400';
    if (usagePercentage >= 60) return 'bg-yellow-400';
    return 'bg-green-500';
  };

  return (
    <div className="space-y-6">
      {/* Current Plan & Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isUserPremium ? (
              <Crown className="h-5 w-5 text-yellow-600" />
            ) : (
              <Gift className="h-5 w-5" />
            )}
            Current Plan
          </CardTitle>
          <CardDescription>
            Your subscription details and plan benefits
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-semibold">{userTierName} Plan</h3>
                <Badge 
                  variant={isUserPremium ? "default" : "secondary"}
                  className={isUserPremium ? "bg-yellow-100 text-yellow-800" : ""}
                >
                  {isSubscribed ? 'Active' : 'Free'}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {isUserPremium
                  ? "Premium features activated with unlimited access"
                  : "Free tier with limited features"}
              </p>
            </div>
            {isUserPremium && (
              <Crown className="h-12 w-12 text-yellow-600" />
            )}
          </div>

          {/* Billing Information for Premium Users */}
          {isUserPremium && billingData && (
            <>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Next Billing:</span>
                    <span className="font-medium">{billingData.nextBillingDate}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Amount:</span>
                    <span className="font-medium">{billingData.billingAmount}/month</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Payment Method:</span>
                    <span className="font-medium">{billingData.paymentMethod}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Auto-Renewal:</span>
                    <span className="font-medium flex items-center gap-1">
                      {billingData.autoRenewal ? (
                        <>
                          <CheckCircle className="h-3 w-3 text-green-600" />
                          Enabled
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-3 w-3 text-red-600" />
                          Disabled
                        </>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Usage Tracking for Free Plan */}
          {!isUserPremium && (
            <>
              <Separator />
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Monthly Usage</h4>
                  <span className={`text-sm font-medium ${getUsageColor()}`}>
                    {minutesUsed} / {minutesLimit} minutes
                  </span>
                </div>
                
                <div className="space-y-2">
                  <Progress 
                    value={usagePercentage} 
                    className="h-3"
                    style={{
                      background: usagePercentage >= 100 ? '#fef2f2' : 
                                 usagePercentage >= 85 ? '#fefce8' : '#f0f9ff'
                    }}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0 min</span>
                    <span>{Math.round(minutesLimit / 2)} min</span>
                    <span>{minutesLimit} min</span>
                  </div>
                </div>

                {/* Usage Warnings & Suggestions */}
                <div className="p-4 rounded-lg border">
                  {usagePercentage >= 100 ? (
                    <div className="text-center space-y-2">
                      <AlertCircle className="h-6 w-6 text-red-600 mx-auto" />
                      <div className="text-red-800 font-medium">Monthly Limit Reached</div>
                      <p className="text-sm text-red-600">
                        You've used all your free minutes. Upgrade to Premium for unlimited access.
                      </p>
                      <div className="text-xs text-red-500">
                        Limit resets in {daysUntilReset} day{daysUntilReset !== 1 ? 's' : ''}
                      </div>
                    </div>
                  ) : usagePercentage >= 80 ? (
                    <div className="text-center space-y-2">
                      <AlertCircle className="h-6 w-6 text-yellow-600 mx-auto" />
                      <div className="text-yellow-800 font-medium">Approaching Limit</div>
                      <p className="text-sm text-yellow-600">
                        You're close to your monthly limit. Consider upgrading to Premium.
                      </p>
                      <div className="text-xs text-yellow-500">
                        Limit resets in {daysUntilReset} day{daysUntilReset !== 1 ? 's' : ''}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center space-y-2">
                      <CheckCircle className="h-6 w-6 text-green-600 mx-auto" />
                      <div className="text-green-800 font-medium">On Track</div>
                      <p className="text-sm text-green-600">
                        You're using your meditation minutes well. Keep up the great work!
                      </p>
                      <div className="text-xs text-green-500">
                        Limit resets in {daysUntilReset} day{daysUntilReset !== 1 ? 's' : ''}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* Plan Features */}
          <div>
            <h4 className="font-medium text-sm mb-3">Plan Features:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>{isUserPremium ? "Unlimited meditation minutes" : "60 meditation minutes/month"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>{isUserPremium ? "Advanced meditation techniques" : "Basic meditation techniques"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>{isUserPremium ? "Advanced biometric tracking" : "Basic progress tracking"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>{isUserPremium ? "Priority customer support" : "Community support"}</span>
              </div>
              {isUserPremium && (
                <>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Offline meditation downloads</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Custom meditation programs</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button asChild className="w-full">
            <Link to="/subscription">
              {isUserPremium ? "Manage Subscription" : "Upgrade to Premium"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>

      {/* Payment Method Management (Premium Users Only) */}
      {isUserPremium && billingData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Method
            </CardTitle>
            <CardDescription>
              Manage your payment information and billing preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-6 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
                  VISA
                </div>
                <div>
                  <div className="font-medium">{billingData.paymentMethod}</div>
                  <div className="text-sm text-muted-foreground">Expires 12/26</div>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Update
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Auto-Renewal</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically renew subscription each month
                </p>
              </div>
              <Switch checked={billingData.autoRenewal} />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Billing History (Premium Users Only) */}
      {isUserPremium && (
        <Card>
          <CardHeader>
            <CardTitle>Billing History</CardTitle>
            <CardDescription>
              View your recent billing and payment history
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { date: 'March 15, 2024', amount: '$7.99', status: 'Paid', invoice: 'INV-2024-003' },
                { date: 'February 15, 2024', amount: '$7.99', status: 'Paid', invoice: 'INV-2024-002' },
                { date: 'January 15, 2024', amount: '$7.99', status: 'Paid', invoice: 'INV-2024-001' }
              ].map((bill, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{bill.date}</div>
                    <div className="text-sm text-muted-foreground">
                      {bill.invoice} • Premium Monthly
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{bill.amount}</div>
                    <Badge variant="default" className="text-xs">
                      {bill.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AccountSubscriptionSettings;
