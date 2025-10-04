import React from 'react';
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
import { useSubscriptionStore, SubscriptionTier } from '@/store/subscriptionStore';
import { Check, Lock, Sparkles } from 'lucide-react';

interface UpgradePromptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  featureName: string;
  requiredTier: 'standard' | 'premium';
  benefits?: string[];
}

export const UpgradePromptDialog: React.FC<UpgradePromptDialogProps> = ({
  open,
  onOpenChange,
  featureName,
  requiredTier,
  benefits = []
}) => {
  const navigate = useNavigate();
  const { getPricing } = useSubscriptionStore();

  const monthlyPrice = getPricing(requiredTier, 'monthly');
  const annualPrice = getPricing(requiredTier, 'annual');

  const defaultBenefits = {
    standard: [
      '40 sessions per month',
      'Biofeedback integration',
      'All meditation content',
      'Advanced progress tracking',
      'Full community access'
    ],
    premium: [
      'Unlimited sessions',
      'All power modules unlocked',
      'Priority support',
      'Early access to new features',
      'Advanced analytics'
    ]
  };

  const displayBenefits = benefits.length > 0 
    ? benefits 
    : requiredTier === 'standard' || requiredTier === 'premium'
    ? defaultBenefits[requiredTier]
    : [];

  const handleViewPricing = () => {
    onOpenChange(false);
    navigate('/pricing');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <Lock className="w-6 h-6 text-primary" />
            Unlock {featureName}
          </DialogTitle>
          <DialogDescription className="text-base pt-2">
            Upgrade to <span className="font-semibold text-foreground capitalize">{requiredTier}</span> to access this feature
          </DialogDescription>
        </DialogHeader>

        <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <Badge className={`mb-3 ${
                requiredTier === 'premium'
                  ? 'bg-yellow-500 text-yellow-950 hover:bg-yellow-600'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}>
                <Sparkles className="w-3 h-3 mr-1" />
                {requiredTier === 'standard' ? 'Most Popular' : 'Best Value'}
              </Badge>
              <h3 className="text-xl font-semibold mb-2 capitalize">{requiredTier}</h3>
              <div className="flex items-baseline justify-center gap-2 mb-2">
                <span className="text-3xl font-bold">${monthlyPrice.toFixed(2)}</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <p className="text-sm text-muted-foreground">
                or ${annualPrice.toFixed(2)}/year (save {requiredTier === 'standard' ? '30' : '25'}%)
              </p>
            </div>

            {displayBenefits.length > 0 && (
              <ul className="space-y-3">
                {displayBenefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-sm">{benefit}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
          >
            Maybe Later
          </Button>
          <Button
            onClick={handleViewPricing}
            className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white"
            data-preload="pricing"
          >
            View Pricing Plans
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
