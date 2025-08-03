/**
 * Common UI patterns and utilities
 */

// Loading state patterns
export const createLoadingState = (isLoading: boolean, hasData: boolean) => ({
  showSkeleton: isLoading && !hasData,
  showContent: !isLoading && hasData,
  showEmpty: !isLoading && !hasData,
  showError: false // Can be extended
});

// Empty state utilities
export interface EmptyStateConfig {
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const createEmptyState = (
  title: string,
  description?: string,
  action?: EmptyStateConfig['action']
): EmptyStateConfig => ({
  title,
  description,
  action
});

// Common error handling patterns
export const handleAsyncOperation = async <T>(
  operation: () => Promise<T>,
  onSuccess?: (result: T) => void,
  onError?: (error: Error) => void
): Promise<{ data?: T; error?: Error }> => {
  try {
    const data = await operation();
    onSuccess?.(data);
    return { data };
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    onError?.(err);
    return { error: err };
  }
};

// Consistent format utilities
export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMins = minutes % 60;
  return remainingMins > 0 ? `${hours}h ${remainingMins}m` : `${hours}h`;
};

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const formatPercentage = (value: number, total: number): string => {
  if (total === 0) return '0%';
  return `${Math.round((value / total) * 100)}%`;
};

// Consistent color utilities
export const getDifficultyColor = (difficulty: string): string => {
  switch (difficulty.toLowerCase()) {
    case 'beginner':
      return 'bg-green-100 text-green-800';
    case 'intermediate':
      return 'bg-yellow-100 text-yellow-800';
    case 'advanced':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getCategoryColor = (category: string): string => {
  switch (category.toLowerCase()) {
    case 'guided':
      return 'bg-blue-100 text-blue-800';
    case 'quick':
      return 'bg-green-100 text-green-800';
    case 'deep':
      return 'bg-purple-100 text-purple-800';
    case 'sleep':
      return 'bg-indigo-100 text-indigo-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Debounce utility for search
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};