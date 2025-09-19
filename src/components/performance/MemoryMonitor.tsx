import React from 'react';
import { useMemoryMonitoring } from '@/lib/performance/memory-management';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// ===================================================================
// MEMORY MONITOR COMPONENT
// ===================================================================

const MemoryMonitor: React.FC = () => {
  const { memoryUsage, resourceStats, isHighMemoryUsage } = useMemoryMonitoring();

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const forceGarbageCollection = () => {
    // Trigger garbage collection if available (Chrome DevTools)
    if ((window as any).gc) {
      (window as any).gc();
    } else {
      // Fallback: create and release objects to encourage GC
      const temp = new Array(1000000).fill(0);
      temp.length = 0;
    }
  };

  if (!memoryUsage) {
    return (
      <div className="fixed bottom-4 left-4 z-50">
        <Card className="w-64">
          <CardContent className="p-3">
            <div className="text-sm text-muted-foreground text-center">
              Memory monitoring not available in this browser
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <Card className={`w-80 ${isHighMemoryUsage ? 'border-destructive' : ''}`}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center justify-between">
            Memory Monitor
            <Badge 
              variant={
                memoryUsage.percentage > 90 ? 'destructive' : 
                memoryUsage.percentage > 70 ? 'secondary' : 'default'
              }
              className="text-xs"
            >
              {memoryUsage.percentage.toFixed(1)}%
            </Badge>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-3">
          {/* Memory Usage Progress */}
          <div className="space-y-1">
            <Progress 
              value={memoryUsage.percentage} 
              className="h-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatBytes(memoryUsage.usedJSHeapSize)}</span>
              <span>{formatBytes(memoryUsage.jsHeapSizeLimit)}</span>
            </div>
          </div>

          {/* Resource Stats */}
          <div className="space-y-2">
            <div className="text-xs font-medium">Resources: {resourceStats.total}</div>
            
            {Object.keys(resourceStats.byType).length > 0 && (
              <div className="flex flex-wrap gap-1">
                {Object.entries(resourceStats.byType).map(([type, count]) => (
                  <Badge key={type} variant="outline" className="text-xs">
                    {type}: {count}
                  </Badge>
                ))}
              </div>
            )}

            {resourceStats.oldestResource && (
              <div className="text-xs text-muted-foreground">
                Oldest: {Math.round(resourceStats.oldestResource.age / 1000)}s
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={forceGarbageCollection}
              className="flex-1 text-xs"
            >
              Force GC
            </Button>
            
            {isHighMemoryUsage && (
              <Button
                size="sm"
                variant="destructive"
                onClick={() => window.location.reload()}
                className="flex-1 text-xs"
              >
                Reload
              </Button>
            )}
          </div>

          {/* Warning for high memory usage */}
          {isHighMemoryUsage && (
            <div className="text-xs text-destructive bg-destructive/10 p-2 rounded border">
              ⚠️ High memory usage detected. Consider reloading the page.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MemoryMonitor;