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
    
    // For session IDs, try to map to our demo files based on category and number
    if (filePath.includes('-')) {
      // Try to extract category and number from session ID
      const parts = filePath.replace('.mp3', '').split('-');
      if (parts.length >= 2) {
        const category = parts[0];
        const number = parts[parts.length - 1]; 
        const demoKey = `${category}-${number}.mp3`;
        
        if (demoAudioMap[demoKey]) {
          console.log(`getMeditationAudioUrl: Mapped ${filePath} to demo file ${demoKey}`);
          return demoAudioMap[demoKey];
        }
      }
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
    
    // Try to find a matching audio file by category and a number
    const categoryMatch = audioFiles.find(file => {
      const fileName = file.toLowerCase();
      const sessionCategory = session.category.toLowerCase();
      return fileName.startsWith(sessionCategory) && 
             (fileName.includes('1') || fileName.includes('2') || fileName.includes('3'));
    });
    
    // Use ID match preferentially, then title match, then category match
    const matchingAudio = idMatch || titleMatch || categoryMatch;
    
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
    const categoryMatch = getMeditationAudioUrl(`${session.category.toLowerCase()}-1.mp3`);
    
    console.log(`Session: ${session.title} (${session.id})`);
    console.log(`- Category: ${session.category}`);
    console.log(`- Direct audioUrl: ${session.audioUrl || 'none'}`);
    console.log(`- ID-based URL: ${sessionIdUrl || 'none'}`);
    console.log(`- Title-based URL: ${titleUrl || 'none'}`);
    console.log(`- Category-based URL: ${categoryMatch || 'none'}`);
    console.log("---");
  });
  
  console.log("=====================================");
}

/**
 * Analyze sessions and report which ones have working audio files
 * Returns an object with arrays of sessions with and without audio
 */
export const analyzeSessionAudio = (sessions: MeditationSession[]): { 
  withAudio: MeditationSession[], 
  withoutAudio: MeditationSession[],
  summary: string 
} => {
  const withAudio: MeditationSession[] = [];
  const withoutAudio: MeditationSession[] = [];
  
  sessions.forEach(session => {
    // Check for direct audioUrl
    if (session.audioUrl && getMeditationAudioUrl(session.audioUrl)) {
      withAudio.push({
        ...session,
        audioSource: 'Direct URL'
      });
      return;
    }
    
    // Check for ID-based match
    const idUrl = getMeditationAudioUrl(`${session.id}.mp3`);
    if (idUrl) {
      withAudio.push({
        ...session,
        audioUrl: `${session.id}.mp3`,
        audioSource: 'ID-based'
      });
      return;
    }
    
    // Check for title-based match
    const titleKey = `${session.title.toLowerCase().replace(/\s+/g, '-')}.mp3`;
    const titleUrl = getMeditationAudioUrl(titleKey);
    if (titleUrl) {
      withAudio.push({
        ...session,
        audioUrl: titleKey,
        audioSource: 'Title-based'
      });
      return;
    }
    
    // Check for category-based match
    const categoryKey = `${session.category.toLowerCase()}-1.mp3`;
    const categoryUrl = getMeditationAudioUrl(categoryKey);
    if (categoryUrl) {
      withAudio.push({
        ...session,
        audioUrl: categoryKey,
        audioSource: 'Category-based'
      });
      return;
    }
    
    // If we got here, no audio URL was found
    withoutAudio.push(session);
  });
  
  // Generate summary
  const summary = `Found ${withAudio.length} sessions with audio and ${withoutAudio.length} sessions without audio.`;
  
  return { withAudio, withoutAudio, summary };
};

// Add these categories to our demo audio map to ensure proper mapping
const categoryToAudioMap = {
  'guided': ['guided-1.mp3', 'guided-2.mp3', 'guided-3.mp3'],
  'quick': ['quick-1.mp3', 'quick-2.mp3', 'quick-3.mp3'],
  'deep': ['deep-1.mp3', 'deep-2.mp3'],
  'sleep': ['sleep-1.mp3']
};

/**
 * Log audio mapping status to console
 */
export const logAudioMappingStatus = () => {
  console.log("===== MEDITATION AUDIO MAPPING STATUS =====");
  console.log("Available demo audio files by category:");
  
  Object.entries(categoryToAudioMap).forEach(([category, files]) => {
    console.log(`${category}: ${files.join(', ')}`);
  });
  
  console.log("==========================================");
};
