import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAIRecommendations } from '@/hooks/useAIRecommendations';
import { Sparkles, Clock, TrendingUp, Brain, Loader2, Settings } from 'lucide-react';
import { SessionRecommendation, RecommendationContext } from '@/services/AIPersonalizationEngine';
import { ContextControls } from './ContextControls';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { AIUsageStats } from './AIUsageStats';

export function AIRecommendationsPanel() {
  const { recommendations, isLoading, generateRecommendations } = useAIRecommendations();
  const [selectedRec, setSelectedRec] = useState<SessionRecommendation | null>(null);
  const [showControls, setShowControls] = useState(false);
  const [currentContext, setCurrentContext] = useState<RecommendationContext>({
    currentMood: 5,
    currentStress: 5,
    energyLevel: 5,
    availableTime: 15,
  });

  useEffect(() => {
    // Auto-generate recommendations on mount with default context
    const currentHour = new Date().getHours();
    const timeOfDay = currentHour < 12 ? 'morning' : currentHour < 18 ? 'afternoon' : 'evening';
    
    const initialContext = {
      ...currentContext,
      timeOfDay
    } as RecommendationContext;
    
    setCurrentContext(initialContext);
    generateRecommendations(initialContext);
  }, []);

  const handleRefresh = () => {
    generateRecommendations(currentContext);
  };

  const handleContextUpdate = (newContext: RecommendationContext) => {
    setCurrentContext(newContext);
    generateRecommendations(newContext);
    setShowControls(false);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            AI-Powered Recommendations
          </CardTitle>
          <CardDescription>Personalized sessions just for you</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Analyzing your preferences...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Context Controls & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <Collapsible open={showControls} onOpenChange={setShowControls}>
            <div className="flex items-center justify-between">
              <CollapsibleTrigger asChild>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Customize
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent className="pt-4">
              <ContextControls
                onUpdate={handleContextUpdate}
                onRefresh={handleRefresh}
                isLoading={isLoading}
              />
            </CollapsibleContent>
          </Collapsible>
        </div>
        <div>
          <AIUsageStats />
        </div>
      </div>

      {/* Recommendations Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                AI-Powered Recommendations
              </CardTitle>
              <CardDescription>Personalized sessions based on your current state</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.length === 0 ? (
          <div className="text-center py-8">
            <Brain className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">
              No recommendations available yet. Complete a few sessions to get personalized suggestions!
            </p>
          </div>
        ) : (
          recommendations.map((rec, index) => (
            <Card
              key={rec.id}
              className="cursor-pointer transition-all hover:shadow-md border-2"
              onClick={() => setSelectedRec(rec)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {rec.sessionType.replace('_', ' ').toUpperCase()}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {rec.difficulty}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {rec.duration} min
                      </div>
                    </div>
                    <CardTitle className="text-lg">{rec.title}</CardTitle>
                    <CardDescription className="mt-1">
                      {rec.description}
                    </CardDescription>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-1 text-xs text-primary font-medium">
                      <TrendingUp className="h-3 w-3" />
                      {Math.round(rec.confidence * 100)}% match
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Expected Benefits */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center p-2 bg-secondary/50 rounded-lg">
                    <div className="text-lg font-bold text-primary">
                      {rec.expectedBenefits.moodImprovement}
                    </div>
                    <div className="text-xs text-muted-foreground">Mood</div>
                  </div>
                  <div className="text-center p-2 bg-secondary/50 rounded-lg">
                    <div className="text-lg font-bold text-primary">
                      {rec.expectedBenefits.stressReduction}
                    </div>
                    <div className="text-xs text-muted-foreground">Stress Relief</div>
                  </div>
                  <div className="text-center p-2 bg-secondary/50 rounded-lg">
                    <div className="text-lg font-bold text-primary">
                      {rec.expectedBenefits.focusImprovement}
                    </div>
                    <div className="text-xs text-muted-foreground">Focus</div>
                  </div>
                </div>

                {/* AI Reasoning */}
                <div className="space-y-1">
                  <p className="text-xs font-medium">Why this session?</p>
                  <ul className="space-y-1">
                    {rec.reasoning.slice(0, 2).map((reason, idx) => (
                      <li key={idx} className="text-xs text-muted-foreground flex items-start gap-2">
                        <span className="text-primary mt-0.5">•</span>
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {rec.tags.slice(0, 4).map((tag, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <Button className="w-full" size="sm">
                  Start Session
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </CardContent>
    </Card>
    </div>
  );
}
