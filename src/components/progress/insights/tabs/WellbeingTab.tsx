
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";
import { 
  RadialBarChart,
  RadialBar,
  Tooltip 
} from "recharts";
import { Brain, Heart, Activity, ArrowUpRight, ArrowDownRight, LayoutDashboard } from "lucide-react";

interface WellbeingTabProps {
  wellbeingScore: number;
}

const WellbeingTab: React.FC<WellbeingTabProps> = ({ wellbeingScore }) => {
  const wellbeingData = [
    { name: 'Well-being', value: wellbeingScore, fill: `hsl(${wellbeingScore * 1.2}, 70%, 50%)` },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Brain className="h-5 w-5 mr-2 text-primary" />
          Well-being Score
        </CardTitle>
        <CardDescription>
          Based on your meditation habits and biometrics
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
        
        <div className="mt-4 border-t pt-4">
          <h3 className="font-medium mb-2">Recommendations</h3>
          <ul className="text-sm space-y-2">
            <li className="flex items-start">
              <div className="p-1 rounded-full bg-primary/10 mr-2 mt-0.5">
                <LayoutDashboard className="h-3 w-3 text-primary" />
              </div>
              <span>Try a 15-minute focused breathing session to further reduce stress levels</span>
            </li>
            <li className="flex items-start">
              <div className="p-1 rounded-full bg-primary/10 mr-2 mt-0.5">
                <LayoutDashboard className="h-3 w-3 text-primary" />
              </div>
              <span>Maintain your current meditation streak for optimal well-being scores</span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default WellbeingTab;
