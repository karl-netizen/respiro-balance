
import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href: string;
  current?: boolean;
}

const routeLabels: Record<string, string> = {
  '/': 'Home',
  '/landing': 'Landing',
  '/dashboard': 'Dashboard',
  '/meditation': 'Meditation',
  '/focus': 'Focus Mode',
  '/progress': 'Progress',
  '/social': 'Social',
  '/morning-ritual': 'Morning Rituals',
  '/biofeedback': 'Biofeedback',
  '/settings': 'Settings',
  '/profile': 'Profile',
};

export const BreadcrumbNavigation: React.FC = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);
  
  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', href: '/landing' }
  ];

  let currentPath = '';
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const label = routeLabels[currentPath] || segment.charAt(0).toUpperCase() + segment.slice(1);
    breadcrumbs.push({
      label,
      href: currentPath,
      current: index === pathSegments.length - 1
    });
  });

  if (breadcrumbs.length <= 1) return null;

  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground mb-4">
      <Home className="h-4 w-4" />
      {breadcrumbs.map((item, index) => (
        <React.Fragment key={item.href}>
          {index > 0 && <ChevronRight className="h-4 w-4" />}
          {item.current ? (
            <span className="text-foreground font-medium">{item.label}</span>
          ) : (
            <Link
              to={item.href}
              className={cn(
                "hover:text-foreground transition-colors",
                index === 0 && "sr-only"
              )}
            >
              {item.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};
