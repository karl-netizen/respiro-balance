
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { DateRange } from "react-day-picker";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { generateMockChartData } from "@/components/coach/utils/chartUtils";

interface StressLevelChartProps {
  timeRange: string;
  dateRange?: DateRange;
}

const StressLevelChart: React.FC<StressLevelChartProps> = ({ timeRange, dateRange }) => {
  // Generate mock data based on the selected time range
  const data = generateMockChartData(timeRange, "stress");

  const chartConfig = {
    high: { color: "hsl(var(--destructive))" },
    moderate: { color: "hsl(var(--warning))" },
    low: { color: "hsl(var(--success))" }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-6">
          <div className="h-[400px]">
            <ChartContainer config={chartConfig}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Line type="monotone" dataKey="high" stroke="hsl(var(--destructive))" name="High Stress" />
                <Line type="monotone" dataKey="moderate" stroke="hsl(var(--warning))" name="Moderate Stress" />
                <Line type="monotone" dataKey="low" stroke="hsl(var(--success))" name="Low Stress" />
              </LineChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4">Stress Distribution</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <div className="flex items-center">
                    <span className="w-3 h-3 rounded-full bg-destructive mr-2"></span>
                    <span>High Stress</span>
                  </div>
                  <span className="font-medium">18%</span>
                </div>
                <div className="w-full bg-secondary h-2 rounded-full">
                  <div className="bg-destructive h-2 rounded-full" style={{ width: "18%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <div className="flex items-center">
                    <span className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></span>
                    <span>Moderate Stress</span>
                  </div>
                  <span className="font-medium">35%</span>
                </div>
                <div className="w-full bg-secondary h-2 rounded-full">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "35%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <div className="flex items-center">
                    <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                    <span>Low Stress</span>
                  </div>
                  <span className="font-medium">47%</span>
                </div>
                <div className="w-full bg-secondary h-2 rounded-full">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: "47%" }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4">Stress Insights</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start">
                <span className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></span>
                <span>Overall stress levels decreased by 12% in the past {timeRange === "7days" ? "week" : timeRange === "30days" ? "month" : "quarter"}</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></span>
                <span>High stress clients have completed 25% fewer sessions</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></span>
                <span>Morning meditation sessions correlate with 15% lower stress levels throughout the day</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 rounded-full bg-destructive mt-1.5 mr-2"></span>
                <span>3 clients require immediate attention due to consistently high stress readings</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 rounded-full bg-green-500 mt-1.5 mr-2"></span>
                <span>7 clients have shown significant improvement in stress management</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StressLevelChart;
