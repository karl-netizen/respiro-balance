
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useMeditationSessions } from '@/hooks/useMeditationSessions';
import { useMeditationFeedback } from '@/hooks/useMeditationFeedback';
import { useBiometricData } from '@/hooks/useBiometricData';

export const useSessionActions = (sessionId: string | undefined) => {
  const navigate = useNavigate();
  const { completeSession } = useMeditationSessions();
  const { addBiometricData } = useBiometricData();
  const { addFeedback } = useMeditationFeedback();
  
  const handleBackToLibrary = () => {
    navigate('/meditate');
  };
  
  const handleSessionComplete = () => {
    if (sessionId) {
      completeSession(sessionId);
    }
  };
  
  const handleToggleFavorite = () => {
    toast.success('Added to favorites');
  };
  
  const handleShareSession = () => {
    navigator.clipboard.writeText(`Check out this meditation: ${window.location.href}`);
    toast.success('Link copied to clipboard');
  };
  
  const handleFeedbackSubmit = (rating: number, comment: string) => {
    if (sessionId) {
      addFeedback(sessionId, rating, comment);
      
      toast.success('Thank you for your feedback!', {
        description: 'Your insights help improve our meditations.'
      });
      
      // Navigate back to library after a short delay
      setTimeout(() => {
        navigate('/meditate');
      }, 2000);
    }
  };
  
  const handleContinueWithoutFeedback = () => {
    navigate('/meditate');
  };
  
  const submitBiometricData = (sessionId: string, biometricData: any) => {
    if (sessionId && biometricData) {
      addBiometricData({
        ...biometricData,
        sessionId
      });
    }
  };
  
  return {
    handleBackToLibrary,
    handleSessionComplete,
    handleToggleFavorite,
    handleShareSession,
    handleFeedbackSubmit,
    handleContinueWithoutFeedback,
    submitBiometricData
  };
};

export default useSessionActions;
