import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const LazyChart: React.FC = () => {
  const data = React.useMemo(() => 
    Array.from({ length: 20 }, (_, i) => ({
      name: `Day ${i + 1}`,
      value: Math.floor(Math.random() * 100)
    }))
  , []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Performance Chart</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {data.slice(0, 5).map((item, index) => (
            <div key={index} className="flex justify-between items-center text-sm">
              <span>{item.name}</span>
              <div className="flex items-center gap-2">
                <div 
                  className="h-2 bg-primary rounded-full" 
                  style={{ width: `${item.value}px`, maxWidth: '100px' }}
                />
                <span className="text-xs text-muted-foreground w-8">{item.value}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default LazyChart;