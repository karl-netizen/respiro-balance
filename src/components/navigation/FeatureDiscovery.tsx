
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, ChevronRight, Sparkles } from 'lucide-react';
import { FadeIn, SlideIn } from '@/components/animations/MicroInteractions';

interface Feature {
  id: string;
  title: string;
  description: string;
  path: string;
  category: 'meditation' | 'biofeedback' | 'progress' | 'focus' | 'social';
  isNew?: boolean;
  completed?: boolean;
}

const features: Feature[] = [
  {
    id: 'guided-meditation',
    title: 'Guided Meditation',
    description: 'Access hundreds of guided meditation sessions',
    path: '/meditation',
    category: 'meditation'
  },
  {
    id: 'biofeedback-monitoring',
    title: 'Real-time Biofeedback',
    description: 'Connect devices to monitor your heart rate and stress',
    path: '/biofeedback',
    category: 'biofeedback',
    isNew: true
  },
  {
    id: 'progress-tracking',
    title: 'Progress Analytics',
    description: 'Track your meditation journey and wellness metrics',
    path: '/progress',
    category: 'progress'
  },
  {
    id: 'focus-mode',
    title: 'Focus Sessions',
    description: 'Enhance productivity with focused work sessions',
    path: '/focus',
    category: 'focus'
  },
  {
    id: 'morning-ritual',
    title: 'Morning Rituals',
    description: 'Create and track personalized morning routines',
    path: '/morning-ritual',
    category: 'meditation'
  },
  {
    id: 'breathing-exercises',
    title: 'Breathing Techniques',
    description: 'Practice guided breathing exercises',
    path: '/breathe',
    category: 'meditation'
  }
];

interface FeatureDiscoveryProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
}

export const FeatureDiscovery: React.FC<FeatureDiscoveryProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Features' },
    { id: 'meditation', label: 'Meditation' },
    { id: 'biofeedback', label: 'Biofeedback' },
    { id: 'progress', label: 'Progress' },
    { id: 'focus', label: 'Focus' },
    { id: 'social', label: 'Social' }
  ];

  const filteredFeatures = selectedCategory === 'all' 
    ? features 
    : features.filter(feature => feature.category === selectedCategory);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <FadeIn>
        <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <CardTitle>Discover Features</CardTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="overflow-y-auto">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-6">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.label}
                </Button>
              ))}
            </div>

            {/* Features Grid */}
            <div className="grid gap-4 md:grid-cols-2">
              {filteredFeatures.map((feature, index) => (
                <SlideIn key={feature.id} delay={index * 100}>
                  <Card className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold">{feature.title}</h3>
                        <div className="flex items-center space-x-1">
                          {feature.isNew && (
                            <Badge variant="secondary" className="text-xs">
                              New
                            </Badge>
                          )}
                          {feature.completed && (
                            <Badge variant="default" className="text-xs">
                              ✓
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {feature.description}
                      </p>
                      <Button
                        size="sm"
                        className="w-full"
                        onClick={() => {
                          onNavigate(feature.path);
                          onClose();
                        }}
                      >
                        Explore
                        <ChevronRight className="h-3 w-3 ml-1" />
                      </Button>
                    </CardContent>
                  </Card>
                </SlideIn>
              ))}
            </div>

            {/* Quick Tips */}
            <div className="mt-8 p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-2">💡 Quick Tips</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Start with guided meditation if you're new to mindfulness</li>
                <li>• Connect a wearable device for real-time biofeedback</li>
                <li>• Check your progress regularly to stay motivated</li>
                <li>• Try focus sessions during work hours for productivity</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  );
};

export default FeatureDiscovery;
