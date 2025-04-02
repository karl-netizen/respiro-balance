
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Download, Mail, Printer, Share2, Clock, Calendar } from "lucide-react";
import ReportPreviewCard from "./ReportPreviewCard";

const ReportingTab = () => {
  const [reportType, setReportType] = useState("team");
  const [reportFormat, setReportFormat] = useState("pdf");
  const [timeRange, setTimeRange] = useState("7days");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerateReport = () => {
    setIsGenerating(true);
    
    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false);
      toast({
        title: "Report Generated",
        description: `Your ${reportType} report has been generated successfully.`,
        duration: 3000,
      });
    }, 1500);
  };

  const handleSendReport = () => {
    toast({
      title: "Report Sent",
      description: "Your report has been sent to selected recipients.",
      duration: 3000,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reporting</CardTitle>
        <CardDescription>
          Generate and share reports on team and individual progress
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Report Configuration</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Report Type</label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="team">Team Progress Report</SelectItem>
                    <SelectItem value="individual">Individual Client Report</SelectItem>
                    <SelectItem value="stress">Stress Analysis Report</SelectItem>
                    <SelectItem value="engagement">Engagement Metrics Report</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {reportType === "individual" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Client</label>
                  <Select defaultValue="all">
                    <SelectTrigger>
                      <SelectValue placeholder="Select client" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Clients</SelectItem>
                      <SelectItem value="client1">Alex Johnson</SelectItem>
                      <SelectItem value="client2">Jamie Smith</SelectItem>
                      <SelectItem value="client3">Casey Brown</SelectItem>
                      <SelectItem value="client4">Taylor Williams</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Time Range</label>
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger>
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Select time range" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7days">Last 7 days</SelectItem>
                    <SelectItem value="30days">Last 30 days</SelectItem>
                    <SelectItem value="90days">Last 90 days</SelectItem>
                    <SelectItem value="custom">Custom range</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Report Format</label>
                <Select value={reportFormat} onValueChange={setReportFormat}>
                  <SelectTrigger>
                    <div className="flex items-center">
                      <FileText className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Select format" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF Document</SelectItem>
                    <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                    <SelectItem value="csv">CSV File</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="pt-4 space-y-4">
                <Button 
                  className="w-full" 
                  onClick={handleGenerateReport} 
                  disabled={isGenerating}
                >
                  {isGenerating ? "Generating..." : "Generate Report"}
                </Button>
                
                <div className="grid grid-cols-3 gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleSendReport}>
                    <Mail className="h-4 w-4 mr-1" />
                    Email
                  </Button>
                  <Button variant="outline" size="sm">
                    <Printer className="h-4 w-4 mr-1" />
                    Print
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Report Preview</h3>
            <ReportPreviewCard 
              reportType={reportType}
              timeRange={timeRange}
            />
          </div>
        </div>
        
        <div className="mt-10">
          <h3 className="text-lg font-semibold mb-4">Scheduled Reports</h3>
          <div className="border rounded-md">
            <div className="grid grid-cols-12 px-4 py-3 bg-secondary/30 font-medium text-sm">
              <div className="col-span-3">Report Name</div>
              <div className="col-span-2">Frequency</div>
              <div className="col-span-2">Format</div>
              <div className="col-span-3">Recipients</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>
            
            <div className="grid grid-cols-12 px-4 py-3 border-t items-center text-sm">
              <div className="col-span-3 font-medium">Weekly Team Progress</div>
              <div className="col-span-2">Weekly (Mon)</div>
              <div className="col-span-2">PDF</div>
              <div className="col-span-3">Team Leaders (3)</div>
              <div className="col-span-2 text-right">
                <Button variant="ghost" size="sm">Edit</Button>
              </div>
            </div>
            
            <div className="grid grid-cols-12 px-4 py-3 border-t items-center text-sm">
              <div className="col-span-3 font-medium">Monthly Analytics</div>
              <div className="col-span-2">Monthly (1st)</div>
              <div className="col-span-2">Excel</div>
              <div className="col-span-3">Management (2)</div>
              <div className="col-span-2 text-right">
                <Button variant="ghost" size="sm">Edit</Button>
              </div>
            </div>
            
            <div className="grid grid-cols-12 px-4 py-3 border-t items-center text-sm">
              <div className="col-span-3 font-medium">Quarterly Review</div>
              <div className="col-span-2">Quarterly</div>
              <div className="col-span-2">PDF</div>
              <div className="col-span-3">All Staff (8)</div>
              <div className="col-span-2 text-right">
                <Button variant="ghost" size="sm">Edit</Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportingTab;
