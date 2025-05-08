import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react'; 
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useFocus } from '@/context/FocusProvider';
import { FocusActivityEntry } from './types';

export const FocusInsights: React.FC = () => {
  const { stats } = useFocus();
  
  const [data, setData] = React.useState<FocusActivityEntry[]>([]);
  
  React.useEffect(() => {
    // In a real app, this data would come from your database
    // Here we're generating demo data
    const demoData: FocusActivityEntry[] = [
      { date: 'Mon', minutesSpent: 65, sessions: 2, averageScore: 85 },
      { date: 'Tue', minutesSpent: 45, sessions: 1, averageScore: 76 },
      { date: 'Wed', minutesSpent: 90, sessions: 3, averageScore: 81 },
      { date: 'Thu', minutesSpent: 30, sessions: 1, averageScore: 72 },
      { date: 'Fri', minutesSpent: 75, sessions: 2, averageScore: 79 },
      { date: 'Sat', minutesSpent: 0, sessions: 0, averageScore: undefined },
      { date: 'Sun', minutesSpent: 50, sessions: 1, averageScore: 88 },
    ];
    
    setData(demoData);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          Focus Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Area 
                yAxisId="left"
                type="monotone" 
                dataKey="minutesSpent" 
                name="Minutes Focused"
                stroke="#8884d8" 
                fill="#8884d8" 
                fillOpacity={0.3}
              />
              <Area 
                yAxisId="right"
                type="monotone" 
                dataKey="averageScore" 
                name="Focus Score"
                stroke="#82ca9d" 
                fill="#82ca9d" 
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 text-center">
          <div>
            <p className="text-muted-foreground text-sm">Weekly Sessions</p>
            <p className="text-2xl font-bold">{stats?.totalSessions || data.reduce((sum, item) => sum + item.sessions, 0)}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Weekly Minutes</p>
            <p className="text-2xl font-bold">{stats?.weeklyFocusTime || data.reduce((sum, item) => sum + item.minutesSpent, 0)}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Avg. Focus Score</p>
            <p className="text-2xl font-bold">
              {stats?.averageFocusScore ? 
                Math.round(stats.averageFocusScore) : 
                Math.round(data.filter(d => d.averageScore !== undefined)
                  .reduce((sum, item) => sum + (item.averageScore || 0), 0) / 
                  data.filter(d => d.averageScore !== undefined).length)
              }
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
