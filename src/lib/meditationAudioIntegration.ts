
import { supabase } from './supabase';
import { toast } from 'sonner';
import { MeditationSession } from '@/types/meditation';

const BUCKET_NAME = 'meditation-audio';

/**
 * Initializes the meditation audio bucket (checks if it exists)
 */
export const initializeAudioBucket = async (): Promise<boolean> => {
  try {
    // Check if bucket exists by trying to list files
    const { data, error } = await supabase.storage.from(BUCKET_NAME).list('', { limit: 1 });
    
    if (error) {
      console.error('Error checking meditation audio bucket:', error);
      return false;
    }
    
    console.log('Meditation audio bucket is available');
    return true;
  } catch (error) {
    console.error('Unexpected error checking meditation audio bucket:', error);
    return false;
  }
};

/**
 * Fetches all available meditation audio files from Supabase storage
 */
export const fetchMeditationAudioFiles = async (): Promise<string[]> => {
  try {
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .list('', {
        limit: 100,
        sortBy: { column: 'name', order: 'asc' }
      });
    
    if (error) {
      console.error('Error fetching meditation audio files:', error);
      return [];
    }
    
    // Filter only audio files and return their names
    const audioFiles = data
      .filter(file => {
        const ext = file.name.toLowerCase();
        return ext.endsWith('.mp3') || ext.endsWith('.wav') || 
               ext.endsWith('.ogg') || ext.endsWith('.m4a');
      })
      .map(file => file.name);
    
    console.log('Found audio files:', audioFiles);
    return audioFiles;
  } catch (error) {
    console.error('Unexpected error fetching audio files:', error);
    return [];
  }
};

/**
 * Gets the public URL for a meditation audio file
 */
export const getMeditationAudioUrl = (fileName: string): string => {
  const { data } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(fileName);
  
  return data.publicUrl;
};

/**
 * Maps audio files to meditation sessions
 */
export const mapAudioFilesToSessions = (
  sessions: MeditationSession[], 
  audioFiles: string[]
): MeditationSession[] => {
  return sessions.map(session => {
    // Try to find a matching audio file for this session
    const matchingAudio = audioFiles.find(fileName => {
      const nameWithoutExt = fileName.replace(/\.[^/.]+$/, '').toLowerCase();
      const sessionName = session.title.toLowerCase().replace(/\s+/g, '-');
      const sessionId = session.id.toLowerCase();
      
      return nameWithoutExt.includes(sessionName) || 
             nameWithoutExt.includes(sessionId) ||
             fileName.startsWith(sessionId);
    });
    
    if (matchingAudio) {
      return {
        ...session,
        audio_url: getMeditationAudioUrl(matchingAudio)
      };
    }
    
    return session;
  });
};

/**
 * Uploads a meditation audio file to Supabase storage
 */
export const uploadMeditationAudio = async (
  file: File, 
  fileName: string,
  onProgress?: (progress: number) => void
): Promise<string | null> => {
  try {
    // Ensure the bucket is available
    const bucketReady = await initializeAudioBucket();
    if (!bucketReady) {
      toast.error('Storage not available');
      return null;
    }
    
    // Upload the file
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      });
    
    if (error) {
      console.error('Error uploading audio file:', error);
      toast.error('Failed to upload audio file');
      return null;
    }
    
    // Get the public URL
    const publicUrl = getMeditationAudioUrl(data.path);
    
    toast.success('Audio file uploaded successfully');
    return publicUrl;
  } catch (error) {
    console.error('Unexpected error uploading audio file:', error);
    toast.error('Something went wrong with the upload');
    return null;
  }
};

/**
 * Deletes a meditation audio file from storage
 */
export const deleteMeditationAudio = async (fileName: string): Promise<boolean> => {
  try {
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([fileName]);
    
    if (error) {
      console.error('Error deleting audio file:', error);
      toast.error('Failed to delete audio file');
      return false;
    }
    
    toast.success('Audio file deleted successfully');
    return true;
  } catch (error) {
    console.error('Unexpected error deleting audio file:', error);
    toast.error('Something went wrong while deleting the file');
    return false;
  }
};
