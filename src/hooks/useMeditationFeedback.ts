
import { useState, useEffect } from 'react';

interface FeedbackData {
  sessionId: string;
  rating: number;
  comment: string;
  timestamp: string;
}

export const useMeditationFeedback = () => {
  const [feedback, setFeedback] = useState<FeedbackData[]>([]);

  useEffect(() => {
    // Load feedback from localStorage
    const stored = localStorage.getItem('meditation-feedback');
    if (stored) {
      setFeedback(JSON.parse(stored));
    }
  }, []);

  const addFeedback = (sessionId: string, rating: number, comment: string = '') => {
    const newFeedback: FeedbackData = {
      sessionId,
      rating,
      comment,
      timestamp: new Date().toISOString()
    };

    const updated = [newFeedback, ...feedback];
    setFeedback(updated);
    localStorage.setItem('meditation-feedback', JSON.stringify(updated));
  };

  const getFeedbackForSession = (sessionId: string) => {
    return feedback.find(f => f.sessionId === sessionId);
  };

  const getAverageRating = () => {
    if (feedback.length === 0) return 0;
    const sum = feedback.reduce((acc, f) => acc + f.rating, 0);
    return Math.round((sum / feedback.length) * 10) / 10;
  };

  return {
    feedback,
    addFeedback,
    getFeedbackForSession,
    getAverageRating
  };
};
