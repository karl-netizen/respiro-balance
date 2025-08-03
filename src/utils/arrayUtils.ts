/**
 * Array utility functions to eliminate repetitive patterns
 */

// Primary array check utilities
export const hasItems = <T>(array?: T[] | null): array is T[] => {
  return Array.isArray(array) && array.length > 0;
};

export const isEmpty = <T>(array?: T[] | null): boolean => {
  return !hasItems(array);
};

export const getLength = <T>(array?: T[] | null): number => {
  return hasItems(array) ? array.length : 0;
};

// Safe array access utilities
export const firstItem = <T>(array?: T[] | null): T | undefined => {
  return hasItems(array) ? array[0] : undefined;
};

export const lastItem = <T>(array?: T[] | null): T | undefined => {
  return hasItems(array) ? array[array.length - 1] : undefined;
};

export const safeSlice = <T>(array?: T[] | null, start?: number, end?: number): T[] => {
  return hasItems(array) ? array.slice(start, end) : [];
};

// Conditional operations utilities
export const mapIfHasItems = <T, R>(
  array: T[] | null | undefined, 
  mapFn: (array: T[]) => R,
  fallback?: R
): R | undefined => {
  if (hasItems(array)) {
    return mapFn(array);
  }
  return fallback;
};

export const forEachIfHasItems = <T>(
  array: T[] | null | undefined,
  callback: (item: T, index: number, array: T[]) => void
): void => {
  if (hasItems(array)) {
    array.forEach(callback);
  }
};

// Filtering utilities
export const filterAndCheck = <T>(
  array: T[] | null | undefined,
  predicate: (item: T) => boolean
): { filtered: T[]; hasResults: boolean } => {
  if (!hasItems(array)) {
    return { filtered: [], hasResults: false };
  }
  
  const filtered = array.filter(predicate);
  return { 
    filtered, 
    hasResults: hasItems(filtered) 
  };
};

// Statistics utilities
export const calculateAverage = (numbers: number[]): number => {
  return hasItems(numbers) ? numbers.reduce((sum, n) => sum + n, 0) / numbers.length : 0;
};

export const calculateRate = (numerator: number, array?: any[] | null): number => {
  return hasItems(array) ? Math.round((numerator / array.length) * 100) : 0;
};

// Common patterns for UI components
export const renderIfHasItems = <T>(
  array: T[] | null | undefined,
  renderFn: (items: T[]) => React.ReactNode,
  emptyState?: React.ReactNode
): React.ReactNode => {
  if (hasItems(array)) {
    return renderFn(array);
  }
  return emptyState || null;
};

export const conditionalClassName = <T>(
  array: T[] | null | undefined,
  hasItemsClass: string,
  emptyClass?: string
): string => {
  return hasItems(array) ? hasItemsClass : (emptyClass || '');
};

import React from 'react';