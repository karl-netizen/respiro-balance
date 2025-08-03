/**
 * UI-specific type definitions
 */

import { ReactNode } from 'react';

// Button variants and sizes
export type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
export type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

// Card variants
export type CardVariant = 'default' | 'elevated' | 'outlined' | 'filled';

// Toast types
export type ToastType = 'default' | 'success' | 'error' | 'warning' | 'info';

// Modal sizes
export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

// Animation types
export type AnimationType = 'fade' | 'slide' | 'scale' | 'bounce' | 'spin';

// Theme modes
export type ThemeMode = 'light' | 'dark' | 'system';

// Navigation item
export interface NavigationItem {
  id: string;
  label: string;
  href?: string;
  icon?: ReactNode;
  children?: NavigationItem[];
  badge?: string | number;
  disabled?: boolean;
}

// Form field types
export type FieldType = 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'checkbox' | 'radio';

// Validation rules
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | boolean;
}