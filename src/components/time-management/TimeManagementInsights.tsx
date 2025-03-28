
import React from "react";
import { Brain, Book, Coffee } from "lucide-react";

interface InsightCardProps {
  icon: React.ReactNode;
  iconColor: string;
  title: string;
  children: React.ReactNode;
  bgColor: string;
}

const InsightCard = ({ icon, iconColor, title, children, bgColor }: InsightCardProps) => (
  <div className={`p-3 md:p-4 ${bgColor} rounded-md`}>
    <h4 className="font-medium text-sm md:text-base mb-1 md:mb-2 flex items-center">
      <span className={`h-3 w-3 md:h-4 md:w-4 ${iconColor} mr-1 md:mr-2`}>{icon}</span>
      {title}
    </h4>
    <p className="text-xs md:text-sm">{children}</p>
  </div>
);

interface TimeManagementInsightsProps {
  deepWorkWeeklyAverage: number;
  learningTotalHours: number;
  learningWeeklyAverage: number;
}

const TimeManagementInsights = ({ 
  deepWorkWeeklyAverage, 
  learningTotalHours,
  learningWeeklyAverage
}: TimeManagementInsightsProps) => {
  const estimatedMonthsToGoal = Math.ceil((1000 - learningTotalHours) / learningWeeklyAverage / 4);
  
  return (
    <div className="bg-white rounded-lg p-3 md:p-6 border shadow-sm">
      <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-4">Time Management Insights</h3>
      <div className="grid gap-3 md:gap-6 md:grid-cols-3">
        <InsightCard 
          icon={<Brain />} 
          iconColor="text-blue-500" 
          title="Deep Work Focus"
          bgColor="bg-blue-50"
        >
          You're averaging {deepWorkWeeklyAverage} hours of deep work per week.
          Aim for 2-4 hour blocks for maximum effectiveness.
        </InsightCard>
        
        <InsightCard 
          icon={<Book />} 
          iconColor="text-green-500" 
          title="Learning Progress"
          bgColor="bg-green-50"
        >
          At your current pace, you'll reach 1000 hours of learning in 
          approximately {estimatedMonthsToGoal} months.
        </InsightCard>
        
        <InsightCard 
          icon={<Coffee />} 
          iconColor="text-yellow-500" 
          title="Rest & Recovery"
          bgColor="bg-yellow-50"
        >
          Your schedule includes regular breaks, which is excellent for maintaining
          sustained performance throughout the day.
        </InsightCard>
      </div>
    </div>
  );
};

export default TimeManagementInsights;
