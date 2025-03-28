import React, { useState } from "react";
import { Brain, Calendar, Clock, Users, Book, Coffee, Home } from "lucide-react";
import { useUserPreferences } from "@/context";
import { TimeBlockProps, TimeBlockCategory } from "./TimeBlock";
import TimeBlocksSection from "./TimeBlocksSection";
import ProgressAndCategoriesSection from "./ProgressAndCategoriesSection";
import TimeManagementInsights from "./TimeManagementInsights";

const categories = [
  { id: "deep_work" as TimeBlockCategory, label: "Deep Work", color: "#3b82f6", icon: <Brain className="h-4 w-4" /> },
  { id: "shallow_work" as TimeBlockCategory, label: "Shallow Work", color: "#6b7280", icon: <Clock className="h-4 w-4" /> },
  { id: "meetings" as TimeBlockCategory, label: "Meetings", color: "#8b5cf6", icon: <Users className="h-4 w-4" /> },
  { id: "learning" as TimeBlockCategory, label: "Learning", color: "#10b981", icon: <Book className="h-4 w-4" /> },
  { id: "rest" as TimeBlockCategory, label: "Rest", color: "#f59e0b", icon: <Coffee className="h-4 w-4" /> },
  { id: "personal" as TimeBlockCategory, label: "Personal", color: "#f97316", icon: <Home className="h-4 w-4" /> }
];

// Sample time blocks
const sampleBlocks: TimeBlockProps[] = [
  {
    id: "1",
    title: "Morning Deep Work",
    startTime: "08:00",
    endTime: "10:00",
    category: "deep_work",
    description: "Focus session on main project",
    completed: true
  },
  {
    id: "2",
    title: "Team Standup",
    startTime: "10:00",
    endTime: "10:30",
    category: "meetings",
    completed: true
  },
  {
    id: "3",
    title: "Email & Admin",
    startTime: "10:30",
    endTime: "11:30",
    category: "shallow_work",
    completed: true
  },
  {
    id: "4",
    title: "Lunch Break",
    startTime: "12:00",
    endTime: "13:00",
    category: "rest",
    completed: true
  },
  {
    id: "5",
    title: "Project Planning",
    startTime: "13:00",
    endTime: "14:30",
    category: "deep_work",
    description: "Strategic planning session"
  },
  {
    id: "6",
    title: "Client Meeting",
    startTime: "15:00",
    endTime: "16:00",
    category: "meetings"
  },
  {
    id: "7",
    title: "Learning: New Tool",
    startTime: "16:30",
    endTime: "17:30",
    category: "learning",
    description: "Online tutorial"
  },
  {
    id: "8",
    title: "Evening Exercise",
    startTime: "18:00",
    endTime: "19:00",
    category: "personal"
  }
];

// Progress data for each category
const progressData = {
  deep_work: { totalHours: 315, goalHours: 1000, weeklyAverage: 12.5, streak: 8 },
  learning: { totalHours: 210, goalHours: 1000, weeklyAverage: 8, streak: 5 },
  meetings: { totalHours: 120, goalHours: 400, weeklyAverage: 5, streak: 12 }
};

const TimeManagementCenter = () => {
  const { preferences } = useUserPreferences();
  const [selectedCategory, setSelectedCategory] = useState<TimeBlockCategory | null>("deep_work");
  const [activeTab, setActiveTab] = useState("today");
  
  const handleBlockClick = (blockId: string) => {
    console.log(`Block clicked: ${blockId}`);
    // In a real app, you would show details or edit modal
  };

  return (
    <section className="py-8 md:py-16 px-4 md:px-6 bg-gradient-to-b from-white to-secondary/10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-6 md:mb-10">
          <h2 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4">Time Management Center</h2>
          <p className="text-foreground/70 text-sm md:text-base max-w-2xl mx-auto">
            Visualize how you spend your time and track your progress towards mastery with the 1000-Hour Method.
          </p>
          {preferences.hasCompletedOnboarding && (
            <p className="mt-2 text-primary text-sm md:text-base font-medium">
              Personalized based on your {preferences.timeManagementStyle || "flexible"} management style
            </p>
          )}
        </div>
        
        <div className="grid gap-4 md:gap-6 mb-6 md:mb-8">
          {/* Main time blocks section */}
          <TimeBlocksSection 
            blocks={sampleBlocks}
            onBlockClick={handleBlockClick}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          
          {/* Progress and Categories section */}
          <ProgressAndCategoriesSection 
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            progressData={progressData}
          />
        </div>
        
        {/* Insights section */}
        <TimeManagementInsights 
          deepWorkWeeklyAverage={progressData.deep_work.weeklyAverage}
          learningTotalHours={progressData.learning.totalHours}
          learningWeeklyAverage={progressData.learning.weeklyAverage}
        />
      </div>
    </section>
  );
};

export default TimeManagementCenter;
