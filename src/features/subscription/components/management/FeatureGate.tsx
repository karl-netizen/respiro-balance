
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Lock, Sparkles, ArrowRight } from 'lucide-react';
import { useFeatureAccess, FeatureTier } from '@/hooks/useFeatureAccess';
import { useNavigate } from 'react-router-dom';

interface FeatureGateProps {
  children: React.ReactNode;
  requiredTier: FeatureTier;
  featureName: string;
  featureDescription?: string;
  showPreview?: boolean;
  customUpgradeMessage?: string;
}

export const FeatureGate: React.FC<FeatureGateProps> = ({
  children,
  requiredTier,
  featureName,
  featureDescription,
  showPreview = false,
  customUpgradeMessage
}) => {
  const { checkFeatureAccess, currentTier } = useFeatureAccess();
  const navigate = useNavigate();
  const access = checkFeatureAccess(requiredTier);

  const getTierDisplayName = (tier: FeatureTier) => {
    switch (tier) {
      case 'free':
        return 'Free';
      case 'standard':
        return 'Standard';
      case 'premium':
        return 'Premium';
      default:
        return 'Premium';
    }
  };

  const getTierPrice = (tier: FeatureTier) => {
    switch (tier) {
      case 'free':
        return '$0/month';
      case 'standard':
        return '$6.99/month';
      case 'premium':
        return '$12.99/month';
      default:
        return '$12.99/month';
    }
  };

  const handleUpgrade = () => {
    navigate('/subscription');
  };

  if (access.hasAccess) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      {showPreview && (
        <div className="opacity-30 pointer-events-none blur-sm">
          {children}
        </div>
      )}
      
      <Card className={`${showPreview ? 'absolute inset-0 bg-white/95 backdrop-blur-sm' : ''} border-2 border-teal-200 bg-gradient-to-br from-teal-50 to-blue-50`}>
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 p-3 bg-gradient-to-br from-teal-100 to-blue-100 rounded-full w-fit">
            <Crown className="h-8 w-8 text-teal-600" />
          </div>
          <CardTitle className="flex items-center justify-center gap-2 text-xl">
            <Lock className="h-5 w-5 text-teal-600" />
            Premium Feature
          </CardTitle>
          <CardDescription className="text-base text-gray-600">
            {featureDescription || `${featureName} requires ${getTierDisplayName(requiredTier)}`}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="flex items-center justify-center gap-2">
            <Badge className="bg-gradient-to-r from-teal-600 to-blue-600 text-white px-4 py-2">
              <Sparkles className="h-3 w-3 mr-1" />
              {getTierDisplayName(requiredTier)} Required
            </Badge>
          </div>
          
          <div className="space-y-3 text-center">
            <div className="p-4 bg-white/80 rounded-lg border border-teal-200">
              <p className="font-semibold text-gray-900 mb-1">{featureName}</p>
              <p className="text-sm text-gray-600 mb-3">
                {customUpgradeMessage || `Unlock ${featureName.toLowerCase()} and many more premium features`}
              </p>
              <div className="flex items-center justify-center gap-2 text-teal-600 font-medium">
                <span>Starting at {getTierPrice(requiredTier)}</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>
            
            <p className="text-xs text-gray-500">
              Current plan: <span className="font-medium capitalize">{currentTier}</span>
            </p>
          </div>

          <Button 
            onClick={handleUpgrade} 
            className="w-full bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white font-medium py-3" 
            size="lg"
          >
            <Crown className="h-4 w-4 mr-2" />
            Upgrade to {getTierDisplayName(requiredTier)}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeatureGate;
