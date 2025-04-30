
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
  
  const addFeedback = (sessionId: string, rating: number, comment: string = '') => {
    const newFeedback: MeditationSessionFeedback = {
      sessionId,
      rating,
      comment,
      submittedAt: new Date().toISOString()
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
  
  return {
    sessionFeedbacks,
    addFeedback,
    getSessionFeedback,
    getAverageRating
  };
};

export default useMeditationFeedback;
