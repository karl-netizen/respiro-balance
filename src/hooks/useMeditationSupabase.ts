
import { useMeditationFetch, useMeditationCRUD } from './meditation';

export type { MeditationSession } from './meditation';

export const useMeditationSupabase = () => {
  const { sessions, isLoading, error, fetchSessions, getSessionById } = useMeditationFetch();
  const { createSession, updateSession, deleteSession, isLoading: crudLoading } = useMeditationCRUD();

  return {
    sessions,
    isLoading: isLoading || crudLoading,
    error,
    fetchSessions,
    createSession,
    updateSession,
    deleteSession,
    getSessionById,
  };
};

export default useMeditationSupabase;
