
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart, Clock, Users, Brain, Calendar } from "lucide-react";

interface ReportPreviewCardProps {
  reportType: string;
  timeRange: string;
}

const ReportPreviewCard: React.FC<ReportPreviewCardProps> = ({ reportType, timeRange }) => {
  const getTimeRangeText = () => {
    switch (timeRange) {
      case "7days":
        return "Last 7 days";
      case "30days":
        return "Last 30 days";
      case "90days":
        return "Last 90 days";
      default:
        return "Custom time range";
    }
  };
  
  const getReportTitle = () => {
    switch (reportType) {
      case "team":
        return "Team Progress Report";
      case "individual":
        return "Individual Client Report";
      case "stress":
        return "Stress Analysis Report";
      case "engagement":
        return "Engagement Metrics Report";
      default:
        return "Report Preview";
    }
  };
  
  return (
    <Card className="border-dashed overflow-hidden">
      <CardContent className="p-0">
        <div className="p-4 bg-primary text-primary-foreground">
          <h4 className="text-lg font-semibold">{getReportTitle()}</h4>
          <p className="text-xs opacity-90">{getTimeRangeText()}</p>
        </div>
        
        <div className="p-6 flex flex-col items-center justify-center space-y-8">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Generated on {new Date().toLocaleDateString()}</span>
          </div>
          
          {reportType === "team" && (
            <div className="w-full space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-primary" />
                    <span className="text-sm font-medium">Client Participation</span>
                  </div>
                  <span className="text-sm font-medium">78%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full w-full">
                  <div className="h-2 bg-primary rounded-full" style={{ width: "78%" }}></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-primary" />
                    <span className="text-sm font-medium">Session Completion</span>
                  </div>
                  <span className="text-sm font-medium">65%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full w-full">
                  <div className="h-2 bg-primary rounded-full" style={{ width: "65%" }}></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Brain className="h-4 w-4 mr-2 text-primary" />
                    <span className="text-sm font-medium">Stress Reduction</span>
                  </div>
                  <span className="text-sm font-medium">42%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full w-full">
                  <div className="h-2 bg-primary rounded-full" style={{ width: "42%" }}></div>
                </div>
              </div>
            </div>
          )}
          
          {reportType === "stress" && (
            <div className="w-full space-y-4">
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="p-3 bg-secondary/30 rounded-md text-center">
                  <p className="text-xs text-muted-foreground">Low</p>
                  <p className="text-lg font-bold">47%</p>
                </div>
                <div className="p-3 bg-secondary/30 rounded-md text-center">
                  <p className="text-xs text-muted-foreground">Moderate</p>
                  <p className="text-lg font-bold">35%</p>
                </div>
                <div className="p-3 bg-secondary/30 rounded-md text-center">
                  <p className="text-xs text-muted-foreground">High</p>
                  <p className="text-lg font-bold">18%</p>
                </div>
              </div>
              
              <div className="h-24 border rounded-md flex items-center justify-center">
                <BarChart className="h-12 w-12 text-muted-foreground/50" />
              </div>
            </div>
          )}
          
          {(reportType === "individual" || reportType === "engagement") && (
            <div className="h-40 w-full border rounded-md flex flex-col items-center justify-center">
              <BarChart className="h-16 w-16 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground mt-2">Chart visualization</p>
            </div>
          )}
          
          <div className="text-center text-xs text-muted-foreground">
            <p>This report includes detailed analytics and visualizations.</p>
            <p>View full report to see all metrics and insights.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportPreviewCard;
