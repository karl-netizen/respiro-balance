// Audio URL validation and fixing utility
export const validateAndFixAudioUrl = (audioUrl: string | null | undefined): string | null => {
  if (!audioUrl) return null;
  
  try {
    // Handle URL encoding issues
    const decodedUrl = decodeURIComponent(audioUrl);
    
    // Check if URL is properly formatted
    const url = new URL(audioUrl);
    
    // Verify it's a valid audio format
    const validExtensions = ['.mp3', '.mp4', '.wav', '.m4a', '.ogg'];
    const hasValidExtension = validExtensions.some(ext => 
      audioUrl.toLowerCase().includes(ext)
    );
    
    if (!hasValidExtension) {
      console.warn('Invalid audio format detected:', audioUrl);
      return null;
    }
    
    return audioUrl;
  } catch (error) {
    console.error('Invalid audio URL:', audioUrl, error);
    return null;
  }
};

// Audio preloader with timeout and fallback
export const preloadAudio = (audioUrl: string): Promise<HTMLAudioElement> => {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    
    const timeout = setTimeout(() => {
      audio.src = '';
      reject(new Error('Audio load timeout'));
    }, 10000); // 10 second timeout
    
    audio.oncanplaythrough = () => {
      clearTimeout(timeout);
      resolve(audio);
    };
    
    audio.onerror = (error) => {
      clearTimeout(timeout);
      console.error('Audio preload failed:', error);
      reject(error);
    };
    
    audio.onabort = () => {
      clearTimeout(timeout);
      reject(new Error('Audio load aborted'));
    };
    
    // Set source after event listeners
    audio.src = audioUrl;
    audio.load();
  });
};

// Get valid audio URL from Supabase with fallback methods
export const getValidAudioUrl = async (supabase: any, bucketName: string, filePath: string): Promise<string | null> => {
  try {
    // Method 1: Try getting public URL
    const { data } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);
    
    if (data?.publicUrl) {
      return data.publicUrl;
    }
    
    // Method 2: Try signed URL (for private files)
    const { data: signedData, error } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(filePath, 3600); // 1 hour expiry
    
    if (error) {
      console.error('Error creating signed URL:', error);
      return null;
    }
      
    return signedData?.signedUrl || null;
      
  } catch (error) {
    console.error('Error generating audio URL:', error);
    return null;
  }
};