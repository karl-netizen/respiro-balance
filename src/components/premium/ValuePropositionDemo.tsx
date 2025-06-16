
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Crown, 
  Zap, 
  BarChart3, 
  Users, 
  Heart, 
  Brain,
  Lock,
  Unlock,
  CheckCircle,
  Star
} from 'lucide-react';
import { FadeIn, ScaleIn, HoverLift } from '@/components/animations/MicroInteractions';

interface PremiumFeature {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  available: boolean;
  demo?: boolean;
}

const ValuePropositionDemo: React.FC = () => {
  const [showDemo, setShowDemo] = useState<string | null>(null);

  const premiumFeatures: PremiumFeature[] = [
    {
      id: 'advanced-analytics',
      title: 'Advanced Analytics',
      description: 'Deep insights into your meditation patterns and progress',
      icon: <BarChart3 className="h-5 w-5" />,
      available: false,
      demo: true
    },
    {
      id: 'unlimited-sessions',
      title: 'Unlimited Sessions',
      description: 'Access to our entire library of 500+ guided meditations',
      icon: <Zap className="h-5 w-5" />,
      available: false
    },
    {
      id: 'biofeedback-pro',
      title: 'Pro Biofeedback',
      description: 'Real-time heart rate and stress monitoring',
      icon: <Heart className="h-5 w-5" />,
      available: false,
      demo: true
    },
    {
      id: 'ai-coaching',
      title: 'AI Personal Coach',
      description: 'Personalized meditation recommendations powered by AI',
      icon: <Brain className="h-5 w-5" />,
      available: false,
      demo: true
    },
    {
      id: 'team-features',
      title: 'Team & Corporate',
      description: 'Advanced features for teams and organizations',
      icon: <Users className="h-5 w-5" />,
      available: false
    }
  ];

  const toggleDemo = (featureId: string) => {
    setShowDemo(showDemo === featureId ? null : featureId);
  };

  return (
    <div className="space-y-6">
      <FadeIn>
        <Card className="border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Crown className="h-12 w-12 text-yellow-600" />
            </div>
            <CardTitle className="text-2xl text-yellow-800">
              Unlock Premium Features
            </CardTitle>
            <p className="text-yellow-700">
              Experience the full power of Respiro Balance with advanced features designed for serious practitioners
            </p>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {premiumFeatures.map((feature, index) => (
                <ScaleIn key={feature.id} delay={index * 100}>
                  <HoverLift>
                    <Card className={`h-full ${feature.available ? 'border-green-200' : 'border-gray-200'}`}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${
                              feature.available ? 'bg-green-100' : 'bg-gray-100'
                            }`}>
                              {feature.icon}
                            </div>
                            <div>
                              <h3 className="font-semibold">{feature.title}</h3>
                              <p className="text-sm text-muted-foreground">
                                {feature.description}
                              </p>
                            </div>
                          </div>
                          
                          {feature.available ? (
                            <Unlock className="h-5 w-5 text-green-600" />
                          ) : (
                            <Lock className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                        
                        {!feature.available && (
                          <div className="space-y-2">
                            {feature.demo && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => toggleDemo(feature.id)}
                                className="w-full"
                              >
                                {showDemo === feature.id ? 'Hide Demo' : 'Try Demo'}
                              </Button>
                            )}
                            
                            {showDemo === feature.id && (
                              <div className="mt-3 p-3 bg-primary/5 rounded-lg border">
                                <div className="flex items-center gap-2 mb-2">
                                  <Star className="h-4 w-4 text-yellow-500" />
                                  <span className="text-sm font-medium">Demo Preview</span>
                                </div>
                                {feature.id === 'advanced-analytics' && (
                                  <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                      <span>Weekly Progress</span>
                                      <Badge variant="secondary">+23%</Badge>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                      <span>Stress Reduction</span>
                                      <Badge variant="secondary">15% improvement</Badge>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                      <span>Session Quality</span>
                                      <Badge variant="secondary">Excellent</Badge>
                                    </div>
                                  </div>
                                )}
                                {feature.id === 'biofeedback-pro' && (
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                      <Heart className="h-4 w-4 text-red-500" />
                                      <span className="text-sm">Heart Rate: 72 BPM</span>
                                    </div>
                                    <div className="text-sm text-green-600">✓ Optimal meditation state detected</div>
                                  </div>
                                )}
                                {feature.id === 'ai-coaching' && (
                                  <div className="space-y-2">
                                    <div className="text-sm font-medium">AI Recommendation:</div>
                                    <div className="text-sm text-muted-foreground">
                                      "Based on your stress patterns, try a 15-minute breathing exercise at 3 PM"
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                        
                        {feature.available && (
                          <div className="flex items-center gap-2 text-green-600">
                            <CheckCircle className="h-4 w-4" />
                            <span className="text-sm font-medium">Active</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </HoverLift>
                </ScaleIn>
              ))}
            </div>
            
            <div className="mt-6 text-center">
              <Button size="lg" className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600">
                <Crown className="h-4 w-4 mr-2" />
                Upgrade to Premium
              </Button>
              <p className="text-sm text-muted-foreground mt-2">
                30-day free trial • Cancel anytime • $9.99/month
              </p>
            </div>
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  );
};

export default ValuePropositionDemo;
