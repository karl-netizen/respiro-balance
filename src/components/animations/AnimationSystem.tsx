import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

// ============= SCROLL REVEAL COMPONENT =============

interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade';
  delay?: number;
  duration?: number;
  distance?: number;
  threshold?: number;
  className?: string;
  once?: boolean;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  direction = 'up',
  delay = 0,
  duration = 600,
  distance = 50,
  threshold = 0.1,
  className,
  once = true
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            observer.unobserve(element);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, once]);

  const getInitialTransform = () => {
    switch (direction) {
      case 'up': return `translateY(${distance}px)`;
      case 'down': return `translateY(-${distance}px)`;
      case 'left': return `translateX(${distance}px)`;
      case 'right': return `translateX(-${distance}px)`;
      case 'fade': return 'translateY(10px)';
      default: return `translateY(${distance}px)`;
    }
  };

  return (
    <div
      ref={ref}
      className={cn('transition-all ease-out', className)}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translate(0)' : getInitialTransform(),
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`
      }}
    >
      {children}
    </div>
  );
};

// ============= STAGGER CONTAINER =============

interface StaggerContainerProps {
  children: React.ReactNode;
  staggerDelay?: number;
  className?: string;
}

export const StaggerContainer: React.FC<StaggerContainerProps> = ({
  children,
  staggerDelay = 100,
  className
}) => {
  return (
    <div className={cn('w-full', className)}>
      {React.Children.map(children, (child, index) => (
        <StaggerItem key={index} delay={index * staggerDelay}>
          {child}
        </StaggerItem>
      ))}
    </div>
  );
};

interface StaggerItemProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export const StaggerItem: React.FC<StaggerItemProps> = ({
  children,
  delay = 0,
  className
}) => {
  return (
    <ScrollReveal 
      direction="up" 
      delay={delay} 
      className={className}
    >
      {children}
    </ScrollReveal>
  );
};

// ============= PARALLAX SECTION =============

interface ParallaxSectionProps {
  children: React.ReactNode;
  offset?: number;
  className?: string;
}

export const ParallaxSection: React.FC<ParallaxSectionProps> = ({
  children,
  offset = 50,
  className
}) => {
  const [scrollY, setScrollY] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const scrollProgress = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / (window.innerHeight + rect.height)));
        setScrollY(scrollProgress * offset);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial calculation
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [offset]);

  return (
    <div
      ref={ref}
      className={cn('relative overflow-hidden', className)}
      style={{
        transform: `translateY(${scrollY}px)`
      }}
    >
      {children}
    </div>
  );
};

// ============= HOVER ANIMATIONS =============

interface HoverScaleProps {
  children: React.ReactNode;
  scale?: number;
  className?: string;
}

export const HoverScale: React.FC<HoverScaleProps> = ({
  children,
  scale = 1.05,
  className
}) => {
  return (
    <div
      className={cn('transition-transform duration-300 ease-out cursor-pointer', className)}
      style={{
        '--scale': scale
      } as React.CSSProperties}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = `scale(${scale})`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      {children}
    </div>
  );
};

interface HoverGlowProps {
  children: React.ReactNode;
  color?: string;
  intensity?: number;
  className?: string;
}

export const HoverGlow: React.FC<HoverGlowProps> = ({
  children,
  color = 'hsl(var(--primary))',
  intensity = 0.3,
  className
}) => {
  return (
    <div
      className={cn('transition-all duration-300 ease-out', className)}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 0 20px ${color.replace(')', `, ${intensity})`)}`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {children}
    </div>
  );
};

// ============= LOADING ANIMATIONS =============

interface PulseLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
}

export const PulseLoader: React.FC<PulseLoaderProps> = ({
  size = 'md',
  color = 'hsl(var(--primary))',
  className
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div
        className={cn('rounded-full animate-pulse', sizeClasses[size])}
        style={{ backgroundColor: color }}
      />
    </div>
  );
};

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  color = 'hsl(var(--primary))',
  className
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-3'
  };

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div
        className={cn('rounded-full animate-spin border-transparent border-t-current', sizeClasses[size])}
        style={{ borderTopColor: color }}
      />
    </div>
  );
};

// ============= FLOATING ANIMATION =============

interface FloatingProps {
  children: React.ReactNode;
  amplitude?: number;
  duration?: number;
  delay?: number;
  className?: string;
}

export const Floating: React.FC<FloatingProps> = ({
  children,
  amplitude = 10,
  duration = 3000,
  delay = 0,
  className
}) => {
  return (
    <div
      className={cn('animate-float-up', className)}
      style={{
        animationDelay: `${delay}ms`,
        animationDuration: `${duration}ms`,
        animationIterationCount: 'infinite'
      }}
    >
      {children}
    </div>
  );
};

// ============= SLIDE IN ANIMATIONS =============

interface SlideInProps {
  children: React.ReactNode;
  direction?: 'left' | 'right' | 'up' | 'down';
  distance?: number;
  duration?: number;
  delay?: number;
  className?: string;
}

export const SlideIn: React.FC<SlideInProps> = ({
  children,
  direction = 'up',
  distance = 50,
  duration = 600,
  delay = 0,
  className
}) => {
  return (
    <ScrollReveal
      direction={direction}
      distance={distance}
      duration={duration}
      delay={delay}
      className={className}
    >
      {children}
    </ScrollReveal>
  );
};