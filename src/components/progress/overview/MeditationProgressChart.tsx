
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { TouchFriendlyButton } from "@/components/responsive/TouchFriendlyButton";
import { Calendar } from "lucide-react";
import { useDeviceDetection } from "@/hooks/useDeviceDetection";

interface MeditationProgressChartProps {
  dailyData: {
    day: string;
    minutes: number;
    sessions: number;
  }[];
}

// Skeleton loader component
const ChartSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
    <div className="space-y-2">
      {[...Array(7)].map((_, i) => (
        <div key={i} className="flex items-center space-x-2">
          <div className="h-3 bg-gray-200 rounded w-8"></div>
          <div className="h-8 bg-gray-200 rounded flex-1" style={{ width: `${Math.random() * 60 + 20}%` }}></div>
        </div>
      ))}
    </div>
  </div>
);

const MeditationProgressChart: React.FC<MeditationProgressChartProps> = ({ dailyData }) => {
  const [view, setView] = React.useState<'daily' | 'weekly'>('daily');
  const [isLoading, setIsLoading] = React.useState(true);
  const { deviceType } = useDeviceDetection();
  
  // Simulate loading for demonstration
  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);
  
  // Calculate average minutes
  const average = dailyData.reduce((sum, item) => sum + item.minutes, 0) / dailyData.length;
  
  // Mobile-specific data filtering - show fewer points on very small screens
  const getFilteredData = () => {
    if (deviceType === 'mobile' && window.innerWidth < 380) {
      // Show every other day on very small screens
      return dailyData.filter((_, index) => index % 2 === 0);
    }
    return dailyData;
  };

  const filteredData = getFilteredData();
  
  // Responsive configuration based on device
  const getResponsiveConfig = () => {
    const isMobile = deviceType === 'mobile';
    const isSmallMobile = isMobile && window.innerWidth < 380;
    
    return {
      height: isMobile ? (isSmallMobile ? 180 : 220) : 280,
      margin: isMobile 
        ? { top: 5, right: 8, left: 0, bottom: isSmallMobile ? 40 : 30 }
        : { top: 10, right: 15, left: 5, bottom: 25 },
      barSize: isMobile ? (isSmallMobile ? 12 : 18) : 24,
      fontSize: isMobile ? (isSmallMobile ? 9 : 11) : 12,
      tickAngle: isMobile ? -45 : 0,
      showReferenceLine: !isSmallMobile
    };
  };

  const config = getResponsiveConfig();
  
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row justify-between items-start space-y-2 sm:space-y-0">
            <div className="space-y-1">
              <div className="h-5 bg-gray-200 rounded w-32 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
            </div>
            <div className="flex gap-1">
              <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-3 sm:p-6">
          <ChartSkeleton />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="w-full overflow-hidden">
      <CardHeader className="flex flex-col space-y-3 pb-2 px-3 sm:px-6 pt-4 sm:pt-6">
        <div className="flex flex-col sm:flex-row justify-between items-start space-y-2 sm:space-y-0">
          <div className="min-w-0 flex-1">
            <CardTitle className="text-base sm:text-lg lg:text-xl truncate">
              Meditation Activity
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-muted-foreground">
              Your meditation minutes over time
            </CardDescription>
          </div>
          
          {/* Mobile-optimized button controls */}
          <div className="flex gap-1 shrink-0">
            <TouchFriendlyButton
              variant={view === 'daily' ? "default" : "outline"}
              size="sm"
              onClick={() => setView('daily')}
              className="h-7 px-2 text-xs sm:h-8 sm:px-3 sm:text-sm min-w-0"
              hapticFeedback={true}
            >
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              <span className="hidden xs:inline">Daily</span>
              <span className="xs:hidden">D</span>
            </TouchFriendlyButton>
            <TouchFriendlyButton
              variant={view === 'weekly' ? "default" : "outline"}
              size="sm"
              onClick={() => setView('weekly')}
              className="h-7 px-2 text-xs sm:h-8 sm:px-3 sm:text-sm min-w-0"
              hapticFeedback={true}
            >
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              <span className="hidden xs:inline">Weekly</span>
              <span className="xs:hidden">W</span>
            </TouchFriendlyButton>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-2 sm:p-4 lg:p-6">
        {/* Chart container with no horizontal scroll */}
        <div className="w-full -mx-1 sm:mx-0">
          <div className="h-[180px] sm:h-[220px] lg:h-[280px] w-full min-w-0">
            <ChartContainer 
              className="w-full h-full" 
              config={{
                minutes: { 
                  label: "Minutes", 
                  theme: { light: "#10b981", dark: "#34d399" } 
                },
                sessions: { 
                  label: "Sessions",
                  theme: { light: "#6366f1", dark: "#818cf8" } 
                }
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={filteredData}
                  margin={config.margin}
                  maxBarSize={config.barSize}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="day" 
                    fontSize={config.fontSize}
                    interval={0}
                    angle={config.tickAngle}
                    textAnchor={config.tickAngle < 0 ? "end" : "middle"}
                    height={deviceType === 'mobile' ? 50 : 40}
                    tick={{ fill: '#64748b' }}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tickLine={{ stroke: '#e2e8f0' }}
                  />
                  <YAxis 
                    fontSize={config.fontSize}
                    width={deviceType === 'mobile' ? 25 : 35}
                    tick={{ fill: '#64748b' }}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tickLine={{ stroke: '#e2e8f0' }}
                  />
                  <Tooltip 
                    formatter={(value, name) => [
                      `${value} ${name === 'minutes' ? 'min' : ''}`, 
                      name === 'minutes' ? 'Minutes' : 'Sessions'
                    ]}
                    labelStyle={{ color: '#1e293b', fontSize: config.fontSize }}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: config.fontSize,
                      padding: deviceType === 'mobile' ? '8px' : '12px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      maxWidth: deviceType === 'mobile' ? '200px' : 'none'
                    }}
                  />
                  <Bar 
                    dataKey="minutes" 
                    fill="var(--color-minutes)" 
                    radius={[3, 3, 0, 0]} 
                    maxBarSize={config.barSize}
                  />
                  {config.showReferenceLine && (
                    <ReferenceLine 
                      y={average} 
                      stroke="#10b981" 
                      strokeDasharray="2 2" 
                      strokeWidth={1}
                    />
                  )}
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </div>
        
        {/* Mobile-optimized summary */}
        <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center text-xs text-muted-foreground mt-3 space-y-1 xs:space-y-0 gap-2">
          <span className="flex-shrink-0">
            Avg: {average.toFixed(1)} min/day
          </span>
          <span className="flex-shrink-0">
            Total: {filteredData.reduce((sum, item) => sum + item.minutes, 0)} minutes
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default MeditationProgressChart;
