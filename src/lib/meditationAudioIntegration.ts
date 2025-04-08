import { supabase } from './supabase';
import { toast } from 'sonner';
import { MeditationSession } from '@/components/meditation/MeditationSessionCard';

// Constants
const AUDIO_BUCKET_NAME = 'meditation-audio';

/**
 * Get the audio URL from Supabase storage or fallback to a static URL for demo purposes
 */
export const getMeditationAudioUrl = (filePath: string): string | null => {
  if (!filePath) {
    console.log("getMeditationAudioUrl: No file path provided");
    return null;
  }

  try {
    console.log("getMeditationAudioUrl: Attempting to get URL for:", filePath);
    
    // Demo fallback URLs to use when Supabase is not available
    const demoAudioMap: Record<string, string> = {
      'guided-1.mp3': 'https://respiro-demo.storage.googleapis.com/meditations/morning-clarity.mp3',
      'guided-2.mp3': 'https://respiro-demo.storage.googleapis.com/meditations/midday-reset.mp3',
      'guided-3.mp3': 'https://respiro-demo.storage.googleapis.com/meditations/evening-unwind.mp3',
      'quick-1.mp3': 'https://respiro-demo.storage.googleapis.com/meditations/quick-focus.mp3',
      'quick-2.mp3': 'https://respiro-demo.storage.googleapis.com/meditations/breath-awareness.mp3',
      'quick-3.mp3': 'https://respiro-demo.storage.googleapis.com/meditations/one-minute-calm.mp3',
      'deep-1.mp3': 'https://respiro-demo.storage.googleapis.com/meditations/deep-concentration.mp3',
      'deep-2.mp3': 'https://respiro-demo.storage.googleapis.com/meditations/mindful-presence.mp3',
      'sleep-1.mp3': 'https://respiro-demo.storage.googleapis.com/meditations/sleep-preparation.mp3',
    };
    
    // Check if we have a demo mapping for this file
    const fileName = filePath.split('/').pop() || filePath;
    if (demoAudioMap[fileName]) {
      console.log("getMeditationAudioUrl: Using demo audio URL for", fileName);
      return demoAudioMap[fileName];
    }
    
    // For session IDs, try to match with our demo mappings
    const sessionIdMatch = Object.keys(demoAudioMap).find(key => 
      key.includes(filePath) || filePath.includes(key.replace('.mp3', ''))
    );
    
    if (sessionIdMatch) {
      console.log("getMeditationAudioUrl: Found matching demo audio for session ID:", filePath);
      return demoAudioMap[sessionIdMatch];
    }
    
    // Otherwise try to get from Supabase
    try {
      const { data } = supabase.storage
        .from(AUDIO_BUCKET_NAME)
        .getPublicUrl(filePath);
      
      console.log("getMeditationAudioUrl: Supabase URL generated:", data.publicUrl);
      return data.publicUrl;
    } catch (error) {
      console.error("Error getting audio URL from Supabase:", error);
      // Default demo audio if nothing else matches
      console.log("getMeditationAudioUrl: Falling back to default demo audio");
      return 'https://respiro-demo.storage.googleapis.com/meditations/default-meditation.mp3';
    }
  } catch (error) {
    console.error("Error in getMeditationAudioUrl:", error);
    return null;
  }
}

/**
 * Retrieve all available meditation audio files from Supabase storage
 */
export const fetchMeditationAudioFiles = async (): Promise<string[]> => {
  try {
    // First try to get from Supabase
    try {
      const { data, error } = await supabase.storage
        .from(AUDIO_BUCKET_NAME)
        .list();
      
      if (error) {
        throw error;
      }
      
      console.log("fetchMeditationAudioFiles: Found files in Supabase:", data);
      return data.map(file => file.name);
    } catch (supabaseError) {
      console.error("Error fetching from Supabase, using demo files:", supabaseError);
      
      // Demo fallback
      const demoFiles = [
        'guided-1.mp3', 
        'guided-2.mp3',
        'guided-3.mp3',
        'quick-1.mp3',
        'quick-2.mp3',
        'quick-3.mp3',
        'deep-1.mp3',
        'deep-2.mp3',
        'sleep-1.mp3'
      ];
      
      return demoFiles;
    }
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
  console.log("mapAudioFilesToSessions: Mapping sessions to audio files...");
  console.log("Available audio files:", audioFiles);
  
  return sessions.map(session => {
    // Try to find a matching audio file by session ID
    const idMatch = audioFiles.find(file => file.includes(session.id));
    
    // Try to find a matching audio file by session title
    const sessionTitle = session.title.toLowerCase().replace(/\s+/g, '-');
    const titleMatch = audioFiles.find(file => file.toLowerCase().includes(sessionTitle));
    
    // Use ID match preferentially, then title match
    const matchingAudio = idMatch || titleMatch;
    
    if (matchingAudio) {
      console.log(`Found audio match for session "${session.title}":`, matchingAudio);
      return {
        ...session,
        audioUrl: matchingAudio
      };
    } else {
      console.log(`No audio match found for session "${session.title}"`);
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

/**
 * Debug utility to verify audio URLs for all sessions
 */
export const debugAllSessionAudio = (sessions: MeditationSession[]): void => {
  console.log("===== DEBUG: MEDITATION AUDIO URLS =====");
  
  sessions.forEach(session => {
    const sessionIdUrl = getMeditationAudioUrl(`${session.id}.mp3`);
    const titleUrl = getMeditationAudioUrl(`${session.title.toLowerCase().replace(/\s+/g, '-')}.mp3`);
    
    console.log(`Session: ${session.title} (${session.id})`);
    console.log(`- Direct audioUrl: ${session.audioUrl || 'none'}`);
    console.log(`- ID-based URL: ${sessionIdUrl || 'none'}`);
    console.log(`- Title-based URL: ${titleUrl || 'none'}`);
    console.log("---");
  });
  
  console.log("=====================================");
}
