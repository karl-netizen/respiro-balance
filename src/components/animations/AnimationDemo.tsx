import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ScrollReveal, 
  StaggerContainer, 
  StaggerItem, 
  ParallaxSection,
  HoverScale,
  HoverGlow,
  PulseLoader,
  Spinner,
  Floating,
  SlideIn
} from './AnimationSystem';
import { useInView, useScrollProgress, useStaggerAnimation } from './AnimationHooks';
import { Grid, GridItem, Container, Section } from '../layout/ResponsiveLayout';

const AnimationDemo: React.FC = () => {
  const [showLoaders, setShowLoaders] = useState(false);
  const scrollProgress = useScrollProgress();
  const { ref: sectionRef, isInView } = useInView({ threshold: 0.2 });
  const { visibleItems, startStagger, resetStagger } = useStaggerAnimation(6, 150);

  const features = [
    { title: 'Scroll Reveal', description: 'Elements appear as you scroll', icon: '👁️' },
    { title: 'Stagger Animation', description: 'Sequential element animations', icon: '🎭' },
    { title: 'Parallax Effects', description: 'Smooth scroll-based movement', icon: '🌊' },
    { title: 'Hover Interactions', description: 'Delightful micro-interactions', icon: '✨' },
    { title: 'Loading States', description: 'Elegant loading animations', icon: '⚡' },
    { title: 'Floating Elements', description: 'Subtle floating animations', icon: '🎈' }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Scroll Progress Bar */}
      <div 
        className="fixed top-0 left-0 h-1 bg-primary z-50 transition-all duration-300"
        style={{ width: `${scrollProgress * 100}%` }}
      />

      <Container size="xl" padding={{ sm: 4, lg: 8 }}>
        {/* Hero Section with Parallax */}
        <ParallaxSection offset={30} className="py-20">
          <Section className="text-center">
            <ScrollReveal direction="fade" delay={200}>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Animation System
              </h1>
            </ScrollReveal>
            
            <ScrollReveal direction="up" delay={400}>
              <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Beautiful, performant animations that enhance user experience
              </p>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={600}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <HoverScale scale={1.05}>
                  <Button 
                    size="lg" 
                    onClick={startStagger}
                    className="hover:glow-effect transition-all duration-300"
                  >
                    Start Stagger Animation
                  </Button>
                </HoverScale>
                
                <HoverScale scale={1.05}>
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={resetStagger}
                  >
                    Reset Animation
                  </Button>
                </HoverScale>
              </div>
            </ScrollReveal>
          </Section>
        </ParallaxSection>

        {/* Features Grid with Stagger */}
        <Section className="py-20" ref={sectionRef}>
          <ScrollReveal direction="up" delay={200}>
            <h2 className="text-3xl font-bold text-center mb-12">
              Animation Features
            </h2>
          </ScrollReveal>

          <Grid columns={{ sm: 1, md: 2, lg: 3 }} gap={{ sm: 4, md: 6, lg: 8 }}>
            {features.map((feature, index) => (
              <GridItem key={index}>
                <div style={{ 
                  opacity: visibleItems > index ? 1 : 0.3,
                  transform: visibleItems > index ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'all 0.6s ease-out'
                }}>
                  <HoverScale scale={1.02}>
                    <HoverGlow intensity={0.2}>
                      <Card className="h-full hover:shadow-lg transition-all duration-300">
                        <CardHeader>
                          <div className="text-4xl mb-4">{feature.icon}</div>
                          <CardTitle className="text-xl">
                            {feature.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground">
                            {feature.description}
                          </p>
                        </CardContent>
                      </Card>
                    </HoverGlow>
                  </HoverScale>
                </div>
              </GridItem>
            ))}
          </Grid>
        </Section>

        {/* Interactive Elements */}
        <Section className="py-20">
          <ScrollReveal direction="up" delay={200}>
            <h2 className="text-3xl font-bold text-center mb-12">
              Interactive Elements
            </h2>
          </ScrollReveal>

          <Grid columns={{ sm: 1, md: 2 }} gap={{ sm: 4, md: 6 }}>
            {/* Hover Effects Demo */}
            <GridItem>
              <ScrollReveal direction="left" delay={300}>
                <Card>
                  <CardHeader>
                    <CardTitle>Hover Effects</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <HoverScale scale={1.1}>
                      <div className="p-4 bg-primary/10 rounded-lg border cursor-pointer">
                        <p className="font-medium">Scale on Hover</p>
                        <p className="text-sm text-muted-foreground">
                          Hover to see the scale effect
                        </p>
                      </div>
                    </HoverScale>

                    <HoverGlow color="hsl(var(--primary))" intensity={0.4}>
                      <div className="p-4 bg-secondary/10 rounded-lg border cursor-pointer">
                        <p className="font-medium">Glow on Hover</p>
                        <p className="text-sm text-muted-foreground">
                          Hover to see the glow effect
                        </p>
                      </div>
                    </HoverGlow>
                  </CardContent>
                </Card>
              </ScrollReveal>
            </GridItem>

            {/* Loading States Demo */}
            <GridItem>
              <ScrollReveal direction="right" delay={300}>
                <Card>
                  <CardHeader>
                    <CardTitle>Loading States</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <Button 
                        onClick={() => setShowLoaders(!showLoaders)}
                        variant="outline"
                      >
                        Toggle Loaders
                      </Button>
                      <Badge variant={showLoaders ? "default" : "secondary"}>
                        {showLoaders ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    
                    {showLoaders && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <span className="text-sm font-medium w-16">Spinner:</span>
                          <Spinner size="sm" />
                          <Spinner size="md" />
                          <Spinner size="lg" />
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <span className="text-sm font-medium w-16">Pulse:</span>
                          <PulseLoader size="sm" />
                          <PulseLoader size="md" />
                          <PulseLoader size="lg" />
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </ScrollReveal>
            </GridItem>
          </Grid>
        </Section>

        {/* Floating Elements */}
        <Section className="py-20">
          <ScrollReveal direction="up" delay={200}>
            <h2 className="text-3xl font-bold text-center mb-12">
              Floating Animations
            </h2>
          </ScrollReveal>

          <div className="flex justify-center items-center space-x-8 py-12">
            <Floating amplitude={15} duration={2000} delay={0}>
              <div className="w-16 h-16 bg-primary rounded-full shadow-lg" />
            </Floating>
            
            <Floating amplitude={20} duration={2500} delay={500}>
              <div className="w-20 h-20 bg-secondary rounded-full shadow-lg" />
            </Floating>
            
            <Floating amplitude={12} duration={3000} delay={1000}>
              <div className="w-14 h-14 bg-accent rounded-full shadow-lg" />
            </Floating>
          </div>
        </Section>

        {/* Stagger Container Example */}
        <Section className="py-20">
          <ScrollReveal direction="up" delay={200}>
            <h2 className="text-3xl font-bold text-center mb-12">
              Stagger Container
            </h2>
          </ScrollReveal>

          <StaggerContainer staggerDelay={100}>
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="mb-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-semibold">Staggered Item {index + 1}</h3>
                        <p className="text-muted-foreground">
                          This item appears with a {index * 100}ms delay
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </StaggerContainer>
        </Section>

        {/* Performance Notes */}
        <Section className="py-20">
          <ScrollReveal direction="up" delay={200}>
            <Card className="bg-muted/50">
              <CardHeader>
                <CardTitle>Performance & Accessibility</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="font-semibold mb-2">✅ Optimized Features</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Respects prefers-reduced-motion</li>
                      <li>• Uses transform for better performance</li>
                      <li>• Intersection Observer for efficiency</li>
                      <li>• CSS-based animations where possible</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">🎯 Best Practices</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Consistent timing functions</li>
                      <li>• Meaningful motion design</li>
                      <li>• Progressive enhancement</li>
                      <li>• Semantic HTML maintained</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </ScrollReveal>
        </Section>
      </Container>
    </div>
  );
};

export default AnimationDemo;