import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUserJourney } from '@/hooks/useUserJourney';
import { useAuth } from '@/hooks/useAuth';
import { 
  TrendingUp, 
  Users, 
  CreditCard, 
  Smartphone, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Target
} from 'lucide-react';

interface OptimizationMetric {
  id: string;
  name: string;
  current: number;
  target: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  category: 'performance' | 'conversion' | 'engagement' | 'retention';
}

interface UserFlowIssue {
  id: string;
  severity: 'high' | 'medium' | 'low';
  category: string;
  description: string;
  impact: string;
  recommendation: string;
  estimatedFix: string;
}

export const UserJourneyOptimization: React.FC = () => {
  const { user } = useAuth();
  const { testUserFlow, getJourneyAnalytics, journeyMetrics } = useUserJourney();
  const [optimizationData, setOptimizationData] = useState<OptimizationMetric[]>([]);
  const [identifiedIssues, setIdentifiedIssues] = useState<UserFlowIssue[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [testResults, setTestResults] = useState<any[]>([]);

  // Initialize optimization metrics
  useEffect(() => {
    const metrics: OptimizationMetric[] = [
      {
        id: 'signup-conversion',
        name: 'Signup Conversion Rate',
        current: 15.2,
        target: 25.0,
        unit: '%',
        trend: 'up',
        category: 'conversion'
      },
      {
        id: 'payment-conversion',
        name: 'Free to Premium Conversion',
        current: 8.5,
        target: 15.0,
        unit: '%',
        trend: 'down',
        category: 'conversion'
      },
      {
        id: 'onboarding-completion',
        name: 'Onboarding Completion Rate',
        current: 72.3,
        target: 85.0,
        unit: '%',
        trend: 'stable',
        category: 'engagement'
      },
      {
        id: 'daily-retention',
        name: 'Day 1 Retention Rate',
        current: 45.1,
        target: 60.0,
        unit: '%',
        trend: 'up',
        category: 'retention'
      },
      {
        id: 'page-load-time',
        name: 'Average Page Load Time',
        current: 2.8,
        target: 2.0,
        unit: 's',
        trend: 'down',
        category: 'performance'
      },
      {
        id: 'mobile-usability',
        name: 'Mobile Usability Score',
        current: 78,
        target: 90,
        unit: '/100',
        trend: 'up',
        category: 'performance'
      }
    ];
    setOptimizationData(metrics);
  }, []);

  // Analyze user journey issues
  const analyzeUserJourneys = async () => {
    setIsAnalyzing(true);
    
    try {
      // Run comprehensive user flow tests
      const flowTests = await Promise.all([
        testUserFlow('signup'),
        testUserFlow('payment'),
        testUserFlow('content-access'),
        testUserFlow('mobile')
      ]);
      
      setTestResults(flowTests);
      
      // Analyze issues based on test results
      const issues: UserFlowIssue[] = [];
      
      flowTests.forEach(test => {
        if (!test.success) {
          test.errors.forEach((error: string) => {
            issues.push({
              id: `${test.flowType}-${Date.now()}`,
              severity: 'high',
              category: test.flowType,
              description: error,
              impact: getImpactForError(error),
              recommendation: getRecommendationForError(error),
              estimatedFix: getEstimatedFixTime(error)
            });
          });
        }
        
        // Check for performance issues
        if (test.duration > 5000) {
          issues.push({
            id: `perf-${test.flowType}-${Date.now()}`,
            severity: 'medium',
            category: 'performance',
            description: `${test.flowType} flow is slow (${test.duration}ms)`,
            impact: 'Increased user drop-off and poor user experience',
            recommendation: 'Optimize API calls and reduce bundle size',
            estimatedFix: '2-3 days'
          });
        }
      });
      
      // Add standard optimization recommendations
      const standardIssues: UserFlowIssue[] = [
        {
          id: 'onboarding-friction',
          severity: 'high',
          category: 'onboarding',
          description: 'Onboarding has too many steps causing drop-off',
          impact: 'Low completion rate (72.3% vs target 85%)',
          recommendation: 'Reduce onboarding to 3 core steps, make others optional',
          estimatedFix: '1-2 days'
        },
        {
          id: 'payment-friction',
          severity: 'high',
          category: 'payment',
          description: 'Payment flow has multiple redirects and unclear pricing',
          impact: 'Low conversion rate (8.5% vs target 15%)',
          recommendation: 'Implement in-app checkout modal with clear value proposition',
          estimatedFix: '3-5 days'
        },
        {
          id: 'mobile-touch-targets',
          severity: 'medium',
          category: 'mobile',
          description: 'Some buttons are too small for touch interaction',
          impact: 'Poor mobile user experience and accessibility issues',
          recommendation: 'Ensure all touch targets are minimum 44px x 44px',
          estimatedFix: '1 day'
        },
        {
          id: 'loading-states',
          severity: 'medium',
          category: 'performance',
          description: 'Missing loading states cause perceived slowness',
          impact: 'Users perceive app as slow even when performance is acceptable',
          recommendation: 'Add skeleton loaders and progress indicators',
          estimatedFix: '2-3 days'
        }
      ];
      
      setIdentifiedIssues([...issues, ...standardIssues]);
      
    } catch (error) {
      console.error('Failed to analyze user journeys:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getImpactForError = (error: string): string => {
    if (error.includes('email') || error.includes('signup')) {
      return 'Blocks new user acquisition and growth';
    }
    if (error.includes('payment') || error.includes('checkout')) {
      return 'Directly impacts revenue and conversion rates';
    }
    if (error.includes('content') || error.includes('access')) {
      return 'Reduces user engagement and satisfaction';
    }
    return 'Degrades overall user experience';
  };

  const getRecommendationForError = (error: string): string => {
    if (error.includes('email')) {
      return 'Implement proper email validation and error handling';
    }
    if (error.includes('checkout') || error.includes('payment')) {
      return 'Review Stripe integration and error handling';
    }
    if (error.includes('content')) {
      return 'Ensure content is properly categorized and accessible';
    }
    return 'Review and fix the underlying technical issue';
  };

  const getEstimatedFixTime = (error: string): string => {
    if (error.includes('integration') || error.includes('payment')) {
      return '3-5 days';
    }
    if (error.includes('validation') || error.includes('UI')) {
      return '1-2 days';
    }
    return '2-3 days';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />;
      default:
        return <BarChart3 className="h-4 w-4 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      default:
        return 'secondary';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'signup':
      case 'onboarding':
        return <Users className="h-4 w-4" />;
      case 'payment':
        return <CreditCard className="h-4 w-4" />;
      case 'mobile':
        return <Smartphone className="h-4 w-4" />;
      case 'performance':
        return <Clock className="h-4 w-4" />;
      default:
        return <Target className="h-4 w-4" />;
    }
  };

  const criticalIssues = identifiedIssues.filter(issue => issue.severity === 'high');
  const mediumIssues = identifiedIssues.filter(issue => issue.severity === 'medium');

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">User Journey Optimization</h1>
        <p className="text-muted-foreground">
          Analyze and optimize critical user flows for maximum conversion and engagement
        </p>
      </div>

      {/* Quick Analysis Button */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Journey Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={analyzeUserJourneys} 
            disabled={isAnalyzing}
            className="w-full"
          >
            {isAnalyzing ? 'Analyzing User Journeys...' : 'Run Complete Journey Analysis'}
          </Button>
        </CardContent>
      </Card>

      <Tabs defaultValue="metrics" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="metrics">Optimization Metrics</TabsTrigger>
          <TabsTrigger value="issues">Critical Issues</TabsTrigger>
          <TabsTrigger value="flows">Flow Testing</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        {/* Optimization Metrics */}
        <TabsContent value="metrics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {optimizationData.map((metric) => (
              <Card key={metric.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center justify-between">
                    {metric.name}
                    {getTrendIcon(metric.trend)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {metric.current}{metric.unit}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Target: {metric.target}{metric.unit}
                  </div>
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{
                          width: `${Math.min((metric.current / metric.target) * 100, 100)}%`
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Critical Issues */}
        <TabsContent value="issues" className="space-y-6">
          {criticalIssues.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <AlertTriangle className="h-5 w-5" />
                  Critical Issues ({criticalIssues.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {criticalIssues.map((issue) => (
                  <div key={issue.id} className="border border-red-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(issue.category)}
                        <h3 className="font-semibold">{issue.description}</h3>
                      </div>
                      <Badge variant={getSeverityColor(issue.severity)}>
                        {issue.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      <strong>Impact:</strong> {issue.impact}
                    </p>
                    <p className="text-sm text-blue-600 mb-2">
                      <strong>Recommendation:</strong> {issue.recommendation}
                    </p>
                    <p className="text-xs text-gray-500">
                      <strong>Estimated fix time:</strong> {issue.estimatedFix}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {mediumIssues.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-600">
                  <Clock className="h-5 w-5" />
                  Medium Priority Issues ({mediumIssues.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mediumIssues.map((issue) => (
                  <div key={issue.id} className="border border-orange-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(issue.category)}
                        <h3 className="font-medium">{issue.description}</h3>
                      </div>
                      <Badge variant={getSeverityColor(issue.severity)}>
                        {issue.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      <strong>Impact:</strong> {issue.impact}
                    </p>
                    <p className="text-sm text-blue-600">
                      <strong>Recommendation:</strong> {issue.recommendation}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Flow Testing Results */}
        <TabsContent value="flows" className="space-y-6">
          {testResults.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {testResults.map((result, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {result.success ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                      )}
                      {result.flowType} Flow Test
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Status:</span>
                        <Badge variant={result.success ? 'default' : 'destructive'}>
                          {result.success ? 'Passed' : 'Failed'}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Duration:</span>
                        <span>{result.duration}ms</span>
                      </div>
                      {result.errors.length > 0 && (
                        <div>
                          <span className="font-medium text-red-600">Errors:</span>
                          <ul className="text-sm text-red-600 ml-4 list-disc">
                            {result.errors.map((error: string, i: number) => (
                              <li key={i}>{error}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Optimization Recommendations */}
        <TabsContent value="recommendations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Priority Optimization Roadmap</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-red-600 mb-3">🔥 Week 1: Critical Fixes</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• Fix payment flow integration issues</li>
                    <li>• Simplify onboarding to 3 core steps</li>
                    <li>• Implement proper error handling for auth flows</li>
                    <li>• Add loading states for all async operations</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-orange-600 mb-3">⚡ Week 2-3: Performance & UX</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• Optimize bundle size and page load times</li>
                    <li>• Improve mobile touch targets and responsiveness</li>
                    <li>• Add comprehensive progress indicators</li>
                    <li>• Implement better error recovery flows</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-green-600 mb-3">📈 Week 4+: Conversion Optimization</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• A/B test different onboarding flows</li>
                    <li>• Implement smart paywall positioning</li>
                    <li>• Add social proof and testimonials</li>
                    <li>• Optimize pricing page and value proposition</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};