
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from "@/components/ui/chart";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { BarChart3, PieChart as PieChartIcon, LineChart as LineChartIcon } from "lucide-react";

interface ComparisonTabProps {
  correlationData: Array<{
    name: string;
    meditation: number;
    nonMeditation: number;
  }>;
}

const ComparisonTab: React.FC<ComparisonTabProps> = ({ correlationData }) => {
  const [chartType, setChartType] = useState<'bar' | 'line' | 'pie'>('bar');
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const renderComparisonChart = () => {
    switch (chartType) {
      case 'line':
        return (
          <LineChart
            data={correlationData}
            margin={{ top: 20, right: 30, left: 70, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={[0, 100]} />
            <Tooltip content={<ChartTooltipContent />} />
            <Legend content={<ChartLegendContent />} />
            <Line type="monotone" dataKey="meditation" stroke="var(--color-meditation)" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="nonMeditation" stroke="var(--color-nonMeditation)" />
          </LineChart>
        );
      
      case 'pie':
        return (
          <div className="flex flex-col items-center">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <h3 className="text-sm font-medium mb-2">With Meditation</h3>
                <PieChart width={150} height={150}>
                  <Pie
                    data={correlationData}
                    cx={75}
                    cy={75}
                    innerRadius={30}
                    outerRadius={60}
                    paddingAngle={5}
                    dataKey="meditation"
                  >
                    {correlationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltipContent />} />
                </PieChart>
              </div>
              <div className="text-center">
                <h3 className="text-sm font-medium mb-2">Without Meditation</h3>
                <PieChart width={150} height={150}>
                  <Pie
                    data={correlationData}
                    cx={75}
                    cy={75}
                    innerRadius={30}
                    outerRadius={60}
                    paddingAngle={5}
                    dataKey="nonMeditation"
                  >
                    {correlationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltipContent />} />
                </PieChart>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-5 gap-2">
              {correlationData.map((entry, index) => (
                <div key={`legend-${index}`} className="flex items-center text-xs">
                  <div className="w-3 h-3 mr-1" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                  {entry.name}
                </div>
              ))}
            </div>
          </div>
        );
      
      default: // bar chart
        return (
          <BarChart
            data={correlationData}
            layout="vertical"
            margin={{ top: 20, right: 30, left: 70, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
            <XAxis type="number" domain={[0, 100]} />
            <YAxis dataKey="name" type="category" width={80} />
            <Tooltip content={<ChartTooltipContent />} />
            <Legend content={<ChartLegendContent />} />
            <Bar dataKey="meditation" stackId="a" fill="var(--color-meditation)" />
            <Bar dataKey="nonMeditation" stackId="a" fill="var(--color-nonMeditation)" />
          </BarChart>
        );
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Meditation Impact</CardTitle>
            <CardDescription>
              Compare days with and without meditation
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant={chartType === 'bar' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setChartType('bar')}
            >
              <BarChart3 className="h-4 w-4 mr-1" />
              Bar
            </Button>
            <Button 
              variant={chartType === 'line' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setChartType('line')}
            >
              <LineChartIcon className="h-4 w-4 mr-1" />
              Line
            </Button>
            <Button 
              variant={chartType === 'pie' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setChartType('pie')}
            >
              <PieChartIcon className="h-4 w-4 mr-1" />
              Pie
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ChartContainer 
            className="w-full h-full" 
            config={{
              meditation: { 
                label: "With Meditation",
                theme: { light: "#6366f1", dark: "#818cf8" } 
              },
              nonMeditation: { 
                label: "Without Meditation", 
                theme: { light: "#94a3b8", dark: "#64748b" } 
              }
            }}
          >
            {renderComparisonChart()}
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ComparisonTab;
