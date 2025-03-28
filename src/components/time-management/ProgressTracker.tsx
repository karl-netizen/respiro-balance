
import React from "react";
import { Progress } from "@/components/ui/progress";
import { Hourglass, Award, TrendingUp } from "lucide-react";

interface ProgressTrackerProps {
  totalHours: number;
  goalHours: number;
  weeklyAverage: number;
  category: string;
  streak: number;
}

const ProgressTracker = ({
  totalHours,
  goalHours,
  weeklyAverage,
  category,
  streak
}: ProgressTrackerProps) => {
  const percentComplete = Math.min((totalHours / goalHours) * 100, 100);
  
  return (
    <div className="bg-white rounded-md border shadow-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg">{category} Progress</h3>
        <div className="text-sm font-medium text-muted-foreground">
          <Hourglass className="h-4 w-4 inline mr-1" /> 
          1000-Hour Method
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium">Progress toward mastery</span>
            <span className="text-sm font-medium">{Math.round(percentComplete)}%</span>
          </div>
          <Progress value={percentComplete} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>{totalHours} hours completed</span>
            <span>{goalHours} hours goal</span>
          </div>
        </div>
        
        <div className="flex space-x-6 pt-2">
          <div className="flex-1">
            <div className="flex items-center text-sm font-medium mb-1">
              <TrendingUp className="h-4 w-4 mr-1 text-blue-500" />
              Weekly Average
            </div>
            <div className="font-bold text-xl">{weeklyAverage}h</div>
            <div className="text-xs text-muted-foreground">
              hours per week
            </div>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center text-sm font-medium mb-1">
              <Award className="h-4 w-4 mr-1 text-amber-500" />
              Current Streak
            </div>
            <div className="font-bold text-xl">{streak}</div>
            <div className="text-xs text-muted-foreground">
              days consistent
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;
