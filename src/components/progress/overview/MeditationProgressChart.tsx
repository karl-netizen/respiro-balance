
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

interface MeditationProgressChartProps {
  dailyData: {
    day: string;
    minutes: number;
    sessions: number;
  }[];
}

const MeditationProgressChart: React.FC<MeditationProgressChartProps> = ({ dailyData }) => {
  const [view, setView] = React.useState<'daily' | 'weekly'>('daily');
  
  // Calculate average minutes
  const average = dailyData.reduce((sum, item) => sum + item.minutes, 0) / dailyData.length;
  
  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row justify-between pb-2 space-y-2 sm:space-y-0">
        <div>
          <CardTitle className="text-lg sm:text-xl">Meditation Activity</CardTitle>
          <CardDescription className="text-sm sm:text-base">Your meditation minutes over time</CardDescription>
        </div>
        <div className="flex gap-1">
          <Button
            variant={view === 'daily' ? "default" : "outline"}
            size="sm"
            onClick={() => setView('daily')}
            className="h-8 text-xs sm:text-sm min-h-[44px] sm:min-h-[32px]"
          >
            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            Daily
          </Button>
          <Button
            variant={view === 'weekly' ? "default" : "outline"}
            size="sm"
            onClick={() => setView('weekly')}
            className="h-8 text-xs sm:text-sm min-h-[44px] sm:min-h-[32px]"
          >
            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            Weekly
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-3 sm:p-6">
        <div className="w-full overflow-x-auto">
          <div className="h-[200px] sm:h-[250px] min-w-[400px] sm:min-w-0">
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
                  data={dailyData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="day" 
                    fontSize={12}
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis fontSize={12} />
                  <Tooltip 
                    formatter={(value, name) => [
                      `${value} ${name === 'minutes' ? 'min' : ''}`, 
                      name === 'minutes' ? 'Minutes' : 'Sessions'
                    ]}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      fontSize: '12px'
                    }}
                  />
                  <Bar dataKey="minutes" fill="var(--color-minutes)" radius={[4, 4, 0, 0]} barSize={20} />
                  <ReferenceLine y={average} stroke="#10b981" strokeDasharray="3 3" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-between text-xs text-muted-foreground mt-2 space-y-1 sm:space-y-0">
          <span>Average: {average.toFixed(1)} min/day</span>
          <span>Total: {dailyData.reduce((sum, item) => sum + item.minutes, 0)} minutes</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default MeditationProgressChart;
