
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar, Download } from "lucide-react";
import TeamOverviewChart from "./TeamOverviewChart";
import StressLevelChart from "./StressLevelChart";
import SessionCompletionChart from "./SessionCompletionChart";
import { DateRange } from "react-day-picker";
import { addDays, format } from "date-fns";
import { DateRangePicker } from "./DateRangePicker";

const TeamMetricsTab = () => {
  const [timeRange, setTimeRange] = useState("7days");
  const [chartType, setChartType] = useState("overview");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: addDays(new Date(), -7),
    to: new Date(),
  });

  const handleExportData = () => {
    // Export logic would be implemented here
    console.log("Exporting data...");
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
            <Button variant="outline" onClick={handleExportData}>
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <Tabs value={chartType} onValueChange={setChartType} className="w-full md:w-auto">
            <TabsList>
              <TabsTrigger value="overview">Team Overview</TabsTrigger>
              <TabsTrigger value="stress">Stress Levels</TabsTrigger>
              <TabsTrigger value="sessions">Session Completion</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
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
        
        <div className="mt-6">
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
      </CardContent>
    </Card>
  );
};

export default TeamMetricsTab;
