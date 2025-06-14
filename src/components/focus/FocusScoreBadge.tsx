
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Target, TrendingUp, TrendingDown } from 'lucide-react';
import { useFocusStats } from '@/hooks/useFocusStats';

const FocusScoreBadge: React.FC = () => {
  const { stats, isLoading } = useFocusStats();

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 animate-pulse">
        <div className="w-16 h-6 bg-muted rounded"></div>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500 text-white';
    if (score >= 60) return 'bg-yellow-500 text-white';
    return 'bg-red-500 text-white';
  };

  const getTrendIcon = () => {
    if (stats.focusScore >= 75) return <TrendingUp className="h-3 w-3" />;
    return <TrendingDown className="h-3 w-3" />;
  };

  return (
    <div className="flex items-center gap-2">
      <Badge variant="outline" className={`flex items-center gap-1 ${getScoreColor(stats.focusScore)}`}>
        <Target className="h-3 w-3" />
        Focus: {stats.focusScore}
      </Badge>
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        {getTrendIcon()}
        <span>{stats.currentStreak} day streak</span>
      </div>
      <div className="text-xs text-muted-foreground">
        {stats.todaysSessions} sessions today
      </div>
    </div>
  );
};

export default FocusScoreBadge;
