
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { Search, Sliders, Filter, MoreHorizontal } from "lucide-react";
import ClientDetailsDialog from "./ClientDetailsDialog";

// Sample client data (in a real app, this would come from an API)
const mockClients = [
  { id: "1", name: "Alex Johnson", progress: 75, lastActive: "Today", stress: "low", joinDate: "2023-04-15", streak: 12, goals: ["Reduce stress", "Better sleep"] },
  { id: "2", name: "Jamie Smith", progress: 45, lastActive: "Yesterday", stress: "high", joinDate: "2023-05-22", streak: 3, goals: ["Improve focus"] },
  { id: "3", name: "Casey Brown", progress: 90, lastActive: "2 days ago", stress: "low", joinDate: "2023-03-10", streak: 21, goals: ["Reduce stress", "Improve focus"] },
  { id: "4", name: "Taylor Williams", progress: 30, lastActive: "1 week ago", stress: "moderate", joinDate: "2023-06-05", streak: 0, goals: ["Better sleep"] },
  { id: "5", name: "Jordan Miller", progress: 60, lastActive: "Today", stress: "moderate", joinDate: "2023-02-18", streak: 8, goals: ["Reduce stress", "Anxiety management"] },
  { id: "6", name: "Morgan Davis", progress: 82, lastActive: "Yesterday", stress: "low", joinDate: "2023-01-30", streak: 45, goals: ["Daily mindfulness"] },
  { id: "7", name: "Riley Wilson", progress: 15, lastActive: "3 days ago", stress: "high", joinDate: "2023-06-12", streak: 2, goals: ["Improve focus", "Better sleep"] },
  { id: "8", name: "Quinn Thomas", progress: 50, lastActive: "Today", stress: "moderate", joinDate: "2023-04-28", streak: 7, goals: ["Reduce stress"] },
];

const ClientManagementTab = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const { toast } = useToast();

  const handleViewClient = (client: any) => {
    setSelectedClient(client);
  };

  const handleCloseDetails = () => {
    setSelectedClient(null);
  };

  const handleSendMessage = (clientId: string) => {
    toast({
      title: "Message Sent",
      description: `Your message to client ${clientId} will be sent once implemented.`,
      duration: 3000,
    });
  };

  // Filter clients based on search query and status filter
  const filteredClients = mockClients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "all" || 
      (filterStatus === "active" && client.lastActive === "Today") ||
      (filterStatus === "high-stress" && client.stress === "high");
    
    return matchesSearch && matchesFilter;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Client Management</CardTitle>
        <CardDescription>
          Manage your clients and their meditation progress
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search clients..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Clients</SelectItem>
              <SelectItem value="active">Active Today</SelectItem>
              <SelectItem value="high-stress">High Stress</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Sliders className="mr-2 h-4 w-4" />
            Advanced Filters
          </Button>
        </div>

        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Stress Level</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead>Streak</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map(client => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">{client.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={client.progress} className="h-2 w-[80px]" />
                      <span className="text-xs text-muted-foreground">{client.progress}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs ${
                      client.stress === "low" 
                        ? "bg-green-100 text-green-800" 
                        : client.stress === "moderate" 
                          ? "bg-yellow-100 text-yellow-800" 
                          : "bg-red-100 text-red-800"
                    }`}>
                      {client.stress}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{client.lastActive}</TableCell>
                  <TableCell>{client.streak} days</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleViewClient(client)}>View</Button>
                    <Button variant="ghost" size="sm" onClick={() => handleSendMessage(client.id)}>Message</Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredClients.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No clients found matching your criteria
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      {selectedClient && (
        <ClientDetailsDialog 
          client={selectedClient} 
          isOpen={!!selectedClient} 
          onClose={handleCloseDetails} 
        />
      )}
    </Card>
  );
};

export default ClientManagementTab;
