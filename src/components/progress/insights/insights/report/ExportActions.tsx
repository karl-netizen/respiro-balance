
import React from 'react';
import { Button } from "@/components/ui/button";
import { Download, Share2, Printer, FileText } from "lucide-react";
import { toast } from "sonner";

interface ExportActionsProps {
  onExportPDF: () => Promise<void>;
  onExportImage: () => Promise<void>;
  onPrint: () => Promise<void>;
  onShare: () => Promise<void>;
  isExporting?: boolean;
}

const ExportActions: React.FC<ExportActionsProps> = ({
  onExportPDF,
  onExportImage,
  onPrint,
  onShare,
  isExporting = false
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
        <Button 
          variant="outline" 
          className="flex flex-col items-center justify-center h-16 md:h-24 gap-1 md:gap-2 hover:bg-primary/5 active:bg-primary/10 transition-colors min-h-[64px] touch-manipulation"
          onClick={() => handleAction(onExportPDF, "PDF Export")}
          disabled={isExporting}
        >
          <FileText className={`h-6 w-6 md:h-8 md:w-8 ${isExporting ? 'text-muted-foreground animate-pulse' : 'text-primary/80'}`} />
          <span className="text-xs font-medium">PDF</span>
        </Button>
        <Button 
          variant="outline"
          className="flex flex-col items-center justify-center h-16 md:h-24 gap-1 md:gap-2 hover:bg-primary/5 active:bg-primary/10 transition-colors min-h-[64px] touch-manipulation"
          onClick={() => handleAction(onExportImage, "Image Export")}
          disabled={isExporting}
        >
          <Download className={`h-6 w-6 md:h-8 md:w-8 ${isExporting ? 'text-muted-foreground animate-pulse' : 'text-primary/80'}`} />
          <span className="text-xs font-medium">Image</span>
        </Button>
        <Button 
          variant="outline"
          className="flex flex-col items-center justify-center h-16 md:h-24 gap-1 md:gap-2 hover:bg-primary/5 active:bg-primary/10 transition-colors min-h-[64px] touch-manipulation"
          onClick={() => handleAction(onPrint, "Print")}
          disabled={isExporting}
        >
          <Printer className={`h-6 w-6 md:h-8 md:w-8 ${isExporting ? 'text-muted-foreground animate-pulse' : 'text-primary/80'}`} />
          <span className="text-xs font-medium">Print</span>
        </Button>
        <Button 
          variant="outline"
          className="flex flex-col items-center justify-center h-16 md:h-24 gap-1 md:gap-2 hover:bg-primary/5 active:bg-primary/10 transition-colors min-h-[64px] touch-manipulation"
          onClick={() => handleAction(onShare, "Share")}
          disabled={isExporting}
        >
          <Share2 className={`h-6 w-6 md:h-8 md:w-8 ${isExporting ? 'text-muted-foreground animate-pulse' : 'text-primary/80'}`} />
          <span className="text-xs font-medium">Share</span>
        </Button>
      </div>
    </div>
  );
};

export default ExportActions;
