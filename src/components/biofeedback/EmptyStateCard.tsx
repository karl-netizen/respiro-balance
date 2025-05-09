
import React, { ReactNode } from 'react';

export interface EmptyStateCardProps {
  children: ReactNode;
  title: string;
  description: string;
  icon: ReactNode;
}

export const EmptyStateCard: React.FC<EmptyStateCardProps> = ({
  children,
  title,
  description,
  icon
}) => {
  return (
    <div className="bg-card border rounded-lg p-6 text-center">
      <div className="mx-auto w-12 h-12 flex items-center justify-center text-primary mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6">{description}</p>
      {children}
    </div>
  );
};

export default EmptyStateCard;
