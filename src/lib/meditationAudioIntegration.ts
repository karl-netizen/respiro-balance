
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

// Enhanced audio loading function with validation and URL fixing
export const loadMeditationAudio = async () => {
  try {
    // First, get the audio file records from database
    const { data: audioRecords, error: dbError } = await supabase
      .from('meditation_audio')
      .select('*, meditation_content(title, description)')
      .order('created_at', { ascending: false });
    
    if (dbError) throw dbError;
    
    // Import validation utilities
    const { validateAndFixAudioUrl, getValidAudioUrl } = await import('@/utils/audioValidation');
    
    // Then, validate and fix audio URLs
    const validatedAudio = await Promise.all(
      (audioRecords || []).map(async (record) => {
        if (!record.file_path && !record.audio_file_url) {
          console.warn('No audio path or URL for record:', record.id);
          return { ...record, audio_url: null, loadError: 'No audio path' };
        }
        
        // Use file_path or audio_file_url
        const audioUrl = record.audio_file_url || record.file_path;
        
        // Try to validate the existing URL
        const validUrl = validateAndFixAudioUrl(audioUrl);
        
        if (!validUrl && record.file_path) {
          // If URL is invalid, try to regenerate it from storage
          const fileName = record.file_path.split('/').pop() || record.file_path;
          const newUrl = await getValidAudioUrl(supabase, 'meditation-audio', fileName);
          
          return {
            ...record,
            audio_url: newUrl,
            loadError: newUrl ? null : 'Cannot generate valid URL'
          };
        }
        
        return { 
          ...record, 
          audio_url: validUrl || audioUrl,
          loadError: validUrl ? null : 'Invalid URL format'
        };
      })
    );
    
    // Cache successful results
    localStorage.setItem('cached_audio_files', JSON.stringify(validatedAudio));
    return validatedAudio;
    
  } catch (error) {
    console.error('Error loading meditation audio:', error);
    // Try to load cached data as fallback
    const cached = localStorage.getItem('cached_audio_files');
    if (cached) {
      return JSON.parse(cached);
    }
    throw error;
  }
};

export const loadAudioFiles = async () => {
  try {
    // First, check if we're online
    if (!navigator.onLine) {
      console.log('Offline - loading cached audio files');
      return loadCachedAudioFiles();
    }

    return await loadMeditationAudio();
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
