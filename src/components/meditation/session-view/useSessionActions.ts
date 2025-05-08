
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { useBiometricData } from '@/hooks/useBiometricData';
import { BiometricData } from '@/components/meditation/types/BiometricTypes';

export const useSessionActions = (sessionId?: string) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { biometricData } = useBiometricData();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Navigate back to the meditation library page
  const handleBackToLibrary = () => {
    navigate('/meditate');
  };
  
  // Mark the session as completed
  const handleSessionComplete = async () => {
    if (!sessionId || !user) return;
    
    try {
      const { error } = await supabase
        .from('meditation_sessions')
        .update({
          completed: true,
          completed_at: new Date().toISOString()
        })
        .eq('id', sessionId)
        .eq('user_id', user.id);
      
      if (error) {
        throw error;
      }
      
      toast.success('Meditation session completed!');
    } catch (error: any) {
      console.error('Error completing session:', error);
      toast.error('Failed to update session status');
    }
  };
  
  // Toggle favorite status for a session
  const handleToggleFavorite = async () => {
    if (!sessionId || !user) return;
    
    try {
      // First get the current status
      const { data, error } = await supabase
        .from('meditation_sessions')
        .select('favorite')
        .eq('id', sessionId)
        .eq('user_id', user.id)
        .single();
      
      if (error) {
        throw error;
      }
      
      // Toggle the favorite status
      const newStatus = !(data?.favorite);
      
      const { error: updateError } = await supabase
        .from('meditation_sessions')
        .update({ favorite: newStatus })
        .eq('id', sessionId)
        .eq('user_id', user.id);
      
      if (updateError) {
        throw updateError;
      }
      
      toast.success(newStatus ? 'Added to favorites!' : 'Removed from favorites');
    } catch (error: any) {
      console.error('Error toggling favorite:', error);
      toast.error('Failed to update favorite status');
    }
  };
  
  // Share the session with others
  const handleShareSession = () => {
    if (!sessionId) return;
    
    // Implement share functionality
    // This could be social sharing, copy to clipboard, etc.
    const shareUrl = `${window.location.origin}/meditate/session/${sessionId}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Check out this meditation session',
        text: 'I found this great meditation session!',
        url: shareUrl
      }).catch(error => {
        console.error('Error sharing:', error);
      });
    } else {
      // Fallback to clipboard copy
      navigator.clipboard.writeText(shareUrl)
        .then(() => {
          toast.success('Link copied to clipboard!');
        })
        .catch(error => {
          console.error('Error copying to clipboard:', error);
          toast.error('Failed to copy link');
        });
    }
  };
  
  // Submit user feedback for the session
  const handleFeedbackSubmit = async (rating: number, feedback?: string) => {
    if (!sessionId || !user) return;
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('meditation_sessions')
        .update({
          rating,
          feedback
        })
        .eq('id', sessionId)
        .eq('user_id', user.id);
      
      if (error) {
        throw error;
      }
      
      toast.success('Thank you for your feedback!');
    } catch (error: any) {
      console.error('Error submitting feedback:', error);
      toast.error('Failed to submit feedback');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Continue without submitting feedback
  const handleContinueWithoutFeedback = () => {
    navigate('/meditate');
  };
  
  // Submit biometric data for the session
  const submitBiometricData = async (sessionId: string, biometricData: BiometricData) => {
    if (!user || !sessionId) return;
    
    try {
      const dataToSubmit = {
        user_id: user.id,
        session_id: sessionId,
        heart_rate: biometricData.heart_rate || biometricData.heartRate,
        hrv: biometricData.hrv,
        respiratory_rate: biometricData.respiratory_rate || biometricData.breath_rate || biometricData.breathRate,
        stress_score: biometricData.stress_score || biometricData.stress_level,
        coherence: biometricData.coherence,
        recorded_at: new Date().toISOString()
      };
      
      const { error } = await supabase
        .from('biometric_data')
        .insert([dataToSubmit]);
      
      if (error) {
        throw error;
      }
      
      console.log('Biometric data saved successfully');
    } catch (error: any) {
      console.error('Error saving biometric data:', error);
    }
  };
  
  return {
    isSubmitting,
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
