
import { useState } from 'react';

export const useMeditationRatings = () => {
  const [showRatingDialog, setShowRatingDialog] = useState(false);
  
  const handleSubmitRating = (sessionId: string, rating: number, feedback: string) => {
    // Get existing ratings or initialize empty object
    const existingRatings = localStorage.getItem('meditationRatings');
    const ratings = existingRatings ? JSON.parse(existingRatings) : {};
    
    // Add or update rating for this session
    ratings[sessionId] = { rating, feedback, timestamp: new Date().toISOString() };
    
    // Save back to localStorage
    localStorage.setItem('meditationRatings', JSON.stringify(ratings));
    
    // Close the rating dialog
    setShowRatingDialog(false);
  };
  
  return {
    showRatingDialog,
    setShowRatingDialog,
    handleSubmitRating
  };
};
