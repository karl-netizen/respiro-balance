
import React from 'react';
import { FileDown, Share2, Printer, Image } from "lucide-react";

interface ExportActionsProps {
  onExportPDF: () => void;
  onExportImage: () => void;
  onPrint: () => void;
  onShare: () => void;
}

const ExportActions: React.FC<ExportActionsProps> = ({ 
  onExportPDF, 
  onExportImage, 
  onPrint, 
  onShare 
}) => {
  return (
    <div className="flex flex-col space-y-2">
      <button 
        onClick={onExportPDF}
        className="flex items-center justify-center w-full py-2 px-4 border border-primary/30 rounded-md hover:bg-primary/5 transition-colors"
      >
        <FileDown className="w-4 h-4 mr-2" />
        Download PDF Report
      </button>
      <button 
        onClick={onExportImage}
        className="flex items-center justify-center w-full py-2 px-4 border border-primary/30 rounded-md hover:bg-primary/5 transition-colors"
      >
        <Image className="w-4 h-4 mr-2" />
        Export as Image
      </button>
      <button 
        onClick={onPrint}
        className="flex items-center justify-center w-full py-2 px-4 border border-primary/30 rounded-md hover:bg-primary/5 transition-colors"
      >
        <Printer className="w-4 h-4 mr-2" />
        Print Report
      </button>
      <button 
        onClick={onShare}
        className="flex items-center justify-center w-full py-2 px-4 border border-primary/30 rounded-md hover:bg-primary/5 transition-colors"
      >
        <Share2 className="w-4 h-4 mr-2" />
        Share Progress
      </button>
    </div>
  );
};

export default ExportActions;
