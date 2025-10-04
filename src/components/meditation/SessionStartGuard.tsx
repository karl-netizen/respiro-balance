import React, { useState } from 'react';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { Check, Lock, Zap } from 'lucide-react';

interface SessionStartGuardProps {
  children: React.ReactNode;
  onSessionStart: () => void;
}

export const SessionStartGuard: React.FC<SessionStartGuardProps> = ({
  children,
  onSessionStart
}) => {
  const navigate = useNavigate();
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const { canStartSession, incrementSessionCount, getSessionsRemaining, tier, sessionsUsed, sessionsLimit } = useSubscriptionStore();

  const handleStartSession = () => {
    if (canStartSession()) {
      incrementSessionCount();
      onSessionStart();
    } else {
      setShowUpgradeDialog(true);
    }
  };

  const handleUpgrade = () => {
    setShowUpgradeDialog(false);
    navigate('/pricing');
  };

  // Clone children and pass handleStartSession
  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child as React.ReactElement<any>, {
        onStartSession: handleStartSession
      });
    }
    return child;
  });

  return (
    <>
      {childrenWithProps}

      <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <Lock className="w-6 h-6 text-primary" />
              Session Limit Reached
            </DialogTitle>
            <DialogDescription className="text-base pt-2">
              You've used <span className="font-semibold text-foreground">{sessionsUsed}/{sessionsLimit}</span> sessions this month.
              Upgrade to continue your wellness journey.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            {/* Standard Plan */}
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <Badge className="mb-2">Most Popular</Badge>
                  <h3 className="text-xl font-semibold mb-2">Standard</h3>
                  <div className="mb-4">
                    <span className="text-3xl font-bold">$6.99</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                </div>
                
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm">40 sessions per month</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm">Biofeedback integration</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm">Access to all core features</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm">Community access</span>
                  </li>
                </ul>
                
                <Button 
                  onClick={handleUpgrade}
                  className="w-full"
                  variant="outline"
                >
                  Choose Standard
                </Button>
              </CardContent>
            </Card>

            {/* Premium Plan */}
            <Card className="border-2 border-primary relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-gradient-to-l from-primary to-primary/80 text-primary-foreground px-3 py-1 text-xs font-semibold">
                Best Value
              </div>
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <Badge variant="secondary" className="mb-2">
                    <Zap className="w-3 h-3 mr-1" />
                    Premium
                  </Badge>
                  <h3 className="text-xl font-semibold mb-2">Premium</h3>
                  <div className="mb-4">
                    <span className="text-3xl font-bold">$12.99</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                </div>
                
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm font-medium">Unlimited sessions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm">All Standard features</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm">All power modules unlocked</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm">Priority support</span>
                  </li>
                </ul>
                
                <Button 
                  onClick={handleUpgrade}
                  className="w-full"
                >
                  Choose Premium
                </Button>
              </CardContent>
            </Card>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowUpgradeDialog(false)}>
              Maybe Later
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
