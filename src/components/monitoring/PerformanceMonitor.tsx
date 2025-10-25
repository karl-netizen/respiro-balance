
import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Activity, Zap, Shield, Clock } from 'lucide-react';

interface PerformanceMetrics {
  lighthouse: {
    performance: number;
    accessibility: number;
    bestPractices: number;
    seo: number;
  };
  vitals: {
    lcp: number; // Largest Contentful Paint
    fid: number; // First Input Delay
    cls: number; // Cumulative Layout Shift
  };
  loadTime: number;
  errorRate: number;
}

export const PerformanceMonitor: React.FC = () => {
  const [metrics] = useState<PerformanceMetrics>({
    lighthouse: {
      performance: 95,
      accessibility: 98,
      bestPractices: 92,
      seo: 90
    },
    vitals: {
      lcp: 1.2,
      fid: 8,
      cls: 0.05
    },
    loadTime: 850,
    errorRate: 0.02
  });

  const [realTimeMetrics, setRealTimeMetrics] = useState({
    activeUsers: 0,
    responseTime: 0,
    memoryUsage: 0
  });

  useEffect(() => {
    // Simulate real-time performance monitoring
    const interval = setInterval(() => {
      setRealTimeMetrics({
        activeUsers: Math.floor(Math.random() * 50) + 20,
        responseTime: Math.floor(Math.random() * 100) + 50,
        memoryUsage: Math.floor(Math.random() * 30) + 40
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Lighthouse Scores */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-600" />
            Lighthouse Performance Scores
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className={`text-3xl font-bold ${getScoreColor(metrics.lighthouse.performance)}`}>
                {metrics.lighthouse.performance}
              </div>
              <div className="text-sm text-muted-foreground">Performance</div>
              <Progress value={metrics.lighthouse.performance} className="mt-2" />
            </div>
            
            <div className="text-center">
              <div className={`text-3xl font-bold ${getScoreColor(metrics.lighthouse.accessibility)}`}>
                {metrics.lighthouse.accessibility}
              </div>
              <div className="text-sm text-muted-foreground">Accessibility</div>
              <Progress value={metrics.lighthouse.accessibility} className="mt-2" />
            </div>
            
            <div className="text-center">
              <div className={`text-3xl font-bold ${getScoreColor(metrics.lighthouse.bestPractices)}`}>
                {metrics.lighthouse.bestPractices}
              </div>
              <div className="text-sm text-muted-foreground">Best Practices</div>
              <Progress value={metrics.lighthouse.bestPractices} className="mt-2" />
            </div>
            
            <div className="text-center">
              <div className={`text-3xl font-bold ${getScoreColor(metrics.lighthouse.seo)}`}>
                {metrics.lighthouse.seo}
              </div>
              <div className="text-sm text-muted-foreground">SEO</div>
              <Progress value={metrics.lighthouse.seo} className="mt-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Core Web Vitals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-600" />
            Core Web Vitals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{metrics.vitals.lcp}s</div>
              <div className="text-sm text-green-700">Largest Contentful Paint</div>
              <Badge className="mt-2 bg-green-100 text-green-800">Good</Badge>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{metrics.vitals.fid}ms</div>
              <div className="text-sm text-green-700">First Input Delay</div>
              <Badge className="mt-2 bg-green-100 text-green-800">Good</Badge>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{metrics.vitals.cls}</div>
              <div className="text-sm text-green-700">Cumulative Layout Shift</div>
              <Badge className="mt-2 bg-green-100 text-green-800">Good</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Real-time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Active Users</p>
                <p className="text-2xl font-bold">{realTimeMetrics.activeUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Response Time</p>
                <p className="text-2xl font-bold">{realTimeMetrics.responseTime}ms</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Memory Usage</p>
                <p className="text-2xl font-bold">{realTimeMetrics.memoryUsage}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
