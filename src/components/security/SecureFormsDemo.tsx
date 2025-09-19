import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  Key, 
  AlertTriangle, 
  CheckCircle, 
  Lock,
  FileText,
  Zap,
  Code,
  Eye,
  EyeOff
} from 'lucide-react';
import { 
  CSRFProvider,
  EnhancedSecureLoginForm,
  SecurePasswordChangeForm,
  SecureInput,
  SecureFormValidator,
  generateCSPHeader,
  encodeHtml,
  sanitizeUrl,
  safeJsonParse
} from './SecureFormComponents';
import { ScrollReveal, StaggerContainer, StaggerItem } from '@/components/animations/AnimationSystem';
import { z } from 'zod';

const SecureFormsDemo: React.FC = () => {
  const [activeDemo, setActiveDemo] = useState<'overview' | 'login' | 'password' | 'input' | 'validation'>('overview');
  const [demoInputValue, setDemoInputValue] = useState('');
  const [demoInputValid, setDemoInputValid] = useState(true);
  const [showCSPExample, setShowCSPExample] = useState(false);

  const securityFeatures = [
    {
      icon: <Shield className="h-8 w-8" />,
      title: "XSS Protection",
      description: "Multi-layer XSS prevention with input sanitization",
      details: ["HTML encoding", "Script tag detection", "Event handler blocking", "URL sanitization"]
    },
    {
      icon: <Key className="h-8 w-8" />,
      title: "CSRF Protection", 
      description: "Cross-site request forgery prevention",
      details: ["Token generation", "Request validation", "Same-origin checks", "Automatic refresh"]
    },
    {
      icon: <Lock className="h-8 w-8" />,
      title: "Secure Validation",
      description: "Type-safe form validation with Zod schemas",
      details: ["Runtime validation", "Input sanitization", "Error handling", "Type safety"]
    },
    {
      icon: <FileText className="h-8 w-8" />,
      title: "Content Security Policy",
      description: "Browser-level security with CSP headers",
      details: ["Script source control", "Style restrictions", "Frame protection", "Base URI limits"]
    }
  ];

  const xssExamples = [
    {
      name: "Script Injection",
      malicious: `<script>alert('XSS')</script>`,
      sanitized: `&lt;script&gt;alert('XSS')&lt;/script&gt;`,
      status: "blocked"
    },
    {
      name: "Event Handler",
      malicious: `<img onerror="alert('XSS')" src="x">`,
      sanitized: `<img src="x">`,
      status: "blocked"
    },
    {
      name: "JavaScript URL", 
      malicious: `javascript:alert('XSS')`,
      sanitized: ``,
      status: "blocked"
    },
    {
      name: "Safe Content",
      malicious: `Hello <b>World</b>!`,
      sanitized: `Hello World!`,
      status: "safe"
    }
  ];

  // Demo validation schema
  const demoSchema = z.object({
    text: z.string()
      .min(3, 'Minimum 3 characters')
      .max(100, 'Maximum 100 characters')
      .refine(text => !/<script/i.test(text), 'Script tags not allowed')
  });

  const handleDemoInputChange = (value: string, isValid: boolean) => {
    setDemoInputValue(value);
    setDemoInputValid(isValid);
  };

  const demoCSPHeader = generateCSPHeader();

  return (
    <CSRFProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <ScrollReveal direction="up" delay={0.1}>
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Shield className="h-12 w-12 text-primary" />
                <h1 className="text-4xl font-bold">Secure Form Components</h1>
              </div>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Advanced form security with XSS protection, CSRF validation, and comprehensive 
                input sanitization for enterprise applications.
              </p>
              <div className="flex items-center justify-center gap-2">
                <Badge variant="outline">XSS Prevention</Badge>
                <Badge variant="outline">CSRF Protection</Badge>
                <Badge variant="outline">Input Validation</Badge>
                <Badge variant="outline">Type Safety</Badge>
              </div>
            </div>
          </ScrollReveal>

          {/* Demo Navigation */}
          <ScrollReveal direction="up" delay={0.2}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Interactive Security Demos
                </CardTitle>
                <CardDescription>
                  Test the security features with live examples and see how protection works
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeDemo} onValueChange={(value) => setActiveDemo(value as any)}>
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="login">Secure Login</TabsTrigger>
                    <TabsTrigger value="password">Password Change</TabsTrigger>
                    <TabsTrigger value="input">Secure Input</TabsTrigger>
                    <TabsTrigger value="validation">XSS Protection</TabsTrigger>
                  </TabsList>
                  
                  <div className="mt-6">
                    <TabsContent value="overview" className="space-y-6">
                      {/* Features Grid */}
                      <StaggerContainer staggerDelay={0.1}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {securityFeatures.map((feature, index) => (
                            <StaggerItem key={index}>
                              <Card className="h-full hover:shadow-lg transition-shadow">
                                <CardHeader>
                                  <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                      {feature.icon}
                                    </div>
                                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                                  </div>
                                  <CardDescription>{feature.description}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                  <ul className="space-y-2">
                                    {feature.details.map((detail, i) => (
                                      <li key={i} className="flex items-center gap-2 text-sm">
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                        {detail}
                                      </li>
                                    ))}
                                  </ul>
                                </CardContent>
                              </Card>
                            </StaggerItem>
                          ))}
                        </div>
                      </StaggerContainer>

                      {/* CSP Demo */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Content Security Policy Generator
                          </CardTitle>
                          <CardDescription>
                            See how CSP headers protect against code injection attacks
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <Button 
                            onClick={() => setShowCSPExample(!showCSPExample)}
                            variant="outline"
                          >
                            {showCSPExample ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                            {showCSPExample ? 'Hide CSP Header' : 'Show Generated CSP Header'}
                          </Button>
                          
                          {showCSPExample && (
                            <div className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto">
                              <pre className="text-sm">
                                <code>{demoCSPHeader}</code>
                              </pre>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="login">
                      <div className="flex justify-center">
                        <EnhancedSecureLoginForm 
                          allowRememberMe={true}
                          enableTwoFactor={true}
                          onSuccess={() => console.log('Login successful')}
                          onError={(error) => console.log('Login error:', error)}
                        />
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="password">
                      <div className="flex justify-center">
                        <SecurePasswordChangeForm 
                          onSuccess={() => console.log('Password changed')}
                          onCancel={() => console.log('Password change cancelled')}
                        />
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="input" className="space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Secure Input Component</CardTitle>
                          <CardDescription>
                            Try entering different types of content to see security validation in action
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Test Input (with XSS protection)</label>
                            <SecureInput
                              onSecureChange={handleDemoInputChange}
                              validation={demoSchema}
                              sanitize={true}
                              maxLength={100}
                              securityLevel="maximum"
                              placeholder="Try entering: <script>alert('test')</script>"
                            />
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium mb-2">Current Value:</p>
                              <code className="bg-muted p-2 rounded text-xs block">
                                {demoInputValue || 'No input yet'}
                              </code>
                            </div>
                            <div>
                              <p className="text-sm font-medium mb-2">Validation Status:</p>
                              <Badge variant={demoInputValid ? 'default' : 'destructive'}>
                                {demoInputValid ? 'Valid' : 'Invalid'}
                              </Badge>
                            </div>
                          </div>
                          
                          <Alert>
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>
                              Try entering malicious content like script tags, event handlers, or javascript URLs. 
                              The secure input component will automatically detect and block dangerous content.
                            </AlertDescription>
                          </Alert>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="validation" className="space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Code className="h-5 w-5" />
                            XSS Protection Examples
                          </CardTitle>
                          <CardDescription>
                            See how different types of malicious input are handled
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {xssExamples.map((example, index) => (
                              <div key={index} className="border rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="font-medium">{example.name}</h4>
                                  <Badge variant={example.status === 'safe' ? 'default' : 'destructive'}>
                                    {example.status === 'safe' ? 'Safe' : 'Blocked'}
                                  </Badge>
                                </div>
                                
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm font-medium text-red-600 mb-1">Malicious Input:</p>
                                    <code className="bg-red-50 text-red-800 p-2 rounded text-xs block">
                                      {example.malicious}
                                    </code>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-green-600 mb-1">Sanitized Output:</p>
                                    <code className="bg-green-50 text-green-800 p-2 rounded text-xs block">
                                      {example.sanitized || '(blocked)'}
                                    </code>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Live HTML encoding demo */}
                      <Card>
                        <CardHeader>
                          <CardTitle>HTML Encoding Demo</CardTitle>
                          <CardDescription>
                            Test HTML encoding for user-generated content
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium mb-2 block">Raw Input:</label>
                                <textarea
                                  className="w-full p-3 border rounded-md text-sm"
                                  rows={4}
                                  placeholder="Enter HTML content to see encoding..."
                                  onChange={(e) => {
                                    const encoded = encodeHtml(e.target.value);
                                    const nextElement = e.target.parentElement?.parentElement?.children[1]?.querySelector('code');
                                    if (nextElement) {
                                      nextElement.textContent = encoded;
                                    }
                                  }}
                                />
                              </div>
                              <div>
                                <label className="text-sm font-medium mb-2 block">Encoded Output:</label>
                                <div className="w-full p-3 border rounded-md bg-muted min-h-[100px]">
                                  <code className="text-sm">Enter content to see encoding...</code>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </div>
                </Tabs>
              </CardContent>
            </Card>
          </ScrollReveal>

          {/* Security Benefits */}
          <ScrollReveal direction="up" delay={0.3}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Why Secure Forms Matter
                </CardTitle>
                <CardDescription>
                  Understanding the importance of comprehensive form security
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-red-600">🚨 Common Attacks</h3>
                    <ul className="space-y-2 text-sm">
                      <li>• Cross-site scripting (XSS)</li>
                      <li>• Cross-site request forgery (CSRF)</li>
                      <li>• SQL injection via forms</li>
                      <li>• Code injection attacks</li>
                      <li>• Data exfiltration</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-blue-600">🛡️ Our Protection</h3>
                    <ul className="space-y-2 text-sm">
                      <li>• Multi-layer input sanitization</li>
                      <li>• Runtime validation with Zod</li>
                      <li>• CSRF token validation</li>
                      <li>• Content Security Policy</li>
                      <li>• Type-safe form handling</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-green-600">✅ Benefits</h3>
                    <ul className="space-y-2 text-sm">
                      <li>• Prevents data breaches</li>
                      <li>• Maintains user trust</li>
                      <li>• Compliance with security standards</li>
                      <li>• Developer-friendly API</li>
                      <li>• Performance optimized</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </ScrollReveal>
        </div>
      </div>
    </CSRFProvider>
  );
};

export default SecureFormsDemo;