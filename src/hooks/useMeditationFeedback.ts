
import { useState, useEffect } from 'react';
import { MeditationSessionFeedback } from '@/types/meditation';
import { toast } from 'sonner';

export const useMeditationFeedback = () => {
  const [sessionFeedbacks, setSessionFeedbacks] = useState<MeditationSessionFeedback[]>([]);
  
  // Load feedbacks from localStorage on mount
  useEffect(() => {
    const savedFeedbacks = localStorage.getItem('meditationFeedbacks');
    if (savedFeedbacks) {
      try {
        setSessionFeedbacks(JSON.parse(savedFeedbacks));
      } catch (error) {
        console.error('Error parsing saved feedbacks:', error);
        setSessionFeedbacks([]);
      }
    }
  }, []);
  
  // Save feedbacks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('meditationFeedbacks', JSON.stringify(sessionFeedbacks));
  }, [sessionFeedbacks]);
  
  const addFeedback = (
    sessionId: string, 
    rating: number, 
    comment: string = '',
    additionalData?: {
      mood?: string;
      focusImprovement?: number;
      stressReduction?: number;
      wouldRecommend?: boolean;
    }
  ) => {
    const newFeedback: MeditationSessionFeedback = {
      sessionId,
      rating,
      comment,
      submittedAt: new Date().toISOString(),
      ...additionalData
    };
    
    setSessionFeedbacks(prev => [...prev, newFeedback]);
    
    // Show success toast
    toast.success('Feedback submitted', {
      description: 'Thank you for sharing your experience!'
    });
    
    return newFeedback;
  };
  
  const getSessionFeedback = (sessionId: string) => {
    return sessionFeedbacks.filter(feedback => feedback.sessionId === sessionId);
  };
  
  const getAverageRating = (sessionId: string) => {
    const sessionRatings = sessionFeedbacks
      .filter(feedback => feedback.sessionId === sessionId)
      .map(feedback => feedback.rating);
    
    if (sessionRatings.length === 0) return 0;
    
    const sum = sessionRatings.reduce((acc, rating) => acc + rating, 0);
    return sum / sessionRatings.length;
  };

  const getMostPositiveFeedback = () => {
    return [...sessionFeedbacks]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 3);
  };
  
  const getFeedbackInsights = () => {
    if (sessionFeedbacks.length === 0) return null;
    
    const totalSessions = sessionFeedbacks.length;
    const averageRating = sessionFeedbacks.reduce((sum, feedback) => sum + feedback.rating, 0) / totalSessions;
    
    // Calculate focus improvement if available
    const focusData = sessionFeedbacks.filter(f => f.focusImprovement !== undefined);
    const avgFocusImprovement = focusData.length > 0 
      ? focusData.reduce((sum, f) => sum + (f.focusImprovement || 0), 0) / focusData.length
      : undefined;
    
    // Calculate stress reduction if available
    const stressData = sessionFeedbacks.filter(f => f.stressReduction !== undefined);
    const avgStressReduction = stressData.length > 0
      ? stressData.reduce((sum, f) => sum + (f.stressReduction || 0), 0) / stressData.length
      : undefined;
      
    return {
      totalFeedbacks: totalSessions,
      averageRating,
      avgFocusImprovement,
      avgStressReduction,
      recommendRate: sessionFeedbacks.filter(f => f.wouldRecommend).length / totalSessions
    };
  };
  
  return {
    sessionFeedbacks,
    addFeedback,
    getSessionFeedback,
    getAverageRating,
    getMostPositiveFeedback,
    getFeedbackInsights
  };
};

export default useMeditationFeedback;
