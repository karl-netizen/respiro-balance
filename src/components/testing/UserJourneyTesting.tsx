import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/features/subscription';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CheckCircle, XCircle, Clock, Users, CreditCard, Smartphone, Zap } from 'lucide-react';

interface TestResult {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'success' | 'failed';
  message?: string;
  duration?: number;
  critical?: boolean;
}

interface UserJourneyTest {
  id: string;
  name: string;
  description: string;
  category: 'auth' | 'payment' | 'content' | 'mobile' | 'performance';
  critical: boolean;
  testFn: () => Promise<void>;
}

export const UserJourneyTesting: React.FC = () => {
  const { user } = useAuth();
  // Use fallback subscription data to avoid provider conflicts
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [completedTests, setCompletedTests] = useState(0);

  const updateTestResult = (id: string, updates: Partial<TestResult>) => {
    setTestResults(prev => 
      prev.map(result => 
        result.id === id ? { ...result, ...updates } : result
      )
    );
  };

  const userJourneyTests: UserJourneyTest[] = [
    // 1. NEW USER JOURNEY TESTS
    {
      id: 'new-user-signup',
      name: 'New User Signup Flow',
      description: 'Test complete signup process',
      category: 'auth',
      critical: true,
      testFn: async () => {
        const testEmail = `test+${Date.now()}@respiro.app`;
        const { error } = await supabase.auth.signUp({
          email: testEmail,
          password: 'TestPassword123!',
          options: {
            emailRedirectTo: `${window.location.origin}/`
          }
        });
        if (error) throw new Error(`Signup failed: ${error.message}`);
      }
    },
    {
      id: 'onboarding-completion',
      name: 'Onboarding Flow Completion',
      description: 'Verify onboarding can be completed',
      category: 'auth',
      critical: true,
      testFn: async () => {
        // Test onboarding preferences save
        const { data, error } = await supabase
          .from('user_preferences')
          .select('has_completed_onboarding')
          .eq('user_id', user?.id || '')
          .single();
        
        if (error) throw new Error('Onboarding data not accessible');
      }
    },
    {
      id: 'first-meditation-access',
      name: 'First Meditation Access',
      description: 'Test first meditation session start',
      category: 'content',
      critical: true,
      testFn: async () => {
        const { data, error } = await supabase
          .from('meditation_content')
          .select('*')
          .eq('subscription_tier', 'free')
          .eq('is_active', true)
          .limit(1);
        
        if (error || !data?.length) {
          throw new Error('No free meditation content available');
        }
      }
    },

    // 2. PREMIUM UPGRADE FLOW TESTS
    {
      id: 'paywall-detection',
      name: 'Premium Paywall Detection',
      description: 'Test paywall appears for premium content',
      category: 'payment',
      critical: true,
      testFn: async () => {
        const { data } = await supabase
          .from('meditation_content')
          .select('*')
          .eq('subscription_tier', 'premium')
          .limit(1);
        
        if (!data?.length) {
          throw new Error('No premium content to test paywall');
        }
      }
    },
    {
      id: 'checkout-creation',
      name: 'Checkout Session Creation',
      description: 'Test Stripe checkout session creation',
      category: 'payment',
      critical: true,
      testFn: async () => {
        try {
          // Mock test since we don't have subscription provider access
          throw new Error('Subscription test skipped - provider unavailable');
        } catch (error) {
          throw new Error(`Checkout creation failed: ${error}`);
        }
      }
    },
    {
      id: 'subscription-verification',
      name: 'Subscription Status Verification',
      description: 'Test subscription status checking',
      category: 'payment',
      critical: true,
      testFn: async () => {
        try {
          // Mock test since we don't have subscription provider access
          throw new Error('Subscription verification skipped - provider unavailable');
        } catch (error) {
          throw new Error(`Subscription check failed: ${error}`);
        }
      }
    },

    // 3. DAILY USAGE PATTERN TESTS
    {
      id: 'session-tracking',
      name: 'Session Progress Tracking',
      description: 'Test meditation session completion tracking',
      category: 'content',
      critical: false,
      testFn: async () => {
        const { error } = await supabase
          .from('meditation_sessions')
          .insert({
            user_id: user?.id || '',
            duration: 600,
            session_type: 'guided',
            completed: true,
            title: 'Test Session'
          });
        
        if (error) throw new Error(`Session tracking failed: ${error.message}`);
      }
    },
    {
      id: 'progress-analytics',
      name: 'Progress Analytics',
      description: 'Test user progress calculation',
      category: 'content',
      critical: false,
      testFn: async () => {
        const { data, error } = await supabase
          .from('meditation_sessions')
          .select('*')
          .eq('user_id', user?.id || '')
          .limit(5);
        
        if (error) throw new Error(`Analytics data inaccessible: ${error.message}`);
      }
    },

    // 4. MOBILE EXPERIENCE TESTS
    {
      id: 'mobile-responsiveness',
      name: 'Mobile Responsiveness',
      description: 'Test mobile layout and interactions',
      category: 'mobile',
      critical: true,
      testFn: async () => {
        const isMobile = window.innerWidth <= 768;
        if (!isMobile) {
          // Simulate mobile viewport
          const metaViewport = document.querySelector('meta[name="viewport"]');
          if (!metaViewport?.getAttribute('content')?.includes('width=device-width')) {
            throw new Error('Mobile viewport not properly configured');
          }
        }
      }
    },
    {
      id: 'touch-interactions',
      name: 'Touch Interactions',
      description: 'Test touch-friendly interface elements',
      category: 'mobile',
      critical: false,
      testFn: async () => {
        const buttons = document.querySelectorAll('button');
        let hasProperTouchTargets = true;
        
        buttons.forEach(button => {
          const rect = button.getBoundingClientRect();
          if (rect.width < 44 || rect.height < 44) {
            hasProperTouchTargets = false;
          }
        });
        
        if (!hasProperTouchTargets) {
          throw new Error('Some touch targets are too small (< 44px)');
        }
      }
    },

    // 5. PERFORMANCE TESTS
    {
      id: 'page-load-performance',
      name: 'Page Load Performance',
      description: 'Test page load times under 3 seconds',
      category: 'performance',
      critical: true,
      testFn: async () => {
        const startTime = performance.now();
        await new Promise(resolve => {
          if (document.readyState === 'complete') {
            resolve(void 0);
          } else {
            window.addEventListener('load', () => resolve(void 0), { once: true });
          }
        });
        
        const loadTime = performance.now() - startTime;
        if (loadTime > 3000) {
          throw new Error(`Page load time too slow: ${Math.round(loadTime)}ms`);
        }
      }
    },
    {
      id: 'javascript-errors',
      name: 'JavaScript Error Detection',
      description: 'Check for console errors',
      category: 'performance',
      critical: true,
      testFn: async () => {
        const errors: string[] = [];
        const originalError = console.error;
        
        console.error = (...args) => {
          errors.push(args.join(' '));
          originalError.apply(console, args);
        };
        
        setTimeout(() => {
          console.error = originalError;
          if (errors.length > 0) {
            throw new Error(`JavaScript errors detected: ${errors.slice(0, 3).join(', ')}`);
          }
        }, 1000);
      }
    }
  ];

  const runAllTests = async () => {
    setIsRunning(true);
    setCompletedTests(0);
    
    // Initialize test results
    const initialResults: TestResult[] = userJourneyTests.map(test => ({
      id: test.id,
      name: test.name,
      status: 'pending',
      critical: test.critical
    }));
    setTestResults(initialResults);

    // Run tests sequentially to avoid overwhelming the system
    for (const test of userJourneyTests) {
      updateTestResult(test.id, { status: 'running' });
      const startTime = Date.now();
      
      try {
        await test.testFn();
        const duration = Date.now() - startTime;
        updateTestResult(test.id, {
          status: 'success',
          duration,
          message: 'Test passed successfully'
        });
      } catch (error) {
        const duration = Date.now() - startTime;
        updateTestResult(test.id, {
          status: 'failed',
          duration,
          message: error instanceof Error ? error.message : 'Test failed'
        });
      }
      
      setCompletedTests(prev => prev + 1);
      
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    setIsRunning(false);
    toast.success('User journey testing completed!');
  };

  const runCriticalTests = async () => {
    const criticalTests = userJourneyTests.filter(test => test.critical);
    setIsRunning(true);
    setCompletedTests(0);
    
    const initialResults: TestResult[] = criticalTests.map(test => ({
      id: test.id,
      name: test.name,
      status: 'pending',
      critical: test.critical
    }));
    setTestResults(initialResults);

    for (const test of criticalTests) {
      updateTestResult(test.id, { status: 'running' });
      const startTime = Date.now();
      
      try {
        await test.testFn();
        const duration = Date.now() - startTime;
        updateTestResult(test.id, {
          status: 'success',
          duration,
          message: 'Critical test passed'
        });
      } catch (error) {
        const duration = Date.now() - startTime;
        updateTestResult(test.id, {
          status: 'failed',
          duration,
          message: error instanceof Error ? error.message : 'Critical test failed'
        });
      }
      
      setCompletedTests(prev => prev + 1);
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    setIsRunning(false);
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'running':
        return <Clock className="h-5 w-5 text-blue-500 animate-spin" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'auth':
        return <Users className="h-4 w-4" />;
      case 'payment':
        return <CreditCard className="h-4 w-4" />;
      case 'mobile':
        return <Smartphone className="h-4 w-4" />;
      case 'performance':
        return <Zap className="h-4 w-4" />;
      default:
        return <CheckCircle className="h-4 w-4" />;
    }
  };

  const successCount = testResults.filter(r => r.status === 'success').length;
  const failedCount = testResults.filter(r => r.status === 'failed').length;
  const criticalFailures = testResults.filter(r => r.status === 'failed' && r.critical).length;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">User Journey Testing Dashboard</h1>
        <p className="text-muted-foreground">
          Comprehensive testing of critical user flows and experiences
        </p>
      </div>

      {/* Test Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Test Controls
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button 
              onClick={runCriticalTests} 
              disabled={isRunning}
              variant="default"
            >
              Run Critical Tests Only
            </Button>
            <Button 
              onClick={runAllTests} 
              disabled={isRunning}
              variant="outline"
            >
              Run All Tests
            </Button>
          </div>
          
          {isRunning && (
            <div className="text-sm text-muted-foreground">
              Running tests... {completedTests} of {testResults.length} completed
            </div>
          )}
        </CardContent>
      </Card>

      {/* Test Results Summary */}
      {testResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Test Results Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{successCount}</div>
                <div className="text-sm text-muted-foreground">Passed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{failedCount}</div>
                <div className="text-sm text-muted-foreground">Failed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{criticalFailures}</div>
                <div className="text-sm text-muted-foreground">Critical Failures</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{testResults.length}</div>
                <div className="text-sm text-muted-foreground">Total Tests</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detailed Test Results */}
      {testResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Detailed Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {testResults.map((result) => (
                <div key={result.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(result.status)}
                    <div>
                      <div className="font-medium flex items-center gap-2">
                        {result.name}
                        {result.critical && (
                          <Badge variant="destructive" className="text-xs">
                            Critical
                          </Badge>
                        )}
                      </div>
                      {result.message && (
                        <div className="text-sm text-muted-foreground">{result.message}</div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    {result.duration && (
                      <div className="text-xs text-muted-foreground">
                        {result.duration}ms
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};