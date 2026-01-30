
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Crown } from 'lucide-react';
import { useSubscriptionContext } from './SubscriptionProvider';
import { SubscriptionGate } from './SubscriptionGate';

interface ExportButtonProps {
  data: any;
  filename: string;
  type: 'pdf' | 'csv' | 'json';
  title?: string;
}

export const ExportButton: React.FC<ExportButtonProps> = ({
  data,
  filename,
  type
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const { isPremium } = useSubscriptionContext();

  const exportToText = (data: any, filename: string) => {
    // Generate a text-based report (PDF removed due to security vulnerability)
    let content = 'Meditation Progress Report\n';
    content += '='.repeat(40) + '\n';
    content += `Generated on: ${new Date().toLocaleDateString()}\n\n`;
    
    if (data.stats) {
      content += 'Statistics:\n';
      content += '-'.repeat(20) + '\n';
      
      Object.entries(data.stats).forEach(([key, value]) => {
        content += `  ${key}: ${value}\n`;
      });
    }
    
    if (data.sessions && data.sessions.length > 0) {
      content += '\nRecent Sessions:\n';
      content += '-'.repeat(20) + '\n';
      
      data.sessions.slice(0, 10).forEach((session: any, index: number) => {
        content += `  ${index + 1}. ${session.title || 'Meditation Session'} - ${session.duration}min\n`;
      });
    }
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.txt`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const exportToCSV = (data: any, filename: string) => {
    let csvContent = '';
    
    if (data.sessions && data.sessions.length > 0) {
      // Headers
      const headers = ['Date', 'Title', 'Duration', 'Type', 'Completed'];
      csvContent += headers.join(',') + '\n';
      
      // Data rows
      data.sessions.forEach((session: any) => {
        const row = [
          new Date(session.started_at).toLocaleDateString(),
          session.title || 'Meditation Session',
          session.duration,
          session.session_type,
          session.completed ? 'Yes' : 'No'
        ];
        csvContent += row.join(',') + '\n';
      });
    }
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const exportToJSON = (data: any, filename: string) => {
    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.json`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate processing
      
      switch (type) {
        case 'pdf':
          // Use text export instead of PDF (jspdf removed due to security vulnerability)
          exportToText(data, filename);
          break;
        case 'csv':
          exportToCSV(data, filename);
          break;
        case 'json':
          exportToJSON(data, filename);
          break;
      }
    } catch (error) {
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  if (!isPremium) {
    return (
      <SubscriptionGate feature="Export Functionality">
        <Button disabled variant="outline">
          <Crown className="h-4 w-4 mr-2" />
          Export {type.toUpperCase()}
        </Button>
      </SubscriptionGate>
    );
  }

  return (
    <Button 
      onClick={handleExport}
      disabled={isExporting}
      variant="outline"
    >
      {isExporting ? (
        <>
          <div className="animate-spin h-4 w-4 mr-2 border-2 border-current border-t-transparent rounded-full" />
          Exporting...
        </>
      ) : (
        <>
          <Download className="h-4 w-4 mr-2" />
          Export {type === 'pdf' ? 'TXT' : type.toUpperCase()}
        </>
      )}
    </Button>
  );
};
