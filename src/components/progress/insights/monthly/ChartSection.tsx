
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
  const [chartType, setChartType] = useState<'bar' | 'line' | 'combined'>('combined');
  const [dataView, setDataView] = useState<'monthly' | 'weekly'>('monthly');
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
  
  // Mobile responsive configuration
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const chartHeight = isMobile ? 200 : 300;
  const fontSize = isMobile ? 10 : 12;
  const barSize = isMobile ? 15 : 20;
  
  // Function to render the appropriate chart based on selected type
  const renderChart = () => {
    const margin = { 
      top: 10, 
      right: isMobile ? 10 : 30, 
      left: isMobile ? 0 : 10, 
      bottom: isMobile ? 30 : 20 
    };

    switch (chartType) {
      case 'bar':
        return (
          <BarChart data={displayData} margin={margin}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey={xAxisKey} 
              fontSize={fontSize}
              angle={isMobile ? -45 : 0}
              textAnchor={isMobile ? "end" : "middle"}
              height={isMobile ? 40 : 30}
            />
            <YAxis fontSize={fontSize} width={isMobile ? 25 : 40} />
            <Tooltip content={<ChartTooltipContent />} />
            <Legend content={<ChartLegendContent />} />
            <Bar 
              dataKey="sessions" 
              fill="var(--color-sessions)" 
              radius={[2, 2, 0, 0]} 
              maxBarSize={barSize} 
            />
            {showPatterns && (
              <ReferenceLine 
                y={averageSessions} 
                stroke="#8884d8" 
                strokeDasharray="2 2" 
                strokeWidth={1}
              />
            )}
          </BarChart>
        );
      case 'line':
        return (
          <LineChart data={displayData} margin={margin}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey={xAxisKey} 
              fontSize={fontSize}
              angle={isMobile ? -45 : 0}
              textAnchor={isMobile ? "end" : "middle"}
              height={isMobile ? 40 : 30}
            />
            <YAxis fontSize={fontSize} width={isMobile ? 25 : 40} />
            <Tooltip content={<ChartTooltipContent />} />
            <Legend content={<ChartLegendContent />} />
            <Line 
              type="monotone" 
              dataKey="minutes" 
              stroke="var(--color-minutes)" 
              strokeWidth={2} 
              dot={{ r: isMobile ? 3 : 4 }} 
            />
            {showPatterns && (
              <ReferenceLine 
                y={displayData.reduce((sum, item) => sum + item.minutes, 0) / displayData.length} 
                stroke="#82ca9d" 
                strokeDasharray="2 2" 
                strokeWidth={1}
                label={!isMobile ? "Average" : ""} 
              />
            )}
          </LineChart>
        );
      default: // combined
        return (
          <BarChart data={displayData} margin={margin}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey={xAxisKey} 
              fontSize={fontSize}
              angle={isMobile ? -45 : 0}
              textAnchor={isMobile ? "end" : "middle"}
              height={isMobile ? 40 : 30}
            />
            <YAxis 
              yAxisId="left" 
              orientation="left" 
              stroke="#6366f1" 
              fontSize={fontSize} 
              width={isMobile ? 25 : 40} 
            />
            <YAxis 
              yAxisId="right" 
              orientation="right" 
              stroke="#10b981" 
              fontSize={fontSize} 
              width={isMobile ? 25 : 40} 
            />
            <Tooltip content={<ChartTooltipContent />} />
            <Legend content={<ChartLegendContent />} />
            <Bar 
              yAxisId="left" 
              dataKey="sessions" 
              fill="var(--color-sessions)" 
              radius={[2, 2, 0, 0]} 
              maxBarSize={barSize} 
            />
            <Line 
              yAxisId="right" 
              type="monotone" 
              dataKey="minutes" 
              stroke="var(--color-minutes)" 
              strokeWidth={2} 
              dot={{ r: isMobile ? 3 : 4 }} 
            />
            {showPatterns && (
              <ReferenceLine 
                yAxisId="left" 
                y={averageSessions} 
                stroke="#8884d8" 
                strokeDasharray="2 2" 
                strokeWidth={1}
              />
            )}
          </BarChart>
        );
    }
  };
  
  return (
    <div className="space-y-4">
      {/* Mobile-optimized controls */}
      <div className="flex flex-col sm:flex-row gap-2 sm:justify-between sm:items-center">
        <div className="flex flex-wrap gap-1">
          <Button
            variant={chartType === 'bar' ? "default" : "outline"}
            size="sm"
            onClick={() => setChartType('bar')}
            className="h-7 px-2 text-xs sm:h-8 sm:px-3 sm:text-sm"
          >
            <BarChart2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            <span className="hidden xs:inline">Bar</span>
          </Button>
          <Button
            variant={chartType === 'line' ? "default" : "outline"}
            size="sm"
            onClick={() => setChartType('line')}
            className="h-7 px-2 text-xs sm:h-8 sm:px-3 sm:text-sm"
          >
            <LineChartIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            <span className="hidden xs:inline">Line</span>
          </Button>
          <Button
            variant={chartType === 'combined' ? "default" : "outline"}
            size="sm"
            onClick={() => setChartType('combined')}
            className="h-7 px-2 text-xs sm:h-8 sm:px-3 sm:text-sm"
          >
            <LayoutGrid className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            <span className="hidden xs:inline">Combined</span>
          </Button>
        </div>
        
        <div className="flex gap-1">
          <Button
            variant={dataView === 'monthly' ? "default" : "outline"}
            size="sm"
            onClick={() => setDataView('monthly')}
            className="h-7 px-2 text-xs sm:h-8 sm:px-3 sm:text-sm"
          >
            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            <span className="hidden xs:inline">Monthly</span>
            <span className="xs:hidden">M</span>
          </Button>
          <Button
            variant={dataView === 'weekly' ? "default" : "outline"}
            size="sm"
            onClick={() => setDataView('weekly')}
            className="h-7 px-2 text-xs sm:h-8 sm:px-3 sm:text-sm"
          >
            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            <span className="hidden xs:inline">Weekly</span>
            <span className="xs:hidden">W</span>
          </Button>
        </div>
      </div>
      
      {/* Chart container - no horizontal scrolling */}
      <div className="w-full overflow-hidden">
        <div className={`h-[${chartHeight}px] w-full`}>
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
            <ResponsiveContainer width="100%" height="100%">
              {renderChart()}
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </div>
      
      {/* Mobile-optimized pattern toggle */}
      <div className="flex justify-center sm:justify-end">
        <Button
          variant={showPatterns ? "default" : "outline"}
          size="sm"
          onClick={() => setShowPatterns(!showPatterns)}
          className="h-7 px-3 text-xs sm:h-8 sm:text-sm"
        >
          {showPatterns ? "Hide Patterns" : "Show Patterns"}
        </Button>
      </div>
    </div>
  );
};

export default ChartSection;
