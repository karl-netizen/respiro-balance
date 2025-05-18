
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useMeditationStats } from './useMeditationStats';
import { ReportContent, ExportActions, useReportExport } from './insights/insights/report';

const ShareableReport = () => {
  const { meditationStats } = useMeditationStats();
  const { user } = useAuth();
  
  const { 
    contentRef, 
    exportAsPDF, 
    exportAsImage, 
    printReport, 
    shareReport 
  } = useReportExport(meditationStats);
  
  const userName = user?.user_metadata?.full_name || "Respiro User";
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Progress Report</CardTitle>
          <CardDescription>
            Generate and share your meditation progress
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
      <div className="hidden">
        <div ref={contentRef} className="bg-white" style={{ width: '800px' }}>
          <ReportContent 
            meditationStats={meditationStats} 
            userName={userName}
          />
        </div>
      </div>
    </div>
  );
};

export default ShareableReport;
