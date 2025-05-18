
import React from 'react';
import { Button } from "@/components/ui/button";
import { Download, Share2, Printer, FileText } from "lucide-react";
import { toast } from "sonner";

interface ExportActionsProps {
  onExportPDF: () => Promise<void>;
  onExportImage: () => Promise<void>;
  onPrint: () => Promise<void>;
  onShare: () => Promise<void>;
}

const ExportActions: React.FC<ExportActionsProps> = ({
  onExportPDF,
  onExportImage,
  onPrint,
  onShare
}) => {
  const handleAction = (action: () => Promise<void>, actionName: string) => {
    toast.info(`Preparing ${actionName}...`);
    action().catch(error => {
      console.error(`Error with ${actionName}:`, error);
      toast.error(`Failed to ${actionName.toLowerCase()}. Please try again.`);
    });
  };
  
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Export your meditation progress report in various formats:
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Button 
          variant="outline" 
          className="flex flex-col items-center justify-center h-24 gap-2 hover:bg-primary/5"
          onClick={() => handleAction(onExportPDF, "PDF Export")}
        >
          <FileText className="h-8 w-8 text-primary/80" />
          <span className="text-xs font-medium">PDF</span>
        </Button>
        <Button 
          variant="outline"
          className="flex flex-col items-center justify-center h-24 gap-2 hover:bg-primary/5"
          onClick={() => handleAction(onExportImage, "Image Export")}
        >
          <Download className="h-8 w-8 text-primary/80" />
          <span className="text-xs font-medium">Image</span>
        </Button>
        <Button 
          variant="outline"
          className="flex flex-col items-center justify-center h-24 gap-2 hover:bg-primary/5"
          onClick={() => handleAction(onPrint, "Print")}
        >
          <Printer className="h-8 w-8 text-primary/80" />
          <span className="text-xs font-medium">Print</span>
        </Button>
        <Button 
          variant="outline"
          className="flex flex-col items-center justify-center h-24 gap-2 hover:bg-primary/5"
          onClick={() => handleAction(onShare, "Share")}
        >
          <Share2 className="h-8 w-8 text-primary/80" />
          <span className="text-xs font-medium">Share</span>
        </Button>
      </div>
    </div>
  );
};

export default ExportActions;
