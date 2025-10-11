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
import { Badge } from '@/components/ui/badge';
import { Crown, Check } from 'lucide-react';
import { TIER_PRICES } from '@/utils/tierAccess';

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sessionTitle: string;
  requiredTier: 'standard' | 'premium';
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({
  open,
  onOpenChange,
  sessionTitle,
  requiredTier
}) => {
  const tierInfo = TIER_PRICES[requiredTier];

  const benefits = requiredTier === 'standard' ? [
    'Access to 15 meditation sessions',
    'Standard and Free tier content',
    'Progress tracking',
    'Favorite sessions',
    'No weekly limits'
  ] : [
    'Access to all 22 meditation sessions',
    'Premium, Standard, and Free content',
    'Advanced focus techniques',
    'Sleep optimization programs',
    'Priority support',
    'Early access to new content'
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-yellow-500" />
            Unlock "{sessionTitle}"
          </DialogTitle>
          <DialogDescription>
            Upgrade to {tierInfo.label} to access this meditation session
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg">
            <div>
              <p className="font-semibold text-lg">{tierInfo.label}</p>
              <p className="text-sm text-muted-foreground">
                Billed monthly, cancel anytime
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">${tierInfo.monthly}</p>
              <p className="text-sm text-muted-foreground">/month</p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="font-semibold text-sm">What's included:</p>
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <span className="text-sm">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
          >
            Maybe Later
          </Button>
          <Button
            onClick={() => {
              // TODO: Integrate with actual payment system
              window.location.href = '/pricing';
            }}
            className="w-full sm:w-auto"
          >
            Upgrade Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
