
import { uploadMeditationAudio, deleteMeditationAudio, getMeditationAudioUrl } from './meditationAudio';
import { supabase } from '@/integrations/supabase/client';

export { uploadMeditationAudio, deleteMeditationAudio, getMeditationAudioUrl };

export const fetchMeditationAudioFiles = async (): Promise<string[]> => {
  try {
    const { data, error } = await supabase.storage
      .from('meditation-audio')
      .list('', {
        limit: 100,
        offset: 0
      });

    if (error) {
      console.error('Error fetching audio files:', error);
      return [];
    }

    return data?.map(file => file.name) || [];
  } catch (error) {
    console.error('Unexpected error fetching audio files:', error);
    return [];
  }
};

export const mapAudioFilesToSessions = (sessions: any[], audioFiles: string[]) => {
  // Mock implementation - just return sessions as is
  return sessions;
};

export const initializeAudioBucket = async (): Promise<boolean> => {
  // Mock implementation for demo
  return true;
};
