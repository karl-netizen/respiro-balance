/**
 * Core application type definitions
 */

// Base entity interface
export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at?: string;
}

// Common component props
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

// Loading and error states
export interface LoadingState {
  isLoading: boolean;
  error?: string | null;
}

// Pagination
export interface PaginationOptions {
  page: number;
  limit: number;
  total?: number;
}

// Filter options
export interface FilterOptions {
  searchTerm?: string;
  category?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// View modes
export type ViewMode = 'grid' | 'list' | 'card';

// Device types
export type DeviceType = 'mobile' | 'tablet' | 'desktop';

// Common status types
export type Status = 'idle' | 'loading' | 'success' | 'error';