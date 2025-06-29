
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TouchFriendlyButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  type?: 'button' | 'submit' | 'reset';
  asChild?: boolean;
  title?: string;
  hapticFeedback?: boolean;
}

export const TouchFriendlyButton: React.FC<TouchFriendlyButtonProps> = ({
  children,
  onClick,
  className,
  disabled = false,
  variant = 'default',
  size = 'default',
  type = 'button',
  asChild = false,
  title,
  hapticFeedback = false,
  ...props
}) => {
  const handleClick = () => {
    if (hapticFeedback && 'vibrate' in navigator) {
      navigator.vibrate(10);
    }
    if (onClick) {
      onClick();
    }
  };

  return (
    <Button
      type={type}
      onClick={handleClick}
      disabled={disabled}
      variant={variant}
      size={size}
      asChild={asChild}
      title={title}
      className={cn(
        'min-h-[44px] min-w-[44px] touch-manipulation select-none',
        'active:scale-95 transition-transform duration-150',
        'focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
};

export default TouchFriendlyButton;
