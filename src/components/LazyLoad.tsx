import React from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { cn } from '@/lib/utils';

interface LazyLoadProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  rootMargin?: string;
  threshold?: number;
  className?: string;
  once?: boolean;
}

export const LazyLoad: React.FC<LazyLoadProps> = ({
  children,
  fallback = <div className="h-32 bg-gray-100 animate-pulse rounded" />,
  rootMargin = '100px',
  threshold = 0.1,
  className,
  once = true
}) => {
  const [ref, isVisible] = useIntersectionObserver({
    rootMargin,
    threshold,
    once
  });

  return (
    <div ref={ref} className={cn(className)}>
      {isVisible ? children : fallback}
    </div>
  );
};

// Lazy loading for images with progressive enhancement
interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallback?: string;
  placeholderClassName?: string;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  fallback = '/placeholder.svg',
  placeholderClassName,
  className,
  ...props
}) => {
  const [ref, isVisible] = useIntersectionObserver({
    rootMargin: '50px',
    threshold: 0.1,
    once: true
  });

  const [loaded, setLoaded] = React.useState(false);
  const [error, setError] = React.useState(false);

  const handleLoad = () => setLoaded(true);
  const handleError = () => setError(true);

  return (
    <div ref={ref} className={cn('relative overflow-hidden', className)}>
      {!loaded && !error && (
        <div className={cn(
          'absolute inset-0 bg-gray-200 animate-pulse',
          placeholderClassName
        )} />
      )}
      
      {isVisible && (
        <img
          src={error ? fallback : src}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            'transition-opacity duration-300',
            loaded ? 'opacity-100' : 'opacity-0',
            className
          )}
          {...props}
        />
      )}
    </div>
  );
};

export default LazyLoad;