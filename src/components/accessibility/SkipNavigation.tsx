
import React from 'react';
import { cn } from '@/lib/utils';

interface SkipNavigationProps {
  links?: Array<{
    href: string;
    label: string;
  }>;
  className?: string;
}

export const SkipNavigation: React.FC<SkipNavigationProps> = ({
  links = [
    { href: '#main-content', label: 'Skip to main content' },
    { href: '#navigation', label: 'Skip to navigation' },
    { href: '#footer', label: 'Skip to footer' }
  ],
  className
}) => {
  return (
    <div className={cn(
      "sr-only focus-within:not-sr-only fixed top-0 left-0 z-[9999] bg-primary text-primary-foreground",
      className
    )}>
      <nav aria-label="Skip navigation links">
        <ul className="flex list-none p-2 gap-2">
          {links.map((link, index) => (
            <li key={index}>
              <a
                href={link.href}
                className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 hover:bg-primary/90 transition-colors"
                onFocus={(e) => {
                  // Ensure the skip link is visible when focused
                  e.currentTarget.scrollIntoView({ block: 'nearest' });
                }}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default SkipNavigation;
