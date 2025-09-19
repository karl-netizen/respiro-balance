import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Shield, Zap, Eye, Gauge, FileText } from 'lucide-react';

export const TestingFrameworkSummary: React.FC = () => {
  const testingSuites = [
    {
      name: 'Unit Tests',
      icon: <Gauge className="h-5 w-5" />,
      description: 'Type safety, branded types, input sanitization, permission systems',
      features: [
        'Branded type validation (UserId, Email)',
        'Permission system testing',
        'Input sanitization & XSS prevention',
        'Performance validation',
        'Mock data factories'
      ],
      status: 'implemented',
      testCount: 45
    },
    {
      name: 'Component Security Tests',
      icon: <Shield className="h-5 w-5" />,
      description: 'XSS prevention, form validation, secure component behavior',
      features: [
        'XSS injection prevention',
        'Form validation security',
        'Button accessibility & security',
        'Modal focus management',
        'Input sanitization validation'
      ],
      status: 'implemented',
      testCount: 32
    },
    {
      name: 'Integration Tests',
      icon: <Zap className="h-5 w-5" />,
      description: 'Authentication flows, CSRF protection, session management',
      features: [
        'Complete authentication flow',
        'CSRF token validation',
        'Permission-based access control',
        'Session management',
        'Error handling & recovery'
      ],
      status: 'implemented',
      testCount: 28
    },
    {
      name: 'Performance Tests',
      icon: <Gauge className="h-5 w-5" />,
      description: 'Rendering performance, memory management, network optimization',
      features: [
        'Component rendering under load',
        'Memory leak prevention',
        'Network request batching',
        'Bundle size optimization',
        'Animation performance (60fps)'
      ],
      status: 'implemented',
      testCount: 24
    },
    {
      name: 'E2E Security Tests',
      icon: <Eye className="h-5 w-5" />,
      description: 'Critical user paths, browser-level security validation',
      features: [
        'Login security flows',
        'Rate limiting validation',
        'XSS protection in browser',
        'Mobile authentication',
        'Network resilience'
      ],
      status: 'configured',
      testCount: 18
    },
    {
      name: 'Accessibility Tests',
      icon: <Eye className="h-5 w-5" />,
      description: 'WCAG compliance, keyboard navigation, screen reader support',
      features: [
        'WCAG color contrast',
        'Keyboard navigation',
        'Screen reader announcements',
        'Focus management',
        'Form accessibility'
      ],
      status: 'configured',
      testCount: 24
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'implemented':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'configured':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const totalTests = testingSuites.reduce((sum, suite) => sum + suite.testCount, 0);
  const implementedTests = testingSuites
    .filter(suite => suite.status === 'implemented')
    .reduce((sum, suite) => sum + suite.testCount, 0);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          🧪 Testing Framework Overview
        </h1>
        <p className="text-muted-foreground text-lg">
          Comprehensive security, performance, and accessibility testing suite
        </p>
      </div>

      {/* Stats */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-3xl font-bold text-green-600">{implementedTests}</div>
            <div className="text-sm text-muted-foreground">Implemented Tests</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-600">{totalTests - implementedTests}</div>
            <div className="text-sm text-muted-foreground">Configured Tests</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary">{totalTests}</div>
            <div className="text-sm text-muted-foreground">Total Test Cases</div>
          </div>
        </div>
      </Card>

      {/* Test Suite Cards */}
      <div className="grid gap-6">
        {testingSuites.map((suite) => (
          <Card key={suite.name} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                {suite.icon}
                <div>
                  <h3 className="text-xl font-semibold">{suite.name}</h3>
                  <p className="text-muted-foreground text-sm">{suite.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge className={getStatusColor(suite.status)}>
                  {suite.status === 'implemented' ? (
                    <CheckCircle className="h-3 w-3 mr-1" />
                  ) : (
                    <FileText className="h-3 w-3 mr-1" />
                  )}
                  {suite.status}
                </Badge>
                <Badge variant="outline">
                  {suite.testCount} tests
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-sm">Test Coverage:</h4>
              <ul className="grid md:grid-cols-2 gap-1 text-sm text-muted-foreground">
                {suite.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="h-1 w-1 bg-primary rounded-full" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        ))}
      </div>

      {/* Implementation Guide */}
      <Card className="p-6">
        <h3 className="text-xl font-bold mb-4">🚀 Quick Start Guide</h3>
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-primary mb-2">Running Tests</h4>
              <div className="space-y-2 text-sm font-mono bg-muted p-3 rounded">
                <div># Run all unit tests</div>
                <div>npm run test</div>
                <div># Run with coverage</div>
                <div>npm run test:coverage</div>
                <div># Watch mode</div>
                <div>npm run test:watch</div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-primary mb-2">E2E Testing</h4>
              <div className="space-y-2 text-sm font-mono bg-muted p-3 rounded">
                <div># Install Playwright</div>
                <div>npx playwright install</div>
                <div># Run E2E tests</div>
                <div>npm run test:e2e</div>
                <div># Debug mode</div>
                <div>npm run test:e2e:debug</div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
            <h4 className="font-semibold text-primary mb-2">✅ Security Testing Highlights</h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <ul className="space-y-1">
                <li>• XSS injection prevention</li>
                <li>• CSRF token validation</li>
                <li>• Authentication flow security</li>
                <li>• Rate limiting protection</li>
              </ul>
              <ul className="space-y-1">
                <li>• Input sanitization validation</li>
                <li>• Permission-based access control</li>
                <li>• Session management security</li>
                <li>• Network request protection</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>

      {/* Demo Actions */}
      <div className="flex justify-center">
        <Button 
          onClick={() => window.location.href = '/testing-demo'}
          className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
        >
          🧪 View Interactive Testing Demo
        </Button>
      </div>
    </div>
  );
};