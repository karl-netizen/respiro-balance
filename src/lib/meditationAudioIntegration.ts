
import { uploadMeditationAudio, deleteMeditationAudio, getMeditationAudioUrl } from './meditationAudio';
import { supabase } from '@/integrations/supabase/client';

export { uploadMeditationAudio, deleteMeditationAudio, getMeditationAudioUrl };

export const fetchMeditationAudioFiles = async (): Promise<string[]> => {
  try {
    // First, check if we're online
    if (!navigator.onLine) {
      console.log('Offline - loading cached audio file names');
      return loadCachedAudioFileNames();
    }

    const { data, error } = await supabase.storage
      .from('meditation-audio')
      .list('', {
        limit: 100,
        offset: 0
      });

    if (error) {
      console.error('Error fetching audio files:', error);
      return ['demo-breathing.mp3'];
    }

    return data?.map(file => file.name) || [];
  } catch (error) {
    console.error('Unexpected error fetching audio files:', error);
    return ['demo-breathing.mp3'];
  }
};

export const loadAudioFiles = async () => {
  try {
    // First, check if we're online
    if (!navigator.onLine) {
      console.log('Offline - loading cached audio files');
      return loadCachedAudioFiles();
    }

    // Try to fetch from Supabase
    const { data: audioFiles, error } = await supabase
      .from('meditation_audio')
      .select('*, meditation_content(title, description)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Database query failed:', error);
      return loadFallbackAudioFiles();
    }

    return audioFiles || [];
  } catch (networkError) {
    console.error('Network error loading audio:', networkError);
    return loadFallbackAudioFiles();
  }
};

// Fallback function with local/demo audio files
const loadFallbackAudioFiles = () => {
  return [
    {
      id: 'demo-1',
      title: 'Demo Breathing Exercise',
      description: 'A simple breathing exercise',
      audio_url: '/demo-audio/breathing.mp3',
      meditation_content: {
        title: 'Mindful Breathing',
        description: 'Focus on your breath'
      }
    }
  ];
};

// Load cached audio file names from localStorage
const loadCachedAudioFileNames = (): string[] => {
  try {
    const cached = localStorage.getItem('cached_audio_file_names');
    return cached ? JSON.parse(cached) : ['demo-breathing.mp3'];
  } catch (error) {
    console.error('Error loading cached audio file names:', error);
    return ['demo-breathing.mp3'];
  }
};

// Load cached audio files from localStorage
const loadCachedAudioFiles = () => {
  try {
    const cached = localStorage.getItem('cached_audio_files');
    return cached ? JSON.parse(cached) : loadFallbackAudioFiles();
  } catch (error) {
    console.error('Error loading cached audio files:', error);
    return loadFallbackAudioFiles();
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
