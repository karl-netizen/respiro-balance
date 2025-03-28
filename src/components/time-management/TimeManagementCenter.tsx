
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, Clock, Brain, Users, Book, Coffee, Home } from "lucide-react";
import { useUserPreferences } from "@/context";
import { formatTime } from "@/components/work-life-balance/utils";
import TimeBlocksContainer from "./TimeBlocksContainer";
import ProgressTracker from "./ProgressTracker";
import CategorySelector from "./CategorySelector";
import { TimeBlockProps, TimeBlockCategory } from "./TimeBlock";

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
    <section className="py-16 px-6 bg-gradient-to-b from-white to-secondary/10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Time Management Center</h2>
          <p className="text-foreground/70 max-w-2xl mx-auto">
            Visualize how you spend your time and track your progress towards mastery with the 1000-Hour Method.
          </p>
          {preferences.hasCompletedOnboarding && (
            <p className="mt-2 text-primary font-medium">
              Personalized based on your {preferences.timeManagementStyle || "flexible"} management style
            </p>
          )}
        </div>
        
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Time Blocks</CardTitle>
                  <CardDescription>
                    Your scheduled activities for {activeTab === "today" ? "today" : "this week"}
                  </CardDescription>
                </div>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-1" /> Add Block
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="px-6 pt-2 pb-0">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="today" className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" /> Daily View
                    </TabsTrigger>
                    <TabsTrigger value="week" className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" /> Weekly Overview
                    </TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="today" className="pt-4">
                  <TimeBlocksContainer 
                    blocks={sampleBlocks} 
                    onBlockClick={handleBlockClick}
                    startHour={7}
                    endHour={20}
                  />
                </TabsContent>
                
                <TabsContent value="week" className="pt-4">
                  <div className="px-6 pb-4">
                    <p className="text-sm text-muted-foreground">
                      Weekly view shows your time allocation across different categories.
                    </p>
                  </div>
                  <div className="px-6 pb-6">
                    <div className="h-[300px] border rounded bg-white p-4 flex items-center justify-center">
                      <p className="text-muted-foreground">Weekly view visualization will appear here.</p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>1000-Hour Method</CardTitle>
                <CardDescription>
                  Track your progress toward mastery in key areas
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedCategory && progressData[selectedCategory] ? (
                  <ProgressTracker 
                    {...progressData[selectedCategory]}
                    category={categories.find(c => c.id === selectedCategory)?.label || ""}
                  />
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    Select a category to view progress
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Categories</CardTitle>
                <CardDescription>
                  Select to view progress toward 1000 hours
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CategorySelector
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                />
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 border shadow-sm">
          <h3 className="text-xl font-semibold mb-4">Time Management Insights</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-4 bg-blue-50 rounded-md">
              <h4 className="font-medium mb-2 flex items-center">
                <Brain className="h-4 w-4 text-blue-500 mr-2" />
                Deep Work Focus
              </h4>
              <p className="text-sm">
                You're averaging {progressData.deep_work.weeklyAverage} hours of deep work per week.
                Aim for 2-4 hour blocks for maximum effectiveness.
              </p>
            </div>
            
            <div className="p-4 bg-green-50 rounded-md">
              <h4 className="font-medium mb-2 flex items-center">
                <Book className="h-4 w-4 text-green-500 mr-2" />
                Learning Progress
              </h4>
              <p className="text-sm">
                At your current pace, you'll reach 1000 hours of learning in 
                approximately {Math.ceil((1000 - progressData.learning.totalHours) / progressData.learning.weeklyAverage / 4)} months.
              </p>
            </div>
            
            <div className="p-4 bg-yellow-50 rounded-md">
              <h4 className="font-medium mb-2 flex items-center">
                <Coffee className="h-4 w-4 text-yellow-500 mr-2" />
                Rest & Recovery
              </h4>
              <p className="text-sm">
                Your schedule includes regular breaks, which is excellent for maintaining
                sustained performance throughout the day.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TimeManagementCenter;
