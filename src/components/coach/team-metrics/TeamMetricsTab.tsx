
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TouchFriendlyButton } from "@/components/responsive/TouchFriendlyButton";
import { Calendar, Download } from "lucide-react";
import TeamOverviewChart from "./TeamOverviewChart";
import StressLevelChart from "./StressLevelChart";
import SessionCompletionChart from "./SessionCompletionChart";
import { DateRange } from "react-day-picker";
import { addDays, format } from "date-fns";
import { DateRangePicker } from "./DateRangePicker";
import { useDeviceDetection } from '@/hooks/core/useDeviceDetection';

const TeamMetricsTab = () => {
  const [timeRange, setTimeRange] = useState("7days");
  const [chartType, setChartType] = useState("overview");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: addDays(new Date(), -7),
    to: new Date(),
  });
  const { deviceType } = useDeviceDetection();

  const handleExportData = () => {
    // Export logic would be implemented here
    console.log("Exporting data...");
  };

  // Mobile-optimized spacing and layout
  const getMobileSpacing = () => {
    switch (deviceType) {
      case 'mobile':
        return 'space-y-3';
      case 'tablet':
        return 'space-y-4';
      default:
        return 'space-y-6';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <CardTitle>Team Metrics</CardTitle>
            <CardDescription>
              View aggregated metrics across all your clients
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <TouchFriendlyButton 
              variant="outline" 
              onClick={handleExportData}
              className="h-10 sm:h-auto"
              hapticFeedback={true}
            >
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </TouchFriendlyButton>
          </div>
        </div>
      </CardHeader>
      <CardContent className={getMobileSpacing()}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          {/* Mobile-optimized tabs with horizontal scroll */}
          <div className="w-full overflow-x-auto -mx-2 px-2 sm:mx-0 sm:px-0">
            <Tabs value={chartType} onValueChange={setChartType} className="w-full min-w-[320px] sm:min-w-0">
              <TabsList className="grid w-full grid-cols-3 gap-1">
                <TabsTrigger 
                  value="overview"
                  className="text-xs sm:text-sm py-2 sm:py-3 min-h-[44px] sm:min-h-auto"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger 
                  value="stress"
                  className="text-xs sm:text-sm py-2 sm:py-3 min-h-[44px] sm:min-h-auto"
                >
                  Stress
                </TabsTrigger>
                <TabsTrigger 
                  value="sessions"
                  className="text-xs sm:text-sm py-2 sm:py-3 min-h-[44px] sm:min-h-auto"
                >
                  Sessions
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-full sm:w-[180px] h-12 sm:h-auto">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 days</SelectItem>
                <SelectItem value="30days">Last 30 days</SelectItem>
                <SelectItem value="90days">Last 90 days</SelectItem>
                <SelectItem value="custom">Custom range</SelectItem>
              </SelectContent>
            </Select>
            
            {timeRange === "custom" && (
              <DateRangePicker 
                date={dateRange} 
                onDateChange={setDateRange} 
              />
            )}
          </div>
        </div>
        
        <div className="mt-6 w-full overflow-x-auto">
          <div className="min-w-[320px] sm:min-w-0">
            {chartType === "overview" && (
              <TeamOverviewChart timeRange={timeRange} dateRange={dateRange} />
            )}
            
            {chartType === "stress" && (
              <StressLevelChart timeRange={timeRange} dateRange={dateRange} />
            )}
            
            {chartType === "sessions" && (
              <SessionCompletionChart timeRange={timeRange} dateRange={dateRange} />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamMetricsTab;
