
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TouchFriendlyButton } from '@/components/responsive/TouchFriendlyButton';
import { BarChart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DashboardStatsProps {
  weeklyProgress: number;
  weeklyGoal: number;
  progressPercentage: number;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({
  weeklyProgress,
  weeklyGoal,
  progressPercentage
}) => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <BarChart className="h-5 w-5 text-green-500" />
          Weekly Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Meditation Goal</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
          <div className="text-center">
            <TouchFriendlyButton 
              className="w-full" 
              onClick={() => navigate('/progress')}
            >
              View Detailed Progress
            </TouchFriendlyButton>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardStats;
