
import React from 'react';
import * as LucideIcons from 'lucide-react';
import { cn } from '@/lib/utils';

interface LucideIconProps {
  name: string;
  className?: string;
}

// This component renders a Lucide icon dynamically based on name
const LucideIcon: React.FC<LucideIconProps> = ({ name, className }) => {
  const Icon = (LucideIcons as any)[name.charAt(0).toUpperCase() + name.slice(1)] || LucideIcons.HelpCircle;
  
  return <Icon className={cn('h-4 w-4 text-respiro-dark', className)} />;
};

export default LucideIcon;
