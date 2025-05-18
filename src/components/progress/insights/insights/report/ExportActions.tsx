
import React from 'react';
import { Button } from "@/components/ui/button";
import { Download, Share2, Printer, FileText } from "lucide-react";

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
  return (
    <div className="flex flex-wrap gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        className="flex items-center gap-1"
        onClick={onExportPDF}
      >
        <FileText className="h-4 w-4" />
        PDF
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        className="flex items-center gap-1"
        onClick={onExportImage}
      >
        <Download className="h-4 w-4" />
        Image
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        className="flex items-center gap-1"
        onClick={onPrint}
      >
        <Printer className="h-4 w-4" />
        Print
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        className="flex items-center gap-1"
        onClick={onShare}
      >
        <Share2 className="h-4 w-4" />
        Share
      </Button>
    </div>
  );
};

export default ExportActions;
