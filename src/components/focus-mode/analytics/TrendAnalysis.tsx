
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp } from 'lucide-react';

interface TrendDataPoint {
  date: string;
  focusScore: number;
  sessions: number;
  distractions: number;
  productivity: number;
}

interface TrendAnalysisProps {
  data: TrendDataPoint[];
  timeframe: 'week' | 'month' | 'quarter';
}

export const TrendAnalysis: React.FC<TrendAnalysisProps> = ({ data, timeframe }) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    if (timeframe === 'week') {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Trend Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Focus Score Trend */}
          <div>
            <h4 className="text-sm font-medium mb-3">Focus Score Trend</h4>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={formatDate}
                    fontSize={12}
                  />
                  <YAxis domain={[0, 100]} fontSize={12} />
                  <Tooltip 
                    labelFormatter={(label) => formatDate(label)}
                    formatter={(value: any, name: string) => [
                      `${value}${name === 'focusScore' ? '/100' : ''}`,
                      name === 'focusScore' ? 'Focus Score' : name
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="focusScore"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Sessions vs Distractions */}
          <div>
            <h4 className="text-sm font-medium mb-3">Sessions vs Distractions</h4>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={formatDate}
                    fontSize={12}
                  />
                  <YAxis fontSize={12} />
                  <Tooltip labelFormatter={(label) => formatDate(label)} />
                  <Line 
                    type="monotone" 
                    dataKey="sessions" 
                    stroke="#82ca9d" 
                    strokeWidth={2}
                    name="Sessions"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="distractions" 
                    stroke="#ff7c7c" 
                    strokeWidth={2}
                    name="Distractions"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="text-lg font-semibold">
                {Math.round(data.reduce((sum, item) => sum + item.focusScore, 0) / data.length)}
              </div>
              <div className="text-xs text-muted-foreground">Avg Focus Score</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold">
                {data.reduce((sum, item) => sum + item.sessions, 0)}
              </div>
              <div className="text-xs text-muted-foreground">Total Sessions</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold">
                {data.reduce((sum, item) => sum + item.distractions, 0)}
              </div>
              <div className="text-xs text-muted-foreground">Total Distractions</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
