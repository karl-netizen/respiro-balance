
import { addDays, format, subDays } from "date-fns";

// Helper function to generate mock chart data based on time range and chart type
export const generateMockChartData = (timeRange: string, chartType: string) => {
  const today = new Date();
  let daysToGenerate: number;
  
  switch (timeRange) {
    case "7days":
      daysToGenerate = 7;
      break;
    case "30days":
      daysToGenerate = 30;
      break;
    case "90days":
      daysToGenerate = 90;
      break;
    default:
      daysToGenerate = 7;
  }
  
  // Generate the mock data based on chart type
  const data = [];
  
  for (let i = daysToGenerate - 1; i >= 0; i--) {
    const date = subDays(today, i);
    const formattedDate = format(date, "MMM dd");
    
    if (chartType === "overview") {
      data.push({
        date: formattedDate,
        sessions: Math.floor(Math.random() * 20) + 5,
        minutes: Math.floor(Math.random() * 150) + 30,
        stress: Math.floor(Math.random() * 60) + 20
      });
    } else if (chartType === "stress") {
      data.push({
        date: formattedDate,
        high: Math.floor(Math.random() * 20) + 5,
        moderate: Math.floor(Math.random() * 30) + 15,
        low: Math.floor(Math.random() * 40) + 20
      });
    } else if (chartType === "completion") {
      const completedSessions = Math.floor(Math.random() * 15) + 10;
      const scheduledSessions = Math.floor(Math.random() * 5) + 3;
      const missedSessions = Math.floor(Math.random() * 7) + 1;
      
      data.push({
        date: formattedDate,
        completed: completedSessions,
        scheduled: scheduledSessions,
        missed: missedSessions
      });
    }
  }
  
  return data;
};

// Generate data for client progress
export const generateClientProgressData = (clientId: string) => {
  const today = new Date();
  const data = [];
  
  for (let i = 29; i >= 0; i--) {
    const date = subDays(today, i);
    const formattedDate = format(date, "MMM dd");
    
    data.push({
      date: formattedDate,
      meditation: Math.floor(Math.random() * 30) + 5,
      stress: Math.floor(Math.random() * 80) + 20,
      focus: Math.floor(Math.random() * 90) + 10
    });
  }
  
  return data;
};

// Calculate average completion rate
export const calculateCompletionRate = (data: any[]) => {
  if (!data.length) return 0;
  
  const totalCompleted = data.reduce((sum, item) => sum + item.completed, 0);
  const totalSessions = data.reduce((sum, item) => sum + item.completed + item.scheduled + item.missed, 0);
  
  return totalSessions > 0 ? Math.round((totalCompleted / totalSessions) * 100) : 0;
};
