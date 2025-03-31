
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
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
  RadialBar,
  RadialBarChart
} from "recharts";
import { Brain, Activity, Heart, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { MeditationStats } from '../useMeditationStats';

interface CorrelationsSectionProps {
  biometricData: any[];
  meditationStats: MeditationStats;
}

const CorrelationsSection: React.FC<CorrelationsSectionProps> = ({ 
  biometricData = [],
  meditationStats 
}) => {
  // Sample correlation data (in a real app, this would come from analyzing actual user data)
  const correlationData = [
    { name: 'Focus', meditation: 65, nonMeditation: 40 },
    { name: 'Stress', meditation: 35, nonMeditation: 70 },
    { name: 'Sleep', meditation: 75, nonMeditation: 50 },
    { name: 'Mood', meditation: 80, nonMeditation: 55 },
    { name: 'Productivity', meditation: 70, nonMeditation: 45 },
  ];
  
  // Sample well-being score based on meditation consistency
  const wellbeingScore = meditationStats.streak > 5 ? 75 : meditationStats.streak > 2 ? 60 : 45;
  
  const wellbeingData = [
    { name: 'Well-being', value: wellbeingScore, fill: `hsl(${wellbeingScore * 1.2}, 70%, 50%)` },
  ];
  
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Meditation Impact</CardTitle>
          <CardDescription>
            Compare days with and without meditation
          </CardDescription>
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
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="h-5 w-5 mr-2 text-primary" />
            Well-being Score
          </CardTitle>
          <CardDescription>
            Based on your meditation habits
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex flex-col items-center justify-center">
            <RadialBarChart
              width={250}
              height={250}
              innerRadius="60%"
              outerRadius="80%"
              data={wellbeingData}
              startAngle={180}
              endAngle={0}
            >
              <RadialBar
                background
                dataKey="value"
                cornerRadius={10}
              />
              <Tooltip content={<ChartTooltipContent />} />
            </RadialBarChart>
            
            <div className="text-center -mt-32">
              <h2 className="text-4xl font-bold">{wellbeingScore}</h2>
              <p className="text-muted-foreground">Well-being Score</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 w-full mt-8">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-green-100 dark:bg-green-900 mr-2">
                  <Heart className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Stress</p>
                  <p className="text-xs text-green-600 dark:text-green-400 flex items-center">
                    <ArrowDownRight className="h-3 w-3 mr-1" />
                    -15% this week
                  </p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900 mr-2">
                  <Activity className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Focus</p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 flex items-center">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    +22% this week
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CorrelationsSection;
