
import React from 'react';
import { cn } from "@/lib/utils";
import { useDeviceDetection } from '@/hooks/core/useDeviceDetection';

interface MobileSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'card' | 'chart' | 'text' | 'avatar' | 'button';
  lines?: number;
}

function MobileSkeleton({
  className,
  variant = 'default',
  lines = 1,
  ...props
}: MobileSkeletonProps) {
  const { deviceType } = useDeviceDetection();
  
  const getVariantClasses = () => {
    const isMobile = deviceType === 'mobile';
    
    switch (variant) {
      case 'card':
        return isMobile 
          ? 'h-32 w-full rounded-lg' 
          : 'h-40 w-full rounded-lg';
      case 'chart':
        return isMobile 
          ? 'h-48 w-full rounded-md' 
          : 'h-64 w-full rounded-md';
      case 'text':
        return isMobile 
          ? 'h-3 w-full rounded' 
          : 'h-4 w-full rounded';
      case 'avatar':
        return isMobile 
          ? 'h-8 w-8 rounded-full' 
          : 'h-10 w-10 rounded-full';
      case 'button':
        return isMobile 
          ? 'h-12 w-24 rounded-md' 
          : 'h-10 w-20 rounded-md';
      default:
        return isMobile 
          ? 'h-4 w-full rounded' 
          : 'h-4 w-full rounded';
    }
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }, (_, i) => (
          <div
            key={i}
            className={cn(
              "animate-pulse bg-muted",
              getVariantClasses(),
              i === lines - 1 && deviceType === 'mobile' ? 'w-3/4' : '',
              className
            )}
            {...props}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "animate-pulse bg-muted",
        getVariantClasses(),
        className
      )}
      {...props}
    />
  );
}

export { MobileSkeleton };
