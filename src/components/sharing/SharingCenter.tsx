
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Share2, 
  Twitter, 
  Facebook, 
  Linkedin, 
  Instagram, 
  Copy,
  Download,
  Mail,
  MessageSquare,
  Trophy,
  Zap,
  Heart,
  Target
} from 'lucide-react';
import { toast } from 'sonner';

interface SharingCenterProps {
  achievement?: {
    type: 'meditation' | 'focus' | 'streak' | 'milestone';
    title: string;
    description: string;
    value: string;
    icon: React.ReactNode;
  };
  onShare?: (platform: string, message: string) => void;
}

const SharingCenter: React.FC<SharingCenterProps> = ({ achievement, onShare }) => {
  const [customMessage, setCustomMessage] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('achievement');

  // Default achievement if none provided
  const defaultAchievement = {
    type: 'meditation' as const,
    title: '30-Day Meditation Streak',
    description: 'Completed 30 consecutive days of mindful meditation practice',
    value: '30 days',
    icon: <Trophy className="h-6 w-6 text-yellow-500" />
  };

  const currentAchievement = achievement || defaultAchievement;

  const messageTemplates = {
    achievement: `🎉 Just unlocked "${currentAchievement.title}" on @RespiroBalance! ${currentAchievement.description}. #Mindfulness #WellnessJourney`,
    progress: `📈 Making great progress on my wellness journey with @RespiroBalance! ${currentAchievement.value} and counting. #Meditation #PersonalGrowth`,
    inspiration: `✨ Finding peace and focus through daily practice. "${currentAchievement.title}" achieved! Join me on this mindful journey. #Mindfulness #Wellness`,
    milestone: `🏆 Major milestone reached: ${currentAchievement.title}! Grateful for the journey and excited for what's next. #Achievement #WellnessGoals`
  };

  const socialPlatforms = [
    {
      name: 'Twitter',
      icon: Twitter,
      color: 'text-blue-400',
      characterLimit: 280,
      action: () => handleShare('twitter')
    },
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'text-blue-600',
      characterLimit: 1000,
      action: () => handleShare('facebook')
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'text-blue-700',
      characterLimit: 1300,
      action: () => handleShare('linkedin')
    },
    {
      name: 'Instagram',
      icon: Instagram,
      color: 'text-pink-500',
      characterLimit: 2200,
      action: () => handleShare('instagram')
    }
  ];

  const directShareOptions = [
    {
      name: 'Copy Link',
      icon: Copy,
      action: () => handleCopyLink()
    },
    {
      name: 'Email',
      icon: Mail,
      action: () => handleShare('email')
    },
    {
      name: 'Text Message',
      icon: MessageSquare,
      action: () => handleShare('sms')
    },
    {
      name: 'Download Image',
      icon: Download,
      action: () => handleDownloadImage()
    }
  ];

  const getAchievementIcon = (type: string) => {
    switch (type) {
      case 'meditation': return <Heart className="h-8 w-8 text-purple-500" />;
      case 'focus': return <Zap className="h-8 w-8 text-orange-500" />;
      case 'streak': return <Target className="h-8 w-8 text-green-500" />;
      case 'milestone': return <Trophy className="h-8 w-8 text-yellow-500" />;
      default: return currentAchievement.icon;
    }
  };

  const handleShare = (platform: string) => {
    const message = customMessage || messageTemplates[selectedTemplate as keyof typeof messageTemplates];
    onShare?.(platform, message);
    
    // Platform-specific sharing logic would go here
    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`);
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?quote=${encodeURIComponent(message)}`);
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?mini=true&summary=${encodeURIComponent(message)}`);
        break;
      default:
        toast.success(`Shared to ${platform}!`);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  const handleDownloadImage = () => {
    // Generate and download achievement image
    toast.success('Achievement image downloaded!');
  };

  const currentTemplate = messageTemplates[selectedTemplate as keyof typeof messageTemplates];
  const displayMessage = customMessage || currentTemplate;

  return (
    <div className="space-y-6">
      {/* Achievement Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Share Your Wellness Journey
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-6 border">
            <div className="flex items-center gap-4">
              {getAchievementIcon(currentAchievement.type)}
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-800">{currentAchievement.title}</h3>
                <p className="text-gray-600 mt-1">{currentAchievement.description}</p>
                <div className="flex items-center gap-2 mt-3">
                  <Badge variant="secondary" className="bg-white">
                    {currentAchievement.value}
                  </Badge>
                  <Badge variant="outline">
                    {currentAchievement.type}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Message Customization */}
      <Card>
        <CardHeader>
          <CardTitle>Customize Your Message</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Template Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Choose a template:</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {Object.entries(messageTemplates).map(([key]) => (
                <Button
                  key={key}
                  variant={selectedTemplate === key ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTemplate(key)}
                  className="text-xs"
                >
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          {/* Custom Message */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Or write your own message:</label>
            <Textarea
              placeholder="Share your wellness journey..."
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              className="min-h-[100px]"
              maxLength={280}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Preview: {displayMessage.slice(0, 50)}...</span>
              <span>{displayMessage.length}/280 characters</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Social Media Sharing */}
      <Card>
        <CardHeader>
          <CardTitle>Share to Social Media</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {socialPlatforms.map((platform) => {
              const IconComponent = platform.icon;
              return (
                <Button
                  key={platform.name}
                  variant="outline"
                  className="h-20 flex flex-col items-center gap-2"
                  onClick={platform.action}
                >
                  <IconComponent className={`h-6 w-6 ${platform.color}`} />
                  <span className="text-xs">{platform.name}</span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Direct Sharing Options */}
      <Card>
        <CardHeader>
          <CardTitle>Other Sharing Options</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {directShareOptions.map((option) => {
              const IconComponent = option.icon;
              return (
                <Button
                  key={option.name}
                  variant="outline"
                  className="h-20 flex flex-col items-center gap-2"
                  onClick={option.action}
                >
                  <IconComponent className="h-6 w-6 text-gray-600" />
                  <span className="text-xs">{option.name}</span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SharingCenter;
