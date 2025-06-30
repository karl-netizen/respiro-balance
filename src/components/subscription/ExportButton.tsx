
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useSubscriptionContext } from '@/context/SubscriptionProvider';

interface ExportButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export const ExportButton: React.FC<ExportButtonProps> = ({
  onClick,
  disabled = false,
  className = ''
}) => {
  const { isPremium } = useSubscriptionContext();

  if (!isPremium) {
    return null;
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      disabled={disabled}
      className={className}
    >
      <Download className="h-4 w-4 mr-2" />
      Export Data
    </Button>
  );
};

export default ExportButton;
