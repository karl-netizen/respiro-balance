import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const LazyAnalytics: React.FC = () => {
  const metrics = React.useMemo(() => [
    { label: 'Active Users', value: '2,341', change: '+12%' },
    { label: 'Sessions', value: '8,753', change: '+5%' },
    { label: 'Bounce Rate', value: '23%', change: '-3%' },
    { label: 'Avg. Session', value: '4m 32s', change: '+8%' }
  ], []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Analytics Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {metrics.map((metric, index) => (
            <div key={index} className="space-y-1">
              <div className="text-xs text-muted-foreground">{metric.label}</div>
              <div className="font-medium text-sm">{metric.value}</div>
              <Badge 
                variant={metric.change.startsWith('+') ? 'default' : 'secondary'}
                className="text-xs"
              >
                {metric.change}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default LazyAnalytics;