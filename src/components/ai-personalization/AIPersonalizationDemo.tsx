import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Brain } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AIPersonalizationDashboard } from './AIPersonalizationDashboard';
import { SessionRecommendation } from '@/lib/ai-personalization/types';

export const AIPersonalizationDemo: React.FC = () => {
  const navigate = useNavigate();

  const handleSessionStart = (recommendation: SessionRecommendation) => {
    // Navigate to appropriate session based on recommendation
    const sessionRoutes = {
      meditation: '/meditate',
      breathing: '/breathe',
      focus: '/focus',
      sleep: '/sleep',
      stress_relief: '/stress-relief'
    };

    const route = sessionRoutes[recommendation.sessionType] || '/meditate';
    navigate(route, { 
      state: { 
        recommendation,
        aiPersonalized: true 
      } 
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Brain className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">AI Personalization Engine</h1>
              <p className="text-lg text-muted-foreground">
                Experience intelligent, personalized wellness recommendations
              </p>
            </div>
          </div>
        </div>

        {/* Feature Overview */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Intelligent Wellness Personalization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg mx-auto mb-3 flex items-center justify-center">
                  <Brain className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold mb-2">Contextual Analysis</h3>
                <p className="text-sm text-muted-foreground">
                  AI analyzes your mood, stress level, available time, and personal history
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg mx-auto mb-3 flex items-center justify-center">
                  <Brain className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-semibold mb-2">Smart Recommendations</h3>
                <p className="text-sm text-muted-foreground">
                  Personalized session suggestions with confidence scoring and reasoning
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg mx-auto mb-3 flex items-center justify-center">
                  <Brain className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-semibold mb-2">Continuous Learning</h3>
                <p className="text-sm text-muted-foreground">
                  System learns from your feedback to improve future recommendations
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Dashboard */}
        <AIPersonalizationDashboard onSessionStart={handleSessionStart} />
      </div>
    </div>
  );
};

export default AIPersonalizationDemo;