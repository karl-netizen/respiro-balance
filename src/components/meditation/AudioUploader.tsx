
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import { uploadMeditationAudio } from '@/lib/meditationAudio';
import { toast } from 'sonner';

interface AudioUploaderProps {
  onAudioUploaded: (audioUrl: string) => void;
  existingAudioUrl?: string;
}

export const AudioUploader: React.FC<AudioUploaderProps> = ({ 
  onAudioUploaded, 
  existingAudioUrl 
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(!!existingAudioUrl);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // Check if it's an audio file
      if (!file.type.startsWith('audio/')) {
        toast.error('Please select an audio file');
        return;
      }
      
      setSelectedFile(file);
      setUploadSuccess(false);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file first');
      return;
    }

    setIsUploading(true);
    
    try {
      // Create a unique file name using timestamp and original name
      const timestamp = new Date().getTime();
      const fileName = `${timestamp}-${selectedFile.name.replace(/\s+/g, '_')}`;
      
      const audioUrl = await uploadMeditationAudio(selectedFile, fileName);
      
      if (audioUrl) {
        setUploadSuccess(true);
        onAudioUploaded(audioUrl);
      }
    } catch (error) {
      toast.error('Failed to upload audio');
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Input
          type="file"
          accept="audio/*"
          onChange={handleFileChange}
          className="max-w-xs"
        />
        <Button 
          onClick={handleUpload} 
          disabled={!selectedFile || isUploading}
          variant="outline"
        >
          {isUploading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload
            </>
          )}
        </Button>
      </div>
      
      {(uploadSuccess || existingAudioUrl) && (
        <div className="flex items-center text-sm text-green-600">
          <CheckCircle className="mr-2 h-4 w-4" />
          {selectedFile ? 'File uploaded successfully' : 'Audio file already uploaded'}
        </div>
      )}
      
      {existingAudioUrl && (
        <div className="rounded-md bg-muted p-2 overflow-hidden text-sm">
          <p className="font-medium">Current audio file:</p>
          <a 
            href={existingAudioUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline truncate block"
          >
            {existingAudioUrl.split('/').pop()}
          </a>
        </div>
      )}
    </div>
  );
};

export default AudioUploader;
