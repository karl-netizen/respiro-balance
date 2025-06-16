
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Users, 
  Target, 
  Clock,
  Star,
  BarChart3,
  Brain,
  Heart
} from 'lucide-react';
import { FadeIn, SlideIn } from '@/components/animations/MicroInteractions';

interface MetricCard {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
  icon: React.ReactNode;
  description: string;
}

const BusinessMetricsDashboard: React.FC = () => {
  const metrics: MetricCard[] = [
    {
      title: 'Daily Active Users',
      value: '2,847',
      change: '+12%',
      trend: 'up',
      icon: <Users className="h-5 w-5" />,
      description: 'vs last week'
    },
    {
      title: 'Session Completion',
      value: '87%',
      change: '+5%',
      trend: 'up',
      icon: <Target className="h-5 w-5" />,
      description: 'average completion rate'
    },
    {
      title: 'User Retention',
      value: '73%',
      change: '+8%',
      trend: 'up',
      icon: <Heart className="h-5 w-5" />,
      description: '7-day retention'
    },
    {
      title: 'Avg Session Time',
      value: '18m',
      change: '+2m',
      trend: 'up',
      icon: <Clock className="h-5 w-5" />,
      description: 'per meditation session'
    },
    {
      title: 'Premium Conversion',
      value: '4.2%',
      change: '+0.8%',
      trend: 'up',
      icon: <Star className="h-5 w-5" />,
      description: 'free to premium'
    },
    {
      title: 'Stress Reduction',
      value: '23%',
      change: '+3%',
      trend: 'up',
      icon: <Brain className="h-5 w-5" />,
      description: 'reported by users'
    }
  ];

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getTrendIcon = (trend: string) => {
    return <TrendingUp className={`h-4 w-4 ${getTrendColor(trend)}`} />;
  };

  return (
    <div className="space-y-6">
      <FadeIn>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Business Metrics Dashboard</h2>
          <Badge variant="secondary" className="flex items-center gap-1">
            <BarChart3 className="h-3 w-3" />
            Real-time
          </Badge>
        </div>
      </FadeIn>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((metric, index) => (
          <SlideIn key={metric.title} direction="up" delay={index * 100}>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {metric.title}
                </CardTitle>
                <div className="p-2 bg-primary/10 rounded-lg">
                  {metric.icon}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline justify-between">
                  <div className="text-2xl font-bold">{metric.value}</div>
                  <div className={`flex items-center gap-1 text-sm ${getTrendColor(metric.trend)}`}>
                    {getTrendIcon(metric.trend)}
                    {metric.change}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {metric.description}
                </p>
              </CardContent>
            </Card>
          </SlideIn>
        ))}
      </div>
    </div>
  );
};

export default BusinessMetricsDashboard;
