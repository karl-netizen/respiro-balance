
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { TouchFriendlyButton } from '@/components/responsive/TouchFriendlyButton';
import { useNavigationHistory } from '@/context/NavigationHistoryProvider';

const BackButton: React.FC = () => {
  const { canGoBack, goBack } = useNavigationHistory();

  // Only show the back button if we can actually go back
  if (!canGoBack) {
    return null;
  }

  return (
    <TouchFriendlyButton
      variant="ghost"
      size="sm"
      onClick={goBack}
      className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
      hapticFeedback={true}
    >
      <ArrowLeft size={16} />
      <span className="hidden sm:inline">Previous Page</span>
      <span className="sm:hidden">Back</span>
    </TouchFriendlyButton>
  );
};

export default BackButton;
