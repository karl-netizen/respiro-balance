/**
 * UI-related constants
 */

export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536
} as const;

export const Z_INDEX = {
  DROPDOWN: 1000,
  STICKY: 1020,
  FIXED: 1030,
  MODAL_BACKDROP: 1040,
  MODAL: 1050,
  POPOVER: 1060,
  TOOLTIP: 1070,
  TOAST: 1080
} as const;

export const ANIMATION_CLASSES = {
  FADE_IN: 'animate-in fade-in-0',
  FADE_OUT: 'animate-out fade-out-0',
  SLIDE_IN_FROM_TOP: 'animate-in slide-in-from-top-2',
  SLIDE_IN_FROM_BOTTOM: 'animate-in slide-in-from-bottom-2',
  SLIDE_IN_FROM_LEFT: 'animate-in slide-in-from-left-2',
  SLIDE_IN_FROM_RIGHT: 'animate-in slide-in-from-right-2',
  SCALE_IN: 'animate-in zoom-in-95',
  SCALE_OUT: 'animate-out zoom-out-95'
} as const;