
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Crown, Check, Star, CreditCard, Calendar, Users } from 'lucide-react';

interface SubscriptionTier {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  current?: boolean;
  popular?: boolean;
}

interface SubscriptionManagementProps {
  currentTier: string;
  usageStats: {
    meditationMinutes: number;
    limit: number;
    sessionsThisMonth: number;
  };
  onUpgrade: (tierId: string) => void;
  onManageSubscription: () => void;
}

export const SubscriptionManagement: React.FC<SubscriptionManagementProps> = ({
  currentTier,
  usageStats,
  onUpgrade,
  onManageSubscription
}) => {
  const [selectedTier, setSelectedTier] = useState<string | null>(null);

  const tiers: SubscriptionTier[] = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      interval: 'month',
      features: [
        '3 Core Sessions - Essential meditation basics',
        'Basic Breathing Techniques - 3 fundamental patterns',
        'Simple Progress Tracking - Basic streaks only',
        'Weekly Session Limit - Up to 2 sessions per week'
      ],
      current: currentTier === 'free'
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 11.97,
      interval: 'month',
      features: [
        '14 Meditation Sessions - Comprehensive guided library',
        'Advanced Breathing Techniques - All patterns and customizations',
        'Unlimited Sessions - No weekly limits or restrictions',
        'Full Progress Analytics - Detailed insights and trends',
        'Ad-Free Experience - No interruptions',
        'Offline Mode - Download and use anywhere'
      ],
      current: currentTier === 'premium'
    },
    {
      id: 'premium-pro',
      name: 'Premium Pro',
      price: 19.97,
      interval: 'month',
      features: [
        'Everything in Premium',
        '18 Meditation Sessions - Extended library with variety',
        'Advanced Habit Tracking - Detailed streaks and rewards',
        'Basic Biofeedback Integration - Heart rate monitoring',
        'Sleep Stories Library - 15+ exclusive stories',
        'Group Challenges - Join community meditation challenges'
      ],
      current: currentTier === 'premium-pro',
      popular: true
    },
    {
      id: 'premium-plus',
      name: 'Premium Plus',
      price: 29.97,
      interval: 'month',
      features: [
        'Everything in Premium Pro',
        'Complete Library - All 22+ sessions + monthly new releases',
        '1-on-1 Expert Sessions - 2 monthly video calls with meditation experts',
        'Advanced Biofeedback Coaching - Real-time guidance and insights',
        'AI-Powered Personalization - Custom meditation plans generated monthly',
        'Family Sharing - Up to 4 accounts included'
      ],
      current: currentTier === 'premium-plus'
    }
  ];

  const usagePercentage = (usageStats.meditationMinutes / usageStats.limit) * 100;

  return (
    <div className="space-y-6">
      {/* Current Usage */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-yellow-600" />
            Current Plan: {tiers.find(t => t.current)?.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Meditation Minutes Used</span>
                <span>{usageStats.meditationMinutes} / {usageStats.limit}</span>
              </div>
              <Progress value={usagePercentage} className="h-2" />
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{usageStats.sessionsThisMonth}</div>
                <div className="text-sm text-blue-700">Sessions This Month</div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{Math.round(usageStats.meditationMinutes / usageStats.sessionsThisMonth) || 0}</div>
                <div className="text-sm text-green-700">Avg Session Length</div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={onManageSubscription} variant="outline" className="flex-1">
                <CreditCard className="h-4 w-4 mr-2" />
                Manage Billing
              </Button>
              {currentTier === 'free' && (
                <Button onClick={() => onUpgrade('premium')} className="flex-1">
                  <Star className="h-4 w-4 mr-2" />
                  Upgrade Now
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subscription Plans */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {tiers.map((tier) => (
          <Card 
            key={tier.id} 
            className={`relative ${tier.current ? 'ring-2 ring-blue-500' : ''} ${tier.popular ? 'scale-105' : ''}`}
          >
            {tier.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-blue-600 text-white">Most Popular</Badge>
              </div>
            )}
            
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                {tier.id === 'premium' && <Crown className="h-5 w-5 text-yellow-500" />}
                {tier.id === 'premium-pro' && <Crown className="h-5 w-5 text-purple-500" />}
                {tier.id === 'premium-plus' && <Users className="h-5 w-5 text-purple-500" />}
                {tier.name}
              </CardTitle>
              <div className="text-3xl font-bold">
                ${tier.price}
                <span className="text-sm font-normal text-muted-foreground">/{tier.interval}</span>
              </div>
            </CardHeader>
            
            <CardContent>
              <ul className="space-y-3 mb-6">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              
              {tier.current ? (
                <Button disabled className="w-full">
                  Current Plan
                </Button>
              ) : (
                <Button 
                  onClick={() => onUpgrade(tier.id)}
                  className="w-full"
                  variant={tier.popular ? 'default' : 'outline'}
                >
                  {currentTier === 'free' ? 'Upgrade' : 'Switch'} to {tier.name}
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
