
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronDown, FileText } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useMeditationStats } from './useMeditationStats';
import { ReportContent, ExportActions, useReportExport } from './insights/insights/report';

const ShareableReport = () => {
  const { meditationStats } = useMeditationStats();
  const { user } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  
  const { 
    contentRef, 
    exportAsPDF, 
    exportAsImage, 
    printReport, 
    shareReport,
    isExporting
  } = useReportExport(meditationStats);
  
  const userName = user?.user_metadata?.full_name || "Respiro User";
  
  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <CardHeader className="bg-primary/5 border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Progress Report
              </CardTitle>
              <CardDescription>
                Generate and share your meditation progress
              </CardDescription>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1"
            >
              {isExpanded ? 'Hide Preview' : 'Show Preview'}
              <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
            </Button>
          </div>
        </CardHeader>
        
        {isExpanded && (
          <div className="max-h-96 overflow-y-auto border-b">
            <div className="scale-[0.7] origin-top transform py-4">
              <ReportContent 
                meditationStats={meditationStats} 
                userName={userName}
              />
            </div>
          </div>
        )}
        
        <CardContent className="pt-6">
          <Tabs defaultValue="export" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="export">Export Options</TabsTrigger>
              <TabsTrigger value="customize">Customize</TabsTrigger>
            </TabsList>
            
            <TabsContent value="export" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-secondary/20 p-4 rounded-lg">
                  <h4 className="text-sm font-medium mb-2">Report Summary</h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Total Sessions: {meditationStats.totalSessions}</li>
                    <li>• Total Minutes: {meditationStats.totalMinutes}</li>
                    <li>• Current Streak: {meditationStats.streak} days</li>
                    <li>• Weekly Completion: {meditationStats.weeklyCompleted}/{meditationStats.weeklyGoal}</li>
                  </ul>
                </div>
                
                <div className="bg-secondary/20 p-4 rounded-lg">
                  <h4 className="text-sm font-medium mb-2">Report Details</h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Generated for: {userName}</li>
                    <li>• Report type: Progress Summary</li>
                    <li>• Data period: Last 30 days</li>
                  </ul>
                </div>
              </div>
              <ExportActions
                onExportPDF={exportAsPDF}
                onExportImage={exportAsImage}
                onPrint={printReport}
                onShare={shareReport}
                isExporting={isExporting}
              />
            </TabsContent>
            
            <TabsContent value="customize">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Customize your report to include the information that matters most to you.
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" disabled className="justify-start">Daily Stats</Button>
                  <Button variant="outline" size="sm" disabled className="justify-start">Weekly Trends</Button>
                  <Button variant="outline" size="sm" disabled className="justify-start">Achievements</Button>
                  <Button variant="outline" size="sm" disabled className="justify-start">Focus Metrics</Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Customization options are available on the premium plan
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Export content container - positioned off-screen but renderable */}
      <div 
        ref={contentRef} 
        className="bg-white shadow-lg rounded-lg"
        style={{ 
          display: 'none',
          width: '800px',
          minHeight: '600px',
          padding: '0',
          margin: '0',
          boxSizing: 'border-box'
        }}
      >
        <ReportContent 
          meditationStats={meditationStats} 
          userName={userName}
        />
      </div>
    </div>
  );
};

export default ShareableReport;
