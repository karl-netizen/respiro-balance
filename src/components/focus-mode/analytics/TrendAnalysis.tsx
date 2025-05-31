
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingUp } from 'lucide-react';

interface TrendData {
  date: string;
  focusScore: number;
  sessions: number;
  distractions: number;
  productivity: number;
}

interface TrendAnalysisProps {
  data: TrendData[];
  timeframe: 'week' | 'month' | 'quarter';
}

export const TrendAnalysis: React.FC<TrendAnalysisProps> = ({ data, timeframe }) => {
  const formatXAxisLabel = (dateStr: string) => {
    const date = new Date(dateStr);
    if (timeframe === 'week') {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else if (timeframe === 'month') {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short' });
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{new Date(label).toLocaleDateString()}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
              {entry.dataKey === 'focusScore' && '/100'}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Calculate trend indicators
  const latestScore = data[data.length - 1]?.focusScore || 0;
  const previousScore = data[data.length - 8]?.focusScore || 0; // Compare to a week ago
  const trend = latestScore - previousScore;

  return (
    <div className="space-y-6">
      {/* Trend Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Productivity Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatXAxisLabel}
                  fontSize={12}
                />
                <YAxis fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="focusScore"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatXAxisLabel}
                  fontSize={12}
                />
                <YAxis fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="sessions"
                  stroke="#82ca9d"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  name="Sessions"
                />
                <Line
                  type="monotone"
                  dataKey="distractions"
                  stroke="#ffc658"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  name="Distractions"
                />
                <Line
                  type="monotone"
                  dataKey="productivity"
                  stroke="#ff7300"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  name="Productivity"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Trend Summary */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Focus Score Trend</p>
              <p className="text-2xl font-bold">
                {trend > 0 ? '+' : ''}{trend.toFixed(1)}
              </p>
            </div>
            <div className={`text-right ${trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : 'text-gray-600'}`}>
              <TrendingUp className={`h-6 w-6 ${trend < 0 ? 'rotate-180' : ''}`} />
              <p className="text-xs">vs previous period</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
