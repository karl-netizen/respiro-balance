
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useMeditationStats } from "@/components/progress/useMeditationStats";
import { ReportContent, ExportActions, useReportExport } from './report';

const ProgressReportCard: React.FC = () => {
  const { user } = useAuth();
  const { meditationStats } = useMeditationStats();
  const userName = user?.email?.split('@')[0] || 'User';
  
  // Use the custom hook for report export functionality
  const { 
    contentRef,
    exportAsPDF,
    exportAsImage,
    printReport,
    shareReport
  } = useReportExport(meditationStats);
  
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Weekly Progress Snapshot</CardTitle>
          <CardDescription>
            Download or share your progress report
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ExportActions 
            onExportPDF={exportAsPDF}
            onExportImage={exportAsImage}
            onPrint={printReport}
            onShare={shareReport}
          />
        </CardContent>
      </Card>
      
      {/* Hidden report content for export */}
      <div 
        ref={contentRef} 
        className="hidden absolute left-0 right-0"
        id="report-content"
      >
        <ReportContent 
          meditationStats={meditationStats} 
          userName={userName} 
        />
      </div>
    </>
  );
};

export default ProgressReportCard;
