
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
}

export const TouchFriendlyButton: React.FC<TouchFriendlyButtonProps> = ({
  children,
  onClick,
  className,
  disabled = false,
  variant = 'default',
  size = 'default',
  type = 'button'
}) => {
  return (
    <Button
      type={type}
      onClick={onClick}
      disabled={disabled}
      variant={variant}
      size={size}
      className={cn(
        'min-h-[44px] min-w-[44px] touch-manipulation select-none',
        'active:scale-95 transition-transform duration-150',
        'focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
        className
      )}
    >
      {children}
    </Button>
  );
};

export default TouchFriendlyButton;
