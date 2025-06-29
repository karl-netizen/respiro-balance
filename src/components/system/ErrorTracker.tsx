
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Bug, Zap, RefreshCw } from 'lucide-react';

interface ErrorLog {
  id: string;
  message: string;
  stack?: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high' | 'critical';
  component?: string;
  userId?: string;
  resolved: boolean;
}

export const ErrorTracker: React.FC = () => {
  const [errors, setErrors] = useState<ErrorLog[]>([]);
  const [filter, setFilter] = useState<'all' | 'unresolved'>('unresolved');

  useEffect(() => {
    // Set up global error tracking
    const handleError = (event: ErrorEvent) => {
      const newError: ErrorLog = {
        id: Date.now().toString(),
        message: event.message,
        stack: event.error?.stack,
        timestamp: new Date(),
        severity: 'medium',
        component: 'Global',
        resolved: false,
      };
      
      setErrors(prev => [newError, ...prev.slice(0, 49)]); // Keep last 50 errors
      
      // Log to console for development
      console.error('Tracked Error:', newError);
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const newError: ErrorLog = {
        id: Date.now().toString(),
        message: `Unhandled Promise Rejection: ${event.reason}`,
        timestamp: new Date(),
        severity: 'high',
        component: 'Promise',
        resolved: false,
      };
      
      setErrors(prev => [newError, ...prev.slice(0, 49)]);
      console.error('Tracked Promise Rejection:', newError);
    };

    // Set up React Error Boundary simulation
    const handleReactError = (error: Error, errorInfo: any) => {
      const newError: ErrorLog = {
        id: Date.now().toString(),
        message: error.message,
        stack: error.stack,
        timestamp: new Date(),
        severity: 'critical',
        component: errorInfo.componentStack?.split('\n')[1]?.trim(),
        resolved: false,
      };
      
      setErrors(prev => [newError, ...prev.slice(0, 49)]);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    // Simulate some sample errors for demonstration
    const sampleErrors: ErrorLog[] = [
      {
        id: '1',
        message: 'Failed to load meditation session',
        timestamp: new Date(Date.now() - 3600000),
        severity: 'medium',
        component: 'MeditationPlayer',
        resolved: false,
      },
      {
        id: '2',
        message: 'Network timeout during sync',
        timestamp: new Date(Date.now() - 7200000),
        severity: 'low',
        component: 'SyncManager',
        resolved: true,
      },
      {
        id: '3',
        message: 'Authentication token expired',
        timestamp: new Date(Date.now() - 1800000),
        severity: 'high',
        component: 'AuthProvider',
        resolved: false,
      },
    ];
    
    setErrors(sampleErrors);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  const getSeverityColor = (severity: ErrorLog['severity']) => {
    switch (severity) {
      case 'low': return 'bg-blue-100 text-blue-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityIcon = (severity: ErrorLog['severity']) => {
    switch (severity) {
      case 'critical': return <Zap className="h-4 w-4" />;
      case 'high': return <AlertTriangle className="h-4 w-4" />;
      default: return <Bug className="h-4 w-4" />;
    }
  };

  const markAsResolved = (id: string) => {
    setErrors(prev => prev.map(error => 
      error.id === id ? { ...error, resolved: true } : error
    ));
  };

  const clearResolvedErrors = () => {
    setErrors(prev => prev.filter(error => !error.resolved));
  };

  const filteredErrors = errors.filter(error => 
    filter === 'all' || !error.resolved
  );

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bug className="h-6 w-6 text-red-600" />
            <div>
              <CardTitle>Error Tracking</CardTitle>
              <CardDescription>
                Monitor and manage application errors
              </CardDescription>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant={filter === 'all' ? 'default' : 'outline'}
              onClick={() => setFilter('all')}
            >
              All ({errors.length})
            </Button>
            <Button
              size="sm"
              variant={filter === 'unresolved' ? 'default' : 'outline'}
              onClick={() => setFilter('unresolved')}
            >
              Unresolved ({errors.filter(e => !e.resolved).length})
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={clearResolvedErrors}
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Clear Resolved
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {filteredErrors.map((error) => (
            <Card key={error.id} className={`p-4 ${error.resolved ? 'opacity-60' : ''}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    {getSeverityIcon(error.severity)}
                    <Badge className={getSeverityColor(error.severity)}>
                      {error.severity.toUpperCase()}
                    </Badge>
                    {error.component && (
                      <Badge variant="outline">{error.component}</Badge>
                    )}
                    {error.resolved && (
                      <Badge className="bg-green-100 text-green-800">Resolved</Badge>
                    )}
                  </div>
                  
                  <h4 className="font-medium mb-1">{error.message}</h4>
                  <p className="text-sm text-gray-500 mb-2">
                    {error.timestamp.toLocaleString()}
                  </p>
                  
                  {error.stack && (
                    <details className="mt-2">
                      <summary className="text-sm text-gray-600 cursor-pointer">
                        View Stack Trace
                      </summary>
                      <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-x-auto">
                        {error.stack}
                      </pre>
                    </details>
                  )}
                </div>
                
                {!error.resolved && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => markAsResolved(error.id)}
                  >
                    Mark Resolved
                  </Button>
                )}
              </div>
            </Card>
          ))}
          
          {filteredErrors.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {filter === 'all' ? 'No errors tracked yet' : 'No unresolved errors'}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
