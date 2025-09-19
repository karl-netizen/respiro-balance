import React, { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePerformanceOptimization } from '@/hooks/usePerformanceOptimization';
import { PerformanceOptimizedApp } from './PerformanceOptimizedApp';
import { 
  ExpensiveComponent, 
  VirtualizedUserList,
  LazyChart,
  LazyAnalytics
} from '@/lib/performance/react-optimizations';
import { useWebSocket } from '@/lib/performance/websocket-client';
import { tokenManager, securityBatcher, permissionChecker } from '@/lib/performance/security-optimizations';

// ===================================================================
// PERFORMANCE OPTIMIZATION DEMO
// ===================================================================

const PerformanceDemo: React.FC = () => {
  const {
    isLowPerformanceDevice,
    shouldLazyLoad,
    getOptimizedImageSize,
    getChartOptimizations,
    getLoadingStrategy,
    deviceType
  } = usePerformanceOptimization();

  // Demo data
  const [demoData, setDemoData] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  // Generate demo users
  const demoUsers = React.useMemo(() => 
    Array.from({ length: 1000 }, (_, i) => ({
      id: `user-${i}`,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      avatar: i % 3 === 0 ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}` : undefined
    }))
  , []);

  // WebSocket demo
  const wsConfig = React.useMemo(() => ({
    url: 'wss://echo.websocket.org',
    maxReconnectAttempts: 3,
    reconnectDelay: 1000
  }), []);

  const { connectionState, send: sendWsMessage } = useWebSocket(wsConfig);

  // Performance testing functions
  const generateHeavyData = React.useCallback(() => {
    setIsLoading(true);
    
    // Simulate heavy computation
    setTimeout(() => {
      const data = Array.from({ length: 10000 }, (_, i) => ({
        id: i,
        value: Math.random() * 1000,
        computed: Math.sin(i) * Math.cos(i) * Math.random()
      }));
      
      setDemoData(data);
      setIsLoading(false);
    }, 100);
  }, []);

  const testSecurityOperations = React.useCallback(async () => {
    try {
      // Test token management
      const token = await tokenManager.getToken('demo-key');
      console.log('Token retrieved:', token ? 'Success' : 'Failed');

      // Test batch operations
      const batchResults = await Promise.all([
        securityBatcher.batchSecurityOperation('check-permission', { permission: 'read:users' }),
        securityBatcher.batchSecurityOperation('validate-session', { sessionId: 'demo' }),
        securityBatcher.batchSecurityOperation('log-action', { action: 'demo-test' })
      ]);
      
      console.log('Batch operations completed:', batchResults.length);

      // Test permission checking
      const hasPermission = permissionChecker.hasPermission(['read:users', 'write:posts'], 'read:users');
      console.log('Permission check result:', hasPermission);
      
    } catch (error) {
      console.error('Security operation test failed:', error);
    }
  }, []);

  const chartOptimizations = getChartOptimizations();
  const loadingStrategy = getLoadingStrategy();
  const optimizedImageSize = getOptimizedImageSize({ width: 800, height: 600 });

  return (
    <PerformanceOptimizedApp>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Performance Optimization Demo</h1>
          <div className="flex gap-2">
            <Badge variant={isLowPerformanceDevice ? 'destructive' : 'default'}>
              {deviceType} Device
            </Badge>
            <Badge variant={shouldLazyLoad ? 'secondary' : 'default'}>
              Lazy Loading: {shouldLazyLoad ? 'ON' : 'OFF'}
            </Badge>
          </div>
        </div>

        {/* Performance Status */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="text-sm font-medium">Device Performance</div>
                <div className={`text-lg font-bold ${isLowPerformanceDevice ? 'text-destructive' : 'text-success'}`}>
                  {isLowPerformanceDevice ? 'Low Performance' : 'High Performance'}
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm font-medium">Loading Strategy</div>
                <div className="text-lg font-bold capitalize">{loadingStrategy}</div>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm font-medium">WebSocket Status</div>
                <div className={`text-lg font-bold ${
                  connectionState.status === 'connected' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {connectionState.status}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Demo Tabs */}
        <Tabs defaultValue="components" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="components">Components</TabsTrigger>
            <TabsTrigger value="virtualization">Lists</TabsTrigger>
            <TabsTrigger value="lazy-loading">Lazy Loading</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          {/* Optimized Components */}
          <TabsContent value="components">
            <Card>
              <CardHeader>
                <CardTitle>Optimized Components Demo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <Button onClick={generateHeavyData} disabled={isLoading}>
                    {isLoading ? 'Generating...' : 'Generate Heavy Data'}
                  </Button>
                  
                  <Button onClick={testSecurityOperations}>
                    Test Security Performance
                  </Button>
                </div>

                {demoData.length > 0 && (
                  <div className="space-y-4">
                    <div className="text-sm text-muted-foreground">
                      Generated {demoData.length} items - Component will be memoized for performance
                    </div>
                    
                    <ExpensiveComponent 
                      data={demoData.slice(0, 100)} // Limit for demo
                      onAction={(id) => console.log('Action:', id)}
                    />
                  </div>
                )}

                <div className="border rounded-lg p-4 bg-muted/50">
                  <h4 className="font-medium mb-2">Optimization Settings</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>Image Size: {optimizedImageSize.width}x{optimizedImageSize.height}</div>
                    <div>Chart Animation: {chartOptimizations.animationDuration}ms</div>
                    <div>Chart Data Points: {chartOptimizations.maxDataPoints}</div>
                    <div>Reduced Motion: {chartOptimizations.reducedComplexity ? 'Yes' : 'No'}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Virtualized Lists */}
          <TabsContent value="virtualization">
            <Card>
              <CardHeader>
                <CardTitle>Virtualized User List ({demoUsers.length} users)</CardTitle>
              </CardHeader>
              <CardContent>
                <VirtualizedUserList 
                  users={demoUsers}
                  onUserSelect={(user) => console.log('Selected user:', user)}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Lazy Loading */}
          <TabsContent value="lazy-loading">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Lazy Chart Component</CardTitle>
                </CardHeader>
                <CardContent>
                  <Suspense fallback={<div className="h-32 bg-muted animate-pulse rounded" />}>
                    <LazyChart />
                  </Suspense>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Lazy Analytics Component</CardTitle>
                </CardHeader>
                <CardContent>
                  <Suspense fallback={<div className="h-32 bg-muted animate-pulse rounded" />}>
                    <LazyAnalytics />
                  </Suspense>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Security Performance */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Layer Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border rounded-lg p-3">
                    <div className="text-sm font-medium">Token Manager</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Cached tokens with automatic refresh
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-3">
                    <div className="text-sm font-medium">Request Batching</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Batch multiple security operations
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-3">
                    <div className="text-sm font-medium">Permission Cache</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Optimized permission checking
                    </div>
                  </div>
                </div>

                <Button onClick={testSecurityOperations}>
                  Run Security Performance Test
                </Button>

                <div className="text-xs text-muted-foreground">
                  Check the console for performance test results
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PerformanceOptimizedApp>
  );
};

export default PerformanceDemo;