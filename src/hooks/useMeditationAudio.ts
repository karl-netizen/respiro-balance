
import { useState, useEffect } from 'react';
import { MeditationSession } from '@/types/meditation';
import { fetchMeditationAudioFiles, mapAudioFilesToSessions, initializeAudioBucket } from '@/lib/meditationAudioIntegration';

export const useMeditationAudio = (sessions: MeditationSession[]) => {
  const [audioFiles, setAudioFiles] = useState<string[]>([]);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(false);
  const [sessionsWithAudio, setSessionsWithAudio] = useState<MeditationSession[]>(sessions);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Initialize audio bucket and fetch available audio files
  useEffect(() => {
    const initAudio = async () => {
      setIsLoading(true);
      
      try {
        // Initialize the audio bucket if it doesn't exist
        const bucketInitialized = await initializeAudioBucket();
        
        if (bucketInitialized) {
          // Fetch available audio files
          const files = await fetchMeditationAudioFiles();
          setAudioFiles(files);
          setAudioEnabled(files.length > 0);
          
          // Map audio files to sessions
          if (files.length > 0 && sessions.length > 0) {
            const updatedSessions = mapAudioFilesToSessions(sessions, files);
            setSessionsWithAudio(updatedSessions);
          } else {
            setSessionsWithAudio(sessions);
          }
        }
      } catch (error) {
        console.error('Error initializing meditation audio:', error);
        setSessionsWithAudio(sessions);
      } finally {
        setIsLoading(false);
      }
    };
    
    initAudio();
  }, [sessions]);
  
  // Update sessions with audio when either sessions or audioFiles change
  useEffect(() => {
    if (audioFiles.length > 0 && sessions.length > 0) {
      const updatedSessions = mapAudioFilesToSessions(sessions, audioFiles);
      setSessionsWithAudio(updatedSessions);
    } else {
      setSessionsWithAudio(sessions);
    }
  }, [sessions, audioFiles]);
  
  return {
    sessionsWithAudio,
    audioFiles,
    audioEnabled,
    isLoading
  };
};
