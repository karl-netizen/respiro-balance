
export const useMeditationFeedback = () => {
  const addFeedback = (sessionId: string, rating: number, comment: string) => {
    // Mock implementation
    console.log('Feedback added:', { sessionId, rating, comment });
  };

  return {
    addFeedback
  };
};
