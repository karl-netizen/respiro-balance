
import React from 'react';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent,
  ChartLegend,
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
  ResponsiveContainer
} from "recharts";
import { MeditationStats } from '../../useMeditationStats';

interface ChartSectionProps {
  sessionData: Array<{
    month: string;
    sessions: number;
    minutes: number;
  }>;
}

const ChartSection: React.FC<ChartSectionProps> = ({ sessionData }) => {
  return (
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
        <BarChart data={sessionData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="month" />
          <YAxis yAxisId="left" orientation="left" stroke="#6366f1" />
          <YAxis yAxisId="right" orientation="right" stroke="#10b981" />
          <Tooltip content={<ChartTooltipContent />} />
          <Legend content={<ChartLegendContent />} />
          <Bar yAxisId="left" dataKey="sessions" fill="var(--color-sessions)" radius={[4, 4, 0, 0]} barSize={20} />
          <Line yAxisId="right" type="monotone" dataKey="minutes" stroke="var(--color-minutes)" strokeWidth={2} dot={{ r: 4 }} />
        </BarChart>
      </ChartContainer>
    </div>
  );
};

export default ChartSection;
