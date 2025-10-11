import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Brain, Zap } from 'lucide-react';

interface UsageEntry {
  type: 'ai_generated' | 'fallback_generated';
  count: number;
  timestamp: string;
}

export function AIUsageStats() {
  const [stats, setStats] = useState<{
    aiGenerated: number;
    fallbackGenerated: number;
    total: number;
    aiPercentage: number;
  }>({
    aiGenerated: 0,
    fallbackGenerated: 0,
    total: 0,
    aiPercentage: 0
  });

  useEffect(() => {
    const loadStats = () => {
      try {
        const usageKey = 'respiro_ai_usage';
        const usageData = JSON.parse(localStorage.getItem(usageKey) || '[]') as UsageEntry[];
        
        const aiCount = usageData.filter(u => u.type === 'ai_generated').length;
        const fallbackCount = usageData.filter(u => u.type === 'fallback_generated').length;
        const total = aiCount + fallbackCount;
        const aiPercentage = total > 0 ? Math.round((aiCount / total) * 100) : 0;
        
        setStats({
          aiGenerated: aiCount,
          fallbackGenerated: fallbackCount,
          total,
          aiPercentage
        });
      } catch (error) {
        console.error('Failed to load usage stats:', error);
      }
    };

    loadStats();
    
    // Refresh stats every minute
    const interval = setInterval(loadStats, 60000);
    return () => clearInterval(interval);
  }, []);

  if (stats.total === 0) {
    return null;
  }

  return (
    <Card className="border-muted">
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <BarChart className="h-4 w-4" />
          AI Usage
        </CardTitle>
        <CardDescription className="text-xs">
          Your recommendation generation stats
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-primary" />
              <span className="text-sm">AI Generated</span>
            </div>
            <Badge variant="secondary" className="text-xs">
              {stats.aiGenerated} ({stats.aiPercentage}%)
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-orange-500" />
              <span className="text-sm">Rule-Based</span>
            </div>
            <Badge variant="outline" className="text-xs">
              {stats.fallbackGenerated} ({100 - stats.aiPercentage}%)
            </Badge>
          </div>

          {/* Progress bar */}
          <div className="space-y-1">
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all"
                style={{ width: `${stats.aiPercentage}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Total: {stats.total} recommendations
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
