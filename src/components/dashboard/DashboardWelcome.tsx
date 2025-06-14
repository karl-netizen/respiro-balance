
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TimePeriod } from '@/services/TimeAwarenessService';

interface DashboardWelcomeProps {
  welcomeMessage: string;
  currentPeriod: TimePeriod;
  quickStats: Array<{
    title: string;
    value: string | number;
    icon: React.ReactNode;
    description: string;
  }>;
}

const DashboardWelcome: React.FC<DashboardWelcomeProps> = ({
  welcomeMessage,
  currentPeriod,
  quickStats
}) => {
  const getPeriodDescription = () => {
    switch (currentPeriod) {
      case 'morning': return "Start your day with intention";
      case 'afternoon': return "Take a moment to reset and refocus";
      case 'evening': return "Unwind and reflect on your day";
      case 'night': return "Prepare for restful sleep";
      default: return "";
    }
  };

  return (
    <Card className="border-0 shadow-none bg-gradient-to-br from-primary/5 to-secondary/5">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">{welcomeMessage}</CardTitle>
            <CardDescription className="text-base mt-1">
              {getPeriodDescription()}
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-sm">
            {currentPeriod.charAt(0).toUpperCase() + currentPeriod.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickStats.map((stat, index) => (
            <div key={index} className="text-center p-3 bg-background/60 rounded-lg backdrop-blur-sm">
              <div className="flex items-center justify-center mb-2">
                {stat.icon}
              </div>
              <div className="font-bold text-lg">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.description}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardWelcome;
