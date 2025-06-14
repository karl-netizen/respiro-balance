
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, ArrowRight, Sparkles } from 'lucide-react';
import { useEnhancedUXContext } from './EnhancedUXProvider';
import { useNavigate } from 'react-router-dom';

export const SmartRecommendations: React.FC = () => {
  const { sessionRecommendations, startSessionFlow } = useEnhancedUXContext();
  const navigate = useNavigate();

  if (sessionRecommendations.length === 0) return null;

  const handleStartFlow = async () => {
    const sessionFlow = await startSessionFlow(sessionRecommendations, {
      userGoal: 'smart_recommendation',
      timeConstraints: { maxDuration: 30 }
    });
    
    if (sessionFlow) {
      navigate(`/${sessionFlow.currentModule}`);
    }
  };

  const getModuleIcon = (module: string) => {
    switch (module) {
      case 'meditation': return '🧘';
      case 'breathing': return '🫁';
      case 'focus': return '🎯';
      case 'morning-ritual': return '🌅';
      default: return '✨';
    }
  };

  return (
    <Card className="border-l-4 border-l-purple-500 bg-purple-50/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-500" />
          Smart Recommendations
          <Badge variant="outline" className="text-purple-600">
            <Sparkles className="h-3 w-3 mr-1" />
            AI Powered
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          Based on your patterns and current state, we recommend this session flow:
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          {sessionRecommendations.map((module, index) => (
            <React.Fragment key={module}>
              <div className="flex items-center gap-1 px-2 py-1 bg-white rounded-lg border">
                <span>{getModuleIcon(module)}</span>
                <span className="text-sm font-medium capitalize">{module.replace('-', ' ')}</span>
              </div>
              {index < sessionRecommendations.length - 1 && (
                <ArrowRight className="h-3 w-3 text-muted-foreground" />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="flex gap-2">
          <Button onClick={handleStartFlow} className="flex-1">
            Start Recommended Flow
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate(`/${sessionRecommendations[0]}`)}
          >
            Just {sessionRecommendations[0]}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
