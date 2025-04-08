
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Users, User, Activity, BarChart, Clock, Calendar, Bell, Shield } from "lucide-react";
import { useUserPreferences } from "@/context";
import { useToast } from "@/hooks/use-toast";
import ClientManagementTab from "./client-management/ClientManagementTab";
import TeamMetricsTab from "./team-metrics/TeamMetricsTab";
import ReportingTab from "./reporting/ReportingTab";
import SecurityTab from "./security/SecurityTab";

const CoachDashboard = () => {
  const { preferences, isCoach } = useUserPreferences();
  const [activeTab, setActiveTab] = useState("clients");
  const { toast } = useToast();
  
  // Mock data for dashboard metrics - in a real app, this would come from an API
  const dashboardMetrics = {
    totalClients: 28,
    activeToday: 12,
    avgProgress: 67,
    totalSessions: 342,
    stressAlerts: 3
  };

  const handleAddClient = () => {
    toast({
      title: "Add Client Feature",
      description: "This feature will be implemented in the next phase.",
      variant: "default",
    });
  };

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
          <Button className="mt-4 md:mt-0" onClick={handleAddClient}>
            <User className="mr-2 h-4 w-4" />
            Add New Client
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="p-2 bg-primary/10 rounded-full mr-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-foreground/70">Total Clients</p>
                  <p className="text-2xl font-bold">{dashboardMetrics.totalClients}</p>
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
                  <p className="text-2xl font-bold">{dashboardMetrics.activeToday}</p>
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
                  <p className="text-2xl font-bold">{dashboardMetrics.avgProgress}%</p>
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
                  <p className="text-2xl font-bold">{dashboardMetrics.totalSessions}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="p-2 bg-primary/10 rounded-full mr-4">
                  <Bell className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-foreground/70">Stress Alerts</p>
                  <p className="text-2xl font-bold">{dashboardMetrics.stressAlerts}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="clients" onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="clients">Client Management</TabsTrigger>
            <TabsTrigger value="metrics">Team Metrics</TabsTrigger>
            <TabsTrigger value="reporting">Reporting</TabsTrigger>
            <TabsTrigger value="security">Data Security</TabsTrigger>
          </TabsList>
          
          <TabsContent value="clients">
            <ClientManagementTab />
          </TabsContent>
          
          <TabsContent value="metrics">
            <TeamMetricsTab />
          </TabsContent>
          
          <TabsContent value="reporting">
            <ReportingTab />
          </TabsContent>
          
          <TabsContent value="security">
            <SecurityTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CoachDashboard;
