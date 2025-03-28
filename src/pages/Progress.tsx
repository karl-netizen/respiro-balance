
import React, { useState } from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ArrowRight, Calendar, Clock, Flame, Info, BarChart, Activity, Sparkles } from "lucide-react";
import { useUserPreferences } from "@/context";
import MeditationPlayer from "@/components/MeditationPlayer";

const ProgressPage = () => {
  const { preferences } = useUserPreferences();
  const [activeTab, setActiveTab] = useState("overview");
  
  // Sample data - in a production app, this would come from an API or local storage
  const meditationStats = {
    totalSessions: 24,
    totalMinutes: 420,
    streak: 6,
    weeklyGoal: 5,
    weeklyCompleted: 3,
    monthlyTrend: [15, 25, 40, 45, 30, 50, 65, 60, 75, 90, 120],
    lastSession: "Morning Clarity",
    lastSessionDate: "Yesterday",
    achievements: [
      { name: "First Steps", description: "Complete your first meditation", unlocked: true },
      { name: "Steady Mind", description: "Meditate for 5 days in a row", unlocked: true },
      { name: "Focus Master", description: "Complete 10 focus meditations", unlocked: false },
      { name: "Breath Explorer", description: "Try all breathing techniques", unlocked: false },
    ]
  };
  
  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const sessions = [
    { day: "Mon", completed: true },
    { day: "Tue", completed: true },
    { day: "Wed", completed: true },
    { day: "Thu", completed: false, today: true },
    { day: "Fri", completed: false },
    { day: "Sat", completed: false },
    { day: "Sun", completed: false }
  ];
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <section className="bg-gradient-to-b from-background to-secondary/20 pt-24 pb-12 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Your Progress</h1>
              <p className="text-foreground/70 text-lg max-w-3xl mx-auto">
                Track your meditation journey, monitor your improvements, and celebrate your achievements.
              </p>
            </div>
          </div>
        </section>
        
        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="insights">Insights</TabsTrigger>
                <TabsTrigger value="achievements">Achievements</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="mt-0">
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-2xl flex items-center">
                        <Calendar className="mr-2 h-5 w-5 text-primary" />
                        {meditationStats.totalSessions}
                      </CardTitle>
                      <CardDescription>Total Sessions</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-foreground/70">
                        You've completed {meditationStats.totalSessions} meditation sessions since you started.
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-2xl flex items-center">
                        <Clock className="mr-2 h-5 w-5 text-primary" />
                        {meditationStats.totalMinutes}
                      </CardTitle>
                      <CardDescription>Total Minutes</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-foreground/70">
                        You've spent {Math.floor(meditationStats.totalMinutes / 60)} hours and {meditationStats.totalMinutes % 60} minutes in meditation.
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-2xl flex items-center">
                        <Flame className="mr-2 h-5 w-5 text-primary" />
                        {meditationStats.streak}
                      </CardTitle>
                      <CardDescription>Current Streak</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-foreground/70">
                        You've meditated {meditationStats.streak} days in a row. Keep it up!
                      </p>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <Card>
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <div>
                            <CardTitle>Weekly Progress</CardTitle>
                            <CardDescription>
                              Your meditation activity this week
                            </CardDescription>
                          </div>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Info className="h-4 w-4" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80">
                              <div className="space-y-2">
                                <h4 className="font-medium">About Weekly Progress</h4>
                                <p className="text-sm">
                                  This shows your weekly meditation sessions. You've set a goal of {meditationStats.weeklyGoal} sessions per week.
                                </p>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex space-x-2 justify-between mb-4">
                          {sessions.map((session, i) => (
                            <div 
                              key={i} 
                              className={`flex flex-col items-center ${session.today ? 'relative' : ''}`}
                            >
                              <div 
                                className={`w-10 h-10 rounded-full flex items-center justify-center mb-1
                                  ${session.completed 
                                    ? 'bg-primary text-white' 
                                    : session.today 
                                      ? 'border-2 border-primary text-primary' 
                                      : 'bg-secondary/50 text-foreground/50'
                                  }`}
                              >
                                {session.completed ? '✓' : ''}
                              </div>
                              <span className={`text-xs ${session.today ? 'font-bold' : ''}`}>{session.day}</span>
                              {session.today && (
                                <div className="absolute -top-2 -right-2 text-xs bg-primary text-white rounded-full px-1">
                                  Today
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Weekly goal progress</span>
                            <span>{meditationStats.weeklyCompleted}/{meditationStats.weeklyGoal} sessions</span>
                          </div>
                          <Progress value={(meditationStats.weeklyCompleted / meditationStats.weeklyGoal) * 100} />
                        </div>
                      </CardContent>
                    </Card>
                    
                    <div className="mt-6">
                      <h3 className="text-xl font-bold mb-4">Continue Your Practice</h3>
                      <MeditationPlayer />
                    </div>
                  </div>
                  
                  <div>
                    <Card className="mb-6">
                      <CardHeader>
                        <CardTitle>Last Session</CardTitle>
                        <CardDescription>
                          {meditationStats.lastSessionDate}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="bg-primary/10 p-4 rounded-md">
                            <h4 className="font-medium">{meditationStats.lastSession}</h4>
                            <p className="text-sm text-foreground/70 mt-1">
                              15 minute guided meditation
                            </p>
                          </div>
                          
                          <div className="flex justify-between text-sm">
                            <span className="flex items-center">
                              <Activity className="h-4 w-4 mr-1 text-primary" />
                              Focus increase
                            </span>
                            <span>+12%</span>
                          </div>
                          
                          <div className="flex justify-between text-sm">
                            <span className="flex items-center">
                              <BarChart className="h-4 w-4 mr-1 text-primary" />
                              Stress reduction
                            </span>
                            <span>-15%</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Recommendations</CardTitle>
                        <CardDescription>
                          Based on your progress
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          <li className="bg-secondary/40 p-3 rounded flex items-start">
                            <div className="p-1 rounded-full bg-primary/20 mr-2 mt-0.5">
                              <Sparkles className="h-3.5 w-3.5 text-primary" />
                            </div>
                            <div className="text-sm">
                              Try a <span className="font-medium">focus meditation</span> tomorrow morning to improve your workday concentration.
                            </div>
                          </li>
                          <li className="bg-secondary/40 p-3 rounded flex items-start">
                            <div className="p-1 rounded-full bg-primary/20 mr-2 mt-0.5">
                              <Activity className="h-3.5 w-3.5 text-primary" />
                            </div>
                            <div className="text-sm">
                              Increase your meditation duration gradually to <span className="font-medium">15 minutes</span> for deeper benefits.
                            </div>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="insights" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Meditation Insights</CardTitle>
                    <CardDescription>
                      Personalized analytics and patterns from your practice
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] border rounded-md bg-white p-4 flex items-center justify-center">
                      <p className="text-muted-foreground">Monthly trend visualization will appear here.</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="achievements" className="mt-0">
                <div className="grid md:grid-cols-2 gap-6">
                  {meditationStats.achievements.map((achievement, i) => (
                    <Card key={i} className={!achievement.unlocked ? "opacity-60" : ""}>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          {achievement.unlocked ? (
                            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center mr-2">
                              <Sparkles className="h-4 w-4 text-white" />
                            </div>
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center mr-2">
                              <span className="text-foreground/50">?</span>
                            </div>
                          )}
                          {achievement.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-foreground/70">
                          {achievement.description}
                        </p>
                        {achievement.unlocked ? (
                          <div className="mt-2 text-sm text-primary font-medium">Unlocked</div>
                        ) : (
                          <div className="mt-2 text-sm text-muted-foreground">Locked</div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProgressPage;
