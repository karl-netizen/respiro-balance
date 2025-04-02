
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { DateRange } from "react-day-picker";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { generateMockChartData } from "@/components/coach/utils/chartUtils";

interface SessionCompletionChartProps {
  timeRange: string;
  dateRange?: DateRange;
}

const SessionCompletionChart: React.FC<SessionCompletionChartProps> = ({ timeRange, dateRange }) => {
  // Generate mock data based on the selected time range
  const data = generateMockChartData(timeRange, "completion");

  const chartConfig = {
    completed: { color: "hsl(var(--primary))" },
    scheduled: { color: "hsl(var(--muted-foreground))" },
    missed: { color: "hsl(var(--destructive))" }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-6">
          <div className="h-[400px]">
            <ChartContainer config={chartConfig}>
              <AreaChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Area type="monotone" dataKey="completed" stackId="1" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.6} name="Completed" />
                <Area type="monotone" dataKey="scheduled" stackId="1" stroke="hsl(var(--muted-foreground))" fill="hsl(var(--muted-foreground))" fillOpacity={0.4} name="Scheduled" />
                <Area type="monotone" dataKey="missed" stackId="1" stroke="hsl(var(--destructive))" fill="hsl(var(--destructive))" fillOpacity={0.4} name="Missed" />
              </AreaChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4">Completion Rate by Session Type</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <span>Guided Meditation</span>
                  <span className="font-medium">87%</span>
                </div>
                <div className="w-full bg-secondary h-2 rounded-full">
                  <div className="bg-primary h-2 rounded-full" style={{ width: "87%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <span>Breathing Exercises</span>
                  <span className="font-medium">76%</span>
                </div>
                <div className="w-full bg-secondary h-2 rounded-full">
                  <div className="bg-primary h-2 rounded-full" style={{ width: "76%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <span>Sleep Sessions</span>
                  <span className="font-medium">92%</span>
                </div>
                <div className="w-full bg-secondary h-2 rounded-full">
                  <div className="bg-primary h-2 rounded-full" style={{ width: "92%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <span>Focus Sessions</span>
                  <span className="font-medium">65%</span>
                </div>
                <div className="w-full bg-secondary h-2 rounded-full">
                  <div className="bg-primary h-2 rounded-full" style={{ width: "65%" }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4">Session Completion Insights</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start">
                <span className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></span>
                <span>Overall completion rate: 78% (up 5% from previous period)</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></span>
                <span>Weekend sessions have 15% lower completion rate than weekday sessions</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></span>
                <span>Morning sessions (6-9am) have the highest completion rate at 91%</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 rounded-full bg-destructive mt-1.5 mr-2"></span>
                <span>5 clients have missed more than 50% of their scheduled sessions</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 rounded-full bg-green-500 mt-1.5 mr-2"></span>
                <span>10 clients have maintained a 100% completion rate</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SessionCompletionChart;
