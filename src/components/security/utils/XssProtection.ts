// XSS Protection Utilities
// Extracted from SecureFormComponents.tsx

import { Result, Ok, Err } from '@/types/advanced-patterns';

// Content Security Policy helpers
export const CSP_DIRECTIVES = {
  'default-src': ["'self'"],
  'script-src': ["'self'", "'unsafe-inline'"],
  'style-src': ["'self'", "'unsafe-inline'"],
  'img-src': ["'self'", 'data:', 'https:'],
  'font-src': ["'self'", 'https://fonts.gstatic.com'],
  'connect-src': ["'self'"],
  'frame-ancestors': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
} as const;

export const generateCSPHeader = (): string => {
  return Object.entries(CSP_DIRECTIVES)
    .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
    .join('; ');
};

// HTML encoding for XSS prevention
export const encodeHtml = (input: string): string => {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
};

export const decodeHtml = (input: string): string => {
  const div = document.createElement('div');
  div.innerHTML = input;
  return div.textContent || '';
};

// URL sanitization
export const sanitizeUrl = (url: string): string => {
  try {
    const parsed = new URL(url);

    const allowedProtocols = ['http:', 'https:', 'mailto:'];
    if (!allowedProtocols.includes(parsed.protocol)) {
      return '';
    }

    if (parsed.protocol === 'javascript:' || parsed.protocol === 'data:') {
      return '';
    }

    return parsed.toString();
  } catch {
    return '';
  }
};

// Safe JSON parsing with size limits
export function safeJsonParse<T>(
  json: string,
  maxSize: number = 10000
): Result<T, string> {
  if (json.length > maxSize) {
    return Err('JSON payload too large');
  }

  try {
    const parsed = JSON.parse(json);
    return Ok(parsed);
  } catch (error) {
    return Err('Invalid JSON format');
  }
}
