
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const BUCKET_NAME = 'meditation-audio';

/**
 * Initializes the meditation audio bucket in Supabase if it doesn't exist
 */
export const initMeditationAudioBucket = async () => {
  try {
    // Get existing buckets
    const { data: buckets, error: getBucketsError } = await supabase.storage.listBuckets();
    
    if (getBucketsError) {
      console.error('Error checking for meditation audio bucket:', getBucketsError);
      return false;
    }
    
    // Check if our bucket already exists
    const bucketExists = buckets.some(bucket => bucket.name === BUCKET_NAME);
    
    if (!bucketExists) {
      // Create the bucket
      const { error: createBucketError } = await supabase.storage.createBucket(BUCKET_NAME, {
        public: true,
        fileSizeLimit: 50000000, // 50MB limit
      });
      
      if (createBucketError) {
        console.error('Error creating meditation audio bucket:', createBucketError);
        return false;
      }
      
      console.log('Meditation audio bucket created successfully');
    }
    
    return true;
  } catch (error) {
    console.error('Unexpected error initializing meditation audio bucket:', error);
    return false;
  }
};

/**
 * Uploads an audio file to the Supabase storage bucket
 */
export const uploadMeditationAudio = async (file: File, fileName: string): Promise<string | null> => {
  try {
    // Check network connectivity first
    if (!navigator.onLine) {
      toast.error('No internet connection. Please check your network and try again.');
      console.error('Upload failed: No internet connection');
      return null;
    }

    console.log('Starting upload process for:', fileName);
    
    // Test Supabase connection first
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      console.log('Auth check result:', user ? 'authenticated' : 'anonymous', authError);
    } catch (authCheckError) {
      console.error('Auth check failed:', authCheckError);
      toast.error('Unable to connect to server. Please check your connection.');
      return null;
    }
    
    // Ensure the bucket exists
    const bucketReady = await initMeditationAudioBucket();
    if (!bucketReady) {
      toast.error('Storage not available. Please try again later.');
      return null;
    }
    
    console.log('Starting file upload...');
    
    // Upload the file with timeout
    const uploadPromise = supabase.storage
      .from(BUCKET_NAME)
      .upload(`${fileName}`, file, {
        cacheControl: '3600',
        upsert: true
      });

    // Add timeout to upload
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Upload timeout after 30 seconds')), 30000)
    );

    const { data, error } = await Promise.race([uploadPromise, timeoutPromise]) as any;
    
    if (error) {
      console.error('Storage upload error:', error);
      
      if (error.message?.includes('network') || error.message?.includes('fetch')) {
        toast.error('Network error during upload. Please check your connection and try again.');
      } else if (error.message?.includes('size')) {
        toast.error('File too large. Please use a smaller file.');
      } else if (error.message?.includes('policy')) {
        toast.error('Permission denied. Please sign in and try again.');
      } else {
        toast.error(`Upload failed: ${error.message}`);
      }
      return null;
    }
    
    console.log('File uploaded successfully, getting public URL...');
    
    // Get the public URL
    const { data: publicUrlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(data.path);
    
    console.log('Upload complete:', publicUrlData.publicUrl);
    toast.success('Audio file uploaded successfully');
    return publicUrlData.publicUrl;
    
  } catch (error: any) {
    console.error('Upload error:', error);
    
    if (error.message?.includes('timeout')) {
      toast.error('Upload timed out. Please try with a smaller file or check your connection.');
    } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
      toast.error('Network error. Please check your internet connection and try again.');
    } else {
      toast.error('Upload failed. Please try again.');
    }
    return null;
  }
};

/**
 * Fetches the public URL for a meditation audio file
 */
export const getMeditationAudioUrl = (filePath: string): string => {
  const { data } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath);
  
  return data.publicUrl;
};

/**
 * Deletes a meditation audio file from storage
 */
export const deleteMeditationAudio = async (filePath: string): Promise<boolean> => {
  try {
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath]);
    
    if (error) {
      toast.error('Failed to delete audio file');
      console.error('Error deleting audio file:', error);
      return false;
    }
    
    toast.success('Audio file deleted successfully');
    return true;
  } catch (error) {
    toast.error('Something went wrong while deleting the file');
    console.error('Unexpected error deleting audio file:', error);
    return false;
  }
};
