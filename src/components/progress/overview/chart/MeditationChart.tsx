
import React from 'react';
import { ChartContainer } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { useChartConfiguration } from './ChartConfiguration';

interface MeditationChartProps {
  data: Array<{
    day: string;
    minutes: number;
    sessions: number;
  }>;
  average: number;
}

export const MeditationChart: React.FC<MeditationChartProps> = ({ data, average }) => {
  const { getResponsiveConfig, getFilteredData } = useChartConfiguration();
  const config = getResponsiveConfig();
  const filteredData = getFilteredData(data);

  return (
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
                height={50}
                tick={{ fill: '#64748b' }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={{ stroke: '#e2e8f0' }}
              />
              <YAxis 
                fontSize={config.fontSize}
                width={25}
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
                  padding: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  maxWidth: '200px'
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
  );
};
