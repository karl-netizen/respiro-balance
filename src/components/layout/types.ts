import { ReactNode } from 'react';

export interface LayoutProps {
  children: ReactNode;
  className?: string;
}

export interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
  className?: string;
  children?: ReactNode;
}

export interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  children?: ReactNode;
}