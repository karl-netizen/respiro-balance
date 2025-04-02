
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Brain, Activity, Heart, TrendingUp, TrendingDown } from "lucide-react";

interface WellbeingCorrelationCardProps {
  metricName: string;
  withMeditation: number;
  withoutMeditation: number;
  icon: 'brain' | 'activity' | 'heart';
  description: string;
}

const WellbeingCorrelationCard: React.FC<WellbeingCorrelationCardProps> = ({
  metricName,
  withMeditation,
  withoutMeditation,
  icon,
  description
}) => {
  const difference = withMeditation - withoutMeditation;
  const isPositive = difference > 0;
  const percentage = Math.abs(difference);
  
  const renderIcon = () => {
    switch (icon) {
      case 'brain':
        return <Brain className="h-5 w-5 text-primary" />;
      case 'activity':
        return <Activity className="h-5 w-5 text-primary" />;
      case 'heart':
        return <Heart className="h-5 w-5 text-primary" />;
      default:
        return <Brain className="h-5 w-5 text-primary" />;
    }
  };
  
  return (
    <Card className="border shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          {renderIcon()}
          {metricName}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">With Meditation</p>
            <div className="bg-primary/10 p-3 rounded-md">
              <p className="text-2xl font-bold">{withMeditation}%</p>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">Without Meditation</p>
            <div className="bg-secondary/10 p-3 rounded-md">
              <p className="text-2xl font-bold">{withoutMeditation}%</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Difference</span>
            <span className="text-sm font-medium flex items-center gap-1">
              {isPositive ? (
                <>
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-green-500">+{percentage}%</span>
                </>
              ) : (
                <>
                  <TrendingDown className="h-4 w-4 text-red-500" />
                  <span className="text-red-500">-{percentage}%</span>
                </>
              )}
            </span>
          </div>
          <Progress value={isPositive ? 50 + percentage/2 : 50 - percentage/2} className="h-2" />
          <p className="text-xs text-muted-foreground mt-1">
            {isPositive 
              ? `${percentage}% improvement on meditation days`
              : `${percentage}% reduction on meditation days`}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default WellbeingCorrelationCard;
