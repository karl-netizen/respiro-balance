
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Users, User, Activity, BarChart, Clock, Calendar } from "lucide-react";
import { useUserPreferences } from "@/context";
import ClientList from "./ClientList";
import TeamMetrics from "./TeamMetrics";

const CoachDashboard = () => {
  const { preferences, isCoach } = useUserPreferences();
  const [activeTab, setActiveTab] = useState("clients");
  
  // Mock data - in a real app, this would come from an API
  const mockClients = [
    { id: "1", name: "Alex Johnson", progress: 75, lastActive: "Today", stress: "low" },
    { id: "2", name: "Jamie Smith", progress: 45, lastActive: "Yesterday", stress: "high" },
    { id: "3", name: "Casey Brown", progress: 90, lastActive: "2 days ago", stress: "low" },
    { id: "4", name: "Taylor Williams", progress: 30, lastActive: "1 week ago", stress: "moderate" },
    { id: "5", name: "Jordan Miller", progress: 60, lastActive: "Today", stress: "moderate" },
  ];

  // If user is not a coach, show access denied
  if (!isCoach()) {
    return (
      <div className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Coach Dashboard Access Denied</h2>
          <p className="text-foreground/70 mb-8">
            You need coach privileges to access this dashboard. Please contact your administrator.
          </p>
          <Button variant="outline">Return to Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold">Coach Dashboard</h2>
            <p className="text-foreground/70">Manage your clients and team metrics</p>
          </div>
          <Button className="mt-4 md:mt-0">
            <User className="mr-2 h-4 w-4" />
            Add New Client
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="p-2 bg-primary/10 rounded-full mr-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-foreground/70">Total Clients</p>
                  <p className="text-2xl font-bold">{mockClients.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="p-2 bg-primary/10 rounded-full mr-4">
                  <Activity className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-foreground/70">Active Today</p>
                  <p className="text-2xl font-bold">
                    {mockClients.filter(c => c.lastActive === "Today").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="p-2 bg-primary/10 rounded-full mr-4">
                  <BarChart className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-foreground/70">Avg Progress</p>
                  <p className="text-2xl font-bold">
                    {Math.round(mockClients.reduce((acc, c) => acc + c.progress, 0) / mockClients.length)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="p-2 bg-primary/10 rounded-full mr-4">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-foreground/70">Total Sessions</p>
                  <p className="text-2xl font-bold">124</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="clients" onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 md:w-[400px] mb-8">
            <TabsTrigger value="clients">Client Management</TabsTrigger>
            <TabsTrigger value="metrics">Team Metrics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="clients">
            <Card>
              <CardHeader>
                <CardTitle>Clients</CardTitle>
                <CardDescription>
                  Manage your clients and their meditation progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* In a real app, this would be a full component with pagination, etc. */}
                <div className="border rounded-md">
                  <div className="grid grid-cols-12 px-4 py-3 bg-secondary/30 font-medium text-sm">
                    <div className="col-span-5">Name</div>
                    <div className="col-span-2">Progress</div>
                    <div className="col-span-2">Stress Level</div>
                    <div className="col-span-2">Last Active</div>
                    <div className="col-span-1"></div>
                  </div>
                  
                  {mockClients.map(client => (
                    <div key={client.id} className="grid grid-cols-12 px-4 py-3 border-t items-center text-sm">
                      <div className="col-span-5 font-medium">{client.name}</div>
                      <div className="col-span-2">
                        <div className="w-full bg-secondary h-2 rounded-full">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{width: `${client.progress}%`}}
                          ></div>
                        </div>
                      </div>
                      <div className="col-span-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          client.stress === "low" 
                            ? "bg-green-100 text-green-800" 
                            : client.stress === "moderate" 
                              ? "bg-yellow-100 text-yellow-800" 
                              : "bg-red-100 text-red-800"
                        }`}>
                          {client.stress}
                        </span>
                      </div>
                      <div className="col-span-2 text-foreground/70">{client.lastActive}</div>
                      <div className="col-span-1 text-right">
                        <Button variant="ghost" size="sm">View</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="metrics">
            <Card>
              <CardHeader>
                <CardTitle>Team Metrics</CardTitle>
                <CardDescription>
                  View aggregated metrics across all your clients
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-12 text-center text-foreground/70">
                  <Calendar className="h-16 w-16 mx-auto mb-4 text-primary/70" />
                  <h3 className="text-lg font-medium mb-2">Team Metrics Dashboard</h3>
                  <p className="max-w-md mx-auto">
                    Charts and detailed analytics would be displayed here, showing team progress, 
                    stress levels, and meditation consistency over time.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CoachDashboard;
