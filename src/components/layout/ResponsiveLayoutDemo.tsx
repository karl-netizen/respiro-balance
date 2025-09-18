// ===================================================================
// RESPONSIVE LAYOUT DEMO - Showcase responsive components
// ===================================================================

import React from 'react';
import {
  Container,
  Grid,
  GridItem,
  Section,
  ResponsiveNavigation,
  HeroSection,
} from './ResponsiveLayout';
import { A11yButton, A11yToastProvider, useA11yToast } from '../accessibility/AccessibleComponents';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  HomeIcon, 
  UserIcon, 
  SettingsIcon, 
  StarIcon,
  ArrowRightIcon,
  PlayIcon,
  CheckIcon,
  TrendingUpIcon,
  UsersIcon,
  ZapIcon
} from 'lucide-react';

const ResponsiveLayoutDemoContent: React.FC = () => {
  const { addToast } = useA11yToast();

  const navigationItems = [
    { label: 'Home', href: '#home', icon: <HomeIcon size={16} /> },
    { label: 'Features', href: '#features', icon: <StarIcon size={16} /> },
    { label: 'About', href: '#about', icon: <UserIcon size={16} /> },
    { label: 'Contact', href: '#contact', icon: <SettingsIcon size={16} />, badge: '2' },
  ];

  const handleAction = (action: string) => {
    addToast({
      type: 'success',
      title: `${action} clicked!`,
      message: 'This demonstrates responsive layout integration with accessible components.',
      duration: 3000,
    });
  };

  const features = [
    {
      icon: <TrendingUpIcon className="h-8 w-8 text-primary" />,
      title: 'Performance First',
      description: 'Optimized for speed with lazy loading and efficient rendering patterns.'
    },
    {
      icon: <UsersIcon className="h-8 w-8 text-primary" />,
      title: 'User Focused',
      description: 'Designed with accessibility and user experience as top priorities.'
    },
    {
      icon: <ZapIcon className="h-8 w-8 text-primary" />,
      title: 'Lightning Fast',
      description: 'Built with modern frameworks for optimal performance across devices.'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Responsive Navigation */}
      <ResponsiveNavigation
        items={navigationItems}
        logo={
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <StarIcon size={16} className="text-primary-foreground" />
            </div>
            <span className="font-bold text-xl text-foreground">Responsive</span>
          </div>
        }
        actions={
          <div className="flex items-center space-x-2">
            <A11yButton
              variant="ghost"
              size="sm"
              onClick={() => handleAction('Login')}
            >
              Login
            </A11yButton>
            <A11yButton
              variant="primary"
              size="sm"
              onClick={() => handleAction('Sign Up')}
            >
              Sign Up
            </A11yButton>
          </div>
        }
        variant="blur"
        mobileBreakpoint="lg"
      />

      {/* Hero Section */}
      <HeroSection
        subtitle="Next-Generation UI System"
        title={
          <>
            Build Beautiful{' '}
            <span className="text-primary">Responsive</span>{' '}
            Interfaces
          </>
        }
        description="A complete design system with accessible components, responsive layouts, and smooth animations. Built with TypeScript for maximum type safety and developer experience."
        actions={
          <>
            <A11yButton
              variant="primary"
              size="lg"
              onClick={() => handleAction('Get Started')}
              rightIcon={<ArrowRightIcon size={16} />}
            >
              Get Started
            </A11yButton>
            <A11yButton
              variant="outline"
              size="lg"
              onClick={() => handleAction('Watch Demo')}
              leftIcon={<PlayIcon size={16} />}
            >
              Watch Demo
            </A11yButton>
          </>
        }
        image={
          <div className="relative w-full h-96 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center">
            <div className="text-6xl">🎨</div>
          </div>
        }
        layout="image-right"
        background="gradient"
        size="lg"
      />

      {/* Features Section */}
      <Section id="features" size="lg">
        <Container>
          <div className="text-center space-y-4 mb-16">
            <Badge variant="secondary" className="px-3 py-1">
              Features
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything You Need
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our responsive layout system includes all the components you need to build modern, accessible web applications.
            </p>
          </div>

          <Grid columns={{ sm: 1, md: 2, lg: 3 }} gap={{ sm: 6, lg: 8 }}>
            {features.map((feature, index) => (
              <GridItem key={index}>
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="mb-4">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </GridItem>
            ))}
          </Grid>
        </Container>
      </Section>

      {/* Grid System Demo */}
      <Section variant="secondary" size="lg">
        <Container>
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl font-bold tracking-tight">
              Flexible Grid System
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Responsive grid layouts that adapt to any screen size with customizable columns, gaps, and spans.
            </p>
          </div>

          {/* Complex Grid Layout */}
          <Grid columns={{ sm: 1, md: 2, lg: 4 }} gap={6} className="mb-8">
            <GridItem span={{ sm: 1, lg: 2 }}>
              <Card className="h-full bg-primary text-primary-foreground">
                <CardHeader>
                  <CardTitle>Main Feature</CardTitle>
                  <CardDescription className="text-primary-foreground/80">
                    Spans 2 columns on large screens
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>This card demonstrates responsive column spanning. It takes full width on mobile, and 2 columns on large screens.</p>
                </CardContent>
              </Card>
            </GridItem>
            
            <GridItem>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Feature 1</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Standard grid item that adapts to the responsive breakpoints.</p>
                </CardContent>
              </Card>
            </GridItem>
            
            <GridItem>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Feature 2</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Another responsive grid item with consistent spacing.</p>
                </CardContent>
              </Card>
            </GridItem>
          </Grid>

          {/* Nested Grid Demo */}
          <Grid columns={{ sm: 1, lg: 2 }} gap={8}>
            <GridItem>
              <Card>
                <CardHeader>
                  <CardTitle>Nested Grid</CardTitle>
                  <CardDescription>
                    Grids can be nested for complex layouts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Grid columns={2} gap={4}>
                    <GridItem>
                      <div className="bg-muted p-4 rounded-lg text-center">
                        <CheckIcon className="h-6 w-6 mx-auto mb-2 text-primary" />
                        <span className="text-sm font-medium">Nested 1</span>
                      </div>
                    </GridItem>
                    <GridItem>
                      <div className="bg-muted p-4 rounded-lg text-center">
                        <CheckIcon className="h-6 w-6 mx-auto mb-2 text-primary" />
                        <span className="text-sm font-medium">Nested 2</span>
                      </div>
                    </GridItem>
                    <GridItem span={2}>
                      <div className="bg-muted p-4 rounded-lg text-center">
                        <CheckIcon className="h-6 w-6 mx-auto mb-2 text-primary" />
                        <span className="text-sm font-medium">Full Width</span>
                      </div>
                    </GridItem>
                  </Grid>
                </CardContent>
              </Card>
            </GridItem>
            
            <GridItem>
              <Card>
                <CardHeader>
                  <CardTitle>Responsive Behavior</CardTitle>
                  <CardDescription>
                    Resize your browser to see the responsive behavior
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-sm">Mobile: Single column</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm">Tablet: Two columns</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Desktop: Four columns</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </GridItem>
          </Grid>
        </Container>
      </Section>

      {/* Container Size Demo */}
      <Section size="lg">
        <div className="space-y-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              Container Sizes
            </h2>
            <p className="text-xl text-muted-foreground">
              Different container sizes for various content layouts
            </p>
          </div>

          <Container size="sm" className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="text-center">
              <h3 className="font-semibold text-red-900">Small Container (max-w-sm)</h3>
              <p className="text-red-700">Perfect for forms and focused content</p>
            </div>
          </Container>

          <Container size="md" className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="text-center">
              <h3 className="font-semibold text-blue-900">Medium Container (max-w-md)</h3>
              <p className="text-blue-700">Good for modal dialogs and cards</p>
            </div>
          </Container>

          <Container size="lg" className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="text-center">
              <h3 className="font-semibold text-green-900">Large Container (max-w-4xl)</h3>
              <p className="text-green-700">Ideal for content-heavy pages and dashboards</p>
            </div>
          </Container>

          <Container size="xl" className="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <div className="text-center">
              <h3 className="font-semibold text-purple-900">Extra Large Container (max-w-7xl)</h3>
              <p className="text-purple-700">Perfect for wide layouts and landing pages</p>
            </div>
          </Container>
        </div>
      </Section>

      {/* CTA Section */}
      <Section variant="primary" size="md">
        <Container>
          <div className="text-center space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
              Start building beautiful, responsive interfaces with our complete design system.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <A11yButton
                variant="secondary"
                size="lg"
                onClick={() => handleAction('Start Building')}
                rightIcon={<ArrowRightIcon size={16} />}
              >
                Start Building Now
              </A11yButton>
              <A11yButton
                variant="outline"
                size="lg"
                onClick={() => handleAction('View Documentation')}
                className="text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary"
              >
                View Documentation
              </A11yButton>
            </div>
          </div>
        </Container>
      </Section>

      {/* Footer */}
      <Section size="sm" className="border-t">
        <Container>
          <div className="text-center text-muted-foreground">
            <p>&copy; 2024 Responsive Layout System. Built with accessibility and performance in mind.</p>
          </div>
        </Container>
      </Section>
    </div>
  );
};

// Wrapper component with Toast Provider
const ResponsiveLayoutDemo: React.FC = () => {
  return (
    <A11yToastProvider>
      <ResponsiveLayoutDemoContent />
    </A11yToastProvider>
  );
};

export default ResponsiveLayoutDemo;