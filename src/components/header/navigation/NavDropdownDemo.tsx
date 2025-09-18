import React, { useState, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { NavigationMenu, NavigationMenuList } from '@/components/ui/navigation-menu';
import { Play, Heart, Settings, User } from 'lucide-react';

import EnhancedNavDropdown from './EnhancedNavDropdown';
import {
  NavigationItem,
  DropdownConfig,
  NavigationState,
  DropdownState,
  NavigationEventEmitter,
  createNavItemId,
  createRoutePath,
  createCategoryId
} from './types';

// ===================================================================
// DEMO COMPONENT WITH ADVANCED TYPESCRIPT PATTERNS
// ===================================================================

const NavDropdownDemo: React.FC = () => {
  // Event emitter for navigation events
  const [eventEmitter] = useState(() => new NavigationEventEmitter());
  const [navigationState, setNavigationState] = useState<NavigationState>({ status: 'idle' });
  const [dropdownState, setDropdownState] = useState<DropdownState>({ type: 'closed' });
  const [events, setEvents] = useState<string[]>([]);

  // Mock navigation items with proper typing
  const meditationItems: NavigationItem[] = [
    {
      id: createNavItemId('meditate_guided'),
      label: 'Guided Sessions',
      path: createRoutePath('/meditate?tab=guided'),
      category: createCategoryId('guided'),
      icon: Play,
      requiresAuth: false
    },
    {
      id: createNavItemId('meditate_quick'),
      label: 'Quick Breaks',
      path: createRoutePath('/meditate?tab=quick'),
      category: createCategoryId('quick'),
      icon: Heart,
      requiresAuth: false
    },
    {
      id: createNavItemId('meditate_deep'),
      label: 'Deep Focus',
      path: createRoutePath('/meditate?tab=deep'),
      category: createCategoryId('deep'),
      icon: Settings,
      requiresAuth: true
    },
    {
      id: createNavItemId('meditate_sleep'),
      label: 'Sleep Stories',
      path: createRoutePath('/meditate?tab=sleep'),
      category: createCategoryId('sleep'),
      icon: User,
      requiresAuth: true
    }
  ];

  const dropdownConfig: DropdownConfig = {
    id: 'meditate_dropdown' as any,
    title: 'Meditate',
    items: meditationItems,
    maxItems: 10
  };

  // Event listeners setup
  React.useEffect(() => {
    const addEvent = (message: string) => {
      setEvents(prev => [...prev.slice(-9), `${new Date().toLocaleTimeString()}: ${message}`]);
    };

    eventEmitter.on('nav:itemClick', (payload) => {
      addEvent(`Item clicked: ${payload.itemId} → ${payload.path}`);
    });

    eventEmitter.on('nav:dropdownOpen', (payload) => {
      addEvent(`Dropdown opened: ${payload.dropdownId}`);
    });

    eventEmitter.on('nav:dropdownClose', (payload) => {
      addEvent(`Dropdown closed: ${payload.dropdownId}`);
    });

    eventEmitter.on('nav:navigationStart', (payload) => {
      addEvent(`Navigation: ${payload.fromPath} → ${payload.toPath}`);
    });

    eventEmitter.on('nav:navigationComplete', (payload) => {
      addEvent(`Navigation complete: ${payload.path} (${payload.duration.toFixed(1)}ms)`);
    });

    eventEmitter.on('nav:navigationError', (payload) => {
      addEvent(`Navigation error: ${payload.error.message}`);
    });

    return () => {
      // Cleanup event listeners
      eventEmitter.off('nav:itemClick', () => {});
      eventEmitter.off('nav:dropdownOpen', () => {});
      eventEmitter.off('nav:dropdownClose', () => {});
      eventEmitter.off('nav:navigationStart', () => {});
      eventEmitter.off('nav:navigationComplete', () => {});
      eventEmitter.off('nav:navigationError', () => {});
    };
  }, [eventEmitter]);

  const handleNavigationStateChange = useCallback((state: NavigationState) => {
    setNavigationState(state);
  }, []);

  const handleDropdownStateChange = useCallback((state: DropdownState) => {
    setDropdownState(state);
  }, []);

  const clearEvents = useCallback(() => {
    setEvents([]);
  }, []);

  // Status badge colors
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'idle': return 'secondary';
      case 'navigating': return 'default';
      case 'success': return 'default';
      case 'error': return 'destructive';
      default: return 'secondary';
    }
  };

  const getDropdownBadgeVariant = (type: string) => {
    switch (type) {
      case 'closed': return 'secondary';
      case 'opening': case 'closing': return 'default';
      case 'open': return 'default';
      default: return 'secondary';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">
          Advanced TypeScript Navigation Demo
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Demonstrating branded types, discriminated unions, type-safe event handling, 
          and advanced TypeScript patterns in a production-ready navigation component.
        </p>
      </div>

      {/* Navigation Component Demo */}
      <Card>
        <CardHeader>
          <CardTitle>Enhanced Navigation Component</CardTitle>
        </CardHeader>
        <CardContent>
          <NavigationMenu>
            <NavigationMenuList>
              <EnhancedNavDropdown
                config={dropdownConfig}
                isActive={false}
                eventEmitter={eventEmitter}
                onNavigationStateChange={handleNavigationStateChange}
                onDropdownStateChange={handleDropdownStateChange}
              />
            </NavigationMenuList>
          </NavigationMenu>
        </CardContent>
      </Card>

      {/* State Monitoring */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Navigation State</span>
              <Badge variant={getStatusBadgeVariant(navigationState.status)}>
                {navigationState.status}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div>
                <strong>Status:</strong> {navigationState.status}
              </div>
              {navigationState.status === 'navigating' && (
                <div>
                  <strong>Target:</strong> {navigationState.targetPath}
                </div>
              )}
              {navigationState.status === 'success' && (
                <div>
                  <strong>Current Path:</strong> {navigationState.currentPath}<br/>
                  <strong>Timestamp:</strong> {navigationState.timestamp.toLocaleString()}
                </div>
              )}
              {navigationState.status === 'error' && (
                <div className="text-destructive">
                  <strong>Error:</strong> {navigationState.error.message}<br/>
                  <strong>Code:</strong> {navigationState.error.code}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Dropdown State</span>
              <Badge variant={getDropdownBadgeVariant(dropdownState.type)}>
                {dropdownState.type}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div>
                <strong>Type:</strong> {dropdownState.type}
              </div>
              {(dropdownState.type === 'opening' || dropdownState.type === 'open' || dropdownState.type === 'closing') && (
                <div>
                  <strong>Dropdown ID:</strong> {dropdownState.dropdownId}
                </div>
              )}
              {dropdownState.type === 'open' && dropdownState.activeItemId && (
                <div>
                  <strong>Active Item:</strong> {dropdownState.activeItemId}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Event Log */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Event Log</span>
            <Button onClick={clearEvents} variant="outline" size="sm">
              Clear
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted p-4 rounded-lg max-h-64 overflow-y-auto">
            {events.length === 0 ? (
              <div className="text-muted-foreground text-sm text-center py-4">
                No events yet. Try interacting with the navigation dropdown above.
              </div>
            ) : (
              <div className="space-y-1">
                {events.map((event, index) => (
                  <div key={index} className="text-sm font-mono">
                    {event}
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* TypeScript Patterns Showcase */}
      <Card>
        <CardHeader>
          <CardTitle>Advanced TypeScript Patterns Implemented</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="font-semibold">Branded Types:</div>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>NavItemId - Prevents ID mix-ups</li>
                <li>RoutePath - Type-safe route validation</li>
                <li>CategoryId - Domain-specific categories</li>
                <li>DropdownId - Unique dropdown identification</li>
              </ul>
            </div>
            <div className="space-y-2">
              <div className="font-semibold">Discriminated Unions:</div>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>NavigationState - Consistent state management</li>
                <li>DropdownState - Type-safe dropdown states</li>
                <li>Result&lt;T,E&gt; - Error handling without exceptions</li>
              </ul>
            </div>
            <div className="space-y-2">
              <div className="font-semibold">Advanced Features:</div>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Type-safe event system</li>
                <li>Runtime validation with assertions</li>
                <li>Template literal types for routes</li>
                <li>Generic constraints & utility types</li>
              </ul>
            </div>
            <div className="space-y-2">
              <div className="font-semibold">Developer Experience:</div>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Rich IntelliSense support</li>
                <li>Compile-time error prevention</li>
                <li>Self-documenting code</li>
                <li>Production-ready error handling</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NavDropdownDemo;