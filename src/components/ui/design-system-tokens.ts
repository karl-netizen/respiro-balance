// ===================================================================
// DESIGN SYSTEM TOKENS - Integrates with existing CSS variables
// ===================================================================

import { CSSProperties } from 'react';

// 1. TYPE DEFINITIONS
// ===================================================================

export type ButtonVariant = {
  variant: 'primary' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link';
  size: 'sm' | 'md' | 'lg' | 'icon';
};

export type AlertVariant = 
  | { type: 'info'; dismissible?: boolean }
  | { type: 'success'; dismissible?: boolean; action?: { label: string; onClick: () => void } }
  | { type: 'warning'; dismissible?: boolean }
  | { type: 'error'; dismissible?: boolean; retry?: () => void };

export type FormFieldState = 
  | { state: 'default' }
  | { state: 'valid' }
  | { state: 'invalid' }
  | { state: 'disabled' };

export type AriaLabel = string;
export type FocusableElement = HTMLElement & { focus(): void };

// 2. DESIGN TOKENS - Using CSS variables from index.css
// ===================================================================

export const colors = {
  // Primary brand colors (from CSS variables)
  primary: {
    50: 'hsl(174, 100%, 97%)',
    100: 'hsl(174, 100%, 94%)', // --respiro-light
    200: 'hsl(174, 44%, 75%)',
    300: 'hsl(174, 44%, 65%)',
    400: 'hsl(174, 44%, 55%)',
    500: 'hsl(174, 44%, 51%)', // --respiro-default / --primary
    600: 'hsl(174, 67%, 40%)',
    700: 'hsl(174, 67%, 27%)', // --respiro-dark / --accent
    800: 'hsl(174, 67%, 20%)',
    900: 'hsl(174, 67%, 15%)', // --respiro-darker
  },
  
  // Neutral colors
  neutral: {
    0: 'hsl(0, 0%, 100%)', // white
    50: 'hsl(210, 40%, 98%)', // --muted
    100: 'hsl(210, 40%, 95%)',
    200: 'hsl(210, 40%, 90%)',
    300: 'hsl(210, 40%, 80%)',
    400: 'hsl(215, 16%, 47%)', // --muted-foreground
    500: 'hsl(215, 16%, 40%)',
    600: 'hsl(215, 16%, 30%)',
    700: 'hsl(210, 40%, 25%)',
    800: 'hsl(210, 40%, 15%)',
    900: 'hsl(210, 40%, 5%)', // dark background
  },

  // Semantic colors
  semantic: {
    success: 'hsl(142, 76%, 36%)',
    error: 'hsl(0, 84%, 60%)', // --destructive
    warning: 'hsl(38, 92%, 50%)',
    info: 'hsl(174, 44%, 51%)', // same as primary
  }
};

export const spacing = {
  1: '0.25rem', // 4px
  2: '0.5rem',  // 8px
  3: '0.75rem', // 12px
  4: '1rem',    // 16px
  5: '1.25rem', // 20px
  6: '1.5rem',  // 24px
  8: '2rem',    // 32px
  10: '2.5rem', // 40px
  12: '3rem',   // 48px
  16: '4rem',   // 64px
};

export const typography = {
  fontSize: {
    xs: '0.75rem',   // --font-size-xs
    sm: '0.875rem',  // --font-size-sm
    base: '1rem',    // --font-size-base
    lg: '1.125rem',  // --font-size-lg
    xl: '1.25rem',   // --font-size-xl
    '2xl': '1.5rem', // --font-size-2xl
    '3xl': '1.875rem', // --font-size-3xl
    '4xl': '2.25rem',  // --font-size-4xl
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    none: 1,
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.625,
  }
};

export const radius = {
  none: '0px',
  sm: '0.25rem',  // 4px
  md: '0.375rem', // 6px
  lg: '0.5rem',   // 8px
  xl: '0.75rem',  // 12px
  full: '9999px',
};

export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
};

// 3. ACCESSIBILITY CONSTANTS
// ===================================================================

export const KEYBOARD_KEYS = {
  ENTER: 'Enter',
  SPACE: ' ',
  TAB: 'Tab',
  ESCAPE: 'Escape',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  HOME: 'Home',
  END: 'End',
} as const;

export const ARIA_ROLES = {
  BUTTON: 'button',
  DIALOG: 'dialog',
  ALERT: 'alert',
  MENU: 'menu',
  MENUITEM: 'menuitem',
  TAB: 'tab',
  TABPANEL: 'tabpanel',
  LISTBOX: 'listbox',
  OPTION: 'option',
} as const;

// 4. UTILITY STYLES
// ===================================================================

export const srOnly: CSSProperties = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0,
};

export const focusVisible: CSSProperties = {
  outline: `2px solid ${colors.primary[500]}`,
  outlineOffset: '2px',
  borderRadius: radius.sm,
};

// 5. BUTTON STYLES FUNCTION
// ===================================================================

export const getButtonStyles = (variant: ButtonVariant): CSSProperties => {
  const baseStyles: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    fontWeight: typography.fontWeight.medium,
    fontSize: typography.fontSize.sm,
    transition: 'all 150ms ease-in-out',
    cursor: 'pointer',
    border: 'none',
    textDecoration: 'none',
    userSelect: 'none',
  };

  // Size styles
  const sizeStyles = {
    sm: {
      height: '2rem', // 32px
      paddingLeft: spacing[3],
      paddingRight: spacing[3],
      fontSize: typography.fontSize.xs,
    },
    md: {
      height: '2.5rem', // 40px
      paddingLeft: spacing[4],
      paddingRight: spacing[4],
      fontSize: typography.fontSize.sm,
    },
    lg: {
      height: '3rem', // 48px
      paddingLeft: spacing[6],
      paddingRight: spacing[6],
      fontSize: typography.fontSize.base,
    },
    icon: {
      height: '2.5rem',
      width: '2.5rem',
      padding: 0,
    },
  };

  // Variant styles
  const variantStyles = {
    primary: {
      backgroundColor: colors.primary[500],
      color: 'white',
      boxShadow: shadows.sm,
      ':hover': {
        backgroundColor: colors.primary[600],
        boxShadow: shadows.md,
      },
      ':active': {
        backgroundColor: colors.primary[700],
      },
    },
    secondary: {
      backgroundColor: colors.primary[100],
      color: colors.primary[700],
      ':hover': {
        backgroundColor: colors.primary[200],
      },
      ':active': {
        backgroundColor: colors.primary[300],
      },
    },
    destructive: {
      backgroundColor: colors.semantic.error,
      color: 'white',
      ':hover': {
        backgroundColor: 'hsl(0, 84%, 55%)',
      },
      ':active': {
        backgroundColor: 'hsl(0, 84%, 50%)',
      },
    },
    outline: {
      backgroundColor: 'transparent',
      color: colors.primary[600],
      border: `1px solid ${colors.primary[300]}`,
      ':hover': {
        backgroundColor: colors.primary[50],
        borderColor: colors.primary[400],
      },
      ':active': {
        backgroundColor: colors.primary[100],
      },
    },
    ghost: {
      backgroundColor: 'transparent',
      color: colors.primary[600],
      ':hover': {
        backgroundColor: colors.primary[50],
      },
      ':active': {
        backgroundColor: colors.primary[100],
      },
    },
    link: {
      backgroundColor: 'transparent',
      color: colors.primary[600],
      textDecoration: 'underline',
      textUnderlineOffset: '4px',
      ':hover': {
        color: colors.primary[700],
      },
      ':active': {
        color: colors.primary[800],
      },
    },
  };

  return {
    ...baseStyles,
    ...sizeStyles[variant.size],
    ...variantStyles[variant.variant],
  };
};

// 6. ANIMATIONS
// ===================================================================

export const animations = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.2 },
  },
  fadeUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
    transition: { duration: 0.3 },
  },
  scaleIn: {
    initial: { scale: 0.95, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.95, opacity: 0 },
    transition: { duration: 0.2 },
  },
  slideIn: {
    initial: { x: -100, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -100, opacity: 0 },
    transition: { duration: 0.3 },
  },
};

// 7. RESPONSIVE UTILITIES
// ===================================================================

export const breakpoints = {
  xs: '475px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

export const mediaQuery = {
  xs: `@media (min-width: ${breakpoints.xs})`,
  sm: `@media (min-width: ${breakpoints.sm})`,
  md: `@media (min-width: ${breakpoints.md})`,
  lg: `@media (min-width: ${breakpoints.lg})`,
  xl: `@media (min-width: ${breakpoints.xl})`,
  '2xl': `@media (min-width: ${breakpoints['2xl']})`,
  touch: '@media (hover: none) and (pointer: coarse)',
  hover: '@media (hover: hover) and (pointer: fine)',
};

// 8. UTILITY FUNCTIONS
// ===================================================================

export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

export const getColorValue = (colorPath: string): string => {
  const parts = colorPath.split('.');
  let current: any = colors;
  
  for (const part of parts) {
    current = current[part];
    if (!current) return colorPath; // fallback to original string
  }
  
  return current;
};

export const generateColorScale = (baseColor: string) => ({
  50: `color-mix(in srgb, ${baseColor} 5%, white)`,
  100: `color-mix(in srgb, ${baseColor} 10%, white)`,
  200: `color-mix(in srgb, ${baseColor} 20%, white)`,
  300: `color-mix(in srgb, ${baseColor} 30%, white)`,
  400: `color-mix(in srgb, ${baseColor} 40%, white)`,
  500: baseColor,
  600: `color-mix(in srgb, ${baseColor} 80%, black)`,
  700: `color-mix(in srgb, ${baseColor} 70%, black)`,
  800: `color-mix(in srgb, ${baseColor} 60%, black)`,
  900: `color-mix(in srgb, ${baseColor} 50%, black)`,
});

// Export all tokens
export default {
  colors,
  spacing,
  typography,
  radius,
  shadows,
  focusVisible,
  srOnly,
  getButtonStyles,
  animations,
  KEYBOARD_KEYS,
  ARIA_ROLES,
  cn,
  getColorValue,
  generateColorScale,
};