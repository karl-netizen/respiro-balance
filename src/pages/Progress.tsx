
import { useState } from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useMeditationSessions } from "@/hooks/useMeditationSessions";
import { Button } from "@/components/ui/button";
import { BarChart, Calendar, Clock, Trophy } from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// Sample data - in a real app this would come from the user's activity
const sampleMeditationData = [
  { day: 'Mon', minutes: 5 },
  { day: 'Tue', minutes: 8 },
  { day: 'Wed', minutes: 0 },
  { day: 'Thu', minutes: 12 },
  { day: 'Fri', minutes: 5 },
  { day: 'Sat', minutes: 15 },
  { day: 'Sun', minutes: 10 },
];

const sampleBreathingData = [
  { day: 'Mon', sessions: 2 },
  { day: 'Tue', sessions: 1 },
  { day: 'Wed', sessions: 3 },
  { day: 'Thu', sessions: 0 },
  { day: 'Fri', sessions: 1 },
  { day: 'Sat', sessions: 2 },
  { day: 'Sun', sessions: 1 },
];

const sampleStreakData = [
  { name: 'Current Streak', value: 4 },
  { name: 'Remaining', value: 3 },
];

const COLORS = ['#2563EB', '#E5E7EB'];

const Progress = () => {
  const { user } = useAuth();
  const { sessions, isLoading } = useMeditationSessions();
  const [period, setPeriod] = useState("week");
  
  // Calculate total minutes meditated
  const totalMinutesMeditated = sampleMeditationData.reduce((total, day) => total + day.minutes, 0);
  
  // Calculate total breathing sessions
  const totalBreathingSessions = sampleBreathingData.reduce((total, day) => total + day.sessions, 0);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <section className="bg-gradient-to-b from-background to-secondary/20 pt-24 pb-12 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Your Progress</h1>
              <p className="text-foreground/70 text-lg max-w-3xl mx-auto">
                Track your meditation and breathing practice over time. See your patterns and celebrate your consistency.
              </p>
            </div>
          </div>
        </section>
        
        {!user ? (
          <section className="py-16 px-6">
            <div className="max-w-2xl mx-auto text-center">
              <Card>
                <CardHeader>
                  <CardTitle>Sign in to track your progress</CardTitle>
                  <CardDescription>
                    Create an account or sign in to save and track your meditation and breathing practice.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center gap-4 mt-4">
                    <Button asChild>
                      <a href="/login">Log In</a>
                    </Button>
                    <Button variant="outline" asChild>
                      <a href="/register">Create Account</a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        ) : (
          <section className="py-16 px-6">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Total Time Meditated</CardDescription>
                    <CardTitle className="text-3xl flex items-center">
                      {totalMinutesMeditated} <span className="text-base ml-1">min</span>
                    </CardTitle>
                  </CardHeader>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Breathing Sessions</CardDescription>
                    <CardTitle className="text-3xl">{totalBreathingSessions}</CardTitle>
                  </CardHeader>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Current Streak</CardDescription>
                    <CardTitle className="text-3xl">4 days</CardTitle>
                  </CardHeader>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Badges Earned</CardDescription>
                    <CardTitle className="text-3xl">3</CardTitle>
                  </CardHeader>
                </Card>
              </div>
              
              <div className="flex justify-end mb-6">
                <div className="inline-flex items-center rounded-md border border-input bg-background p-1">
                  <Button 
                    variant={period === 'week' ? 'default' : 'ghost'} 
                    size="sm" 
                    onClick={() => setPeriod('week')}
                    className="text-xs"
                  >
                    Week
                  </Button>
                  <Button 
                    variant={period === 'month' ? 'default' : 'ghost'} 
                    size="sm" 
                    onClick={() => setPeriod('month')}
                    className="text-xs"
                  >
                    Month
                  </Button>
                  <Button 
                    variant={period === 'year' ? 'default' : 'ghost'} 
                    size="sm" 
                    onClick={() => setPeriod('year')}
                    className="text-xs"
                  >
                    Year
                  </Button>
                </div>
              </div>
              
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-3 mb-8">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="meditation">Meditation</TabsTrigger>
                  <TabsTrigger value="breathing">Breathing</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview">
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Clock className="h-5 w-5" /> Meditation Minutes
                          </CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[300px] w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                              data={sampleMeditationData}
                              margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" vertical={false} />
                              <XAxis dataKey="day" />
                              <YAxis />
                              <Tooltip />
                              <Line 
                                type="monotone" 
                                dataKey="minutes" 
                                stroke="#2563EB" 
                                strokeWidth={2}
                                dot={{ r: 4 }}
                                activeDot={{ r: 6 }}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Wind className="h-5 w-5" /> Breathing Sessions
                          </CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[300px] w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <RechartsBarChart
                              data={sampleBreathingData}
                              margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" vertical={false} />
                              <XAxis dataKey="day" />
                              <YAxis />
                              <Tooltip />
                              <Bar 
                                dataKey="sessions" 
                                fill="#2563EB" 
                                radius={[4, 4, 0, 0]}
                              />
                            </RechartsBarChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Trophy className="h-5 w-5" /> Current Streak
                          </CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="flex justify-center items-center">
                        <div className="h-[200px] w-[200px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={sampleStreakData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                fill="#8884d8"
                                paddingAngle={0}
                                dataKey="value"
                              >
                                {sampleStreakData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-2xl font-bold">
                                4/7
                              </text>
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="ml-4">
                          <p className="font-medium">You're on a 4-day streak!</p>
                          <p className="text-sm text-foreground/70 mt-1">3 more days to reach a full week</p>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Calendar className="h-5 w-5" /> Activity Calendar
                          </CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center p-8">
                          <p className="text-foreground/70">
                            Activity calendar visualization will appear here, showing your daily practice consistency.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="meditation">
                  <Card>
                    <CardHeader>
                      <CardTitle>Meditation Sessions</CardTitle>
                      <CardDescription>
                        Your recent meditation activity and detailed stats
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {isLoading ? (
                        <p>Loading your sessions...</p>
                      ) : sessions.length > 0 ? (
                        <div className="space-y-4">
                          <div className="rounded-md border">
                            <div className="grid grid-cols-4 p-4 font-medium border-b">
                              <div>Date</div>
                              <div>Type</div>
                              <div>Duration</div>
                              <div>Status</div>
                            </div>
                            <div className="divide-y">
                              {sessions.map((session) => (
                                <div key={session.id} className="grid grid-cols-4 p-4">
                                  <div>{new Date(session.started_at).toLocaleDateString()}</div>
                                  <div>{session.session_type}</div>
                                  <div>{session.duration} min</div>
                                  <div>
                                    {session.completed ? (
                                      <span className="text-green-500">Completed</span>
                                    ) : (
                                      <span className="text-amber-500">In Progress</span>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-foreground/70 mb-4">
                            You haven't completed any meditation sessions yet.
                          </p>
                          <Button asChild>
                            <a href="/#meditation">Start Meditating</a>
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="breathing">
                  <Card>
                    <CardHeader>
                      <CardTitle>Breathing Practice</CardTitle>
                      <CardDescription>
                        Your breathing exercise history and patterns
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8">
                        <p className="text-foreground/70 mb-4">
                          Detailed breathing session tracking coming soon.
                        </p>
                        <Button asChild>
                          <a href="/breathe">Practice Breathing</a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </section>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Progress;
