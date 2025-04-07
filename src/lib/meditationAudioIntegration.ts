
import { supabase } from './supabase';
import { toast } from 'sonner';
import { MeditationSession } from '@/components/meditation/MeditationSessionCard';

// Constants
const AUDIO_BUCKET_NAME = 'meditation-audio';

/**
 * Get the audio URL from Supabase storage
 */
export const getMeditationAudioUrl = (filePath: string): string | null => {
  if (!filePath) return null;

  try {
    const { data } = supabase.storage
      .from(AUDIO_BUCKET_NAME)
      .getPublicUrl(filePath);
    
    return data.publicUrl;
  } catch (error) {
    console.error("Error getting audio URL:", error);
    return null;
  }
}

/**
 * Retrieve all available meditation audio files from Supabase storage
 */
export const fetchMeditationAudioFiles = async (): Promise<string[]> => {
  try {
    const { data, error } = await supabase.storage
      .from(AUDIO_BUCKET_NAME)
      .list();
    
    if (error) {
      throw error;
    }
    
    return data.map(file => file.name);
  } catch (error) {
    console.error("Error fetching meditation audio files:", error);
    toast.error("Failed to load meditation audio files");
    return [];
  }
}

/**
 * Associate audio files with meditation sessions based on name matching
 * This is a utility function to help connect audio files with sessions
 */
export const mapAudioFilesToSessions = (
  sessions: MeditationSession[],
  audioFiles: string[]
): MeditationSession[] => {
  return sessions.map(session => {
    // Try to find a matching audio file by session title or id
    const sessionTitle = session.title.toLowerCase().replace(/\s+/g, '-');
    const matchingAudio = audioFiles.find(
      file => file.toLowerCase().includes(sessionTitle) || file.includes(session.id)
    );
    
    if (matchingAudio) {
      return {
        ...session,
        audioUrl: matchingAudio
      };
    }
    
    return session;
  });
}

/**
 * Check if the audio bucket exists and create it if not
 */
export const initializeAudioBucket = async (): Promise<boolean> => {
  try {
    // List all buckets
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      throw bucketsError;
    }
    
    // Check if our bucket exists
    const bucketExists = buckets.some(bucket => bucket.name === AUDIO_BUCKET_NAME);
    
    if (!bucketExists) {
      // Create the bucket if it doesn't exist
      const { error } = await supabase.storage.createBucket(AUDIO_BUCKET_NAME, {
        public: true,
        fileSizeLimit: 524288000, // 500MB limit for audio files
      });
      
      if (error) {
        throw error;
      }
      
      console.log("Created meditation audio bucket");
    }
    
    return true;
  } catch (error) {
    console.error("Error initializing audio bucket:", error);
    return false;
  }
}
