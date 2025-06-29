
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { TouchFriendlyButton } from '@/components/responsive/TouchFriendlyButton';

interface DashboardHeaderProps {
  onGoBack: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onGoBack }) => {
  return (
    <div className="container mx-auto px-6 pt-6">
      <TouchFriendlyButton
        variant="ghost"
        size="sm"
        onClick={onGoBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
        hapticFeedback={true}
      >
        <ArrowLeft size={16} />
        <span className="hidden sm:inline">Back to Landing</span>
        <span className="sm:hidden">Back</span>
      </TouchFriendlyButton>
    </div>
  );
};

export default DashboardHeader;
