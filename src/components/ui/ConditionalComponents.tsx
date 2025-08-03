import React from 'react';
import { hasItems, isEmpty, renderIfHasItems } from '@/lib/utils/array';
import { createEmptyState, EmptyStateConfig } from '@/lib/utils/patterns';

interface EmptyStateProps extends EmptyStateConfig {
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  action,
  className = ""
}) => (
  <div className={`text-center py-12 ${className}`}>
    <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
    {description && (
      <p className="text-gray-500 mb-4">{description}</p>
    )}
    {action && (
      <button
        onClick={action.onClick}
        className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
      >
        {action.label}
      </button>
    )}
  </div>
);

interface LoadingStateProps {
  isLoading: boolean;
  hasData: boolean;
  children: React.ReactNode;
  emptyState?: EmptyStateConfig;
  loadingComponent?: React.ReactNode;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  isLoading,
  hasData,
  children,
  emptyState,
  loadingComponent
}) => {
  if (isLoading && !hasData) {
    return loadingComponent || <div className="animate-pulse">Loading...</div>;
  }

  if (!isLoading && !hasData) {
    return emptyState ? <EmptyState {...emptyState} /> : null;
  }

  return <>{children}</>;
};

interface ConditionalListProps<T> {
  items?: T[] | null;
  renderItem: (item: T, index: number) => React.ReactNode;
  renderEmpty?: () => React.ReactNode;
  className?: string;
}

export const ConditionalList = <T,>({
  items,
  renderItem,
  renderEmpty,
  className = ""
}: ConditionalListProps<T>) => {
  return (
    <div className={className}>
      {renderIfHasItems(
        items,
        (itemArray) => itemArray.map(renderItem),
        renderEmpty?.()
      )}
    </div>
  );
};

interface SmartGridProps<T> {
  items?: T[] | null;
  renderItem: (item: T) => React.ReactNode;
  emptyState?: EmptyStateConfig;
  className?: string;
  gridClassName?: string;
}

export const SmartGrid = <T,>({
  items,
  renderItem,
  emptyState,
  className = "",
  gridClassName = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
}: SmartGridProps<T>) => {
  return (
    <div className={className}>
      {hasItems(items) ? (
        <div className={gridClassName}>
          {items.map(renderItem)}
        </div>
      ) : (
        emptyState && <EmptyState {...emptyState} />
      )}
    </div>
  );
};