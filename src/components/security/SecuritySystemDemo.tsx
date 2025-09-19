import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  Key, 
  AlertTriangle, 
  CheckCircle, 
  Users, 
  Lock,
  Eye,
  Code,
  FileText,
  Zap
} from 'lucide-react';
import { AuthProvider } from '@/security/SecureAuthSystem';
import SecureLoginForm from './SecureLoginForm';
import SecurityDashboard from './SecurityDashboard';
import { ScrollReveal, StaggerContainer, StaggerItem } from '@/components/animations/AnimationSystem';

const SecuritySystemDemo: React.FC = () => {
  const [activeDemo, setActiveDemo] = useState<'overview' | 'login' | 'dashboard'>('overview');

  const features = [
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Type-Safe Authentication",
      description: "Branded types prevent mixing up different credential types",
      details: ["Email & UserId branded types", "Compile-time safety", "No runtime type errors"]
    },
    {
      icon: <Key className="h-8 w-8" />,
      title: "Advanced Permission System", 
      description: "Hierarchical role-based access control with fine-grained permissions",
      details: ["Role hierarchy", "Permission inheritance", "Runtime validation"]
    },
    {
      icon: <AlertTriangle className="h-8 w-8" />,
      title: "Security Error Handling",
      description: "Comprehensive error types for all security scenarios",
      details: ["Rate limiting", "Account lockout", "Suspicious activity detection"]
    },
    {
      icon: <Lock className="h-8 w-8" />,
      title: "Input Sanitization",
      description: "Multi-layer XSS and injection attack prevention",
      details: ["HTML sanitization", "XSS pattern detection", "Content validation"]
    },
    {
      icon: <Eye className="h-8 w-8" />,
      title: "Session Management",
      description: "Secure token handling with automatic refresh",
      details: ["JWT token management", "CSRF protection", "Device tracking"]
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Rate Limiting",
      description: "Intelligent rate limiting with progressive penalties",
      details: ["Per-user limits", "Adaptive timeouts", "Failure tracking"]
    }
  ];

  const codeExamples = [
    {
      title: "Branded Types",
      code: `// Type-safe branded types prevent mixing
type UserId = Brand<string, 'UserId'>;
type Email = Brand<string, 'Email'>; 

// Compile-time error prevention
function getUser(id: UserId) { /* ... */ }
getUser("123"); // ❌ Error: string not assignable to UserId
getUser(createUserId("123")); // ✅ Correct`
    },
    {
      title: "Result Pattern",
      code: `// Functional error handling
async function login(creds: LoginCredentials): Promise<Result<Session, SecurityError>> {
  const result = await authService.login(creds);
  
  if (result.success) {
    return Ok(result.data);
  } else {
    return Err(result.error);
  }
}`
    },
    {
      title: "Security Validation", 
      code: `// Multi-layer input validation
export const sanitizeUserInput = (input: unknown): Result<string, string> => {
  if (typeof input !== 'string') return Err('Input must be a string');
  if (input.length > 10000) return Err('Input too long');
  
  // XSS pattern detection
  const xssPatterns = [/<script[^>]*>.*?<\/script>/gi, /javascript:/gi];
  for (const pattern of xssPatterns) {
    if (pattern.test(input)) return Err('Malicious content detected');
  }
  
  return Ok(sanitizeHtml(input));
}`
    }
  ];

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <ScrollReveal direction="up" delay={0.1}>
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Shield className="h-12 w-12 text-primary" />
                <h1 className="text-4xl font-bold">Enterprise Security System</h1>
              </div>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Comprehensive type-safe authentication with advanced security patterns, 
                built for modern applications that prioritize safety and developer experience.
              </p>
              <div className="flex items-center justify-center gap-2">
                <Badge variant="outline">TypeScript</Badge>
                <Badge variant="outline">Type Safety</Badge>
                <Badge variant="outline">Security First</Badge>
                <Badge variant="outline">Enterprise Ready</Badge>
              </div>
            </div>
          </ScrollReveal>

          {/* Demo Navigation */}
          <ScrollReveal direction="up" delay={0.2}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Interactive Demo
                </CardTitle>
                <CardDescription>
                  Explore the security system features with live examples
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeDemo} onValueChange={(value) => setActiveDemo(value as any)}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="overview">System Overview</TabsTrigger>
                    <TabsTrigger value="login">Secure Login</TabsTrigger>
                    <TabsTrigger value="dashboard">Security Dashboard</TabsTrigger>
                  </TabsList>
                  
                  <div className="mt-6">
                    <TabsContent value="overview" className="space-y-6">
                      {/* Features Grid */}
                      <StaggerContainer staggerDelay={0.1}>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {features.map((feature, index) => (
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
                                  <ul className="space-y-1">
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

                      {/* Code Examples */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Code className="h-5 w-5" />
                            Code Examples
                          </CardTitle>
                          <CardDescription>
                            See how type safety and security patterns work in practice
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                            {codeExamples.map((example, index) => (
                              <Card key={index} className="bg-slate-50">
                                <CardHeader className="pb-3">
                                  <CardTitle className="text-base">{example.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <pre className="text-xs bg-slate-900 text-slate-100 p-3 rounded overflow-x-auto">
                                    <code>{example.code}</code>
                                  </pre>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="login">
                      <div className="flex justify-center">
                        <SecureLoginForm 
                          onSuccess={() => setActiveDemo('dashboard')}
                          onError={(error) => console.log('Login error:', error)}
                        />
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="dashboard">
                      <SecurityDashboard />
                    </TabsContent>
                  </div>
                </Tabs>
              </CardContent>
            </Card>
          </ScrollReveal>

          {/* Technical Benefits */}
          <ScrollReveal direction="up" delay={0.3}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Technical Benefits
                </CardTitle>
                <CardDescription>
                  Why this security system is superior to traditional approaches
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-green-600">✅ With This System</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                        Compile-time type safety prevents credential mixing
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                        Explicit error handling with Result pattern
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                        Built-in rate limiting and security monitoring
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                        Comprehensive input sanitization
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                        Permission system with inheritance
                      </li>
                    </ul>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-red-600">❌ Traditional Systems</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
                        Runtime errors from type confusion
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
                        Try-catch error handling scattered throughout code
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
                        Manual rate limiting implementation
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
                        Inconsistent input validation
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
                        Basic role checks without fine-grained control
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </ScrollReveal>
        </div>
      </div>
    </AuthProvider>
  );
};

export default SecuritySystemDemo;