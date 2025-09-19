import React from 'react';
import { usePerformanceMonitoring } from '@/lib/performance/web-vitals-monitor';
import { useMemoryMonitoring } from '@/lib/performance/memory-management';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';

// ===================================================================
// PERFORMANCE DASHBOARD COMPONENT
// ===================================================================

const PerformanceDashboard: React.FC = () => {
  const { metrics, measurePerformance } = usePerformanceMonitoring();
  const { memoryUsage, resourceStats, isHighMemoryUsage } = useMemoryMonitoring();

  const formatMetricValue = (name: string, value: number): string => {
    if (name === 'CLS') {
      return value.toFixed(3);
    }
    return `${Math.round(value)}ms`;
  };

  const getMetricRatingColor = (rating: string) => {
    switch (rating) {
      case 'good': return 'bg-green-100 text-green-800 border-green-200';
      case 'needs-improvement': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'poor': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Performance Dashboard</h2>
        <button
          onClick={() => measurePerformance('manual-test', () => {
            // Simulate some work
            const start = Date.now();
            while (Date.now() - start < 100) {}
          })}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          Test Performance
        </button>
      </div>

      {/* High Memory Usage Alert */}
      {isHighMemoryUsage && (
        <Alert variant="destructive">
          <AlertDescription>
            High memory usage detected. Consider closing unused tabs or refreshing the page.
          </AlertDescription>
        </Alert>
      )}

      {/* Core Web Vitals */}
      <Card>
        <CardHeader>
          <CardTitle>Core Web Vitals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {Object.entries(metrics).map(([name, metric]) => (
              <div key={name} className="space-y-2">
                <div className="text-sm font-medium">{name}</div>
                <div className="text-2xl font-bold">
                  {formatMetricValue(name, metric.value)}
                </div>
                <Badge className={getMetricRatingColor(metric.rating)}>
                  {metric.rating}
                </Badge>
              </div>
            ))}
          </div>
          
          {Object.keys(metrics).length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No performance metrics collected yet. Interact with the page to see data.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Memory Usage */}
      {memoryUsage && (
        <Card>
          <CardHeader>
            <CardTitle>Memory Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Used Heap</span>
                <span>{formatBytes(memoryUsage.usedJSHeapSize)}</span>
              </div>
              
              <Progress 
                value={memoryUsage.percentage} 
                className="h-3"
              />
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Total Heap:</span>
                  <div className="font-medium">{formatBytes(memoryUsage.totalJSHeapSize)}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Heap Limit:</span>
                  <div className="font-medium">{formatBytes(memoryUsage.jsHeapSizeLimit)}</div>
                </div>
              </div>

              <div className="pt-2 border-t">
                <div className="text-sm font-medium mb-2">Resource Tracking</div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>Total Resources: {resourceStats.total}</div>
                  {resourceStats.oldestResource && (
                    <div>
                      Oldest: {Math.round(resourceStats.oldestResource.age / 1000)}s
                    </div>
                  )}
                </div>
                
                {Object.keys(resourceStats.byType).length > 0 && (
                  <div className="mt-2">
                    <div className="text-xs text-muted-foreground mb-1">By Type:</div>
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(resourceStats.byType).map(([type, count]) => (
                        <Badge key={type} variant="outline" className="text-xs">
                          {type}: {count}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Performance Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div>• Keep LCP under 2.5 seconds for good user experience</div>
            <div>• Maintain FID under 100ms for responsive interactions</div>
            <div>• Keep CLS under 0.1 for visual stability</div>
            <div>• Monitor memory usage to prevent crashes</div>
            <div>• Use lazy loading for large components</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceDashboard;