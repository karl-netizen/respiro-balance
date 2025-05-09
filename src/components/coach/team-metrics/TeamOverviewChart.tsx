
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { DateRange } from "react-day-picker";
import { ChartConfig, ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { generateMockChartData } from "@/components/coach/utils/chartUtils";

interface TeamOverviewChartProps {
  timeRange: string;
  dateRange?: DateRange;
}

const TeamOverviewChart: React.FC<TeamOverviewChartProps> = ({ timeRange, dateRange }) => {
  // Generate mock data based on the selected time range
  const data = generateMockChartData(timeRange, "overview");

  const chartConfig: ChartConfig = {
    sessions: {
      label: "Sessions",
      theme: {
        light: "hsl(var(--primary))",
        dark: "hsl(var(--primary-dark))"
      }
    },
    minutes: {
      label: "Minutes",
      theme: {
        light: "hsl(var(--secondary))",
        dark: "hsl(var(--secondary-dark))"
      }
    },
    stress: {
      label: "Stress Level",
      theme: {
        light: "hsl(var(--destructive))",
        dark: "hsl(var(--destructive-dark))"
      }
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-6">
          <div className="h-[400px]">
            <ChartContainer config={chartConfig}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip content={(props) => <ChartTooltipContent {...props} />} />
                <Legend />
                <Bar dataKey="sessions" fill="hsl(var(--primary))" name="Sessions" />
                <Bar dataKey="minutes" fill="hsl(var(--secondary))" name="Minutes" />
                <Bar dataKey="stress" fill="hsl(var(--destructive))" name="Stress Level" />
              </BarChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-2">Key Insights</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <span className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></span>
                <span>Average of 2.3 sessions per client this {timeRange === "7days" ? "week" : timeRange === "30days" ? "month" : "quarter"}</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></span>
                <span>Total meditation time increased by 15% compared to previous period</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></span>
                <span>Average stress levels decreased by 8%</span>
              </li>
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-2">Client Engagement</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <span>Active Clients</span>
                  <span className="font-medium">85%</span>
                </div>
                <div className="w-full bg-secondary h-2 rounded-full">
                  <div className="bg-primary h-2 rounded-full" style={{ width: "85%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <span>Goal Achievement</span>
                  <span className="font-medium">62%</span>
                </div>
                <div className="w-full bg-secondary h-2 rounded-full">
                  <div className="bg-primary h-2 rounded-full" style={{ width: "62%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <span>Weekly Streaks</span>
                  <span className="font-medium">41%</span>
                </div>
                <div className="w-full bg-secondary h-2 rounded-full">
                  <div className="bg-primary h-2 rounded-full" style={{ width: "41%" }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-2">Top Sessions</h3>
            <ol className="space-y-2">
              <li className="flex justify-between items-center text-sm pb-2 border-b">
                <span>1. Morning Calm</span>
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">32%</span>
              </li>
              <li className="flex justify-between items-center text-sm pb-2 border-b">
                <span>2. Stress Relief</span>
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">28%</span>
              </li>
              <li className="flex justify-between items-center text-sm pb-2 border-b">
                <span>3. Deep Focus</span>
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">15%</span>
              </li>
              <li className="flex justify-between items-center text-sm">
                <span>4. Sleep Well</span>
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">10%</span>
              </li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TeamOverviewChart;
