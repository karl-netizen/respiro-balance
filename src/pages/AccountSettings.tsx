import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useSubscriptionStore } from '@/features/subscription';
import { mockStripeService } from '@/lib/payment/stripe';
import { useAuth } from '@/hooks/useAuth';
import { 
  ArrowLeft, 
  CreditCard, 
  Calendar, 
  Activity, 
  TrendingUp, 
  Download,
  AlertTriangle
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function AccountSettings() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    tier,
    status,
    billingCycle,
    currentPeriodEnd,
    cancelAtPeriodEnd,
    sessionsUsed,
    sessionsLimit,
    getSessionsRemaining,
    cancelSubscription,
    reactivateSubscription
  } = useSubscriptionStore();

  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [billingHistory, setBillingHistory] = useState<any[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<any>(null);

  // Redirect if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    if (tier !== 'free') {
      // Load billing history and payment method
      mockStripeService.getBillingHistory().then(setBillingHistory);
      mockStripeService.getPaymentMethod().then(setPaymentMethod);
    }
  }, [tier]);

  const handleCancelSubscription = () => {
    cancelSubscription();
    setShowCancelDialog(false);
    toast.success('Subscription Canceled', {
      description: `Your subscription will remain active until ${currentPeriodEnd ? format(new Date(currentPeriodEnd), 'PPP') : 'the end of the billing period'}.`,
    });
  };

  const handleReactivate = () => {
    reactivateSubscription();
    toast.success('Subscription Reactivated', {
      description: 'Your subscription has been reactivated successfully.',
    });
  };

  const sessionsRemaining = getSessionsRemaining();
  const progressPercentage = tier === 'premium' ? 100 : (sessionsUsed / sessionsLimit) * 100;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <h1 className="text-3xl font-bold mb-8">Account Settings</h1>

        {/* Subscription Status Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center justify-between">
              <span>Subscription Status</span>
              <Badge 
                variant={
                  tier === 'premium' ? 'default' : 
                  tier === 'standard' ? 'secondary' : 
                  'outline'
                }
                className={`capitalize ${
                  tier === 'premium'
                    ? 'bg-yellow-500 text-yellow-950 hover:bg-yellow-600'
                    : tier === 'standard'
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : ''
                }`}
              >
                {tier}
              </Badge>
            </CardTitle>
            <CardDescription>
              Manage your subscription and view usage
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-6 pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Billing Cycle</p>
                <p className="font-medium capitalize">{billingCycle}</p>
              </div>
              
              {currentPeriodEnd && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    {cancelAtPeriodEnd ? 'Access Until' : 'Next Billing Date'}
                  </p>
                  <p className="font-medium">
                    {format(new Date(currentPeriodEnd), 'PPP')}
                  </p>
                </div>
              )}
            </div>

            <Separator />

            {/* Session Usage */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-primary" />
                  <span className="font-medium">Session Usage</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {tier === 'premium' 
                    ? 'Unlimited' 
                    : `${sessionsRemaining} remaining`
                  }
                </span>
              </div>
              
              {tier !== 'premium' && (
                <>
                  <Progress value={progressPercentage} className="h-2 mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {sessionsUsed} of {sessionsLimit} sessions used this month
                  </p>
                </>
              )}
              
              {tier === 'premium' && (
                <p className="text-sm text-muted-foreground">
                  Enjoy unlimited meditation sessions
                </p>
              )}
            </div>

            <Separator />

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              {!cancelAtPeriodEnd ? (
                <Button onClick={() => navigate('/pricing')}>
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Change Plan
                </Button>
              ) : (
                <Button onClick={handleReactivate}>
                  Reactivate Subscription
                </Button>
              )}
            </div>

            {cancelAtPeriodEnd && (
              <div className="flex items-start gap-2 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-500 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-yellow-900 dark:text-yellow-100">
                    Subscription Canceled
                  </p>
                  <p className="text-yellow-800 dark:text-yellow-200">
                    Your subscription will end on {currentPeriodEnd ? format(new Date(currentPeriodEnd), 'PPP') : 'the billing date'}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment Method Card (for paid tiers) */}
        {tier !== 'free' && paymentMethod && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-xl font-semibold flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Method
              </CardTitle>
              <CardDescription>
                Manage your payment information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 p-6 pt-0">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded">
                    <CreditCard className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium capitalize">{paymentMethod.brand}</p>
                    <p className="text-sm text-muted-foreground">
                      •••• •••• •••• {paymentMethod.last4}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Expires</p>
                  <p className="text-sm font-medium">
                    {paymentMethod.expiryMonth}/{paymentMethod.expiryYear}
                  </p>
                </div>
              </div>

              <Button variant="outline" className="w-full">
                Update Payment Method
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Billing History (for paid tiers) */}
        {tier !== 'free' && billingHistory.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-xl font-semibold flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Billing History
              </CardTitle>
              <CardDescription>
                View and download your invoices
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="space-y-2">
                {billingHistory.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div>
                      <p className="font-medium">
                        {format(new Date(invoice.date), 'MMMM d, yyyy')}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        ${invoice.amount.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="capitalize">
                        {invoice.status}
                      </Badge>
                      <Button size="sm" variant="ghost">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Danger Zone (for paid, non-canceled subscriptions) */}
        {tier !== 'free' && !cancelAtPeriodEnd && (
          <Card className="border-2 border-red-500/50">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-red-600 dark:text-red-400 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Danger Zone
              </CardTitle>
              <CardDescription>
                Irreversible actions for your subscription
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Cancel Subscription</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Your subscription will remain active until the end of the current billing period.
                    After that, you'll be downgraded to the free plan.
                  </p>
                  <Button 
                    variant="destructive"
                    className="bg-red-500 hover:bg-red-600 text-white"
                    onClick={() => setShowCancelDialog(true)}
                  >
                    Cancel Subscription
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Subscription?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel your subscription? You'll lose access to:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Extended session limits</li>
                <li>Biofeedback integration</li>
                <li>Power modules (if Premium)</li>
                <li>Priority support</li>
              </ul>
              <p className="mt-3">
                Your subscription will remain active until {currentPeriodEnd ? format(new Date(currentPeriodEnd), 'PPP') : 'the end of your billing period'}.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleCancelSubscription}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Cancel Subscription
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
