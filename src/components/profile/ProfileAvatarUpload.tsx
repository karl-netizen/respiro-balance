
import React, { useState, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Camera, Upload, User } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface ProfileAvatarUploadProps {
  size?: 'sm' | 'md' | 'lg';
  showUploadButton?: boolean;
  className?: string;
}

const ProfileAvatarUpload: React.FC<ProfileAvatarUploadProps> = ({ 
  size = 'md', 
  showUploadButton = true,
  className = ''
}) => {
  const { user, updateProfile } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(user?.user_metadata?.avatar_url || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-16 w-16'
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setIsUploading(true);

    try {
      // Create a URL for the uploaded image (in a real app, this would upload to a server)
      const objectUrl = URL.createObjectURL(file);
      setAvatarUrl(objectUrl);
      
      // Update user profile with new avatar URL
      await updateProfile({ 
        avatar_url: objectUrl 
      });

      toast.success('Profile picture updated successfully');
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Failed to update profile picture');
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const removeAvatar = async () => {
    try {
      setAvatarUrl('');
      await updateProfile({ avatar_url: '' });
      toast.success('Profile picture removed');
    } catch (error) {
      console.error('Error removing avatar:', error);
      toast.error('Failed to remove profile picture');
    }
  };

  const userInitials = user?.email?.charAt(0).toUpperCase() || 'U';

  return (
    <div className={`relative ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      {showUploadButton ? (
        <Dialog>
          <DialogTrigger asChild>
            <div className="relative cursor-pointer group">
              <Avatar className={`${sizeClasses[size]} ring-2 ring-background`}>
                <AvatarImage src={avatarUrl} alt="Profile picture" />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera className="h-4 w-4 text-white" />
              </div>
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Update Profile Picture</DialogTitle>
              <DialogDescription>
                Choose a new profile picture or remove your current one.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={avatarUrl} alt="Profile picture" />
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex space-x-2">
                <Button 
                  onClick={triggerFileSelect}
                  disabled={isUploading}
                  className="flex items-center space-x-2"
                >
                  <Upload className="h-4 w-4" />
                  <span>{isUploading ? 'Uploading...' : 'Upload Photo'}</span>
                </Button>
                
                {avatarUrl && (
                  <Button 
                    variant="outline" 
                    onClick={removeAvatar}
                    disabled={isUploading}
                  >
                    Remove
                  </Button>
                )}
              </div>
              
              <p className="text-sm text-muted-foreground text-center">
                Recommended: Square image, at least 200x200 pixels, max 5MB
              </p>
            </div>
          </DialogContent>
        </Dialog>
      ) : (
        <Avatar className={`${sizeClasses[size]} ring-2 ring-background`}>
          <AvatarImage src={avatarUrl} alt="Profile picture" />
          <AvatarFallback className="bg-primary text-primary-foreground">
            {userInitials}
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

export default ProfileAvatarUpload;
