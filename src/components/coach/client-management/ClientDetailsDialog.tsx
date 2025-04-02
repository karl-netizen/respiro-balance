
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock, BarChart, Activity, Brain, Mail, Phone, MessageSquare } from "lucide-react";

interface ClientDetailsDialogProps {
  client: any;
  isOpen: boolean;
  onClose: () => void;
}

const ClientDetailsDialog: React.FC<ClientDetailsDialogProps> = ({ client, isOpen, onClose }) => {
  // Mock meditation data for the client
  const meditationData = {
    weeklyProgress: 68,
    totalSessions: 47,
    totalMinutes: 470,
    favorites: ["Morning Calm", "Stress Relief", "Deep Focus"],
    recentSessions: [
      { date: "2023-06-18", name: "Morning Calm", duration: 10 },
      { date: "2023-06-17", name: "Stress Relief", duration: 15 },
      { date: "2023-06-15", name: "Deep Focus", duration: 20 },
    ],
    biometricTrends: {
      heartRate: [72, 70, 74, 71, 69, 68, 67],
      stressScore: [65, 70, 80, 75, 60, 55, 50],
    },
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{client.name}</DialogTitle>
          <DialogDescription>
            Client since {new Date(client.joinDate).toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="p-2 bg-primary/10 rounded-full mr-4">
                  <Activity className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-foreground/70">Current Streak</p>
                  <p className="text-xl font-bold">{client.streak} days</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="p-2 bg-primary/10 rounded-full mr-4">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-foreground/70">Total Sessions</p>
                  <p className="text-xl font-bold">{meditationData.totalSessions}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="p-2 bg-primary/10 rounded-full mr-4">
                  <Brain className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-foreground/70">Stress Level</p>
                  <p className="text-xl font-bold capitalize">{client.stress}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="communication">Communication</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Client Goals</CardTitle>
                  <CardDescription>Meditation and wellness goals</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {client.goals.map((goal: string, index: number) => (
                      <Badge key={index} variant="secondary">{goal}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Progress</CardTitle>
                  <CardDescription>Progress toward meditation goals</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Progress</span>
                      <span className="text-sm font-medium">{meditationData.weeklyProgress}%</span>
                    </div>
                    <Progress value={meditationData.weeklyProgress} className="h-2" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Favorite Sessions</CardTitle>
                  <CardDescription>Most used meditation sessions</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {meditationData.favorites.map((session, index) => (
                      <li key={index} className="flex items-center text-sm">
                        <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mr-2">
                          {index + 1}
                        </span>
                        {session}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="progress">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Biometric Trends</CardTitle>
                  <CardDescription>Heart rate and stress level over time</CardDescription>
                </CardHeader>
                <CardContent className="h-[200px] flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <BarChart className="h-16 w-16 mx-auto mb-4" />
                    <p>Biometric visualizations will be implemented in the next phase</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Recent Sessions</CardTitle>
                  <CardDescription>Last meditation sessions</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {meditationData.recentSessions.map((session, index) => (
                      <li key={index} className="flex justify-between items-center text-sm border-b pb-2 last:border-0">
                        <div>
                          <p className="font-medium">{session.name}</p>
                          <p className="text-muted-foreground text-xs flex items-center">
                            <CalendarDays className="h-3 w-3 mr-1" />
                            {new Date(session.date).toLocaleDateString()}
                          </p>
                        </div>
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                          {session.duration} min
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="communication">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">client.email@example.com</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">(555) 123-4567</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Send Message</CardTitle>
                  <CardDescription>Send a direct message to this client</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center h-[100px]">
                    <MessageSquare className="h-12 w-12 text-muted-foreground/50" />
                  </div>
                  <p className="text-center text-sm text-muted-foreground">
                    Messaging functionality will be implemented in the next phase
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Client notification settings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    <p>Session reminders: Enabled</p>
                    <p>Progress updates: Enabled</p>
                    <p>Coach messages: Enabled</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>Close</Button>
          <Button>Send Message</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ClientDetailsDialog;
