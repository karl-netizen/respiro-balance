
import React, { useState } from 'react';
import { 
  ChartContainer, 
  ChartTooltipContent,
  ChartLegendContent
} from "@/components/ui/chart";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea
} from "recharts";
import { Button } from "@/components/ui/button";
import { Calendar, BarChart2, LineChart as LineChartIcon, LayoutGrid } from "lucide-react";

interface ChartSectionProps {
  sessionData: Array<{
    month: string;
    sessions: number;
    minutes: number;
  }>;
}

const ChartSection: React.FC<ChartSectionProps> = ({ sessionData }) => {
  // State for chart type
  const [chartType, setChartType] = useState<'bar' | 'line' | 'combined'>('combined');
  // State for data view - monthly or weekly (simulated in this case)
  const [dataView, setDataView] = useState<'monthly' | 'weekly'>('monthly');
  // State for highlighted regions (to show patterns)
  const [showPatterns, setShowPatterns] = useState(false);
  
  // Calculate average session count for reference line
  const averageSessions = sessionData.reduce((sum, item) => sum + item.sessions, 0) / sessionData.length;
  
  // Simulated data for weekly view
  const weeklyData = [
    { day: 'Mon', sessions: 1, minutes: 15 },
    { day: 'Tue', sessions: 2, minutes: 25 },
    { day: 'Wed', sessions: 0, minutes: 0 },
    { day: 'Thu', sessions: 1, minutes: 10 },
    { day: 'Fri', sessions: 0, minutes: 0 },
    { day: 'Sat', sessions: 2, minutes: 30 },
    { day: 'Sun', sessions: 1, minutes: 20 },
  ];
  
  // Determine which data to display based on view
  const displayData = dataView === 'monthly' ? sessionData : weeklyData;
  const xAxisKey = dataView === 'monthly' ? 'month' : 'day';
  
  // Function to render the appropriate chart based on selected type
  const renderChart = () => {
    switch (chartType) {
      case 'bar':
        return (
          <BarChart data={displayData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey={xAxisKey} />
            <YAxis />
            <Tooltip content={<ChartTooltipContent />} />
            <Legend content={<ChartLegendContent />} />
            <Bar dataKey="sessions" fill="var(--color-sessions)" radius={[4, 4, 0, 0]} barSize={20} />
            {showPatterns && <ReferenceLine y={averageSessions} stroke="#8884d8" strokeDasharray="3 3" />}
            {showPatterns && dataView === 'monthly' && (
              <ReferenceArea x1="Jan" x2="Mar" y1={0} y2={Math.max(...sessionData.map(d => d.sessions)) + 1} fill="#8884d8" fillOpacity={0.1} />
            )}
          </BarChart>
        );
      case 'line':
        return (
          <LineChart data={displayData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xAxisKey} />
            <YAxis />
            <Tooltip content={<ChartTooltipContent />} />
            <Legend content={<ChartLegendContent />} />
            <Line type="monotone" dataKey="minutes" stroke="var(--color-minutes)" strokeWidth={2} dot={{ r: 4 }} />
            {showPatterns && (
              <ReferenceLine 
                y={displayData.reduce((sum, item) => sum + item.minutes, 0) / displayData.length} 
                stroke="#82ca9d" 
                strokeDasharray="3 3" 
                label="Average" 
              />
            )}
          </LineChart>
        );
      default: // combined
        return (
          <BarChart data={displayData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey={xAxisKey} />
            <YAxis yAxisId="left" orientation="left" stroke="#6366f1" />
            <YAxis yAxisId="right" orientation="right" stroke="#10b981" />
            <Tooltip content={<ChartTooltipContent />} />
            <Legend content={<ChartLegendContent />} />
            <Bar yAxisId="left" dataKey="sessions" fill="var(--color-sessions)" radius={[4, 4, 0, 0]} barSize={20} />
            <Line yAxisId="right" type="monotone" dataKey="minutes" stroke="var(--color-minutes)" strokeWidth={2} dot={{ r: 4 }} />
            {showPatterns && <ReferenceLine yAxisId="left" y={averageSessions} stroke="#8884d8" strokeDasharray="3 3" />}
          </BarChart>
        );
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 justify-between items-center">
        <div className="flex gap-1">
          <Button
            variant={chartType === 'bar' ? "default" : "outline"}
            size="sm"
            onClick={() => setChartType('bar')}
            className="h-8"
          >
            <BarChart2 className="h-4 w-4 mr-1" />
            Bar
          </Button>
          <Button
            variant={chartType === 'line' ? "default" : "outline"}
            size="sm"
            onClick={() => setChartType('line')}
            className="h-8"
          >
            <LineChartIcon className="h-4 w-4 mr-1" />
            Line
          </Button>
          <Button
            variant={chartType === 'combined' ? "default" : "outline"}
            size="sm"
            onClick={() => setChartType('combined')}
            className="h-8"
          >
            <LayoutGrid className="h-4 w-4 mr-1" />
            Combined
          </Button>
        </div>
        
        <div className="flex gap-1">
          <Button
            variant={dataView === 'monthly' ? "default" : "outline"}
            size="sm"
            onClick={() => setDataView('monthly')}
            className="h-8"
          >
            <Calendar className="h-4 w-4 mr-1" />
            Monthly
          </Button>
          <Button
            variant={dataView === 'weekly' ? "default" : "outline"}
            size="sm"
            onClick={() => setDataView('weekly')}
            className="h-8"
          >
            <Calendar className="h-4 w-4 mr-1" />
            Weekly
          </Button>
        </div>
      </div>
      
      <div className="h-[300px]">
        <ChartContainer 
          className="w-full h-full" 
          config={{
            sessions: { 
              label: "Sessions",
              theme: { light: "#6366f1", dark: "#818cf8" } 
            },
            minutes: { 
              label: "Minutes", 
              theme: { light: "#10b981", dark: "#34d399" } 
            }
          }}
        >
          {renderChart()}
        </ChartContainer>
      </div>
      
      <div className="text-right">
        <Button
          variant={showPatterns ? "default" : "outline"}
          size="sm"
          onClick={() => setShowPatterns(!showPatterns)}
          className="h-8"
        >
          {showPatterns ? "Hide Patterns" : "Show Patterns"}
        </Button>
      </div>
    </div>
  );
};

export default ChartSection;
