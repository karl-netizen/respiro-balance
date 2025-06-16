
import React from 'react';
import { cn } from '@/lib/utils';

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export const FadeIn: React.FC<FadeInProps> = ({ 
  children, 
  delay = 0, 
  className 
}) => (
  <div 
    className={cn('animate-fade-in', className)}
    style={{ animationDelay: `${delay}ms` }}
  >
    {children}
  </div>
);

interface SlideInProps {
  children: React.ReactNode;
  direction?: 'left' | 'right' | 'up' | 'down';
  delay?: number;
  className?: string;
}

export const SlideIn: React.FC<SlideInProps> = ({ 
  children, 
  direction = 'up', 
  delay = 0,
  className 
}) => {
  const directionClasses = {
    left: 'animate-slide-in-left',
    right: 'animate-slide-in-right',
    up: 'animate-slide-in-up',
    down: 'animate-slide-in-down'
  };

  return (
    <div 
      className={cn(directionClasses[direction], className)}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

interface ScaleInProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export const ScaleIn: React.FC<ScaleInProps> = ({ 
  children, 
  delay = 0,
  className 
}) => (
  <div 
    className={cn('animate-scale-in', className)}
    style={{ animationDelay: `${delay}ms` }}
  >
    {children}
  </div>
);

interface HoverLiftProps {
  children: React.ReactNode;
  className?: string;
}

export const HoverLift: React.FC<HoverLiftProps> = ({ 
  children, 
  className 
}) => (
  <div className={cn('transition-transform hover:scale-105 hover:-translate-y-1', className)}>
    {children}
  </div>
);

interface PulseProps {
  children: React.ReactNode;
  className?: string;
}

export const Pulse: React.FC<PulseProps> = ({ 
  children, 
  className 
}) => (
  <div className={cn('animate-pulse', className)}>
    {children}
  </div>
);

interface GentleBounceProps {
  children: React.ReactNode;
  className?: string;
}

export const GentleBounce: React.FC<GentleBounceProps> = ({ 
  children, 
  className 
}) => (
  <div className={cn('animate-bounce-gentle', className)}>
    {children}
  </div>
);
