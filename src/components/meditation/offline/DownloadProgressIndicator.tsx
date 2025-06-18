
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Download, Check, AlertCircle, Pause } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface DownloadProgressIndicatorProps {
  status: 'idle' | 'downloading' | 'completed' | 'error' | 'paused';
  progress: number;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export const DownloadProgressIndicator: React.FC<DownloadProgressIndicatorProps> = ({
  status,
  progress,
  size = 'md',
  showText = true,
  className = ''
}) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'downloading':
        return <Download className="h-4 w-4 animate-pulse" />;
      case 'completed':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'paused':
        return <Pause className="h-4 w-4 text-orange-500" />;
      default:
        return <Download className="h-4 w-4" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'downloading':
        return `Downloading... ${Math.round(progress)}%`;
      case 'completed':
        return 'Downloaded';
      case 'error':
        return 'Download Failed';
      case 'paused':
        return 'Paused';
      default:
        return 'Download';
    }
  };

  const getStatusVariant = () => {
    switch (status) {
      case 'downloading':
        return 'default';
      case 'completed':
        return 'default';
      case 'error':
        return 'destructive';
      case 'paused':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  if (status === 'idle') {
    return (
      <Badge variant="outline" className={className}>
        {getStatusIcon()}
        {showText && <span className="ml-1">Download</span>}
      </Badge>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center space-x-2">
        <Badge variant={getStatusVariant()}>
          {getStatusIcon()}
          {showText && <span className="ml-1">{getStatusText()}</span>}
        </Badge>
      </div>
      
      {(status === 'downloading' || status === 'paused') && (
        <Progress 
          value={progress} 
          className={`w-full ${
            size === 'sm' ? 'h-1' : 
            size === 'lg' ? 'h-3' : 'h-2'
          }`}
        />
      )}
    </div>
  );
};
